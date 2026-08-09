-- ============================================================
-- Admin helper, admin policies, and image storage buckets.
--
-- is_admin() lives in the `private` schema deliberately: PostgREST only
-- exposes `public`, so it cannot be called as /rest/v1/rpc/is_admin.
-- It is SECURITY DEFINER so the policy check does not itself hit
-- admin_users RLS and recurse.
-- ============================================================

create schema if not exists private;
revoke all on schema private from anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

-- ---------- admin policies ----------
create policy "admins read admin list"
  on public.admin_users for select to authenticated
  using (private.is_admin());

create policy "admins manage news"
  on public.news_posts for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "admins manage projects"
  on public.projects for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "admins manage subscribers"
  on public.subscribers for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "admins manage enquiries"
  on public.contact_submissions for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "admins manage site content"
  on public.site_content for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "admins manage campaigns"
  on public.newsletter_campaigns for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- ---------- storage ----------
-- Public read so <img src> works without signed URLs; admin-only write.
-- 5 MB per file keeps us inside the 1 GB free storage tier.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('news-images', 'news-images', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('project-images', 'project-images', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "anyone reads site images"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('news-images', 'project-images'));

create policy "admins upload site images"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('news-images', 'project-images') and private.is_admin());

create policy "admins update site images"
  on storage.objects for update to authenticated
  using (bucket_id in ('news-images', 'project-images') and private.is_admin())
  with check (bucket_id in ('news-images', 'project-images') and private.is_admin());

create policy "admins delete site images"
  on storage.objects for delete to authenticated
  using (bucket_id in ('news-images', 'project-images') and private.is_admin());
