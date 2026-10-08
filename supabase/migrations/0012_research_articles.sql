-- Phase 25A — research_articles schema
-- User runs this in the Supabase SQL Editor. No other files changed.

create table if not exists public.research_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  body_md text not null,
  category text,
  author_name text default 'Stratova Quant',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists research_articles_published_idx
  on public.research_articles (is_published, published_at desc);

create index if not exists research_articles_slug_idx
  on public.research_articles (slug);

alter table public.research_articles enable row level security;

-- Public reads only published
create policy "research_articles_public_read"
  on public.research_articles for select to anon, authenticated
  using (is_published = true);

-- Admins can do anything
create policy "research_articles_admin_all"
  on public.research_articles for all to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

grant select on public.research_articles to anon, authenticated;
grant insert, update, delete on public.research_articles to authenticated;

-- Auto-updated_at trigger

create or replace function public.research_articles_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_research_articles_updated_at on public.research_articles;
create trigger trg_research_articles_updated_at
  before update on public.research_articles
  for each row execute function public.research_articles_set_updated_at();
