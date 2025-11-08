//// This module contains the code to run the sql queries defined in
//// `./src/db_querry/session/sql`.
//// > 🐿️ This module was generated automatically using v4.5.0 of
//// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
////

import gleam/dynamic/decode
import gleam/option.{type Option}
import gleam/time/timestamp.{type Timestamp}
import pog

/// A row you get from running the `get_session_with_token` query
/// defined in `./src/db_querry/session/sql/get_session_with_token.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetSessionWithTokenRow {
  GetSessionWithTokenRow(
    id: String,
    expires_at: Timestamp,
    token: String,
    created_at: Timestamp,
    updated_at: Timestamp,
    ip_address: Option(String),
    user_agent: Option(String),
    user_id: String,
    impersonated_by: Option(String),
    active_organization_id: Option(String),
  )
}

/// Runs the `get_session_with_token` query
/// defined in `./src/db_querry/session/sql/get_session_with_token.sql`.
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_session_with_token(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(GetSessionWithTokenRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    use expires_at <- decode.field(1, pog.timestamp_decoder())
    use token <- decode.field(2, decode.string)
    use created_at <- decode.field(3, pog.timestamp_decoder())
    use updated_at <- decode.field(4, pog.timestamp_decoder())
    use ip_address <- decode.field(5, decode.optional(decode.string))
    use user_agent <- decode.field(6, decode.optional(decode.string))
    use user_id <- decode.field(7, decode.string)
    use impersonated_by <- decode.field(8, decode.optional(decode.string))
    use active_organization_id <- decode.field(
      9,
      decode.optional(decode.string),
    )
    decode.success(GetSessionWithTokenRow(
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

  "SELECT
  id,
  \"expiresAt\" as expires_at,
  token,
  \"createdAt\" as created_at,
  \"updatedAt\" as updated_at,
  \"ipAddress\" as ip_address,
  \"userAgent\" as user_agent,
  \"userId\" as user_id,
  \"impersonatedBy\" as impersonated_by,
  \"activeOrganizationId\" as active_organization_id
FROM \"session\"
WHERE token = $1
LIMIT 1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}
