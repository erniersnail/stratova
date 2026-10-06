-- Prevent duplicate ACTIVE subscriptions to the same strategy.
-- Preview subscriptions (strategy_id IS NULL) are not covered —
-- they no longer exist after 0005.
create unique index if not exists subscriptions_active_unique
  on public.subscriptions (user_id, strategy_id)
  where status = 'ACTIVE' and strategy_id is not null;
