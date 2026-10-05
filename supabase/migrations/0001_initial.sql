-- ============================================================================
-- Stratova — 0001_initial.sql
--
-- Handoff surface only. The Oracle VM writes `strategies` and
-- `recommendations` using the service role key; the website reads them as a
-- subscriber. This file contains NO strategy logic.
--
-- Apply via Supabase Dashboard → SQL Editor.
--
-- Design notes:
--   * RLS is enabled on every table. With RLS on and no policy granting write
--     access, anon/authenticated cannot write — only the service role (which
--     bypasses RLS) can. This is what keeps strategies and recommendations
--     VM-owned.
--   * `gen_random_uuid()` and `auth.uid()` are provided by Supabase (pgcrypto
--     / auth schema). No extensions need to be created.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------

-- Profiles: 1:1 with an auth user. Written by the user (own row only).
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  pan         text,
  kyc_status  text default 'pending',
  created_at  timestamptz default now()
);

-- Strategies: written by the VM, read by the website.
create table public.strategies (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  short_description  text,
  long_description   text,
  risk_level         text,
  benchmark          text,
  fee                numeric(10, 2),
  returns_json       jsonb,
  is_public          boolean default false,
  display_order      int default 0,
  created_at         timestamptz default now()
);

-- Subscriptions: written by the service role only. Read by owner.
create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users (id) on delete cascade,
  strategy_id         uuid references public.strategies (id),
  status              text check (
                         status in ('PENDING','ACTIVE','PAUSED','CANCELLED','EXPIRED')
                       ),
  plan                text,
  price               numeric(10, 2),
  started_at          timestamptz,
  expires_at          timestamptz,
  payment_reference   text,
  created_at          timestamptz default now()
);

-- Consents: append-only regulatory evidence of MITC / terms acceptance.
-- No UPDATE and no DELETE policy — rows are immutable by design.
create table public.consents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users (id) on delete cascade,
  doc_type      text not null,
  doc_version   text not null,
  accepted_at   timestamptz default now(),
  ip            inet,
  user_agent    text
);

-- Recommendations: written by the VM, read by subscribers with an ACTIVE
-- subscription to the parent strategy.
create table public.recommendations (
  id            uuid primary key default gen_random_uuid(),
  strategy_id   uuid references public.strategies (id),
  symbol        text not null,
  action        text check (action in ('BUY','SELL','HOLD')),
  as_of         timestamptz not null,
  rationale     text,
  expires_at    timestamptz,
  published_at  timestamptz default now()
);

-- Contact form submissions. Re-enabled in a later phase.
create table public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  message       text,
  submitted_at  timestamptz default now(),
  handled       boolean default false
);

-- Newsletter signups. Re-enabled in a later phase.
create table public.newsletter_signups (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  subscribed_at   timestamptz default now(),
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Indexes supporting the RLS predicates below
-- ---------------------------------------------------------------------------

create index subscriptions_user_id_idx    on public.subscriptions (user_id);
create index subscriptions_strategy_idx   on public.subscriptions (strategy_id);
create index recommendations_strategy_idx on public.recommendations (strategy_id);
create index recommendations_published_idx on public.recommendations (published_at desc);
create index consents_user_id_idx         on public.consents (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles            enable row level security;
alter table public.strategies          enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.consents            enable row level security;
alter table public.recommendations     enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_signups  enable row level security;

-- profiles: a user reads and writes only their own row.
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- strategies: public read of published strategies only.
-- No INSERT/UPDATE/DELETE policies => only the service role (which bypasses
-- RLS) can write. This is what makes the VM the sole writer.
create policy "strategies_select_public"
  on public.strategies for select
  to anon, authenticated
  using (is_public = true);

-- subscriptions: a user reads only their own rows.
-- No write policies => subscriptions are created by the service role only.
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- consents: a user reads their own rows and may append for themselves.
-- Deliberately no UPDATE and no DELETE policy: consent records are immutable.
create policy "consents_select_own"
  on public.consents for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "consents_insert_own"
  on public.consents for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- recommendations: readable only by an authenticated user holding an ACTIVE
-- subscription to the parent strategy.
create policy "recommendations_select_active_subscribers"
  on public.recommendations for select
  to authenticated
  using (
    exists (
      select 1
      from public.subscriptions s
      where s.strategy_id = recommendations.strategy_id
        and s.user_id = (select auth.uid())
        and s.status = 'ACTIVE'
    )
  );

-- contact_submissions: anon may submit. No SELECT policy => nobody can read
-- submissions through the public API; only the service role can.
create policy "contact_submissions_insert_anon"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- newsletter_signups: anon may subscribe. No SELECT policy => the signup list
-- is not readable through the public API.
create policy "newsletter_signups_insert_anon"
  on public.newsletter_signups for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
-- RLS policies decide *what rows* are visible. Grants decide which roles may
-- touch each table at all. Without grants, a role has no table privilege and
-- every policy above is inert.
--
--   profiles        -> SELECT, UPDATE, INSERT  (own row only, per policies)
--   strategies      -> SELECT                 (VM writes via service role)
--   subscriptions   -> SELECT                 (service role writes)
--   consents        -> SELECT, INSERT         (service role may also write)
--   recommendations -> SELECT                 (VM writes via service role)
--   contact_submissions / newsletter_signups -> INSERT only, no SELECT.
--
-- No INSERT/UPDATE/DELETE is granted to anon or authenticated on strategies,
-- subscriptions or recommendations. That is what enforces the VM handoff.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select             on public.profiles to authenticated;
grant update, insert     on public.profiles to authenticated;

grant select             on public.strategies to anon, authenticated;

grant select             on public.subscriptions to authenticated;

grant select, insert     on public.consents to authenticated;

grant select             on public.recommendations to authenticated;

grant insert             on public.contact_submissions to anon, authenticated;
grant insert             on public.newsletter_signups  to anon, authenticated;

