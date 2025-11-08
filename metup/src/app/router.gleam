import app/helpers/auth as h_auth
import app/pages
import app/pages/components/layout.{layout}
import app/routes/index
import app/state.{type Context}
import app/web
import gleam/option.{None, Some}

import lustre/element
import wisp.{type Request, type Response}

pub fn handle_request(req: Request, ctx: Context) -> Response {
  // let path = wisp.path_segments(req) |> string.join("/")
  // wisp.log_info(path)
  use req, request_ctx <- web.middleware(req, ctx)
  // let assert Ok(a) = request.get_header(req, "cookie")
  // wisp.log_info("AUTHq: " <> a)
  case wisp.path_segments(req) {
    [] -> {
      // let assert option.Some(a) = web.get_optional_user(request_ctx)
      // wisp.log_info("AUTHq: " <> a.user_id)
      // wisp.html_response("<h1>Hello, World!<h1>", 200)
      let is_auth = case h_auth.get_optional_user(request_ctx) {
        Some(_user) -> True

        None -> False
      }
      pages.home(is_auth)
      |> element.to_document_string
      |> wisp.html_response(200)
    }
    ["sign-up"] -> {
      [pages.signup(req)]
      |> layout
      |> element.to_document_string
      |> wisp.html_response(200)
    }
    ["sign-in"] -> {
      [pages.signin(req)]
      |> layout
      |> element.to_document_string
      |> wisp.html_response(200)
    }
    ["api", ..] -> index.handle_request(req, ctx, request_ctx)
    _ -> wisp.not_found()
  }
}
