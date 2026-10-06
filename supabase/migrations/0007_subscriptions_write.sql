-- Allow users to insert and update their own subscriptions.
-- SELECT policy already exists from 0001.

drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own"
  on public.subscriptions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own"
  on public.subscriptions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);