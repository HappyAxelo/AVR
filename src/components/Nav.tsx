import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useT } from '../i18n'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const t = useT()
  const overHero = pathname === '/'

  const links = [
    { href: '/#services', label: t.nav.services },
    { href: '/#how', label: t.nav.how },
    { href: '/work', label: t.nav.work },
    { href: '/#impact', label: t.nav.impact },
    { href: '/news', label: t.nav.news },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || !overHero || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-terrace/95 shadow-lg shadow-terrace-dark/20 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-paper"
          aria-label={t.nav.home}
        >
          AVR<span className="text-volt">.</span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              {l.href.startsWith('/#') ? (
                <a
                  href={l.href}
                  className="text-sm font-medium text-paper/80 transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  to={l.href}
                  className="text-sm font-medium text-paper/80 transition-colors hover:text-paper"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher className="hidden sm:block" />
          <a
            href="/#contact"
            className="rounded-full bg-volt px-4 py-2 text-sm font-semibold text-terrace transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
          >
            {t.nav.book}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-lg text-paper transition hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-paper/10 bg-terrace lg:hidden"
          >
            <ul className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
              {links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith('/#') ? (
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-base font-medium text-paper/85 transition hover:text-paper"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-base font-medium text-paper/85 transition hover:text-paper"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="mt-3 border-t border-paper/10 pt-4 sm:hidden">
                <LanguageSwitcher />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
