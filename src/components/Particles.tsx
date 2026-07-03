const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 137.5) % 100}%`,
  size: 2 + ((i * 7) % 4),
  duration: 10 + ((i * 5) % 12),
  delay: (i * 1.3) % 10,
  hue: i % 3,
}))

const HUE_CLASS = ['bg-gold', 'bg-cream', 'bg-fuchsia-300']

export function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute bottom-0 rounded-full opacity-0 ${HUE_CLASS[p.hue]}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
