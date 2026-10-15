-- Tighten the subscriber SELECT policy on recommendations so unapproved
-- and removed picks are invisible at the RLS layer, not only in the
-- application fetch functions. Without this, a subscriber could hit the
-- Supabase API directly and read pending picks for strategies they're
-- subscribed to.
--
-- Admin path is preserved: admins can still see pending and removed rows
-- so the review UI at /admin/recommendations works.

drop policy if exists recommendations_select_subscribers_or_admin
  on recommendations;

create policy recommendations_select_subscribers_or_admin
on recommendations
for select
to authenticated
using (
  (
    approved_at is not null
    and removed_at is null
    and exists (
      select 1 from subscriptions s
      where s.user_id = auth.uid()
        and s.status = 'ACTIVE'
        and s.strategy_id = recommendations.strategy_id
    )
  )
  or exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);
