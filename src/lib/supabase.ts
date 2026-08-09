import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  // Loud in development, harmless in production: the site still renders,
  // it just falls back to built-in content.
  console.warn(
    'Supabase env vars missing. Copy .env.example to .env and fill in ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(url ?? '', key ?? '', {
  auth: { persistSession: true, autoRefreshToken: true },
})

/** Row shapes are shared with the public REST client. */
export type { GalleryImage, NewsRow, ProjectRow } from './rest'

export interface ContactSubmission {
  name: string
  phone: string
  email?: string | null
  location?: string | null
  crop?: string | null
  hectares?: number | null
  message?: string | null
}
