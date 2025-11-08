import app/models/user
import app/state.{type Context}
import db_querry/session/sql as session
import dot_env/env
import gleam/http
import gleam/http/request
import gleam/httpc
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import gleam/string
import gleam/uri
import valkyrie
import wisp.{type Request, type Response}

pub fn email_sign_up(req: Request, _ctx: Context) -> Response {
  case req.method {
    http.Post -> {
      use formdata <- wisp.require_form(req)
      let assert Ok(auth_url) = env.get_string("AUTH_URL")
      let assert Ok(server_url) = env.get_string("SERVER_URL")
      let assert Ok(base_req) =
        request.to(auth_url <> "/api/auth/sign-up/email")

      //let response = result.try(httpc.send())
      let form_res = {
        use name <- result.try(list.key_find(formdata.values, "name"))
        use email <- result.try(list.key_find(formdata.values, "email"))
        use password <- result.try(list.key_find(formdata.values, "password"))
        let _ = wisp.log_info(server_url <> "/sign-in")
        Ok(user.CreateUser(
          name,
          email,
          password,
          option.None,
          option.Some(server_url <> "/sign-in"),
          //TODO: decide on a better callback url
        ))
        // Ok(#(name, email, password))
      }
      let assert Ok(create_user) = form_res

      let res = {
        let req =
          base_req
          |> request.set_body(
            user.create_user_to_json(create_user) |> json.to_string,
          )
          |> request.set_method(http.Post)
          |> request.prepend_header("content-type", "application/json")

        use resp <- result.try(httpc.send(req))
        // wisp.log_info("Status: " <> int.to_string(resp.status))
        // wisp.log_info("Response: " <> resp.body)
        // wisp.log_info(
        //   "Headers: "
        //   <> string.join(
        //     list.map(resp.headers, fn(d) {
        //       let #(a, b) = d
        //       "[" <> a <> ":" <> b <> "];"
        //     }),
        //     ";",
        //   ),
        // )
        Ok(resp)
      }

      case res {
        Ok(res) -> {
          case res.status {
            200 ->
              wisp.redirect("/sign-in?success=Account%20created%20successfully")
            400 ->
              wisp.redirect("/sign-up?error=Invalid%20email%20or%20password")
            409 -> wisp.redirect("/sign-up?error=Email%20already%20exists")
            _ -> {
              let error_msg = case string.is_empty(res.body) {
                True -> "Sign up failed. Please try again."
                False -> {
                  //TODO: FIND BETTER AUTH ERROR BODY AND PARSE
                  wisp.log_info("Response: " <> res.body)
                  res.body
                }
              }
              // wisp.redirect("/sign-up?error=Something%20went%20wrong")
              wisp.redirect("/sign-up?error=" <> uri.percent_encode(error_msg))
            }
          }
        }
        Error(_) ->
          wisp.redirect(
            "/sign-up?error=Network%20error.%20Please%20try%20again.",
          )
      }
      // wisp.redirect("/")
    }
    _ -> wisp.method_not_allowed([http.Post])
  }
}

