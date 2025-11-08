import app/router
import app/state
import dot_env
import dot_env/env

import mist
import wisp
import wisp/wisp_mist

pub fn start(wrap_reload) {
  wisp.configure_logger()

  dot_env.new()
  |> dot_env.set_path(".env")
  |> dot_env.set_debug(False)
  |> dot_env.load

  let assert Ok(secret_key_base) = env.get_string("SECRET_KEY_BASE")

  let ctx = state.init()

  let handler = router.handle_request(_, ctx)

  let assert Ok(_) =
    wisp_mist.handler(handler, secret_key_base)
    |> wrap_reload()
    |> mist.new
    |> mist.bind("0.0.0.0")
    |> mist.port(8134)
    |> mist.start
}
