import db_querry/session/sql as session
import gleam/dynamic/decode
import gleam/json
import gleam/result
import gleam/time/duration
import gleam/time/timestamp

// import gleam/list
import gleam/option

pub type User {
  User(
    id: option.Option(String),
    email: String,
    name: String,
    email_verified: Bool,
    image: option.Option(String),
    banned: option.Option(Bool),
    ban_reason: option.Option(String),
    ban_expires: option.Option(String),
    created_at: String,
    updated_at: String,
  )
}

pub fn user_decoder() -> decode.Decoder(User) {
  use id <- decode.field("id", decode.optional(decode.string))
  use email <- decode.field("email", decode.string)
  use name <- decode.field("name", decode.string)
  use email_verified <- decode.field("emailVerified", decode.bool)
  use image <- decode.field("image", decode.optional(decode.string))
  use banned <- decode.optional_field(
    "banned",
    option.None,
    decode.optional(decode.bool),
  )
  //use banned <- decode.field("banned", decode.optional(decode.bool))
  use ban_reason <- decode.optional_field(
    "banReason",
    option.None,
    decode.optional(decode.string),
  )
  use ban_expires <- decode.optional_field(
    "banExpires",
    option.None,
    decode.optional(decode.string),
  )
  use created_at <- decode.field("createdAt", decode.string)
  use updated_at <- decode.field("updatedAt", decode.string)
  decode.success(User(
    id:,
    email:,
    name:,
    email_verified:,
    image:,
    banned:,
    ban_reason:,
    ban_expires:,
    created_at:,
    updated_at:,
  ))
}

pub fn user_to_json(user: User) -> json.Json {
  let User(
    id:,
    email:,
    name:,
    email_verified:,
    image:,
    banned:,
    ban_reason:,
    ban_expires:,
    created_at:,
    updated_at:,
  ) = user
  json.object([
    #("id", case id {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("email", json.string(email)),
    #("name", json.string(name)),
    #("email_verified", json.bool(email_verified)),
    #("image", case image {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("banned", case banned {
      option.None -> json.null()
      option.Some(value) -> json.bool(value)
    }),
    #("ban_reason", case ban_reason {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("ban_expires", case ban_expires {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("created_at", json.string(created_at)),
    #("updated_at", json.string(updated_at)),
  ])
}

pub type Session {
  Session(
    id: String,
    user_id: String,
    expires_at: String,
    created_at: String,
    updated_at: String,
    token: String,
    ip_address: option.Option(String),
    user_agent: option.Option(String),
    impersonated_by: option.Option(String),
    active_org_id: option.Option(String),
  )
}

pub fn session_to_json(session: Session) -> json.Json {
  let Session(
    id:,
    user_id:,
    expires_at:,
    created_at:,
    updated_at:,
    token:,
    ip_address:,
    user_agent:,
    impersonated_by:,
    active_org_id:,
  ) = session
  json.object([
    #("id", json.string(id)),
    #("userId", json.string(user_id)),
    #("expiresAt", json.string(expires_at)),
    #("createdAt", json.string(created_at)),
    #("updatedAt", json.string(updated_at)),
    #("token", json.string(token)),
    #("ipAddress", case ip_address {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("userAgent", case user_agent {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("impersonatedBy", case impersonated_by {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("activeOrganizationId", case active_org_id {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
  ])
}

fn session_decoder() -> decode.Decoder(Session) {
  use id <- decode.field("id", decode.string)
  use user_id <- decode.field("userId", decode.string)
  use expires_at <- decode.field("expiresAt", decode.string)
  use created_at <- decode.field("createdAt", decode.string)
  use updated_at <- decode.field("updatedAt", decode.string)
  use token <- decode.field("token", decode.string)
  use ip_address <- decode.optional_field(
    "ipAddress",
    option.None,
    decode.optional(decode.string),
  )
  use user_agent <- decode.optional_field(
    "userAgent",
    option.None,
    decode.optional(decode.string),
  )
  use impersonated_by <- decode.optional_field(
    "impersonatedBy",
    option.None,
    decode.optional(decode.string),
  )
  use active_org_id <- decode.optional_field(
    "activeOrganizationId",
    option.None,
    decode.optional(decode.string),
  )
  decode.success(Session(
    id:,
    user_id:,
    expires_at:,
    created_at:,
    updated_at:,
    token:,
    ip_address:,
    user_agent:,
    impersonated_by:,
    active_org_id:,
  ))
}

pub type GetSessionRes {
  GetSessionRes(session: Session, user: User)
}

pub fn get_session_res_decoder() -> decode.Decoder(GetSessionRes) {
  use session <- decode.field("session", session_decoder())
  use user <- decode.field("user", user_decoder())
  decode.success(GetSessionRes(session:, user:))
}

pub type AuthResponse {
  AuthResponse(
    token: option.Option(String),
    user: User,
    success: option.Option(Bool),
    redirect: option.Option(Bool),
    url: option.Option(String),
  )
}

pub fn auth_response_decoder() -> decode.Decoder(AuthResponse) {
  use token <- decode.field("token", decode.optional(decode.string))
  use user <- decode.field("user", user_decoder())
  use success <- decode.optional_field(
    "success",
    option.None,
    decode.optional(decode.bool),
  )
  use redirect <- decode.optional_field(
    "redirect",
    option.None,
    decode.optional(decode.bool),
  )
  use url <- decode.optional_field(
    "url",
    option.None,
    decode.optional(decode.string),
  )
  decode.success(AuthResponse(token:, user:, success:, redirect:, url:))
}

