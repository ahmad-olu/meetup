import dot_env/env
import gleam/erlang/process
import gleam/int
import gleam/option
import gleam/otp/static_supervisor as supervisor
import pog
import valkyrie
import wisp

pub type AuthUser {
  // AuthUser(id: String, email: String, name: String, role: option.Option(String))
  AuthUser(user_id: String, token: String, token_with_sig: String)
}

pub type RequestContext {
  RequestContext(user: option.Option(AuthUser))
}

pub type Context {
  Context(
    static_directory: String,
    redis: valkyrie.Connection,
    pg: pog.Connection,
  )
}

pub fn init() -> Context {
  let assert Ok(priv_directory) = wisp.priv_directory("metup")
  let stateic_dir = priv_directory <> "/static"

  Context(
    static_directory: stateic_dir,
    redis: start_redis_pool(),
    pg: start_pog_pool(),
  )
}

fn start_pog_pool() -> pog.Connection {
  let pool_name = process.new_name("pog_pool")

  let assert Ok(pg_host) = env.get_string("POSTGRES_HOST")
  let assert Ok(pg_db) = env.get_string("POSTGRES_DB")
  let assert Ok(pg_user) = env.get_string("POSTGRES_USER")
  let assert Ok(pg_password) = env.get_string("POSTGRES_PASSWORD")

  let assert Ok(pg_port) = env.get_string("POSTGRES_PORT")
  let assert Ok(pg_port) = pg_port |> int.parse

  let pool_child =
    pog.default_config(pool_name)
    |> pog.host(pg_host)
    |> pog.database(pg_db)
    |> pog.user(pg_user)
    |> pog.password(option.Some(pg_password))
    |> pog.port(pg_port)
    |> pog.pool_size(10)
    |> pog.supervised

  let assert Ok(_started) =
    supervisor.new(supervisor.OneForOne)
    |> supervisor.add(pool_child)
    |> supervisor.start

  pog.named_connection(pool_name)
}

fn start_redis_pool() -> valkyrie.Connection {
  let pool_name = process.new_name("redis_pool")

  let assert Ok(redis_one_password) = env.get_string("REDIS_1_PASSWORD")

  let valkyrie_child_spec =
    valkyrie.default_config()
    |> valkyrie.port(8091)
    |> valkyrie.auth(valkyrie.PasswordOnly(redis_one_password))
    |> valkyrie.supervised_pool(
      size: 10,
      name: option.Some(pool_name),
      timeout: 1000,
    )
  let assert Ok(_started) =
    supervisor.new(supervisor.OneForOne)
    |> supervisor.add(valkyrie_child_spec)
    |> supervisor.start

  valkyrie.named_connection(pool_name)
}
