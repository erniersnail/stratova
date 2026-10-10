-- Phase 49 fix — admin write policies for recommendations.
-- INSERT: admins can insert manual recommendations.
-- UPDATE: admins can expire recommendations (set expires_at).
-- Grants: authenticated role needs table-level insert/update.

-- Admin INSERT
drop policy if exists "recommendations_insert_admin" on public.recommendations;
create policy "recommendations_insert_admin"
  on public.recommendations
  for insert to authenticated
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- Admin UPDATE (for expire operations)
drop policy if exists "recommendations_update_admin" on public.recommendations;
create policy "recommendations_update_admin"
  on public.recommendations
  for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- Grants
grant insert, update on public.recommendations to authenticated;
