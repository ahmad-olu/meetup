-- get user verifications with pagination
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
