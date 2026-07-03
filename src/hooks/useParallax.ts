import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export function useParallax(strength = 20) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 })
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    function onMove(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      x.set(nx * strength)
      y.set(ny * strength)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [strength, x, y])

  return { x: springX, y: springY }
}
