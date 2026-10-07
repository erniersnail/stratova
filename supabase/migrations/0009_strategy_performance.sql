create table if not exists public.strategy_performance (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid not null references public.strategies(id) on delete cascade,
  date date not null,
  total_value numeric(14,2) not null,
  cash numeric(14,2) not null,
  holdings_value numeric(14,2) not null,
  seed_inception boolean not null default false,
  created_at timestamptz default now(),
  unique (strategy_id, date)
);

create index if not exists strategy_performance_strategy_date_idx
  on public.strategy_performance (strategy_id, date desc);

alter table public.strategy_performance enable row level security;

create policy "strategy_performance_select_public"
  on public.strategy_performance for select to anon, authenticated
  using (true);

grant select on public.strategy_performance to anon, authenticated;