pub fn email_sign_in(req: Request, ctx: Context) -> Response {
  case req.method {
    http.Post -> {
      use formdata <- wisp.require_form(req)
      let assert Ok(auth_url) = env.get_string("AUTH_URL")
      let assert Ok(base_req) =
        request.to(auth_url <> "/api/auth/sign-in/email")

      let form_res = {
        use email <- result.try(list.key_find(formdata.values, "email"))
        use password <- result.try(list.key_find(formdata.values, "password"))
        Ok(user.SignInUser(email, password))
        // Ok(#(name, email, password))
      }
      let assert Ok(sign_in_user) = form_res

      let res = {
        let req =
          base_req
          |> request.set_body(
            user.sign_in_user_to_json(sign_in_user) |> json.to_string,
          )
          |> request.set_method(http.Post)
          |> request.prepend_header("content-type", "application/json")

        use resp <- result.try(httpc.send(req))
        Ok(resp)
      }

      case res {
        Ok(res) -> {
          case res.status {
            200 -> {
              let cookie_header =
                list.find(res.headers, fn(header) {
                  let #(name, _value) = header
                  string.lowercase(name) == "set-cookie"
                })
              let assert Ok(auth_res) =
                json.parse(res.body, user.auth_response_decoder())
              let assert option.Some(token) = auth_res.token

              let assert Ok(session_res) =
                session.get_session_with_token(ctx.pg, token)

              let assert Ok(a) = list.first(session_res.rows)
              let cache_value =
                user.get_session_with_token_row_to_json(a) |> json.to_string

              case cookie_header {
                Ok(#(_name, cookie_value)) -> {
                  // let expired_at =
                  //   birl.now()
                  //   |> birl.to_unix
                  //   |> timestamp.from_unix_seconds
                  //   |> timestamp.difference(a.expires_at, _)
                  //   |> duration.to_seconds
                  //   |> float.round

                  let options =
                    valkyrie.SetOptions(
                      ..valkyrie.default_set_options(),
                      expiry_option: option.Some(valkyrie.ExpirySeconds(3600)),
                    )
                  let assert Ok(_) =
                    echo valkyrie.set(
                      ctx.redis,
                      cookie_value,
                      cache_value,
                      option.Some(options),
                      1000,
                    )

                  wisp.redirect("/?success=Account%20created%20successfully")
                  |> wisp.set_header("set-cookie", cookie_value)
                }
                Error(_) -> wisp.internal_server_error()
              }
            }
            _ -> {
              let error_msg = case string.is_empty(res.body) {
                True -> "Sign up failed. Please try again."
                False -> {
                  //TODO: FIND BETTER AUTH ERROR BODY AND PARSE
                  wisp.log_info("Response: " <> res.body)
                  res.body
                }
              }
              wisp.redirect("/sign-in?error=" <> uri.percent_encode(error_msg))
            }
          }
        }
        Error(_) ->
          wisp.redirect(
            "/sign-in?error=Network%20error.%20Please%20try%20again.",
          )
      }
    }
    _ -> wisp.method_not_allowed([http.Post])
  }
}

pub fn email_sign_out(
  req: Request,
  ctx: Context,
  req_ctx: state.RequestContext,
) -> Response {
  let cookie_header = request.get_header(req, "cookie")

  case req.method {
    http.Post -> {
      let assert Ok(auth_url) = env.get_string("AUTH_URL")
      //let assert Ok(server_url) = env.get_string("SERVER_URL")
      let assert Ok(base_req) = request.to(auth_url <> "/api/auth/sign-out")

      let res = {
        let outgoing_req = case cookie_header {
          Ok(cookie_value) -> {
            base_req
            |> request.set_method(http.Post)
            |> request.prepend_header("content-type", "application/json")
            |> request.prepend_header("cookie", cookie_value)
          }
          Error(_) -> {
            base_req
            |> request.set_method(http.Post)
            |> request.prepend_header("content-type", "application/json")
          }
        }
        use resp <- result.try(httpc.send(outgoing_req))
        Ok(resp)
      }
      //TODO: check for non 200 status and catch error
      case res {
        Ok(_res) -> {
          let assert option.Some(sig_token) = req_ctx.user
          let sig_token =
            "better-auth.session_token=" <> sig_token.token_with_sig
          let assert Ok(_) = echo valkyrie.del(ctx.redis, [sig_token], 1000)
          wisp.redirect("/sign-in")
          |> wisp.set_cookie(
            req,
            "better-auth.session_token",
            "",
            wisp.Signed,
            60 * 60 * 24 * -1,
          )
        }
        Error(_) -> wisp.internal_server_error()
      }
    }
    _ -> wisp.method_not_allowed([http.Post])
  }
}
