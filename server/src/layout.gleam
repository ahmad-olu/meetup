// src/layout.gleam
import gleam/json
import lustre/attribute
import lustre/element
import lustre/element/html

/// Custom HTML layout built with Lustre
pub fn html_layout(component_name: String, app_data: json.Json) -> String {
  html.html([attribute.attribute("lang", "en")], [
    html.head([], [
      html.meta([attribute.attribute("charset", "utf-8")]),
      html.meta([
        attribute.name("viewport"),
        attribute.attribute("content", "width=device-width, initial-scale=1"),
      ]),
      html.title([], component_name),
      html.link([
        attribute.rel("stylesheet"),
        attribute.href("/static/css/styles.css"),
      ]),
    ]),
    html.body([], [
      html.div(
        [
          attribute.id("app"),
          attribute.attribute("data-page", json.to_string(app_data)),
        ],
        [],
      ),
      html.script(
        [attribute.type_("module"), attribute.src("/static/js/main.js")],
        "",
      ),
    ]),
  ])
  |> element.to_document_string()
}
