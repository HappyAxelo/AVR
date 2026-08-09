import { useState } from 'react'
import type { FormEvent } from 'react'
import Reveal from './Reveal'
import { contact } from '../data/mock'
import { useT } from '../i18n'

const inputClass =
  'w-full rounded-xl border border-paper/20 bg-terrace-light/60 px-4 py-3 text-paper placeholder:text-paper/55 focus:border-volt focus:outline-none'

const labelClass = 'mb-1.5 block text-sm font-medium text-paper/70'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const t = useT()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Phase 3 wires this to Supabase (contact_submissions) + enquiry notification.
    setSent(true)
  }

  return (
    <section
      id="contact"
      className="bg-terrace py-24 text-paper sm:py-32"
      aria-label={t.contact.eyebrow}
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
            {t.contact.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t.contact.title}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-paper/65">{t.contact.intro}</p>

          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-paper/60">{t.contact.phone}</dt>
              <dd className="mt-0.5">
                <a href={`tel:+${contact.phoneE164}`} className="text-paper hover:text-volt">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">{t.contact.whatsapp}</dt>
              <dd className="mt-0.5">
                <a
                  href={`https://wa.me/${contact.phoneE164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper hover:text-volt"
                >
                  {contact.whatsapp}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">{t.contact.email}</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${contact.email}`} className="text-paper hover:text-volt">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">{t.contact.base}</dt>
              <dd className="mt-0.5 text-paper">{contact.address}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <div
              className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-volt/30 bg-terrace-light/40 p-10 text-center"
              role="status"
            >
              <p className="text-2xl font-semibold text-volt">{t.contact.successTitle}</p>
              <p className="mt-3 max-w-sm text-paper/70">{t.contact.successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className={labelClass}>
                  {t.contact.name}
                </label>
                <input id="c-name" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-phone" className={labelClass}>
                  {t.contact.phone}
                </label>
                <input
                  id="c-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="07xx xxx xxx"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="c-email" className={labelClass}>
                  {t.contact.email} <span className="text-paper/60">{t.contact.optional}</span>
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="c-location" className={labelClass}>
                  {t.contact.location}
                </label>
                <input
                  id="c-location"
                  name="location"
                  required
                  placeholder={t.contact.locationHint}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="c-crop" className={labelClass}>
                  {t.contact.crop}
                </label>
                <input
                  id="c-crop"
                  name="crop"
                  placeholder={t.contact.cropHint}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="c-hectares" className={labelClass}>
                  {t.contact.hectares}
                </label>
                <input
                  id="c-hectares"
                  name="hectares"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="5"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className={labelClass}>
                  {t.contact.message} <span className="text-paper/60">{t.contact.optional}</span>
                </label>
                <textarea id="c-message" name="message" rows={4} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-volt px-7 py-3.5 font-semibold text-terrace transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt sm:w-auto"
                >
                  {t.contact.submit}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
