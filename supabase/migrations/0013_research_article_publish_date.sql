-- Phase 25D Fix 3: manual publish date override.
-- Additive only: stores an admin-chosen publish date while the article
-- is still a draft ("intended publish date"). Null = auto (use now() on
-- publish). Run this in the Supabase SQL Editor.

alter table public.research_articles
  add column if not exists publish_date_override date;
