-- 1. Drop the preview policy (has preview clause)
drop policy if exists "recommendations_select_active_subscribers"
  on public.recommendations;

-- 2. New policy: subscribers OR admins
create policy "recommendations_select_subscribers_or_admin"
  on public.recommendations
  for select to authenticated
  using (
    exists (
      select 1 from public.subscriptions s
      where s.user_id = (select auth.uid())
        and s.status = 'ACTIVE'
        and s.strategy_id = recommendations.strategy_id
    )
    or exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid())
        and p.role = 'admin'
    )
  );

-- 3. Add capital_allocated to subscriptions
alter table public.subscriptions
  add column if not exists capital_allocated numeric(14,2);

-- 4. Drop the auto-preview trigger from migration 0004
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 5. Delete all existing preview subscription rows
delete from public.subscriptions where plan = 'preview';

-- 6. Promote the admin account
-- (Edit the email below to match the production admin account
--  before applying to a fresh project.)
update public.profiles
   set role = 'admin'
 where id = (select id from auth.users
             where email = 'vinnykumar2011@gmail.com');
