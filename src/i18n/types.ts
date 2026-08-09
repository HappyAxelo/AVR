export const LOCALES = ['en', 'fr', 'rw', 'sw'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
  sw: 'Kiswahili',
}

/** Short label for the switcher button. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  rw: 'RW',
  sw: 'SW',
}

export interface Dict {
  nav: {
    services: string
    how: string
    work: string
    impact: string
    coverage: string
    news: string
    book: string
    home: string
    openMenu: string
    closeMenu: string
    language: string
  }
  hero: {
    eyebrow: string
    headline: string
    subline: string
    cta: string
    secondary: string
  }
  services: {
    eyebrow: string
    title: string
    intro: string
    items: { title: string; line: string }[]
  }
  how: {
    eyebrow: string
    title: string
    steps: { title: string; line: string }[]
  }
  impact: {
    eyebrow: string
    title: string
    intro: string
    statLabels: string[]
    credentials: string[]
  }
  work: {
    eyebrow: string
    title: string
    intro: string
    seeAll: string
    view: string
    overview: string
    task: string
    client: string
    year: string
    gallery: string
    back: string
    notFound: string
    allTitle: string
  }
  coverage: {
    eyebrow: string
    title: string
    p1: string
    p2: string
    mapLabel: string
  }
  news: {
    eyebrow: string
    title: string
    seeAll: string
    read: string
    back: string
    notFound: string
  }
  contact: {
    eyebrow: string
    title: string
    intro: string
    phone: string
    whatsapp: string
    email: string
    base: string
    name: string
    location: string
    locationHint: string
    crop: string
    cropHint: string
    hectares: string
    message: string
    optional: string
    submit: string
    successTitle: string
    successBody: string
  }
  newsletter: {
    title: string
    intro: string
    placeholder: string
    submit: string
    success: string
  }
  footer: {
    tagline: string
    licence: string
    rights: string
    socials: string
  }
  common: {
    loading: string
    pageNotFound: string
    backHome: string
  }
}
