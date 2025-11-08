import gleam/dynamic/decode
import gleam/json
import gleam/option

pub type Session {
  Session(
    id: option.Option(String),
    user_id: String,
    token: String,
    ip_address: option.Option(String),
    user_agent: option.Option(String),
    created_at: String,
    updated_at: String,
    expires_at: String,
  )
}

pub fn session_decode() -> decode.Decoder(Session) {
  use id <- decode.field("id", decode.optional(decode.string))
  use user_id <- decode.field("user_id", decode.string)
  use token <- decode.field("token", decode.string)
  use ip_address <- decode.field("ip_address", decode.optional(decode.string))
  use user_agent <- decode.field("user_agent", decode.optional(decode.string))
  use created_at <- decode.field("created_at", decode.string)
  use updated <- decode.field("updated_at", decode.string)
  use expires <- decode.field("expires_at", decode.string)
  decode.success(Session(
    id,
    user_id,
    token,
    ip_address,
    user_agent,
    created_at,
    updated_at: updated,
    expires_at: expires,
  ))
}

pub fn session_encode_object(user: Session) -> json.Json {
  json.object([
    #("id", json.nullable(user.id, json.string)),
    #("user_id", json.string(user.user_id)),
    #("token", json.string(user.token)),
    #("ip_address", json.nullable(user.ip_address, json.string)),
    #("user_agent", json.nullable(user.user_agent, json.string)),
    #("created_at", json.string(user.created_at)),
    #("updated_at", json.string(user.updated_at)),
    #("expires_at", json.string(user.expires_at)),
  ])
}

pub fn session_encode(user: Session) -> String {
  session_encode_object(user)
  |> json.to_string
}
