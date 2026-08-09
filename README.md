# AVR — Ampere Vision Rwanda

Marketing site, portfolio, news system and admin panel for Ampere Vision
Rwanda Ltd, a licensed drone agri-tech company in Kigali. Precision drone
spraying: crop protection, fertiliser and biopesticide application,
larviciding.

## Stack

- React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion
- Supabase (Postgres, Auth, Storage, Edge Functions) — free tier
- Resend for email (100/day, 3,000/month free) via Edge Functions
- Netlify hosting — free tier

No paid services anywhere. The only paid item is the domain.

## Run locally

```bash
npm install
cp .env.example .env   # fill in Supabase values when available
npm run dev
```

## Routes

| Route          | Purpose                          |
| -------------- | -------------------------------- |
| `/`            | Marketing page                   |
| `/work`        | Portfolio index                  |
| `/work/:slug`  | Project detail + photo gallery   |
| `/news`        | All published news posts         |
| `/news/:slug`  | Single article                   |
| `/admin`       | Admin panel (Supabase auth)      |
| `/unsubscribe` | Newsletter unsubscribe           |

## Languages

The site ships in English, French, Kinyarwanda and Kiswahili. The switcher
sits in the nav and the footer.

- Strings live in `src/i18n/en.ts`, `fr.ts`, `rw.ts`, `sw.ts`, all typed
  against the `Dict` interface in `src/i18n/types.ts`. Adding a key to
  `Dict` forces every language to supply it, so nothing silently falls back.
- English is bundled as the fallback. The other three are fetched only when
  selected, so a visitor downloads one language, not four.
- The choice is saved to `localStorage`, otherwise the browser's preferred
  language is used. `<html lang>` follows the active language.

**Translations need a native-speaker review before launch**, especially
Kinyarwanda and Kiswahili agronomy and aviation terms.

## Contact details (confirmed)

Phone and WhatsApp `0792 437 462`, email `amperevisionrwanda@gmail.com`,
base Nyarugenge District, Kigali. Held in `src/data/mock.ts` until phase 3
moves them into the `site_content` table.

## Still to confirm

Search the codebase for `[CONFIRM]`. Currently outstanding:

- Whether mapping & scouting is a service AVR offers
- Regions served
- Licence number and exact licence wording for the footer
- Social media links
- **Every portfolio project** — `src/data/projects.ts` holds three
  placeholder records. Client names, years and descriptions are invented
  structure, not real history. Replace them from the admin panel.
- Real photographs. Until one is uploaded, cards show a clearly-labelled
  "photograph to be supplied" placeholder that cannot be mistaken for a
  real AVR photo.

## Build phases

1. ✅ Scaffold: Vite, routing, Tailwind, Framer Motion, netlify.toml
2. ✅ Public marketing page with mock data, portfolio, four languages
3. Supabase: schema, RLS, storage, auth
4. Admin panel (news, projects + photo upload, site copy, enquiries,
   subscribers, newsletter)
5. Edge Functions (newsletter, enquiry notify, double opt-in, unsubscribe)
6. Netlify deploy + DNS/Resend verification

Instructions for adding a news post, adding a project, editing homepage copy,
sending a newsletter, and the full DNS record list will be added as those
phases land.
