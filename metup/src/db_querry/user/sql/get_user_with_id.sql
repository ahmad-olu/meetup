SELECT
  id,
  name,
  email,
  "emailVerified" as email_verified,
  image,
  "createdAt" as created_at,
  "updatedAt" as updated_at,
  role,
  banned,
  "banReason" as ban_reason,
  "banExpires" as ban_expires
FROM "user"
WHERE id = $1
LIMIT 1;
