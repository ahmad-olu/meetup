import app/server
import gleam/erlang/process
import mist/reload

// import gleam/io

pub fn main() -> Nil {
  let assert Ok(_) = server.start(reload.wrap)
  process.sleep_forever()
  // io.println("Hello from server!")
}
