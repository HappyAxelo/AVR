import { createClient } from '@supabase/supabase-js'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '../config/public'

const url = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(url, key, {
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
