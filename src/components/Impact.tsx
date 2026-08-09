import Reveal from './Reveal'
import Counter from './Counter'
import { stats } from '../data/mock'
import { useI18n } from '../i18n'

export default function Impact() {
  const { t, locale } = useI18n()

  return (
    <section id="impact" className="bg-paper py-24 sm:py-32" aria-label={t.impact.eyebrow}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terrace/70">
            {t.impact.eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-terrace sm:text-5xl">
            {t.impact.title}
          </h2>
          <p className="mt-4 max-w-xl text-ink/65">{t.impact.intro}</p>
        </Reveal>

        <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <Reveal key={t.impact.statLabels[i]} delay={i * 0.06}>
              <div className="border-l-2 border-volt pl-5">
                <dd className="font-display text-4xl font-semibold text-terrace sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} locale={locale} />
                </dd>
                <dt className="mt-1.5 text-sm text-ink/60">{t.impact.statLabels[i]}</dt>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={0.15}>
          <ul className="mt-16 flex flex-wrap gap-3">
            {t.impact.credentials.map((c) => (
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
