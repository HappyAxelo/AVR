import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { formatDate } from '../components/NewsSection'
import { newsPosts } from '../data/mock'
import { useI18n } from '../i18n'

export default function News() {
  const { t, locale } = useI18n()

  const published = newsPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => b.published_at.localeCompare(a.published_at))

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-4xl px-5 pb-24 pt-32 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
          {t.news.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-terrace sm:text-5xl">{t.news.title}</h1>

        <div className="mt-12 space-y-5">
          {published.map((post) => (
            <article key={post.id}>
              <Link
                to={`/news/${post.slug}`}
                className="group block rounded-2xl border border-terrace/10 bg-white/60 p-7 transition duration-300 hover:border-terrace/25 hover:shadow-lg hover:shadow-terrace/5"
              >
                <time
                  dateTime={post.published_at}
                  className="text-xs font-medium uppercase tracking-wider text-ink/60"
                >
                  {formatDate(post.published_at, locale)}
                </time>
                <h2 className="mt-2 text-2xl font-semibold text-terrace">{post.title}</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-ink/60">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-medium text-terrace/70 transition group-hover:text-terrace">
                  {t.news.read} →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
