# AVR — Ampere Vision Rwanda

Marketing site, portfolio, news system and admin panel for Ampere Vision
Rwanda Ltd, a licensed drone agri-tech company in Kigali. Precision drone
spraying: crop protection, fertiliser and biopesticide application,
larviciding.

## Stack

- React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion
- Supabase (Postgres, Auth, Storage, Edge Functions) — free tier
- Resend for email (100/day, 3,000/month free) via Edge Functions — phase 5
- Netlify hosting — free tier

No paid services anywhere. The only paid item is the domain.

## Run locally

```bash
npm install
cp .env.example .env   # fill in the Supabase URL and anon key
npm run dev
```

## Routes

| Route          | Purpose                          |
| -------------- | -------------------------------- |
| `/`            | Marketing page                   |
| `/work`        | Portfolio index                  |
| `/work/:slug`  | Project detail + photo gallery   |
| `/news`        | All published news posts         |
| `/news/:slug`  | Article + photo gallery          |
| `/admin`       | Admin panel (Supabase auth)      |
| `/unsubscribe` | Newsletter unsubscribe (phase 5) |

## Signing in to the admin panel

Go to `/admin` and sign in with `muyombanohappy@gmail.com`. There is no
sign-up link: the account is created from the Supabase dashboard under
**Authentication → Users**, and admin rights come from the `admin_users`
allowlist in the database, not from merely having an account.

To add another admin, insert their email into `public.admin_users` and
create their user in the dashboard.

## Adding a news article

1. `/admin` → **News** → **New article**.
2. Type a title. The web address fills itself in; edit it if you like.
3. Write a short **summary** — this is what shows on cards and the news list.
4. Upload a **cover image** if you have one.
5. Write the **story**. Leave a blank line between paragraphs.
6. Under **Photos**, add as many images as you like and give each a
   **caption**. Captions appear under the photo on the article page, and in
   the full-screen viewer. Reorder with the arrows.
7. **Publish** when ready, or **Save** to keep it as a draft. Drafts are
   invisible to the public — this is enforced in the database, not just the UI.

## Adding a project to the portfolio

`/admin` → **Our work** → **New project**. Same flow, plus **client**, **year**,
an **overview**, **the task**, and a **display order** (lower numbers first).

## Editing contact details

`/admin` → **Site details**. Phone, WhatsApp, email and address update
everywhere on the site, in all four languages, without a redeploy.

Marketing copy and headings are not here: each needs a version per language,
so they live in the translation files (see below).

## Enquiries and subscribers

`/admin` → **Enquiries** shows form submissions, with a WhatsApp shortcut,
read/unread marking and CSV export. **Subscribers** shows the mailing list
with confirmed/pending counts, CSV export and removal.

## Languages

English, French, Kinyarwanda and Kiswahili. The switcher is in the nav and
the footer.

- Strings live in `src/i18n/en.ts`, `fr.ts`, `rw.ts`, `sw.ts`, all typed
  against the `Dict` interface in `src/i18n/types.ts`. Adding a key to
  `Dict` forces every language to supply it, so nothing silently falls back.
- English is bundled as the fallback. The other three are fetched only when
  selected, so a visitor downloads one language, not four.
- The choice is saved to `localStorage`; otherwise the browser's preferred
  language is used. `<html lang>` follows the active language.

**Translations need a native-speaker review before launch**, especially the
Kinyarwanda and Kiswahili agronomy and aviation terms.

News articles and projects are stored in one language as authored. If you
want them translated too, that is a schema change — say so and it can be added.

## Database

Two migrations in `supabase/migrations/` describe the whole schema, already
applied to project `vusbutgfaivhodtztsxm`:

| Table                  | Public can…                    |
| ---------------------- | ------------------------------ |
| `news_posts`           | read published rows only       |
| `projects`             | read published rows only       |
| `site_content`         | read                           |
| `subscribers`          | insert only — never read       |
| `contact_submissions`  | insert only — never read       |
| `newsletter_campaigns` | nothing                        |
| `admin_users`          | nothing                        |

Admin rights are checked by `private.is_admin()`, which lives outside the
API-exposed `public` schema so it cannot be called as a REST endpoint.

Storage buckets `news-images` and `project-images` are public to read and
admin-only to write, capped at 5 MB per file, images only.

**Verified against the live database** with real rows present: anonymous
users see nothing private and no drafts; a signed-in user who is *not* on the
allowlist also sees nothing; subscribe and enquiry inserts succeed; anonymous
attempts to publish content, edit site details or delete subscribers all fail
or match zero rows. Supabase security advisors report no issues.

## Performance

The public bundle is about 115 kB gzipped. The Supabase SDK (another ~62 kB)
is deliberately kept out of it: public pages talk to PostgREST with plain
`fetch` via `src/lib/rest.ts`, and the SDK loads only inside the admin panel,
which is a lazily-loaded route. Each extra language is about 2 kB.

## Still to confirm

Search the codebase for `[CONFIRM]`:

- Whether mapping & scouting is a service AVR offers
- Regions served
- Licence number and exact licence wording for the footer
- Social media links
- Real portfolio projects and real photographs. Until a project exists in the
  database, the site shows three clearly-marked placeholders that cannot be
  mistaken for real work.

## Build phases

1. ✅ Scaffold: Vite, routing, Tailwind, Framer Motion, netlify.toml
2. ✅ Public marketing page, portfolio, four languages
3. ✅ Supabase schema, RLS, storage, auth; public site reads live content
4. ✅ Admin panel: news, projects, photos with captions, enquiries,
   subscribers, site details
5. Edge Functions: newsletter send, enquiry notification, double opt-in
   confirmation, unsubscribe
6. Netlify deploy + DNS and Resend verification