//==========================>

pub type CreateUser {
  CreateUser(
    name: String,
    email: String,
    password: String,
    image: option.Option(String),
    callback_url: option.Option(String),
  )
}

pub fn create_user_to_json(create_user: CreateUser) -> json.Json {
  let CreateUser(name:, email:, password:, image:, callback_url:) = create_user
  json.object([
    #("name", json.string(name)),
    #("email", json.string(email)),
    #("password", json.string(password)),
    #("image", case image {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("callbackURL", case callback_url {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
  ])
}

pub type SignInUser {
  SignInUser(email: String, password: String)
}

pub fn sign_in_user_to_json(sign_in_user: SignInUser) -> json.Json {
  let SignInUser(email:, password:) = sign_in_user
  json.object([
    #("email", json.string(email)),
    #("password", json.string(password)),
  ])
}

pub fn get_session_with_token_row_to_json(
  get_session_with_token_row: session.GetSessionWithTokenRow,
) -> json.Json {
  let session.GetSessionWithTokenRow(
    id:,
    expires_at:,
    token:,
    created_at:,
    updated_at:,
    ip_address:,
    user_agent:,
    user_id:,
    impersonated_by:,
    active_organization_id:,
  ) = get_session_with_token_row

  json.object([
    #("id", json.string(id)),
    #(
      "expires_at",
      json.string(timestamp.to_rfc3339(expires_at, duration.seconds(0))),
    ),
    #("token", json.string(token)),
    #(
      "created_at",
      json.string(timestamp.to_rfc3339(created_at, duration.seconds(0))),
    ),
    #(
      "updated_at",
      json.string(timestamp.to_rfc3339(updated_at, duration.seconds(0))),
    ),
    #("ip_address", case ip_address {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("user_agent", case user_agent {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("user_id", json.string(user_id)),
    #("impersonated_by", case impersonated_by {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
    #("active_organization_id", case active_organization_id {
      option.None -> json.null()
      option.Some(value) -> json.string(value)
    }),
  ])
}

pub fn get_session_with_token_row_decoder() -> decode.Decoder(
  session.GetSessionWithTokenRow,
) {
  use id <- decode.field("id", decode.string)
  use expires_at <- decode.field("expires_at", decode.string)
  use token <- decode.field("token", decode.string)
  use created_at <- decode.field("created_at", decode.string)
  use updated_at <- decode.field("updated_at", decode.string)
  use ip_address <- decode.field("ip_address", decode.optional(decode.string))
  use user_agent <- decode.field("user_agent", decode.optional(decode.string))
  use user_id <- decode.field("user_id", decode.string)
  use impersonated_by <- decode.field(
    "impersonated_by",
    decode.optional(decode.string),
  )
  use active_organization_id <- decode.field(
    "active_organization_id",
    decode.optional(decode.string),
  )
  let expires_at =
    result.unwrap(
      expires_at |> timestamp.parse_rfc3339(),
      timestamp.from_unix_seconds(0),
    )
  let created_at =
    result.unwrap(
      created_at |> timestamp.parse_rfc3339(),
      timestamp.from_unix_seconds(0),
    )
  let updated_at =
    result.unwrap(
      updated_at |> timestamp.parse_rfc3339(),
      timestamp.from_unix_seconds(0),
    )
  decode.success(session.GetSessionWithTokenRow(
    id:,
    expires_at:,
    token:,
    created_at:,
    updated_at:,
    ip_address:,
    user_agent:,
    user_id:,
    impersonated_by:,
    active_organization_id:,
  ))
}
// pub fn sign_in_user_stringify(user: SignInUser) -> String {
//   json.object([
//     #("email", json.string(user.email)),
//     #("password", json.string(user.password)),
//   ])
//   |> json.to_string
// }
// from json
// pub fn user_decode() -> decode.Decoder(User) {
//   use id <- decode.field("id", decode.optional(decode.string))
//   use email <- decode.field("email", decode.string)
//   use email_verified <- decode.field("email_verified", decode.bool)
//   use created_at <- decode.field("created_at", decode.string)
//   use updated_at <- decode.field("updated_at", decode.string)
//   decode.success(User(id, email, email_verified, created_at, updated_at))
// }

// pub fn users_decode() -> decode.Decoder(List(User)) {
//   decode.list(user_decode())
// }

// pub fn user_encode(user: User) -> String {
//   json.object([
//     #("id", json.nullable(user.id, json.string)),
//     #("email", json.string(user.email)),
//     #("email_verified", json.bool(user.email_verified)),
//     #("created_at", json.string(user.created_at)),
//     #("updated_at", json.string(user.updated_at)),
//   ])
//   |> json.to_string
// }
//

// pub fn user_encode_object(user: User) -> json.Json {
//   json.object([
//     #("id", json.nullable(user.id, json.string)),
//     #("email", json.string(user.email)),
//     #("email_verified", json.bool(user.email_verified)),
//     #("created_at", json.string(user.created_at)),
//     #("updated_at", json.string(user.updated_at)),
//   ])
// }

// pub fn user_encode(user: User) -> String {
//   user_encode_object(user)
//   |> json.to_string
// }

// pub fn users_encode(users: List(User)) -> String {
//   json.array(users, of: user_encode_object)
//   |> json.to_string
// }
