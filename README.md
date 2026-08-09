# AVR — Ampere Vision Rwanda

Marketing site, news system and admin panel for Ampere Vision Rwanda Ltd,
a licensed drone agri-tech company in Kigali. Precision drone spraying:
crop protection, fertiliser and biopesticide application, larviciding.

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
| `/news`        | All published news posts         |
| `/news/:slug`  | Single article                   |
| `/admin`       | Admin panel (Supabase auth)      |
| `/unsubscribe` | Newsletter unsubscribe           |

## Environment variables

See `.env.example`. `VITE_`-prefixed vars are safe for the browser.
Service-role and Resend keys live only in Supabase Edge Function secrets.
Never commit `.env`.

## Build phases

1. ✅ Scaffold: Vite, routing, Tailwind, Framer Motion, netlify.toml
2. Public marketing page with mock data
3. Supabase: schema, RLS, storage, auth
4. Admin panel
5. Edge Functions (newsletter, enquiry notify, double opt-in, unsubscribe)
6. Netlify deploy + DNS/Resend verification

Sections for adding news posts, editing homepage copy, sending a newsletter
and DNS records will be filled in as those phases land.
