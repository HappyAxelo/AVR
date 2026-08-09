-- ============================================================
-- AVR initial schema: content, enquiries, subscribers, campaigns
-- Applied to project vusbutgfaivhodtztsxm.
-- ============================================================

-- ---------- admin identity ----------
-- Admins are an allowlist of email addresses, not "anyone who signed up".
-- Public sign-up must also be disabled in the Supabase Auth settings.
create table if not exists public.admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

insert into public.admin_users (email)
values ('muyombanohappy@gmail.com')
on conflict (email) do nothing;

-- ---------- shared updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- news_posts ----------
create table public.news_posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text not null default '',
  body            text not null default '',
  cover_image_url text,
  -- [{ "url": "...", "caption": "..." }]
  gallery         jsonb not null default '[]'::jsonb,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint news_gallery_is_array check (jsonb_typeof(gallery) = 'array')
);

create index news_posts_published_idx
  on public.news_posts (status, published_at desc);

create trigger news_posts_updated_at
  before update on public.news_posts
  for each row execute function public.set_updated_at();

alter table public.news_posts enable row level security;

create policy "anyone reads published news"
  on public.news_posts for select to anon, authenticated
  using (status = 'published');

-- ---------- projects (portfolio) ----------
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  client          text not null default '',
  year            text not null default '',
  summary         text not null default '',
  overview        text not null default '',
  task            text not null default '',
  cover_image_url text,
  -- [{ "url": "...", "caption": "..." }]
  gallery         jsonb not null default '[]'::jsonb,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint projects_gallery_is_array check (jsonb_typeof(gallery) = 'array')
);

create index projects_published_idx
  on public.projects (status, sort_order);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

create policy "anyone reads published projects"
  on public.projects for select to anon, authenticated
  using (status = 'published');

-- ---------- subscribers ----------
create table public.subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  status            text not null default 'subscribed'
                      check (status in ('subscribed', 'unsubscribed')),
  confirmed         boolean not null default false,
  unsubscribe_token uuid not null default gen_random_uuid(),
  confirm_token     uuid not null default gen_random_uuid(),
  created_at        timestamptz not null default now()
);

create index subscribers_sendable_idx
  on public.subscribers (status, confirmed);

alter table public.subscribers enable row level security;

-- Anonymous visitors may sign up, and nothing else. No select policy for anon
-- means the subscriber list is unreadable without an admin session.
create policy "anyone can subscribe"
  on public.subscribers for insert to anon, authenticated
  with check (true);

-- ---------- contact_submissions ----------
create table public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  location   text,
  crop       text,
  hectares   numeric,
  message    text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_submissions_unread_idx
  on public.contact_submissions (read, created_at desc);

alter table public.contact_submissions enable row level security;

create policy "anyone can send an enquiry"
  on public.contact_submissions for insert to anon, authenticated
  with check (true);

-- ---------- site_content ----------
create table public.site_content (
  key        text primary key,
  value      jsonb not null default '""'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

create policy "anyone reads site content"
  on public.site_content for select to anon, authenticated
  using (true);

insert into public.site_content (key, value) values
  ('contact_phone',     '"0792 437 462"'::jsonb),
  ('contact_phone_e164','"250792437462"'::jsonb),
  ('contact_whatsapp',  '"0792 437 462"'::jsonb),
  ('contact_email',     '"amperevisionrwanda@gmail.com"'::jsonb),
  ('contact_address',   '"Nyarugenge District, Kigali, Rwanda"'::jsonb)
on conflict (key) do nothing;

-- ---------- newsletter_campaigns ----------
create table public.newsletter_campaigns (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  body            text not null default '',
  recipient_count integer not null default 0,
  status          text not null default 'draft'
                    check (status in ('draft', 'sending', 'sent', 'failed')),
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.newsletter_campaigns enable row level security;
