// Checks the Supabase configuration before every build.
//
// Frontend config can come from two places: environment variables (preferred,
// e.g. Netlify) or the committed public values in src/config/public.ts. This
// script confirms at least one supplies both values, and — more importantly —
// refuses to build if a service-role key has been put where the publishable
// key belongs, which would hand every visitor a key that bypasses row-level
// security.

import { readFileSync, existsSync } from 'node:fs'

const REQUIRED = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

// Vite reads .env files itself, so a plain Node script has to do the same or
// it would reject a perfectly good local setup.
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

/** The committed fallback in src/config/public.ts. */
function loadCommittedConfig() {
  const path = 'src/config/public.ts'
  if (!existsSync(path)) return {}
  const src = readFileSync(path, 'utf8')
  const grab = (name) => src.match(new RegExp(`${name}\\s*=\\s*['"]([^'"]+)['"]`))?.[1] ?? ''
  return {
    VITE_SUPABASE_URL: grab('PUBLIC_SUPABASE_URL'),
    VITE_SUPABASE_ANON_KEY: grab('PUBLIC_SUPABASE_ANON_KEY'),
  }
}

const fromFiles = loadDotEnv()
const committed = loadCommittedConfig()

const readEnv = (name) => (process.env[name] ?? fromFiles[name] ?? '').trim()
const effective = (name) => readEnv(name) || (committed[name] ?? '').trim()

// A service-role key must never be compiled into the browser bundle.
for (const name of REQUIRED) {
  const value = effective(name)
  if (value.includes('service_role') || value.startsWith('sb_secret_')) {
    console.error(
      `\nBUILD STOPPED — ${name} looks like a SERVICE ROLE key.\n` +
        'That key bypasses row-level security and would be shipped to every\n' +
        'visitor. Use the publishable/anon key instead.\n',
    )
    process.exit(1)
  }
}

const missing = REQUIRED.filter((name) => !effective(name))

if (missing.length && !process.env.ALLOW_MISSING_SUPABASE) {
  console.error(`
┌───────────────────────────────────────────────────────────────┐
│  BUILD STOPPED — Supabase configuration is missing            │
└───────────────────────────────────────────────────────────────┘

Missing: ${missing.join(', ')}

Building without these produces a site that LOOKS fine but:
  • the admin panel cannot sign in
  • news and projects silently show built-in placeholder content
  • the contact form reports an error on every submission

Set them either in src/config/public.ts (publishable values only) or as
environment variables:

  VITE_SUPABASE_URL       https://<project-ref>.supabase.co
  VITE_SUPABASE_ANON_KEY  the publishable key from
                          Supabase → Settings → API Keys

The service-role and Resend keys are Edge Function secrets and must never
be set here.

To build anyway (a static preview with no backend):
  ALLOW_MISSING_SUPABASE=1 npm run build
`)
  process.exit(1)
}

if (missing.length) {
  console.warn(`⚠  Building WITHOUT Supabase (${missing.join(', ')}). Backend features will not work.`)
} else {
  const source = readEnv('VITE_SUPABASE_URL') ? 'environment variables' : 'src/config/public.ts'
  console.log(`✓ Supabase configured from ${source}: ${effective('VITE_SUPABASE_URL')}`)
}
