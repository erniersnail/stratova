-- Phase 49: source column on recommendations (vm-written vs manually inserted).
-- Run this in the Supabase SQL Editor.

alter table public.recommendations
  add column if not exists source text not null default 'vm'
  check (source in ('vm', 'manual'));

create index if not exists recommendations_source_idx
  on public.recommendations (source);
