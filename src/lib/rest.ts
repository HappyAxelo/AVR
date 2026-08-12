// Minimal PostgREST client for the public site.
//
// The full @supabase/supabase-js SDK bundles auth, realtime, storage and
// functions — about 58 kB gzipped. The marketing pages only ever do
// anonymous reads and two inserts, so they use plain fetch and the SDK
// stays in the lazy-loaded admin chunk. RLS is what protects the data
// either way; the anon key is public by design.

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '../config/public'

// Environment variables win when set; the committed public config is the
// fallback so a deploy can never ship with no backend. See src/config/public.ts.
const URL_BASE = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY

export const hasSupabase = Boolean(URL_BASE && ANON_KEY)

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

function headers(extra?: Record<string, string>): HeadersInit {
  return {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    ...extra,
  }
}

/** GET rows from a table. `query` is a PostgREST query string. */
export async function selectRows<T>(table: string, query: string): Promise<T[] | null> {
  if (!hasSupabase) return null
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${table}?${query}`, { headers: headers() })
    if (!res.ok) return null
    return (await res.json()) as T[]
  } catch {
    return null
  }
}

export interface InsertResult {
  ok: boolean
  /** Postgres error code, e.g. 23505 for a duplicate key. */
  code?: string
}

/**
 * POST a row. Returns ok:false plus the Postgres code when it fails.
 *
 * Always `return=minimal`: anonymous visitors may insert into these tables but
 * cannot read them back, so asking PostgREST for the created row makes the
 * whole insert fail the RLS check. When the caller needs the new row's id, it
 * generates one with `newId()` and includes it in the payload.
 */
export async function insertRow(table: string, row: unknown): Promise<InsertResult> {
  // Never report success with no backend: a "thank you" over a discarded
  // enquiry is worse than an honest error asking the visitor to phone.
  if (!hasSupabase) return { ok: false }
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${table}`, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
    })
    if (res.ok) return { ok: true }
    const body = (await res.json().catch(() => null)) as { code?: string } | null
    return { ok: false, code: body?.code }
  } catch {
    return { ok: false }
  }
}

/** A client-side UUID, so the caller knows the row id without reading it back. */
export function newId(): string {
  return crypto.randomUUID()
}
