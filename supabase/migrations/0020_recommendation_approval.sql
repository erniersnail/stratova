-- Recommendation approval gate.
-- VM writes new picks with approved_at = null; admin reviews and approves
-- via /admin/recommendations. Clients only see approved, non-removed picks.

alter table recommendations
  add column if not exists admin_remark text;

-- Speed up the client read filter.
create index if not exists recommendations_approved_idx
  on recommendations (strategy_id, approved_at, removed_at)
  where approved_at is not null and removed_at is null;
