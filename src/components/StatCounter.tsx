import { useCountUp } from '../hooks/useCountUp'

export function StatCounter({ value, label }: { value: number; label: string }) {
  const { value: animated, ref } = useCountUp(value)

  return (
    <div ref={ref as never} className="glass glass-hover rounded-2xl px-5 py-4 text-center">
      <div className="font-mono text-3xl font-bold text-gold sm:text-4xl">
        {animated.toLocaleString()}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted">{label}</div>
    </div>
  )
}
