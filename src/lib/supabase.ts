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

export const hasSupabase = Boolean(url && key)

/** Rows as stored. Gallery images are `[{ url, caption }]`. */
export interface GalleryImage {
  url: string
  caption: string
}

export interface NewsRow {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  cover_image_url: string | null
  gallery: GalleryImage[]
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectRow {
  id: string
  title: string
  slug: string
  client: string
  year: string
  summary: string
  overview: string
  task: string
  cover_image_url: string | null
  gallery: GalleryImage[]
  status: 'draft' | 'published'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  name: string
  phone: string
  email?: string | null
  location?: string | null
  crop?: string | null
  hectares?: number | null
  message?: string | null
}
