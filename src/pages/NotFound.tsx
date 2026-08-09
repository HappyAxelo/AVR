import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-6 inline-block underline">
        Back to home
      </Link>
    </main>
  )
}
