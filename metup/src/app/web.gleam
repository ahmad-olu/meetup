import app/models/user
import app/state.{type Context}
import dot_env/env
import gleam/bool
import gleam/dynamic/decode
import gleam/http
import gleam/http/request
import gleam/httpc
import gleam/json
import gleam/list
import gleam/option.{None, Some}
import gleam/result
import gleam/string
import valkyrie
import wisp.{Text}

fn is_public_route(path: String) -> Bool {
  case path {
    "/" -> True
    "/sign-in" -> True
    "/sign-up" -> True
    "/forgot-password" -> True
    "/about" -> True
    "/how-it-works" -> True
    "/faq" -> True
    "/privacy-policy" -> True
    "/terms-of-service" -> True
    "/browse-polls" -> True
    "/browse-topics" -> True
    "/categories" -> True
    "/api/auth/sign-up" -> True
    "/api/auth/sign-in" -> True
    _ -> {
      path |> string.starts_with("/static")
      //|| path |> string.starts_with("/category/")
    }
  }
}

//state.RequestContext
pub fn middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(wisp.Request, state.RequestContext) -> wisp.Response,
) -> wisp.Response {
  let req = wisp.method_override(req)
  use <- wisp.serve_static(req, under: "/static", from: ctx.static_directory)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  use <- default_responses

  use request_ctx <- auth_middleware(req, ctx)

  handle_request(req, request_ctx)
}

fn auth_middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(state.RequestContext) -> wisp.Response,
) -> wisp.Response {
  let path = wisp.path_segments(req) |> string.join("/")
  let is_public = is_public_route("/" <> path)
  //wisp.log_info("1.-->" <> bool.to_string(is_public))
  //let is_public = is_public_route(path)

  // let cookies = request.get_cookies(req)
  // list.each(cookies, fn(cookie) {
  //   let #(key, value) = cookie
  //   wisp.log_info("Cookie: " <> key <> " = " <> value)
  // })

  let session_result = {
    let cookies = request.get_cookies(req)
    list.find_map(cookies, fn(cookie) {
      let #(key, value) = cookie
      case key == "better-auth.session_token" {
        True -> Ok(value)
        False -> Error(Nil)
      }
    })
  }

  // NOTE: `wisp.get_cookie` does not work
  // let session_result = wisp.get_cookie(req, "Cookie", wisp.Signed)
  case is_public, session_result {
    True, Ok(session_token) -> {
      case get_user_from_session(ctx, session_token) {
        Ok(user) -> {
          let request_ctx = state.RequestContext(user: Some(user))
          // wisp.log_info("1a.-->" <> session_token)
          handle_request(request_ctx)
        }
        Error(_) -> {
          let request_ctx = state.RequestContext(user: None)
          // wisp.log_info("1c.-->" <> session_token)
          handle_request(request_ctx)
        }
      }
    }
    True, Error(_) -> {
      let request_ctx = state.RequestContext(user: None)
      //wisp.log_info("1b.-->" <> bool.to_string(is_public))
      handle_request(request_ctx)
    }
    False, Ok(session_token) -> {
      case get_user_from_session(ctx, session_token) {
        Ok(user) -> {
          let request_ctx = state.RequestContext(user: Some(user))
          handle_request(request_ctx)
        }
        Error(_) -> {
          wisp.redirect("/sign-in")
        }
      }
    }
    False, Error(_) -> {
      wisp.redirect("/sign-in")
    }
  }
}

pub fn default_responses(handle_request: fn() -> wisp.Response) -> wisp.Response {
  let response = handle_request()

  use <- bool.guard(when: response.body != Text(""), return: response)

  case response.status {
    404 | 405 ->
      "<h1>Not Found</h1>"
      |> wisp.html_body(response, _)

    400 | 422 ->
      "<h1>Bad request</h1>"
      |> wisp.html_body(response, _)

    413 ->
      "<h1>Request entity too large</h1>"
      |> wisp.html_body(response, _)

    500 ->
      "<h1>Internal server error</h1>"
      |> wisp.html_body(response, _)

    _ -> response
  }
}

fn get_user_from_session(
  ctx: Context,
  session_token: String,
) -> Result(state.AuthUser, Nil) {
  let better_auth_const = "better-auth.session_token="

  case valkyrie.get(ctx.redis, better_auth_const <> session_token, 1000) {
    Ok(cached_data) -> {
      case json.parse(cached_data, user.get_session_with_token_row_decoder()) {
        Ok(session_res) -> {
          // wisp.log_info("1.-->" <> "is auth")
          Ok(state.AuthUser(
            user_id: session_res.user_id,
            token: session_res.token,
            token_with_sig: better_auth_const <> session_token,
          ))
        }
        Error(_) -> Error(Nil)
      }
    }
    Error(_) -> {
      case get_session_from_ba(better_auth_const <> session_token) {
        Ok(res) -> {
          let cache_value = user.session_to_json(res.session) |> json.to_string
          let options =
            valkyrie.SetOptions(
              ..valkyrie.default_set_options(),
              expiry_option: option.Some(valkyrie.ExpirySeconds(3600)),
              // chche for 1 hour
            )

          let _res =
            valkyrie.set(
              ctx.redis,
              better_auth_const <> session_token,
              cache_value,
              option.Some(options),
              1000,
            )

          Ok(state.AuthUser(
            user_id: res.session.user_id,
            token: res.session.token,
            token_with_sig: better_auth_const <> session_token,
          ))
        }
        Error(_) -> Error(Nil)
      }
    }
  }
}

fn get_session_from_ba(cookie_value: String) -> Result(user.GetSessionRes, Nil) {
  let assert Ok(auth_url) = env.get_string("AUTH_URL")
  let assert Ok(base_req) = request.to(auth_url <> "/api/auth/get-session")

  let res = {
    let outgoing_req =
      base_req
      |> request.set_method(http.Get)
      |> request.prepend_header("content-type", "application/json")
      |> request.prepend_header("cookie", cookie_value)
    use resp <- result.try(httpc.send(outgoing_req))
    Ok(resp)
  }
  case res {
    Ok(res) -> {
      let assert Ok(auth_res) =
        json.parse(res.body, decode.optional(user.get_session_res_decoder()))
      case auth_res {
        None -> Error(Nil)
        Some(r) -> Ok(r)
      }
    }
    Error(_) -> Error(Nil)
  }
}
//get_session_res_decoder()
