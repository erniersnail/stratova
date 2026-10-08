-- Phase 25E — article image uploads
-- Public storage bucket for article media + cover image column.
-- User runs this in the Supabase SQL Editor.

-- Public bucket for article media
insert into storage.buckets (id, name, public)
values ('article-media', 'article-media', true)
on conflict (id) do nothing;

-- Public read
drop policy if exists "article_media_public_read" on storage.objects;
create policy "article_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'article-media');

-- Admin insert/update/delete
drop policy if exists "article_media_admin_write" on storage.objects;
create policy "article_media_admin_write"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'article-media'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  )
  with check (
    bucket_id = 'article-media'
    and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );

-- Add cover image URL column to articles
alter table public.research_articles
  add column if not exists cover_image_url text;
