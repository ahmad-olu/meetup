SELECT
  id,
  "expiresAt" as expires_at,
  token,
  "createdAt" as created_at,
  "updatedAt" as updated_at,
  "ipAddress" as ip_address,
  "userAgent" as user_agent,
  "userId" as user_id,
  "impersonatedBy" as impersonated_by,
  "activeOrganizationId" as active_organization_id
FROM "session"
WHERE token = $1
LIMIT 1;
