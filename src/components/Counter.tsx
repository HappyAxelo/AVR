import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CounterProps {
  value: number
  suffix?: string
  duration?: number
  /** BCP 47 tag for number grouping, so 350,000 localises correctly. */
  locale?: string
}

/** Counts up from 0 to value once when scrolled into view. */
export default function Counter({
  value,
  suffix = '',
  duration = 1.6,
  locale = 'en-GB',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, reduceMotion])

  return (
    <span ref={ref}>
      {display.toLocaleString(locale)}
      {suffix}
    </span>
  )
}
