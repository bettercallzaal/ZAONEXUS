import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'

function useTransformNeg(value: MotionValue<number>) {
  return useTransform(value, (v) => -v)
}

export function AuroraBackground() {
  const { x, y } = useParallax(24)
  const negX = useTransformNeg(x)
  const negY = useTransformNeg(y)

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ x, y }}
        className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] animate-aurora rounded-full bg-gold/30 blur-[120px]"
      />
      <motion.div
        style={{ x: negX, y: negY }}
        className="absolute -top-24 right-0 h-[30rem] w-[30rem] animate-aurora-slow rounded-full bg-fuchsia-400/20 blur-[130px]"
      />
      <motion.div
        style={{ x, y: negY }}
        className="absolute top-52 left-0 h-[26rem] w-[26rem] animate-aurora rounded-full bg-cyan-400/15 blur-[110px]"
      />
      <div className="absolute bottom-0 right-1/4 h-[22rem] w-[22rem] animate-aurora-slow rounded-full bg-cream/15 blur-[110px]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
    </div>
  )
}
