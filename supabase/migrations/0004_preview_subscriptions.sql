-- ============================================================================
-- Stratova — 0004_preview_subscriptions.sql
--
-- Preview plan: every user gets an ACTIVE 'preview' subscription on signup
-- (strategy_id = NULL = all strategies). RLS on recommendations grants
-- preview holders visibility into every strategy's picks; paid plans stay
-- scoped to their strategy_id.
--
-- Apply via Supabase Dashboard → SQL Editor. Do NOT run from the website.
-- ============================================================================

-- 1. Update RLS: preview plans see all recommendations,
--    paid plans see only their strategy_id.
drop policy if exists "recommendations_select_active_subscribers"
  on public.recommendations;

create policy "recommendations_select_active_subscribers"
  on public.recommendations
  for select to authenticated
  using (exists (
    select 1 from public.subscriptions s
    where s.user_id = (select auth.uid())
      and s.status = 'ACTIVE'
      and (s.strategy_id = recommendations.strategy_id
           or s.plan = 'preview')
  ));

-- 2. Auto-create a preview subscription on user signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, strategy_id, status, plan)
  values (new.id, null, 'ACTIVE', 'preview');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Backfill existing users who don't already have a preview row.
insert into public.subscriptions (user_id, strategy_id, status, plan)
select u.id, null, 'ACTIVE', 'preview'
  from auth.users u
  left join public.subscriptions s
    on s.user_id = u.id and s.plan = 'preview'
 where s.id is null;

-- 4. Supporting index for the new RLS predicate.
create index if not exists subscriptions_user_plan_idx
  on public.subscriptions (user_id, plan);
