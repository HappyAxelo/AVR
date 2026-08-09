import { useEffect, useState } from 'react'
import { selectRows, hasSupabase } from './rest'
import type { NewsRow, ProjectRow } from './rest'
import { newsPosts as fallbackNews, contact as fallbackContact } from '../data/mock'
import { projects as fallbackProjects } from '../data/projects'

// While AVR is still filling the database, the site falls back to the
// built-in content rather than rendering an empty page. Once a table has
// rows, the live data wins and the fallback is never used again.

function newsFallback(): NewsRow[] {
  return fallbackNews.map((p) => ({
    ...p,
    gallery: [],
    created_at: p.published_at,
    updated_at: p.published_at,
  }))
}

function projectsFallback(): ProjectRow[] {
  const now = new Date().toISOString()
  return fallbackProjects.map((p) => ({
    ...p,
    gallery: p.gallery.map((g) => ({ url: g.url ?? '', caption: g.caption })),
    created_at: now,
    updated_at: now,
  }))
}

interface Result<T> {
  data: T
  loading: boolean
  /** True when the built-in content is showing because the table is empty. */
  isFallback: boolean
}

function useRows<T>(
  table: string,
  query: string,
  fallback: () => T[],
  limit?: number,
): Result<T[]> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    const applyFallback = () => {
      if (cancelled) return
      const rows = fallback()
      setData(limit ? rows.slice(0, limit) : rows)
      setIsFallback(true)
      setLoading(false)
    }

    if (!hasSupabase) {
      applyFallback()
      return
    }

    const full = limit ? `${query}&limit=${limit}` : query
    void selectRows<T>(table, full).then((rows) => {
      if (cancelled) return
      if (!rows || rows.length === 0) {
        applyFallback()
        return
      }
      setData(rows)
      setIsFallback(false)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, query, limit])

  return { data, loading, isFallback }
}

const NEWS_QUERY = 'select=*&status=eq.published&order=published_at.desc.nullslast'
const PROJECTS_QUERY = 'select=*&status=eq.published&order=sort_order.asc'

export function usePublishedNews(limit?: number): Result<NewsRow[]> {
  return useRows<NewsRow>('news_posts', NEWS_QUERY, newsFallback, limit)
}

export function usePublishedProjects(limit?: number): Result<ProjectRow[]> {
  return useRows<ProjectRow>('projects', PROJECTS_QUERY, projectsFallback, limit)
}

function useOne<T extends { slug: string }>(
  table: string,
  slug: string | undefined,
  fallback: () => T[],
): Result<T | null> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!slug) {
      setLoading(false)
      return
    }

    const applyFallback = () => {
      if (cancelled) return
      setData(fallback().find((p) => p.slug === slug) ?? null)
      setIsFallback(true)
      setLoading(false)
    }

    if (!hasSupabase) {
      applyFallback()
      return
    }

    const query = `select=*&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`
    void selectRows<T>(table, query).then((rows) => {
      if (cancelled) return
      if (!rows || rows.length === 0) {
        applyFallback()
        return
      }
      setData(rows[0])
      setIsFallback(false)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, slug])

  return { data, loading, isFallback }
}

export function useNewsPost(slug?: string): Result<NewsRow | null> {
  return useOne<NewsRow>('news_posts', slug, newsFallback)
}

export function useProject(slug?: string): Result<ProjectRow | null> {
  return useOne<ProjectRow>('projects', slug, projectsFallback)
}

export type SiteContent = typeof fallbackContact

/** Contact details, editable from the admin panel via `site_content`. */
export function useContactDetails(): SiteContent {
  const [data, setData] = useState<SiteContent>(fallbackContact)

  useEffect(() => {
    if (!hasSupabase) return
    let cancelled = false

    void selectRows<{ key: string; value: unknown }>('site_content', 'select=key,value').then(
      (rows) => {
        if (cancelled || !rows?.length) return
        const map = new Map(rows.map((r) => [r.key, r.value]))
        const str = (key: string, fb: string) => {
          const v = map.get(key)
          return typeof v === 'string' && v.trim() ? v : fb
        }
        setData({
          phone: str('contact_phone', fallbackContact.phone),
          phoneE164: str('contact_phone_e164', fallbackContact.phoneE164),
          whatsapp: str('contact_whatsapp', fallbackContact.whatsapp),
          email: str('contact_email', fallbackContact.email),
          address: str('contact_address', fallbackContact.address),
        })
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  return data
}
