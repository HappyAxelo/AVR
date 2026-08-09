import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  const reduceMotion = useReducedMotion()

  return (
    <main className="min-h-screen bg-terrace text-paper">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-volt"
        >
          AVR — Ampere Vision Rwanda
        </motion.p>
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl"
        >
          Precision spraying, flown for Rwanda's fields.
        </motion.h1>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-paper/80"
        >
          Half the input. Same protection. Marketing site under construction —
          full build coming in the next phase.
        </motion.p>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-volt px-6 py-3 font-medium text-terrace transition hover:brightness-110"
          >
            Book a spray
          </a>
          <Link
            to="/news"
            className="rounded-full border border-paper/30 px-6 py-3 font-medium transition hover:border-paper/60"
          >
            News
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
