import type { MouseEvent } from 'react'
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function useTilt(max = 8, glareColor = 'rgba(245,166,35,0.18)') {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 300, damping: 24, mass: 0.6 }

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  const glareX = useTransform(px, [0, 1], ['0%', '100%'])
  const glareY = useTransform(py, [0, 1], ['0%', '100%'])
  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${glareX} ${glareY}, ${glareColor}, transparent 70%)`

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function onMouseLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return { rotateX, rotateY, glareBackground, onMouseMove, onMouseLeave }
}
