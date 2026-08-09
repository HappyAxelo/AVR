import { useState } from 'react'
import type { FormEvent } from 'react'
import Reveal from './Reveal'
import { siteContent } from '../data/mock'

export default function Newsletter() {
  const [done, setDone] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Phase 5 wires this to double opt-in via Supabase + Resend.
    setDone(true)
  }

  return (
    <section className="border-t border-terrace/10 bg-paper py-20 sm:py-24" aria-label="Newsletter">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-terrace sm:text-4xl">
            Notes from the field, straight to you.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ink/60">{siteContent.newsletter_line}</p>

          {done ? (
            <p className="mt-8 font-medium text-terrace" role="status">
              Check your inbox — confirm your email to finish subscribing.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="nl-email" className="sr-only">
                Email address
              </label>
              <input
                id="nl-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full flex-1 rounded-full border border-terrace/20 bg-white px-5 py-3 text-ink placeholder:text-ink/55 focus:border-terrace focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-terrace px-6 py-3 font-semibold text-paper transition hover:bg-terrace-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terrace"
              >
                Subscribe
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
