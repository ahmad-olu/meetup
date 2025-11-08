SELECT COUNT(*) as total
FROM professional_credential
WHERE user_id = $1;
