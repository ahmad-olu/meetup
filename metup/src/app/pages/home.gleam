import app/pages/components/home_layout
import lustre/attribute.{class, href}
import lustre/element.{type Element, text}
import lustre/element/html.{
  a, aside, br, button, div, footer, form, h1, h3, main, nav,
}

pub fn root(is_auth: Bool) -> Element(t) {
  home_layout.layout(
    [
      nav([class("navbar")], [
        div([class("logo")], [text("Credence")]),
        div([class("nav-links")], [
          a([href("#")], [text("Home")]),
          a([href("#")], [text("Search")]),
          a([href("#")], [text("Service")]),
        ]),
        //TODO: switch the form to htmx . form looks weird there
        case is_auth {
          True ->
            form(
              [
                attribute.method("post"),
                attribute.action("/api/auth/sign-out"),
              ],
              [div([class("auth-buttons")], [button([], [text("Sign Out")])])],
            )
          False ->
            div([class("auth-buttons")], [
              a([href("/sign-in")], [button([], [text("Sign-in")])]),
              a([href("/sign-up")], [button([], [text("Sign-up")])]),
            ])
        },
      ]),
      // TODO:content
      div([class("content")], [
        aside([class("sidebar")], [
          h3([], [text("side panel")]),
          a([href("#")], [text("Explore")]),
          br([]),
          a([href("#")], [text("Notifications")]),
          br([]),
          a([href("#")], [text("Profile")]),
          //TODO: add gap here
          br([]),
          a([href("#")], [text("Categories")]),
          br([]),
          a([href("#")], [text("Create")]),
          br([]),
        ]),
        main([class("main")], [h1([], [text("main content")])]),
      ]),
      // TODO: nav bar
      footer([], [
        text("&copy; 2025 Credence. All rights reserved."),
        br([]),
        a([href("#")], [text("About")]),
        br([]),
        a([href("#")], [text("FAQ")]),
        br([]),
        a([href("#")], [text("Privacy Policy")]),
        br([]),
        a([href("#")], [text("Terms of Service")]),
      ]),
    ],
    [
      attribute.href("/static/styles/home.css"),
    ],
  )
}
