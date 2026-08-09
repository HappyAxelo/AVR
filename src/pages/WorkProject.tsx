import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import { projects } from '../data/projects'
import { useT } from '../i18n'

export default function WorkProject() {
  const { slug } = useParams()
  const t = useT()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const project = projects.find((p) => p.slug === slug && p.status === 'published')

  if (!project) {
    return (
      <>
        <Nav />
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 text-center">
          <h1 className="text-3xl font-semibold text-terrace">{t.work.notFound}</h1>
          <Link
            to="/work"
            className="mt-6 underline decoration-terrace/40 underline-offset-4 hover:decoration-terrace"
          >
            {t.work.back}
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <div className="mx-auto max-w-5xl px-5 pt-32 sm:px-8">
          <Link
            to="/work"
            className="text-sm font-medium text-terrace/70 transition hover:text-terrace"
          >
            {t.work.back}
          </Link>

          <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight text-terrace sm:text-5xl">
            {project.title}
          </h1>

          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-y border-terrace/10 py-5">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-ink/60">
                {t.work.client}
              </dt>
              <dd className="mt-1 font-medium text-terrace">{project.client}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-ink/60">
                {t.work.year}
              </dt>
              <dd className="mt-1 font-medium text-terrace">{project.year}</dd>
            </div>
          </dl>
        </div>

        {/* Cover */}
        <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl">
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder className="h-full w-full" seed={0} />
            )}
          </div>
        </div>

        {/* Overview + task */}
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-20">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
              {t.work.overview}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">{project.overview}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
              {t.work.task}
            </h2>
            <p className="mt-4 leading-relaxed text-ink/75">{project.task}</p>
          </Reveal>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <section className="bg-terrace py-16 text-paper sm:py-20" aria-label={t.work.gallery}>
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                {t.work.gallery}
              </h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((image, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="group block w-full overflow-hidden rounded-xl border border-paper/10 text-left transition hover:border-volt/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
                    >
                      <span className="block aspect-[4/3] overflow-hidden">
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={image.caption}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <ImagePlaceholder className="h-full w-full" seed={i + 1} />
                        )}
                      </span>
                      <span className="block px-4 py-3 text-sm text-paper/70">{image.caption}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Lightbox
        images={project.gallery}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={setLightbox}
      />

      <Footer />
    </>
  )
}
