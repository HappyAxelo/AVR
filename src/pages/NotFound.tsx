import { Link } from 'react-router-dom'
import { useT } from '../i18n'

export default function NotFound() {
  const t = useT()

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-terrace">{t.common.pageNotFound}</h1>
      <Link
        to="/"
        className="mt-6 inline-block underline decoration-terrace/40 underline-offset-4 hover:decoration-terrace"
      >
        {t.common.backHome}
      </Link>
    </main>
  )
}
