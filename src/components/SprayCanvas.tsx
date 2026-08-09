import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

// Module-level so the default doesn't re-trigger the effect on every render.
const DEFAULT_NOZZLES = [0.36, 0.5, 0.64]

interface SprayCanvasProps {
  /** Nozzle positions as fractions of canvas width (0–1). */
  nozzles?: number[]
  /** Vertical emit origin as a fraction of canvas height. */
  originY?: number
  className?: string
  /** Max particles alive at once. Keep low for mid-range phones. */
  maxParticles?: number
}

/**
 * Lightweight canvas particle system: a fine downward mist that drifts
 * and fades like settling spray. Pauses when offscreen or tab-hidden.
 * With prefers-reduced-motion it draws a single static mist frame.
 */
export default function SprayCanvas({
  nozzles = DEFAULT_NOZZLES,
  originY = 0.08,
  className,
  maxParticles = 90,
}: SprayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const drawStaticMist = () => {
      ctx.clearRect(0, 0, width, height)
      for (const n of nozzles) {
        const nx = n * width
        const ny = originY * height
        const grad = ctx.createLinearGradient(nx, ny, nx, height)
        grad.addColorStop(0, 'rgba(244, 241, 234, 0.28)')
        grad.addColorStop(0.7, 'rgba(244, 241, 234, 0.08)')
        grad.addColorStop(1, 'rgba(244, 241, 234, 0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(nx, ny)
        ctx.lineTo(nx - width * 0.09, height)
        ctx.lineTo(nx + width * 0.09, height)
        ctx.closePath()
        ctx.fill()
      }
    }

    if (reduceMotion) {
      drawStaticMist()
      const onResize = () => {
        resize()
        drawStaticMist()
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const particles: Particle[] = []
    let raf = 0
    let running = false
    let last = 0

    const spawn = () => {
      if (particles.length >= maxParticles) return
      const n = nozzles[Math.floor(Math.random() * nozzles.length)]
      const maxLife = 1.6 + Math.random() * 1.4
      particles.push({
        x: n * width + (Math.random() - 0.5) * 6,
        y: originY * height,
        vx: (Math.random() - 0.5) * 14,
        vy: 34 + Math.random() * 26,
        life: 0,
        maxLife,
        size: 0.8 + Math.random() * 1.7,
      })
    }

    const step = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < 3; i++) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += dt
        if (p.life > p.maxLife || p.y > height) {
          particles.splice(i, 1)
          continue
        }
        // drift: spread widens and slows as it falls
        p.vx += (Math.random() - 0.5) * 8 * dt + 2.4 * dt // gentle wind
        p.vy *= 1 - 0.25 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt

        const fade = 1 - p.life / p.maxLife
        ctx.fillStyle = `rgba(244, 241, 234, ${0.35 * fade})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 + p.life * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    // Pause when the canvas leaves the viewport
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (canvas.getBoundingClientRect().top < window.innerHeight) start()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', resize)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [nozzles, originY, maxParticles, reduceMotion])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
