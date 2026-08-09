import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Lightbox from '../components/Lightbox'
import { formatDate } from '../components/NewsSection'
import { useNewsPost } from '../lib/content'
import { useI18n } from '../i18n'

export default function NewsPost() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const { data: post, loading } = useNewsPost(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (loading) {
    return (
      <>
        <Nav />
        <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5">
          <p className="text-ink/65">{t.common.loading}</p>
        </main>
        <Footer />
      </>
    )
  }

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

  const gallery = post.gallery ?? []

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <article className="mx-auto max-w-3xl px-5 pt-32 sm:px-8">
          <Link
            to="/news"
            className="text-sm font-medium text-terrace/70 transition hover:text-terrace"
          >
            {t.news.back}
          </Link>

          <time
            dateTime={post.published_at ?? undefined}
            className="mt-8 block text-xs font-medium uppercase tracking-wider text-ink/60"
          >
            {formatDate(post.published_at, locale)}
          </time>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-terrace sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-xl leading-relaxed text-ink/70">{post.excerpt}</p>
          )}

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-10 w-full rounded-2xl"
              loading="lazy"
            />
          )}

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/75">
            {post.body
              .split(/\n{2,}/)
              .filter((p) => p.trim())
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </article>

        {gallery.length > 0 && (
          <section className="mt-16 bg-terrace py-16 text-paper sm:py-20" aria-label={t.work.gallery}>
            <div className="mx-auto max-w-5xl px-5 sm:px-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                {t.work.gallery}
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((image, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="group block w-full overflow-hidden rounded-xl border border-paper/10 text-left transition hover:border-volt/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
                    >
                      <span className="block aspect-[4/3] overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.caption}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </span>
                      {image.caption && (
                        <span className="block px-4 py-3 text-sm text-paper/75">
                          {image.caption}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Lightbox
        images={gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />

      <Footer />
    </>
  )
}
