import gleam/dict
import gleam/erlang/process
import gleam/json
import inertia_wisp/inertia
import layout
import mist
import wisp
import wisp/wisp_mist

// Your custom layout module

pub fn main() {
  wisp.configure_logger()

  let assert Ok(_) =
    fn(req) { handle_request(req) }
    |> wisp_mist.handler("your_secret_key")
    |> mist.new
    |> mist.port(8020)
    |> mist.start

  process.sleep_forever()
}

fn handle_request(req: wisp.Request) -> wisp.Response {
  // let assert Ok(priv_directory) = wisp.priv_directory("server")
  // let ss = priv_directory <> "/static"

  let assert Ok(priv) = wisp.priv_directory("server")
  // wisp.log_info(priv)
  use <- wisp.serve_static(req, under: "/static", from: priv <> "/static")

  case wisp.path_segments(req) {
    [] -> home_page(req)
    ["about"] -> about_page(req)
    _ -> wisp.not_found()
  }
}

// Define your props type
pub type HomePageProps {
  HomePageProps(message: String, user: String, count: Int)
}

pub type AboutPageProps {
  AboutPageProps(title: String)
}

// Create encoder for your props
fn encode_home_page_props(props: HomePageProps) -> dict.Dict(String, json.Json) {
  dict.from_list([
    #("message", json.string(props.message)),
    #("user", json.string(props.user)),
    #("count", json.int(props.count)),
  ])
}

fn encode_about_page_props(
  props: AboutPageProps,
) -> dict.Dict(String, json.Json) {
  dict.from_list([
    #("title", json.string(props.title)),
  ])
}

fn home_page(req: wisp.Request) -> wisp.Response {
  let props =
    HomePageProps(message: "Hello from Gleam!", user: "Alice", count: 42)

  req
  |> inertia.response_builder("Home")
  |> inertia.props(props, encode_home_page_props)
  |> inertia.response(200, layout.html_layout)
}

fn about_page(req: wisp.Request) -> wisp.Response {
  let props = AboutPageProps(title: "About Us")

  req
  |> inertia.response_builder("About")
  |> inertia.props(props, encode_about_page_props)
  |> inertia.response(200, layout.html_layout)
}
