import { useState } from 'react'
import type { FormEvent } from 'react'
import Reveal from './Reveal'
import { siteContent } from '../data/mock'

const inputClass =
  'w-full rounded-xl border border-paper/20 bg-terrace-light/60 px-4 py-3 text-paper placeholder:text-paper/55 focus:border-volt focus:outline-none'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Phase 3 wires this to Supabase (contact_submissions) + enquiry notification.
    setSent(true)
  }

  return (
    <section id="contact" className="bg-terrace py-24 text-paper sm:py-32" aria-label="Contact">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
            Book a spray
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">
            Tell us about your fields.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-paper/65">
            Send your details and we will call you back to plan the spray. Cooperatives and
            single farms both welcome.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-paper/60">Phone</dt>
              <dd className="mt-0.5 text-paper">{siteContent.contact_phone}</dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">WhatsApp</dt>
              <dd className="mt-0.5 text-paper">{siteContent.contact_whatsapp}</dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">Email</dt>
              <dd className="mt-0.5 text-paper">{siteContent.contact_email}</dd>
            </div>
            <div>
              <dt className="font-medium text-paper/60">Base</dt>
              <dd className="mt-0.5 text-paper">{siteContent.contact_address}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <div
              className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-volt/30 bg-terrace-light/40 p-10 text-center"
              role="status"
            >
              <p className="text-2xl font-semibold text-volt">Thank you.</p>
              <p className="mt-3 max-w-sm text-paper/70">
                We have your details and will be in touch shortly to plan your spray.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Name
                </label>
                <input id="c-name" name="name" required autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-phone" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Phone
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
                <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Email <span className="text-paper/60">(optional)</span>
                </label>
                <input id="c-email" name="email" type="email" autoComplete="email" className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-location" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Location
                </label>
                <input id="c-location" name="location" required placeholder="District / sector" className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-crop" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Crop
                </label>
                <input id="c-crop" name="crop" placeholder="e.g. maize, potatoes" className={inputClass} />
              </div>
              <div>
                <label htmlFor="c-hectares" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Hectares
                </label>
                <input
                  id="c-hectares"
                  name="hectares"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 5"
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium text-paper/70">
                  Message <span className="text-paper/60">(optional)</span>
                </label>
                <textarea id="c-message" name="message" rows={4} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-volt px-7 py-3.5 font-semibold text-terrace transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt sm:w-auto"
                >
                  Send enquiry
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
