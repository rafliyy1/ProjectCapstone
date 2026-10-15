import { useEffect, useRef, useState } from 'react'

/**
 * Hook yang mengembalikan [ref, isVisible].
 * Saat elemen yang di-attach ref masuk viewport, isVisible menjadi true.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el) // hanya sekali
        }
      },
      { threshold: 0.12, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}
