import app/routes/auth
import app/state
import wisp

pub fn handle_request(
  req: wisp.Request,
  ctx: state.Context,
  req_ctx: state.RequestContext,
) -> wisp.Response {
  // let path = wisp.path_segments(req) |> string.join("/")
  // wisp.log_info(path)
  case wisp.path_segments(req) {
    ["api", "auth", "sign-up"] -> auth.email_sign_up(req, ctx)
    ["api", "auth", "sign-in"] -> auth.email_sign_in(req, ctx)
    ["api", "auth", "sign-out"] -> auth.email_sign_out(req, ctx, req_ctx)
    _ -> wisp.not_found()
  }
}
