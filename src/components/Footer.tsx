import { Link } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { contact } from '../data/mock'
import { useT } from '../i18n'

export default function Footer() {
  const t = useT()

  return (
    <footer className="bg-terrace-dark py-14 text-paper" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className="font-display text-2xl font-bold">
              AVR<span className="text-volt">.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper/60">{t.footer.tagline}</p>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#services" className="text-paper/70 transition hover:text-paper">
                  {t.nav.services}
                </a>
              </li>
              <li>
                <a href="/#how" className="text-paper/70 transition hover:text-paper">
                  {t.nav.how}
                </a>
              </li>
              <li>
                <Link to="/work" className="text-paper/70 transition hover:text-paper">
                  {t.nav.work}
                </Link>
              </li>
              <li>
                <a href="/#impact" className="text-paper/70 transition hover:text-paper">
                  {t.nav.impact}
                </a>
              </li>
              <li>
                <Link to="/news" className="text-paper/70 transition hover:text-paper">
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <a href="/#contact" className="text-paper/70 transition hover:text-paper">
                  {t.nav.book}
                </a>
              </li>
            </ul>
          </nav>

          <div className="text-sm">
            <p>
              <a href={`mailto:${contact.email}`} className="text-paper/70 transition hover:text-paper">
                {contact.email}
              </a>
            </p>
            <p className="mt-1">
              <a href={`tel:+${contact.phoneE164}`} className="text-paper/70 transition hover:text-paper">
                {contact.phone}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`https://wa.me/${contact.phoneE164}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/70 transition hover:text-paper"
              >
                WhatsApp
              </a>
            </p>
            <p className="mt-1 text-paper/55">{contact.address}</p>
            <p className="mt-4 text-paper/60">{t.footer.socials}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/10 pt-6 text-xs text-paper/60">
          <p>{t.footer.licence}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} Ampere Vision Rwanda Ltd. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
