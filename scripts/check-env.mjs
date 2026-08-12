// Fails the build when the Supabase environment variables are missing.
//
// Without this, Vite happily compiles `import.meta.env.VITE_SUPABASE_URL`
// down to undefined and ships a site that looks fine but cannot reach the
// database: news falls back to built-in content, the admin panel cannot log
// in, and — worst of all — the contact form reports success while discarding
// the enquiry. A build that fails loudly is far better than a deploy that
// fails silently.
//
// Set ALLOW_MISSING_SUPABASE=1 to build without it on purpose.

import { readFileSync, existsSync } from 'node:fs'

const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

// Vite reads .env files itself, so a plain Node script has to do the same or
// it would reject a perfectly good local setup. Real environment variables
// (how Netlify supplies them) always win.
function loadDotEnv() {
  const values = {}
  for (const file of ['.env', '.env.local', '.env.production']) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!match) continue
      values[match[1]] = match[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return values
}

const fromFiles = loadDotEnv()
const read = (name) => (process.env[name] ?? fromFiles[name] ?? '').trim()

const missing = REQUIRED.filter((name) => !read(name))

if (missing.length && !process.env.ALLOW_MISSING_SUPABASE) {
  console.error(`
┌───────────────────────────────────────────────────────────────┐
│  BUILD STOPPED — Supabase configuration is missing            │
└───────────────────────────────────────────────────────────────┘

Missing: ${missing.join(', ')}

Building without these produces a site that LOOKS fine but:
  • the admin panel cannot sign in
  • news and projects silently show built-in placeholder content
  • the contact form says "thank you" and throws the enquiry away

To fix:
  • Netlify  → Site configuration → Environment variables
  • Locally  → copy .env.example to .env and fill it in

  VITE_SUPABASE_URL       https://<project-ref>.supabase.co
  VITE_SUPABASE_ANON_KEY  the publishable key from
                          Supabase → Settings → API Keys

Only these two belong in the frontend. The service-role and Resend keys
are Edge Function secrets and must never be set here.

To build anyway (a static preview with no backend):
  ALLOW_MISSING_SUPABASE=1 npm run build
`)
  process.exit(1)
}

if (missing.length) {
  console.warn(`⚠  Building WITHOUT Supabase (${missing.join(', ')} unset). Backend features will not work.`)
} else {
  const url = read('VITE_SUPABASE_URL')
  const key = read('VITE_SUPABASE_ANON_KEY')

  // A service-role key here would be handed to every visitor.
  if (key.includes('service_role') || key.startsWith('sb_secret_')) {
    console.error(
      '\nBUILD STOPPED — VITE_SUPABASE_ANON_KEY looks like a SERVICE ROLE key.\n' +
        'That key bypasses row-level security and would be shipped to every\n' +
        'visitor. Use the publishable/anon key instead.\n',
    )
    process.exit(1)
  }
  console.log(`✓ Supabase configured: ${url}`)
}
