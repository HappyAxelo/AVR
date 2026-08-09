import Reveal from './Reveal'
import Counter from './Counter'
import { siteContent } from '../data/mock'

export default function Impact() {
  return (
    <section id="impact" className="bg-paper py-24 sm:py-32" aria-label="Impact">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
            Why AVR
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-terrace sm:text-5xl">
            Half the input. Same protection.
          </h2>
          <p className="mt-4 max-w-xl text-ink/65">{siteContent.impact_intro}</p>
        </Reveal>

        <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <div className="border-l-2 border-volt pl-5">
                <dd className="font-display text-4xl font-semibold text-terrace sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-1.5 text-sm text-ink/60">{stat.label}</dt>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.15}>
          <ul className="mt-16 flex flex-wrap gap-3" aria-label="Credentials">
            {siteContent.credentials.map((c) => (
              <li
                key={c}
                className="rounded-full border border-terrace/15 bg-white/60 px-4 py-1.5 text-sm text-terrace/80"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
