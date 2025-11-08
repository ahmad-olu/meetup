import gleam/http/request
import gleam/list
import gleam/option.{None, Some}
import gleam/result
import gleam/uri
import lustre/attribute
import lustre/element.{type Element, text}
import lustre/element/html.{a, button, div, form, h2, input, label, span}
import wisp

pub fn root(req: wisp.Request) -> Element(t) {
  let error_message =
    request.get_query(req)
    |> result.try(list.key_find(_, "error"))
    |> result.try(uri.percent_decode)
    |> option.from_result
  div([], [
    h2(
      [
        attribute.styles([
          #("text-align", "center"),
          #("margin-bottom", "1rem"),
          #("color", "#333"),
        ]),
      ],
      [text("Sign In")],
    ),
    case error_message {
      Some(msg) -> {
        div([attribute.class("error-banner")], [text(msg)])
      }
      None -> element.none()
    },
    form(
      [
        attribute.method("post"),
        attribute.action("/api/auth/sign-in"),
        attribute.class("center"),
      ],
      [
        label([], [
          text("Email:"),
          input([
            attribute.id("email"),
            attribute.type_("email"),
            attribute.name("email"),
            attribute.placeholder("Email"),
            attribute.required(True),
          ]),
          span([attribute.class("error-message")], [
            text("Enter a valid email address."),
          ]),
        ]),

        label([], [
          text("Password:"),
          input([
            attribute.id("password"),
            attribute.placeholder("Password"),
            attribute.name("password"),
            attribute.required(True),
            attribute.type_("password"),
            attribute.minlength(8),
            attribute.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"),
            attribute.title(
              "Must contain at least one number, one uppercase and lowercase letter, and 8 or more characters",
            ),
          ]),
          span([attribute.class("error-message")], [
            text(
              "Password must have 8+ chars, a number, and an uppercase letter.",
            ),
          ]),
        ]),

        button([attribute.type_("submit")], [text("Sign In")]),
      ],
    ),
    div([attribute.class("redirect")], [
      text("Don't have an account yet? "),
      a([attribute.href("/sign-up")], [text("Sign Up")]),
    ]),
    // div([], [text("")]),
  ])
}
