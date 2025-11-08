-- get user trust_score and analytics

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
