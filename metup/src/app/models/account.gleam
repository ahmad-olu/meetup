import gleam/dynamic/decode
import gleam/json

import gleam/option

pub type Provider {
  Classic
  Google
  Github
}

pub fn provider_decode() -> decode.Decoder(Provider) {
  decode.string
  |> decode.map(fn(provider_str) {
    case provider_str {
      "classic" -> Classic
      "google" -> Google
      "github" -> Github
      _ -> Classic
    }
  })
}

pub fn provider_encode(provider: Provider) -> json.Json {
  case provider {
    Classic -> json.string("classic")
    Google -> json.string("google")
    Github -> json.string("github")
  }
}

pub type Account {
  Account(
    id: option.Option(String),
    provider_id: Provider,
    user_id: String,
    access_token: option.Option(String),
    refresh_token: option.Option(String),
    access_token_expires_at: option.Option(String),
    refresh_token_expires_at: option.Option(String),
    password: option.Option(String),
    created_at: String,
    updated_at: String,
  )
}

pub fn account_decode() -> decode.Decoder(Account) {
  use id <- decode.field("id", decode.optional(decode.string))
  use provider_id <- decode.field("provider_id", provider_decode())
  use user_id <- decode.field("user_id", decode.string)
  use access_token <- decode.field(
    "access_token",
    decode.optional(decode.string),
  )
  use refresh_token <- decode.field(
    "refresh_token",
    decode.optional(decode.string),
  )
  use access_token_expires_at <- decode.field(
    "access_token_expires_at",
    decode.optional(decode.string),
  )
  use refresh_token_expires_at <- decode.field(
    "refresh_token_expires_at",
    decode.optional(decode.string),
  )
  use password <- decode.field("password", decode.optional(decode.string))
  use created_at <- decode.field("created_at", decode.string)
  use updated_at <- decode.field("updated_at", decode.string)

  decode.success(Account(
    id,
    provider_id,
    user_id,
    access_token,
    refresh_token,
    access_token_expires_at,
    refresh_token_expires_at,
    password,
    created_at,
    updated_at,
  ))
}

pub fn account_encode_object(user: Account) -> json.Json {
  json.object([
    #("id", json.nullable(user.id, json.string)),
    #("provider_id", provider_encode(user.provider_id)),
    #("user_id", json.string(user.user_id)),
    #("access_token", json.nullable(user.access_token, json.string)),
    #("refresh_token", json.nullable(user.refresh_token, json.string)),
    #(
      "access_token_expires_at",
      json.nullable(user.access_token_expires_at, json.string),
    ),
    #(
      "refresh_token_expires_at",
      json.nullable(user.refresh_token_expires_at, json.string),
    ),
    #("password", json.nullable(user.password, json.string)),
    #("created_at", json.string(user.created_at)),
    #("updated_at", json.string(user.updated_at)),
  ])
}

pub fn account_encode(user: Account) -> String {
  account_encode_object(user)
  |> json.to_string
}
