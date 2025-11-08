import app/server
import gleam/erlang/process

// import gleam/io

pub fn main() -> Nil {
  //io.println("Hello from server!")
  let assert Ok(_) = server.start(fn(h) { h })
  process.sleep_forever()
}
