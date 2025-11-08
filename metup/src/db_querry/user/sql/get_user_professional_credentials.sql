-- get user professional credentials with pagination
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
