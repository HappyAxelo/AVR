import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ImagePlaceholder from './ImagePlaceholder'
import { projects } from '../data/projects'
import { useT } from '../i18n'

export default function SelectedWork() {
  const t = useT()
  const published = projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 3)

  return (
    <section id="work" className="bg-terrace py-24 text-paper sm:py-32" aria-label={t.work.allTitle}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                {t.work.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t.work.title}</h2>
              <p className="mt-4 max-w-md text-paper/65">{t.work.intro}</p>
            </div>
            <Link
              to="/work"
              className="text-sm font-medium text-paper/80 underline decoration-paper/30 underline-offset-4 transition hover:text-paper hover:decoration-paper"
            >
              {t.work.seeAll}
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {published.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <article className="h-full">
                <Link
                  to={`/work/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper/10 bg-terrace-light/30 transition duration-300 hover:border-volt/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
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
                    <p className="text-xs font-medium uppercase tracking-wider text-paper/60">
                      {project.client} · {project.year}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/65">{project.summary}</p>
                    <span className="mt-auto pt-5 text-sm font-medium text-volt">
                      {t.work.view} →
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
