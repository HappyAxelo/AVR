import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import DroneSvg from './DroneSvg'
import SprayCanvas from './SprayCanvas'
import { siteContent } from '../data/mock'

/** Layered terrace contours drawn as SVG — placeholder until real footage arrives. */
function Terraces() {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] w-full"
      aria-hidden="true"
    >
      <path
        d="M0 180 C 240 130 420 210 720 170 C 1020 130 1200 200 1440 160 L1440 420 L0 420 Z"
        fill="#123a2a"
      />
      <path
        d="M0 250 C 280 200 480 280 760 240 C 1040 200 1240 270 1440 235 L1440 420 L0 420 Z"
        fill="#0e2f21"
      />
      <path
        d="M0 320 C 300 280 520 350 800 315 C 1080 280 1280 340 1440 310 L1440 420 L0 420 Z"
        fill="#0a2419"
      />
      {/* contour lines */}
      <path
        d="M0 205 C 250 158 440 235 730 196 C 1030 158 1210 224 1440 186"
        fill="none"
        stroke="#C6F135"
        strokeOpacity="0.12"
        strokeWidth="1.5"
      />
      <path
        d="M0 285 C 290 238 500 312 780 274 C 1060 238 1250 302 1440 268"
        fill="none"
        stroke="#C6F135"
        strokeOpacity="0.08"
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Drone tracks across and down as you scroll out of the hero
  const droneX = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const droneY = useTransform(scrollYProgress, [0, 1], ['0%', '55%'])
  const terracesY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden bg-terrace text-paper"
      aria-label="Introduction"
    >
      {/* soft sky glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(90% 60% at 70% 10%, rgba(198,241,53,0.07), transparent 60%)',
        }}
      />

      <motion.div style={reduceMotion ? undefined : { y: terracesY }} className="absolute inset-0">
        <Terraces />
      </motion.div>

      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-24 pb-56 sm:px-8 xl:pb-40">
        <div className="max-w-2xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-volt"
          >
            Ampere Vision Rwanda
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-[2.6rem] leading-[1.05] font-semibold sm:text-6xl lg:text-7xl"
          >
            {siteContent.hero_headline}
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-paper/75"
          >
            {siteContent.hero_subline}
          </motion.p>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <a
              href="#contact"
              className="rounded-full bg-volt px-7 py-3.5 font-semibold text-terrace transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
            >
              {siteContent.hero_cta}
            </a>
            <a
              href="#how"
              className="text-sm font-medium text-paper/70 underline decoration-paper/30 underline-offset-4 transition hover:text-paper"
            >
              How it works
            </a>
          </motion.div>
        </div>
      </div>

      {/* Drone + mist scene. On phones it flies below the copy, over the terraces;
          on wider screens it sits beside the headline. */}
      <motion.div
        className="pointer-events-none absolute right-2 top-[68%] z-10 w-[52%] sm:right-6 sm:w-[42%] lg:w-[36%] xl:right-[5%] xl:top-[19%] xl:w-[40%] xl:max-w-sm"
        style={reduceMotion ? undefined : { x: droneX, y: droneY, opacity: fade }}
        initial={reduceMotion ? false : { opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DroneSvg className="w-full drop-shadow-2xl" animateRotors={!reduceMotion} />
        </motion.div>
        {/* mist falls from beneath the drone into the terraces */}
        <SprayCanvas className="absolute left-0 top-[70%] h-[52svh] w-full" />
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-paper/50"
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
          <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="9" r="2.5" fill="currentColor" />
        </svg>
      </motion.div>
    </section>
  )
}
