import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { submitToken } from '../lib/functions'
import type { TokenResult } from '../lib/functions'
import { useT } from '../i18n'

type State = 'working' | TokenResult

/**
 * Backs both `/confirm` and `/unsubscribe`. Those URLs are what people click
 * in an email, so they live on the AVR domain and are shown in the visitor's
 * language; the actual change is made by the Edge Function.
 */
export default function TokenAction({ action }: { action: 'confirm' | 'unsubscribe' }) {
  const [params] = useSearchParams()
  const t = useT()
  const [state, setState] = useState<State>('working')
  const token = params.get('token') ?? ''

  useEffect(() => {
    let cancelled = false
    const fn = action === 'confirm' ? 'confirm-subscription' : 'unsubscribe'
    void submitToken(fn, token).then((result) => {
      if (!cancelled) setState(result)
    })
    return () => {
      cancelled = true
    }
  }, [action, token])

  const copy = t.tokenPage[action]

  const heading =
    state === 'working'
      ? t.common.loading
      : state === 'ok'
        ? copy.doneTitle
        : state === 'invalid'
          ? t.tokenPage.invalidTitle
          : t.tokenPage.errorTitle

  const message =
    state === 'working'
      ? ''
      : state === 'ok'
        ? copy.doneBody
        : state === 'invalid'
          ? t.tokenPage.invalidBody
          : t.tokenPage.errorBody

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-terrace px-5 text-center text-paper">
      <Link to="/" className="font-display text-3xl font-bold">
        AVR<span className="text-volt">.</span>
      </Link>

      <div className="mt-8 max-w-md" role="status" aria-live="polite">
        <h1 className="text-2xl font-semibold sm:text-3xl">{heading}</h1>
        {message && <p className="mt-3 leading-relaxed text-paper/75">{message}</p>}
      </div>

      <Link
        to="/"
        className="mt-8 rounded-full bg-volt px-6 py-3 font-semibold text-terrace transition hover:brightness-110"
      >
        {t.common.backHome}
      </Link>
    </main>
  )
}
