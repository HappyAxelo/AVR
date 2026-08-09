import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { formatDate } from '../components/NewsSection'
import { usePublishedNews } from '../lib/content'
import { useI18n } from '../i18n'

export default function News() {
  const { t, locale } = useI18n()
  const { data: published, loading } = usePublishedNews()

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-4xl px-5 pb-24 pt-32 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
          {t.news.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-terrace sm:text-5xl">{t.news.title}</h1>

        {loading ? (
          <p className="mt-12 text-ink/65">{t.common.loading}</p>
        ) : (
          <div className="mt-12 space-y-5">
            {published.map((post) => (
              <article key={post.id}>
                <Link
                  to={`/news/${post.slug}`}
                  className="group flex gap-6 rounded-2xl border border-terrace/10 bg-white/60 p-6 transition duration-300 hover:border-terrace/25 hover:shadow-lg hover:shadow-terrace/5 sm:p-7"
                >
                  {post.cover_image_url && (
                    <span className="hidden w-40 shrink-0 overflow-hidden rounded-xl sm:block">
                      <img
                        src={post.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <time
                      dateTime={post.published_at ?? undefined}
                      className="text-xs font-medium uppercase tracking-wider text-ink/60"
                    >
                      {formatDate(post.published_at, locale)}
                    </time>
                    <span className="mt-2 block text-2xl font-semibold text-terrace">
                      {post.title}
                    </span>
                    <span className="mt-2 block leading-relaxed text-ink/60">{post.excerpt}</span>
                    <span className="mt-4 inline-block text-sm font-medium text-terrace/70 transition group-hover:text-terrace">
                      {t.news.read} →
                    </span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
