//// This module contains the code to run the sql queries defined in
//// `./src/db_querry/user/sql`.
//// > 🐿️ This module was generated automatically using v4.5.0 of
//// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
////

import gleam/dynamic/decode
import gleam/option.{type Option}
import gleam/time/calendar.{type Date}
import gleam/time/timestamp.{type Timestamp}
import pog
import youid/uuid.{type Uuid}

/// A row you get from running the `count_user_professional_credentials` query
/// defined in `./src/db_querry/user/sql/count_user_professional_credentials.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type CountUserProfessionalCredentialsRow {
  CountUserProfessionalCredentialsRow(total: Int)
}

/// Runs the `count_user_professional_credentials` query
/// defined in `./src/db_querry/user/sql/count_user_professional_credentials.sql`.
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn count_user_professional_credentials(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(CountUserProfessionalCredentialsRow), pog.QueryError) {
  let decoder = {
    use total <- decode.field(0, decode.int)
    decode.success(CountUserProfessionalCredentialsRow(total:))
  }

  "SELECT COUNT(*) as total
FROM professional_credential
WHERE user_id = $1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_data` query
/// defined in `./src/db_querry/user/sql/get_user_data.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserDataRow {
  GetUserDataRow(
    user_id: String,
    trust_score: Int,
    verification_level: String,
    is_flagged: Option(Bool),
    flag_reason: Option(String),
    flagged_at: Option(Timestamp),
    flagged_by: Option(String),
    activity_score: Option(Int),
    report_count: Option(Int),
    verified_reports_count: Option(Int),
    trust_upvotes_received: Option(Int),
    downvotes_received: Option(Int),
    trust_last_updated: Timestamp,
    credential_id: Option(Uuid),
    profession: Option(String),
    specialty: Option(String),
    license_number: Option(String),
    issuing_body: Option(String),
    issuing_country: Option(String),
    issuing_state: Option(String),
    issued_at: Option(Date),
    expires_at: Option(Date),
    verification_status: Option(String),
    verification_method: Option(String),
    verified_at: Option(Timestamp),
    document_url: Option(String),
    is_public: Option(Bool),
    credential_created_at: Option(Timestamp),
    credential_updated_at: Option(Timestamp),
    polls_created: Option(Int),
    polls_voted: Option(Int),
    comments_created: Option(Int),
    topics_created: Option(Int),
    upvotes_given: Option(Int),
    analytics_upvotes_received: Option(Int),
    follower_count: Option(Int),
    following_count: Option(Int),
    influence_score: Option(Float),
    last_active_at: Option(Timestamp),
    analytics_updated_at: Option(Timestamp),
  )
}

/// get user trust_score, professional_credential, and analytics
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_data(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(GetUserDataRow), pog.QueryError) {
  let decoder = {
    use user_id <- decode.field(0, decode.string)
    use trust_score <- decode.field(1, decode.int)
    use verification_level <- decode.field(2, decode.string)
    use is_flagged <- decode.field(3, decode.optional(decode.bool))
    use flag_reason <- decode.field(4, decode.optional(decode.string))
    use flagged_at <- decode.field(5, decode.optional(pog.timestamp_decoder()))
    use flagged_by <- decode.field(6, decode.optional(decode.string))
    use activity_score <- decode.field(7, decode.optional(decode.int))
    use report_count <- decode.field(8, decode.optional(decode.int))
    use verified_reports_count <- decode.field(9, decode.optional(decode.int))
    use trust_upvotes_received <- decode.field(10, decode.optional(decode.int))
    use downvotes_received <- decode.field(11, decode.optional(decode.int))
    use trust_last_updated <- decode.field(12, pog.timestamp_decoder())
    use credential_id <- decode.field(13, decode.optional(uuid_decoder()))
    use profession <- decode.field(14, decode.optional(decode.string))
    use specialty <- decode.field(15, decode.optional(decode.string))
    use license_number <- decode.field(16, decode.optional(decode.string))
    use issuing_body <- decode.field(17, decode.optional(decode.string))
    use issuing_country <- decode.field(18, decode.optional(decode.string))
    use issuing_state <- decode.field(19, decode.optional(decode.string))
    use issued_at <- decode.field(
      20,
      decode.optional(pog.calendar_date_decoder()),
    )
    use expires_at <- decode.field(
      21,
      decode.optional(pog.calendar_date_decoder()),
    )
    use verification_status <- decode.field(22, decode.optional(decode.string))
    use verification_method <- decode.field(23, decode.optional(decode.string))
    use verified_at <- decode.field(
      24,
      decode.optional(pog.timestamp_decoder()),
    )
    use document_url <- decode.field(25, decode.optional(decode.string))
    use is_public <- decode.field(26, decode.optional(decode.bool))
    use credential_created_at <- decode.field(
      27,
      decode.optional(pog.timestamp_decoder()),
    )
    use credential_updated_at <- decode.field(
      28,
      decode.optional(pog.timestamp_decoder()),
    )
    use polls_created <- decode.field(29, decode.optional(decode.int))
    use polls_voted <- decode.field(30, decode.optional(decode.int))
    use comments_created <- decode.field(31, decode.optional(decode.int))
    use topics_created <- decode.field(32, decode.optional(decode.int))
    use upvotes_given <- decode.field(33, decode.optional(decode.int))
    use analytics_upvotes_received <- decode.field(
      34,
      decode.optional(decode.int),
    )
    use follower_count <- decode.field(35, decode.optional(decode.int))
    use following_count <- decode.field(36, decode.optional(decode.int))
    use influence_score <- decode.field(
      37,
      decode.optional(pog.numeric_decoder()),
    )
    use last_active_at <- decode.field(
      38,
      decode.optional(pog.timestamp_decoder()),
    )
    use analytics_updated_at <- decode.field(
      39,
      decode.optional(pog.timestamp_decoder()),
    )
    decode.success(GetUserDataRow(
      user_id:,
      trust_score:,
      verification_level:,
      is_flagged:,
      flag_reason:,
      flagged_at:,
      flagged_by:,
      activity_score:,
      report_count:,
      verified_reports_count:,
      trust_upvotes_received:,
      downvotes_received:,
      trust_last_updated:,
      credential_id:,
      profession:,
      specialty:,
      license_number:,
      issuing_body:,
      issuing_country:,
      issuing_state:,
      issued_at:,
      expires_at:,
      verification_status:,
      verification_method:,
      verified_at:,
      document_url:,
      is_public:,
      credential_created_at:,
      credential_updated_at:,
      polls_created:,
      polls_voted:,
      comments_created:,
      topics_created:,
      upvotes_given:,
      analytics_upvotes_received:,
      follower_count:,
      following_count:,
      influence_score:,
      last_active_at:,
      analytics_updated_at:,
    ))
  }

  "-- get user trust_score, professional_credential, and analytics

SELECT
  -- user_trust_score columns
  uts.user_id,
  uts.trust_score,
  uts.verification_level,
  uts.is_flagged,
  uts.flag_reason,
  uts.flagged_at,
  uts.flagged_by,
  uts.activity_score,
  uts.report_count,
  uts.verified_reports_count,
  uts.upvotes_received as trust_upvotes_received,
  uts.downvotes_received,
  uts.last_updated as trust_last_updated,

  -- professional_credential columns
  pc.id as credential_id,
  pc.profession,
  pc.specialty,
  pc.license_number,
  pc.issuing_body,
  pc.issuing_country,
  pc.issuing_state,
  pc.issued_at,
  pc.expires_at,
  pc.verification_status,
  pc.verification_method,
  pc.verified_at,
  pc.document_url,
  pc.is_public,
  pc.created_at as credential_created_at,
  pc.updated_at as credential_updated_at,

  -- user_analytics columns
  ua.polls_created,
  ua.polls_voted,
  ua.comments_created,
  ua.topics_created,
  ua.upvotes_given,
  ua.upvotes_received as analytics_upvotes_received,
  ua.follower_count,
  ua.following_count,
  ua.influence_score,
  ua.last_active_at,
  ua.updated_at as analytics_updated_at
FROM user_trust_score uts
LEFT JOIN professional_credential pc ON pc.user_id = uts.user_id
LEFT JOIN user_analytics ua ON ua.user_id = uts.user_id
WHERE uts.user_id = $1
LIMIT 1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_professional_credentials` query
/// defined in `./src/db_querry/user/sql/get_user_professional_credentials.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserProfessionalCredentialsRow {
  GetUserProfessionalCredentialsRow(
    id: Uuid,
    user_id: String,
    profession: String,
    specialty: Option(String),
    license_number: Option(String),
    issuing_body: String,
    issuing_country: String,
    issuing_state: Option(String),
    issued_at: Option(Date),
    expires_at: Option(Date),
    verification_status: String,
    verification_method: Option(String),
    verified_at: Option(Timestamp),
    document_url: Option(String),
    is_public: Option(Bool),
    created_at: Timestamp,
    updated_at: Timestamp,
    total_count: Int,
  )
}

/// get user professional credentials with pagination
/// $1 = user_id, $2 = limit, $3 = offset
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_professional_credentials(
  db: pog.Connection,
  arg_1: String,
  arg_2: Int,
  arg_3: Int,
) -> Result(pog.Returned(GetUserProfessionalCredentialsRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, uuid_decoder())
    use user_id <- decode.field(1, decode.string)
    use profession <- decode.field(2, decode.string)
    use specialty <- decode.field(3, decode.optional(decode.string))
    use license_number <- decode.field(4, decode.optional(decode.string))
    use issuing_body <- decode.field(5, decode.string)
    use issuing_country <- decode.field(6, decode.string)
    use issuing_state <- decode.field(7, decode.optional(decode.string))
    use issued_at <- decode.field(
      8,
      decode.optional(pog.calendar_date_decoder()),
    )
    use expires_at <- decode.field(
      9,
      decode.optional(pog.calendar_date_decoder()),
    )
    use verification_status <- decode.field(10, decode.string)
    use verification_method <- decode.field(11, decode.optional(decode.string))
    use verified_at <- decode.field(
      12,
      decode.optional(pog.timestamp_decoder()),
    )
    use document_url <- decode.field(13, decode.optional(decode.string))
    use is_public <- decode.field(14, decode.optional(decode.bool))
    use created_at <- decode.field(15, pog.timestamp_decoder())
    use updated_at <- decode.field(16, pog.timestamp_decoder())
    use total_count <- decode.field(17, decode.int)
    decode.success(GetUserProfessionalCredentialsRow(
      id:,
      user_id:,
      profession:,
      specialty:,
      license_number:,
      issuing_body:,
      issuing_country:,
      issuing_state:,
      issued_at:,
      expires_at:,
      verification_status:,
      verification_method:,
      verified_at:,
      document_url:,
      is_public:,
      created_at:,
      updated_at:,
      total_count:,
    ))
  }

  "-- get user professional credentials with pagination
-- $1 = user_id, $2 = limit, $3 = offset

SELECT
  id,
  user_id,
  profession,
  specialty,
  license_number,
  issuing_body,
  issuing_country,
  issuing_state,
  issued_at,
  expires_at,
  verification_status,
  verification_method,
  verified_at,
  document_url,
  is_public,
  created_at,
  updated_at,
  COUNT(*) OVER() as total_count
FROM professional_credential
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2
OFFSET $3;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.int(arg_2))
  |> pog.parameter(pog.int(arg_3))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_trust_score_analytics` query
/// defined in `./src/db_querry/user/sql/get_user_trust_score_analytics.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserTrustScoreAnalyticsRow {
  GetUserTrustScoreAnalyticsRow(
    user_id: String,
    trust_score: Int,
    verification_level: String,
    is_flagged: Option(Bool),
    flag_reason: Option(String),
    flagged_at: Option(Timestamp),
    flagged_by: Option(String),
    activity_score: Option(Int),
    report_count: Option(Int),
    verified_reports_count: Option(Int),
    trust_upvotes_received: Option(Int),
    downvotes_received: Option(Int),
    trust_last_updated: Timestamp,
    polls_created: Option(Int),
    polls_voted: Option(Int),
    comments_created: Option(Int),
    topics_created: Option(Int),
    upvotes_given: Option(Int),
    analytics_upvotes_received: Option(Int),
    follower_count: Option(Int),
    following_count: Option(Int),
    influence_score: Option(Float),
    last_active_at: Option(Timestamp),
    analytics_updated_at: Option(Timestamp),
  )
}

/// get user trust_score and analytics
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_trust_score_analytics(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(GetUserTrustScoreAnalyticsRow), pog.QueryError) {
  let decoder = {
    use user_id <- decode.field(0, decode.string)
    use trust_score <- decode.field(1, decode.int)
    use verification_level <- decode.field(2, decode.string)
    use is_flagged <- decode.field(3, decode.optional(decode.bool))
    use flag_reason <- decode.field(4, decode.optional(decode.string))
    use flagged_at <- decode.field(5, decode.optional(pog.timestamp_decoder()))
    use flagged_by <- decode.field(6, decode.optional(decode.string))
    use activity_score <- decode.field(7, decode.optional(decode.int))
    use report_count <- decode.field(8, decode.optional(decode.int))
    use verified_reports_count <- decode.field(9, decode.optional(decode.int))
    use trust_upvotes_received <- decode.field(10, decode.optional(decode.int))
    use downvotes_received <- decode.field(11, decode.optional(decode.int))
    use trust_last_updated <- decode.field(12, pog.timestamp_decoder())
    use polls_created <- decode.field(13, decode.optional(decode.int))
    use polls_voted <- decode.field(14, decode.optional(decode.int))
    use comments_created <- decode.field(15, decode.optional(decode.int))
    use topics_created <- decode.field(16, decode.optional(decode.int))
    use upvotes_given <- decode.field(17, decode.optional(decode.int))
    use analytics_upvotes_received <- decode.field(
      18,
      decode.optional(decode.int),
    )
    use follower_count <- decode.field(19, decode.optional(decode.int))
    use following_count <- decode.field(20, decode.optional(decode.int))
    use influence_score <- decode.field(
      21,
      decode.optional(pog.numeric_decoder()),
    )
    use last_active_at <- decode.field(
      22,
      decode.optional(pog.timestamp_decoder()),
    )
    use analytics_updated_at <- decode.field(
      23,
      decode.optional(pog.timestamp_decoder()),
    )
    decode.success(GetUserTrustScoreAnalyticsRow(
      user_id:,
      trust_score:,
      verification_level:,
      is_flagged:,
      flag_reason:,
      flagged_at:,
      flagged_by:,
      activity_score:,
      report_count:,
      verified_reports_count:,
      trust_upvotes_received:,
      downvotes_received:,
      trust_last_updated:,
      polls_created:,
      polls_voted:,
      comments_created:,
      topics_created:,
      upvotes_given:,
      analytics_upvotes_received:,
      follower_count:,
      following_count:,
      influence_score:,
      last_active_at:,
      analytics_updated_at:,
    ))
  }

  "-- get user trust_score and analytics

SELECT
  -- user_trust_score columns
  uts.user_id,
  uts.trust_score,
  uts.verification_level,
  uts.is_flagged,
  uts.flag_reason,
  uts.flagged_at,
  uts.flagged_by,
  uts.activity_score,
  uts.report_count,
  uts.verified_reports_count,
  uts.upvotes_received as trust_upvotes_received,
  uts.downvotes_received,
  uts.last_updated as trust_last_updated,

  -- user_analytics columns
  ua.polls_created,
  ua.polls_voted,
  ua.comments_created,
  ua.topics_created,
  ua.upvotes_given,
  ua.upvotes_received as analytics_upvotes_received,
  ua.follower_count,
  ua.following_count,
  ua.influence_score,
  ua.last_active_at,
  ua.updated_at as analytics_updated_at
FROM user_trust_score uts
LEFT JOIN user_analytics ua ON ua.user_id = uts.user_id
WHERE uts.user_id = $1
LIMIT 1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_verifications` query
/// defined in `./src/db_querry/user/sql/get_user_verifications.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserVerificationsRow {
  GetUserVerificationsRow(
    id: Uuid,
    user_id: String,
    verification_type: String,
    verification_status: String,
    submitted_at: Timestamp,
    reviewed_at: Option(Timestamp),
    reviewed_by: Option(String),
    document_url: Option(String),
    verification_data: Option(String),
    notes: Option(String),
    expires_at: Option(Timestamp),
    total_count: Int,
  )
}

/// get user verifications with pagination
/// $1 = user_id, $2 = limit, $3 = offset
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_verifications(
  db: pog.Connection,
  arg_1: String,
  arg_2: Int,
  arg_3: Int,
) -> Result(pog.Returned(GetUserVerificationsRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, uuid_decoder())
    use user_id <- decode.field(1, decode.string)
    use verification_type <- decode.field(2, decode.string)
    use verification_status <- decode.field(3, decode.string)
    use submitted_at <- decode.field(4, pog.timestamp_decoder())
    use reviewed_at <- decode.field(5, decode.optional(pog.timestamp_decoder()))
    use reviewed_by <- decode.field(6, decode.optional(decode.string))
    use document_url <- decode.field(7, decode.optional(decode.string))
    use verification_data <- decode.field(8, decode.optional(decode.string))
    use notes <- decode.field(9, decode.optional(decode.string))
    use expires_at <- decode.field(10, decode.optional(pog.timestamp_decoder()))
    use total_count <- decode.field(11, decode.int)
    decode.success(GetUserVerificationsRow(
      id:,
      user_id:,
      verification_type:,
      verification_status:,
      submitted_at:,
      reviewed_at:,
      reviewed_by:,
      document_url:,
      verification_data:,
      notes:,
      expires_at:,
      total_count:,
    ))
  }

  "-- get user verifications with pagination
-- $1 = user_id, $2 = limit, $3 = offset

SELECT
  id,
  user_id,
  verification_type,
  verification_status,
  submitted_at,
  reviewed_at,
  reviewed_by,
  document_url,
  verification_data,
  notes,
  expires_at,
  COUNT(*) OVER() as total_count
FROM user_verification
WHERE user_id = $1
ORDER BY submitted_at DESC
LIMIT $2
OFFSET $3;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.int(arg_2))
  |> pog.parameter(pog.int(arg_3))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_with_email` query
/// defined in `./src/db_querry/user/sql/get_user_with_email.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserWithEmailRow {
  GetUserWithEmailRow(
    id: String,
    name: String,
    email: String,
    email_verified: Bool,
    image: Option(String),
    created_at: Timestamp,
    updated_at: Timestamp,
    role: Option(String),
    banned: Option(Bool),
    ban_reason: Option(String),
    ban_expires: Option(Timestamp),
  )
}

/// Runs the `get_user_with_email` query
/// defined in `./src/db_querry/user/sql/get_user_with_email.sql`.
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_with_email(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(GetUserWithEmailRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    use name <- decode.field(1, decode.string)
    use email <- decode.field(2, decode.string)
    use email_verified <- decode.field(3, decode.bool)
    use image <- decode.field(4, decode.optional(decode.string))
    use created_at <- decode.field(5, pog.timestamp_decoder())
    use updated_at <- decode.field(6, pog.timestamp_decoder())
    use role <- decode.field(7, decode.optional(decode.string))
    use banned <- decode.field(8, decode.optional(decode.bool))
    use ban_reason <- decode.field(9, decode.optional(decode.string))
    use ban_expires <- decode.field(
      10,
      decode.optional(pog.timestamp_decoder()),
    )
    decode.success(GetUserWithEmailRow(
      id:,
      name:,
      email:,
      email_verified:,
      image:,
      created_at:,
      updated_at:,
      role:,
      banned:,
      ban_reason:,
      ban_expires:,
    ))
  }

  "SELECT
  id,
  name,
  email,
  \"emailVerified\" as email_verified,
  image,
  \"createdAt\" as created_at,
  \"updatedAt\" as updated_at,
  role,
  banned,
  \"banReason\" as ban_reason,
  \"banExpires\" as ban_expires
FROM \"user\"
WHERE email = $1
LIMIT 1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_user_with_id` query
/// defined in `./src/db_querry/user/sql/get_user_with_id.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.5.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetUserWithIdRow {
  GetUserWithIdRow(
    id: String,
    name: String,
    email: String,
    email_verified: Bool,
    image: Option(String),
    created_at: Timestamp,
    updated_at: Timestamp,
    role: Option(String),
    banned: Option(Bool),
    ban_reason: Option(String),
    ban_expires: Option(Timestamp),
  )
}

/// Runs the `get_user_with_id` query
/// defined in `./src/db_querry/user/sql/get_user_with_id.sql`.
///
/// > 🐿️ This function was generated automatically using v4.5.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_user_with_id(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(GetUserWithIdRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    use name <- decode.field(1, decode.string)
    use email <- decode.field(2, decode.string)
    use email_verified <- decode.field(3, decode.bool)
    use image <- decode.field(4, decode.optional(decode.string))
    use created_at <- decode.field(5, pog.timestamp_decoder())
    use updated_at <- decode.field(6, pog.timestamp_decoder())
    use role <- decode.field(7, decode.optional(decode.string))
    use banned <- decode.field(8, decode.optional(decode.bool))
    use ban_reason <- decode.field(9, decode.optional(decode.string))
    use ban_expires <- decode.field(
      10,
      decode.optional(pog.timestamp_decoder()),
    )
    decode.success(GetUserWithIdRow(
      id:,
      name:,
      email:,
      email_verified:,
      image:,
      created_at:,
      updated_at:,
      role:,
      banned:,
      ban_reason:,
      ban_expires:,
    ))
  }

  "SELECT
  id,
  name,
  email,
  \"emailVerified\" as email_verified,
  image,
  \"createdAt\" as created_at,
  \"updatedAt\" as updated_at,
  role,
  banned,
  \"banReason\" as ban_reason,
  \"banExpires\" as ban_expires
FROM \"user\"
WHERE id = $1
LIMIT 1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

// --- Encoding/decoding utils -------------------------------------------------

/// A decoder to decode `Uuid`s coming from a Postgres query.
///
fn uuid_decoder() {
  use bit_array <- decode.then(decode.bit_array)
  case uuid.from_bit_array(bit_array) {
    Ok(uuid) -> decode.success(uuid)
    Error(_) -> decode.failure(uuid.v7(), "Uuid")
  }
}
