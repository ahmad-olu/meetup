import app/state
import gleam/option.{type Option, None, Some}
import wisp

pub fn get_optional_user(
  auth_ctx: state.RequestContext,
) -> Option(state.AuthUser) {
  auth_ctx.user
}

pub fn require_auth(
  ctx: state.RequestContext,
  handle: fn(state.AuthUser) -> wisp.Response,
) -> wisp.Response {
  case ctx.user {
    Some(user) -> handle(user)
    None -> wisp.redirect("/sign-in")
  }
}
