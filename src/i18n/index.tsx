import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { LOCALES } from './types'
import type { Dict, Locale } from './types'
import en from './en'

// English ships in the main bundle as the fallback. The other three are
// fetched only when a visitor actually selects them, which keeps the
// first load light on 4G.
const LOADERS: Record<Locale, () => Promise<{ default: Dict }>> = {
  en: async () => ({ default: en }),
  fr: () => import('./fr'),
  rw: () => import('./rw'),
  sw: () => import('./sw'),
}

const STORAGE_KEY = 'avr-locale'

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** Saved choice first, then the browser's preference, then English. */
function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (isLocale(saved)) return saved
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}

interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Dict
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  // `locale` is what the UI currently reflects; it only advances once the
  // strings have loaded, so the page never renders a half-translated frame.
  const [locale, setLocaleState] = useState<Locale>('en')
  const [dict, setDict] = useState<Dict>(en)
  const [wanted, setWanted] = useState<Locale>(detectLocale)

  useEffect(() => {
    let cancelled = false
    if (wanted === locale) return

    LOADERS[wanted]()
      .then((mod) => {
        if (cancelled) return
        setDict(mod.default)
        setLocaleState(wanted)
      })
      .catch(() => {
        // Network hiccup on the locale chunk: stay on the current language.
        if (!cancelled) setWanted(locale)
      })

    return () => {
      cancelled = true
    }
  }, [wanted, locale])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setWanted(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing can block storage; the choice still applies this visit.
    }
  }, [])

  const value = useMemo(() => ({ locale, setLocale, t: dict }), [locale, setLocale, dict])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

/** Shorthand for components that only need the strings. */
export function useT(): Dict {
  return useI18n().t
}

export { LOCALES, LOCALE_NAMES, LOCALE_SHORT } from './types'
export type { Locale } from './types'
