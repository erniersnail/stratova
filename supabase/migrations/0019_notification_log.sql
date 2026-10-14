-- Tracks per-strategy notification state so the daily cron knows what has
-- already been emailed to subscribers. One row per strategy; the cron
-- upserts on each run.
--
-- RLS enabled with no policies: the table is backend-only. Only the
-- service-role key (used by the cron handler) can read or write it. Anon
-- and authenticated roles are denied by default.

create table if not exists notification_log (
  strategy_id uuid primary key references strategies(id) on delete cascade,
  last_notified_at timestamptz not null default now()
);

alter table notification_log enable row level security;
