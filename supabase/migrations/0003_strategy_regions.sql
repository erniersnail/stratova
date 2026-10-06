-- Add region column to strategies
alter table public.strategies
  add column if not exists region text default 'india'
  check (region in ('india', 'us'));

-- Backfill existing rows
update public.strategies
   set region = 'india'
 where region is null;

-- Seed the US strategy (placeholder — real data added later)
insert into public.strategies
  (slug, name, short_description, risk_level, benchmark,
   is_public, display_order, region)
values
  ('us-equity-leadership',
   'U.S. Equity Leadership',
   'NASDAQ large-cap momentum. Concentrated portfolio ranked by 90-day dollar-volume leadership.',
   'high',
   'NASDAQ 100',
   true,
   5,
   'us')
on conflict (slug) do nothing;
