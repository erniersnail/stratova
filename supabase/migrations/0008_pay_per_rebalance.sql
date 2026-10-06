-- 1. Fee per rebalance on strategies (admin-editable)
alter table public.strategies
  add column if not exists fee_per_rebalance numeric(10,2) not null default 5000;

-- 2. One row per rebalance unlock per subscription
create table if not exists public.subscription_payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  rebalance_date date not null,
  amount numeric(10,2) not null,
  status text not null default 'PENDING'
    check (status in ('PENDING','PAID','FAILED','REFUNDED')),
  payment_provider text,
  payment_reference text,
  created_at timestamptz default now(),
  paid_at timestamptz,
  unique (subscription_id, rebalance_date)
);

create index if not exists subscription_payments_subscription_idx
  on public.subscription_payments (subscription_id);

alter table public.subscription_payments enable row level security;

-- Users read their own payments
create policy "subscription_payments_select_own"
  on public.subscription_payments for select to authenticated
  using (exists (
    select 1 from public.subscriptions s
    where s.id = subscription_payments.subscription_id
      and s.user_id = (select auth.uid())
  ));

-- Admins read all payments
create policy "subscription_payments_select_admin"
  on public.subscription_payments for select to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- Admins update payment status (mark PAID)
create policy "subscription_payments_update_admin"
  on public.subscription_payments for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (true);

grant select on public.subscription_payments to authenticated;
grant update on public.subscription_payments to authenticated;

-- Admins can update strategy fees
drop policy if exists "strategies_update_admin" on public.strategies;
create policy "strategies_update_admin"
  on public.strategies for update to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (true);
