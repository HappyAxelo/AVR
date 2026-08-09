import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { usePublishedNews } from '../lib/content'
import { useI18n } from '../i18n'

const DATE_LOCALES: Record<string, string> = {
  en: 'en-GB',
  fr: 'fr-FR',
  rw: 'rw-RW',
  sw: 'sw-KE',
}

export function formatDate(iso: string | null, locale = 'en') {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(DATE_LOCALES[locale] ?? 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function NewsSection() {
  const { t, locale } = useI18n()
  const { data: latest } = usePublishedNews(3)

  if (latest.length === 0) return null

  return (
    <section id="news" className="bg-paper py-24 sm:py-32" aria-label={t.news.eyebrow}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
                {t.news.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-terrace sm:text-5xl">
                {t.news.title}
              </h2>
            </div>
            <Link
              to="/news"
              className="text-sm font-medium text-terrace underline decoration-terrace/30 underline-offset-4 transition hover:decoration-terrace"
            >
              {t.news.seeAll}
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {latest.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <article className="group h-full">
                <Link
                  to={`/news/${post.slug}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-terrace/10 bg-white/60 transition duration-300 hover:border-terrace/25 hover:shadow-lg hover:shadow-terrace/5"
                >
                  {post.cover_image_url && (
                    <span className="block aspect-[16/9] overflow-hidden">
                      <img
                        src={post.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </span>
                  )}
                  <span className="flex flex-1 flex-col p-6">
                    <time
                      dateTime={post.published_at ?? undefined}
                      className="text-xs font-medium uppercase tracking-wider text-ink/60"
                    >
                      {formatDate(post.published_at, locale)}
                    </time>
                    <span className="mt-3 block text-lg font-semibold leading-snug text-terrace">
                      {post.title}
                    </span>
                    <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-ink/60">
                      {post.excerpt}
                    </span>
                    <span className="mt-auto block pt-4 text-sm font-medium text-terrace/70 transition group-hover:text-terrace">
                      {t.news.read} →
                    </span>
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
