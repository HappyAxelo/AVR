import { Link } from 'react-router-dom'
import { siteContent } from '../data/mock'

export default function Footer() {
  return (
    <footer className="bg-terrace-dark py-14 text-paper" aria-label="Footer">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className="font-display text-2xl font-bold">
              AVR<span className="text-volt">.</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper/55">
              Ampere Vision Rwanda Ltd. Precision drone spraying for Rwanda's fields.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm">
              <li><a href="/#services" className="text-paper/70 transition hover:text-paper">Services</a></li>
              <li><a href="/#how" className="text-paper/70 transition hover:text-paper">How it works</a></li>
              <li><a href="/#impact" className="text-paper/70 transition hover:text-paper">Impact</a></li>
              <li><Link to="/news" className="text-paper/70 transition hover:text-paper">News</Link></li>
              <li><a href="/#contact" className="text-paper/70 transition hover:text-paper">Book a spray</a></li>
            </ul>
          </nav>

          <div className="text-sm">
            <p className="text-paper/70">{siteContent.contact_email}</p>
            <p className="mt-1 text-paper/70">{siteContent.contact_phone}</p>
            <p className="mt-1 text-paper/55">{siteContent.contact_address}</p>
            <p className="mt-4 text-paper/60">[CONFIRM social links]</p>
          </div>
        </div>

        <div className="mt-12 border-t border-paper/10 pt-6 text-xs text-paper/60">
          <p>{siteContent.footer_licence}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} Ampere Vision Rwanda Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
