import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Router links like `/#services` change the URL but React Router does not
 * scroll on its own. This scrolls to the anchor when there is a hash, and to
 * the top on a plain route change.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait a frame so a lazily-loaded route has painted its sections.
      const id = requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
      return () => cancelAnimationFrame(id)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
