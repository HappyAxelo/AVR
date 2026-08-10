import { useState } from 'react'
import type { FormEvent } from 'react'
import Reveal from './Reveal'
import { requestSubscribe } from '../lib/functions'
import { useT } from '../i18n'

export default function Newsletter() {
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useT()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    const email = (new FormData(e.currentTarget).get('email') as string).trim().toLowerCase()
    if (!email) return

    setBusy(true)
    setError(null)

    // The function creates the row unconfirmed and emails the opt-in link.
    // It answers the same way for a new and an existing address, so this form
    // cannot be used to test who is already on the list.
    const { ok } = await requestSubscribe(email)
    setBusy(false)

    if (!ok) {
      setError(t.newsletter.error)
      return
    }
    setDone(true)
  }

  return (
    <section className="border-t border-terrace/10 bg-paper py-20 sm:py-24" aria-label={t.newsletter.title}>
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold text-terrace sm:text-4xl">{t.newsletter.title}</h2>
          <p className="mx-auto mt-3 max-w-md text-ink/65">{t.newsletter.intro}</p>

          {done ? (
            <p className="mt-8 font-medium text-terrace" role="status">
              {t.newsletter.success}
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="nl-email" className="sr-only">
                {t.contact.email}
              </label>
              <input
                id="nl-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={t.newsletter.placeholder}
                className="w-full flex-1 rounded-full border border-terrace/20 bg-white px-5 py-3 text-ink placeholder:text-ink/55 focus:border-terrace focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-terrace px-6 py-3 font-semibold text-paper transition hover:bg-terrace-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terrace disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? t.newsletter.sending : t.newsletter.submit}
              </button>
            </form>
          )}
          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-terrace">
              {error}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
