import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../lib/useAuth'
import { Banner, btn, field, label } from './ui'

export default function Login() {
  const { signIn } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setBusy(true)
    setError(null)

    const { error: signInError } = await signIn(
      (form.get('email') as string).trim(),
      form.get('password') as string,
    )
    setBusy(false)
    // Deliberately vague: never reveal whether an address has an account.
    if (signInError) setError('Those details were not recognised.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-terrace px-5">
      <div className="w-full max-w-sm">
        <p className="font-display text-3xl font-bold text-paper">
          AVR<span className="text-volt">.</span>
        </p>
        <h1 className="mt-2 text-lg text-paper/70">Admin sign in</h1>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-2xl border border-paper/10 bg-paper p-6"
        >
          {error && <Banner kind="error">{error}</Banner>}

          <div>
            <label htmlFor="a-email" className={label}>
              Email
            </label>
            <input
              id="a-email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="a-password" className={label}>
              Password
            </label>
            <input
              id="a-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={field}
            />
          </div>

          <button type="submit" className={`${btn} w-full`} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-paper/60">
          <a href="/" className="underline">
            Back to the site
          </a>
        </p>
      </div>
    </main>
  )
}
