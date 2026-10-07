create table if not exists public.benchmarks (
  symbol text not null,
  date date not null,
  close numeric(14,2) not null,
  primary key (symbol, date)
);

create index if not exists benchmarks_date_idx
  on public.benchmarks (date desc);

alter table public.benchmarks enable row level security;

create policy "benchmarks_public_read"
  on public.benchmarks for select to anon, authenticated
  using (true);

grant select on public.benchmarks to anon, authenticated;
