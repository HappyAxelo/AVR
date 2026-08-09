import Reveal from './Reveal'
import { siteContent } from '../data/mock'

const icons = [
  // crosshair
  <svg key="s" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
  </svg>,
  // droplet
  <svg key="f" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z" strokeLinejoin="round" />
  </svg>,
  // shield
  <svg key="l" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z" strokeLinejoin="round" />
  </svg>,
  // map pin
  <svg key="m" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>,
]

export default function Services() {
  return (
    <section id="services" className="bg-paper py-24 sm:py-32" aria-label="Services">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
            Services
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold text-terrace sm:text-5xl">
            What we fly for you.
          </h2>
          <p className="mt-4 max-w-xl text-ink/65">{siteContent.services_intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {siteContent.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <article className="group h-full rounded-2xl border border-terrace/10 bg-white/60 p-7 transition duration-300 hover:border-terrace/25 hover:shadow-lg hover:shadow-terrace/5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terrace text-volt">
                  {icons[i]}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-terrace">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{s.line}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
