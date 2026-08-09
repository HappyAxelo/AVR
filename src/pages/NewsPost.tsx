import { Link, useParams } from 'react-router-dom'

export default function NewsPost() {
  const { slug } = useParams()

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold">Article: {slug}</h1>
      <p className="mt-4 text-ink/70">
        Article content will load from Supabase in a later phase.
      </p>
      <Link to="/news" className="mt-8 inline-block underline">
        All news
      </Link>
    </main>
  )
}
