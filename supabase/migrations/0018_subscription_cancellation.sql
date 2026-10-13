-- Add cancelled_at for subscription cancellation audit trail.
-- No refund column added: policy is no refunds once ACTIVE (client has
-- accessed current-month picks). SEBI-mandated refunds on RA suspension/
-- cancellation are handled out-of-band.

alter table subscriptions
  add column if not exists cancelled_at timestamptz;

create index if not exists subscriptions_user_status_idx
  on subscriptions (user_id, status);
