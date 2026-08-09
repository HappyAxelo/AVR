import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ImagePlaceholder from './ImagePlaceholder'
import type { ProjectImage } from '../data/projects'

interface LightboxProps {
  images: ProjectImage[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const reduceMotion = useReducedMotion()

  // Focus and scroll lock: runs only on open/close, so arrow-key navigation
  // does not re-capture the trigger or steal focus back to the close button.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [open])

  // Keyboard navigation follows the current index.
  useEffect(() => {
    if (!open || index === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, images.length, onClose, onNavigate])

  const current = index === null ? null : images[index]

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col bg-terrace-dark/95 backdrop-blur"
          onClick={onClose}
        >
          <div className="flex justify-end p-4">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-11 w-11 items-center justify-center rounded-full text-paper transition hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="flex flex-1 items-center justify-center gap-3 px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onNavigate((index - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper transition hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt sm:flex"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <figure className="flex max-h-full min-w-0 flex-1 flex-col items-center">
              {current.url ? (
                <img
                  src={current.url}
                  alt={current.caption}
                  className="max-h-[70svh] w-auto max-w-full rounded-xl object-contain"
                />
              ) : (
                <ImagePlaceholder
                  className="aspect-[4/3] max-h-[70svh] w-full max-w-3xl rounded-xl"
                  seed={index}
                />
              )}
              <figcaption className="mt-4 max-w-xl text-center text-sm text-paper/75">
                {current.caption}
              </figcaption>
              <p className="mt-2 text-xs text-paper/60">
                {index + 1} / {images.length}
              </p>
            </figure>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % images.length)}
                aria-label="Next image"
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper transition hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt sm:flex"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
