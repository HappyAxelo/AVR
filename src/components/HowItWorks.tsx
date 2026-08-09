import Reveal from './Reveal'
import { siteContent } from '../data/mock'

export default function HowItWorks() {
  return (
    <section id="how" className="bg-terrace py-24 text-paper sm:py-32" aria-label="How it works">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-5xl">
            {siteContent.how_intro}
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.how_steps.map((step, i) => (
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
                {i < siteContent.how_steps.length - 1 && (
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
