import lustre/attribute
import lustre/element.{type Element}
import lustre/element/html

pub fn layout(
  elements: List(Element(t)),
  attributes: List(attribute.Attribute(t)),
) -> Element(t) {
  html.html([], [
    html.head([], [
      html.title([], "CREDENCE"),
      html.meta([
        attribute.name("viewport"),
        attribute.attribute("content", "width=device-width, initial-scale=1"),
      ]),
      html.link([
        attribute.rel("stylesheet"),
        attribute.href("/static/styles/app.css"),
        ..attributes
      ]),
    ]),
    html.body(
      [
        attribute.class("center"),
      ],
      elements,
    ),
  ])
}
