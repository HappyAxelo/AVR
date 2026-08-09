import { Link } from 'react-router-dom'

export default function News() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold">News</h1>
      <p className="mt-4 text-ink/70">
        Articles will load from Supabase in a later phase.
      </p>
      <Link to="/" className="mt-8 inline-block underline">
        Back to home
      </Link>
    </main>
  )
}
