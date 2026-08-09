import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ImagePlaceholder from '../components/ImagePlaceholder'
import Reveal from '../components/Reveal'
import { projects } from '../data/projects'
import { useT } from '../i18n'

export default function Work() {
  const t = useT()
  const published = projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-32 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
          {t.work.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-terrace sm:text-5xl">{t.work.allTitle}</h1>
        <p className="mt-4 max-w-lg text-ink/65">{t.work.intro}</p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.06}>
              <article className="h-full">
                <Link
                  to={`/work/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-terrace/10 bg-white/60 transition duration-300 hover:border-terrace/30 hover:shadow-lg hover:shadow-terrace/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terrace"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ImagePlaceholder className="h-full w-full" seed={i} />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-ink/60">
                      {project.client} · {project.year}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-terrace">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{project.summary}</p>
                    <span className="mt-auto pt-5 text-sm font-medium text-terrace/70 transition group-hover:text-terrace">
                      {t.work.view} →
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
