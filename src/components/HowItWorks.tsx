import Reveal from './Reveal'
import { useT } from '../i18n'

export default function HowItWorks() {
  const t = useT()

  return (
    <section id="how" className="bg-terrace py-24 text-paper sm:py-32" aria-label={t.how.eyebrow}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
            {t.how.eyebrow}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-5xl">{t.how.title}</h2>
        </Reveal>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <li className="relative">
                <span
                  className="font-display text-5xl font-semibold text-volt/25"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-paper/65">{step.line}</p>
                {i < t.how.steps.length - 1 && (
                  <span
                    className="absolute right-0 top-6 hidden h-px w-8 bg-volt/30 lg:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
