-- ============================================================================
-- Stratova — 0002_seed_strategies.sql
--
-- Fixed strategy catalog (4 rows), seeded once.
-- The VM does NOT write here. Recommendations reference these rows.
-- fee / long_description / returns_json stay NULL; filled in later phases.
--
-- Apply via Supabase Dashboard → SQL Editor.
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING + IF NOT EXISTS).
-- ============================================================================

-- 1. Subscriber / admin role on profiles.
alter table public.profiles
  add column if not exists role text default 'subscriber'
  check (role in ('subscriber', 'admin'));

-- 2. Fixed catalog.
insert into public.strategies
  (slug, name, short_description, risk_level, benchmark, is_public, display_order)
values
  (
    'momentum-eq',
    'Momentum EQ',
    'NSE large-cap momentum. Monthly rebalance, 3 positions.',
    'moderate',
    'NIFTY 50',
    true,
    1
  ),
  (
    'momentum-broad',
    'Momentum Broad',
    'NSE broad-market momentum across EQ, BE and BZ series. Monthly rebalance, 3 positions.',
    'high',
    'NIFTY 500',
    true,
    2
  ),
  (
    'smallcap-ensemble',
    'Smallcap Ensemble',
    'NIFTY Smallcap 100 ensemble. Quarterly rebalance, 3 positions.',
    'high',
    'NIFTY Smallcap 100',
    true,
    3
  ),
  (
    'midcap',
    'Midcap Select',
    'NIFTY Midcap 100 momentum. Quarterly rebalance, 6 positions.',
    'high',
    'NIFTY Midcap 100',
    true,
    4
  )
on conflict (slug) do nothing;
