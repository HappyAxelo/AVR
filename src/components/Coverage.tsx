import Reveal from './Reveal'
import { useT } from '../i18n'

/**
 * Simplified outline of Rwanda, plotted from national border coordinates
 * (roughly 28.9–30.9°E, 1.05–2.84°S) and flattened to a clean cartographic
 * silhouette. Illustrative, not survey-accurate.
 */
function RwandaMap({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 400 340" className="w-full max-w-md" role="img" aria-label={label}>
      {/* national outline */}
      <path
        d="M111 101 L148 83 L208 74 L292 33 L351 78 L362 132 L349 193 L342 239
           L281 239 L232 277 L184 304 L111 303 L54 269 L75 223 L51 193 L74 155
           L38 124 Z"
        fill="#163527"
        stroke="#C6F135"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Lake Kivu, along the western border */}
      <path
        d="M38 124 L74 155 L51 193 L75 223 L54 269 L74 257 L94 221 L72 192
           L94 152 L58 122 Z"
        fill="#0a2419"
        stroke="#C6F135"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {/* Kigali */}
      <circle cx="226" cy="168" r="5.5" fill="#C6F135" />
      <circle cx="226" cy="168" r="10" fill="none" stroke="#C6F135" strokeOpacity="0.5">
        <animate attributeName="r" values="7;20" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;0" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <text
        x="242"
        y="173"
        fill="#F4F1EA"
        fontSize="15"
        fontFamily="Satoshi, system-ui, sans-serif"
      >
        Kigali
      </text>
    </svg>
  )
}

export default function Coverage() {
  const t = useT()

  return (
    <section
      id="coverage"
      className="bg-terrace-dark py-24 text-paper sm:py-32"
      aria-label={t.coverage.eyebrow}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">
            {t.coverage.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t.coverage.title}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-paper/65">{t.coverage.p1}</p>
          <p className="mt-4 max-w-md leading-relaxed text-paper/65">{t.coverage.p2}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <RwandaMap label={t.coverage.mapLabel} />
        </Reveal>
      </div>
    </section>
  )
}
