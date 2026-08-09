import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { formatDate } from '../components/NewsSection'
import { newsPosts } from '../data/mock'
import { useI18n } from '../i18n'

export default function NewsPost() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const post = newsPosts.find((p) => p.slug === slug && p.status === 'published')

  if (!post) {
    return (
      <>
        <Nav />
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-semibold text-terrace">{t.news.notFound}</h1>
          <Link to="/news" className="mt-6 underline decoration-terrace/40 underline-offset-4">
            {t.news.back}
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-3xl px-5 pb-24 pt-32 sm:px-8">
        <Link
          to="/news"
          className="text-sm font-medium text-terrace/70 transition hover:text-terrace"
        >
          {t.news.back}
        </Link>
        <article className="mt-8">
          <time
            dateTime={post.published_at}
            className="text-xs font-medium uppercase tracking-wider text-ink/60"
          >
            {formatDate(post.published_at, locale)}
          </time>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-terrace sm:text-5xl">
            {post.title}
          </h1>
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-8 w-full rounded-2xl"
              loading="lazy"
            />
          )}
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/75">
            {post.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
