import { motion } from 'framer-motion'
import { ArrowUpRight, Clock } from 'lucide-react'
import { startHere, whatsNew } from '../data/deriveStats'
import type { ZaoLink } from '../data/types'
import { domainOf } from '../lib/url'
import { useTilt } from '../hooks/useTilt'

function StartHereCard({ item, index }: { item: ZaoLink; index: number }) {
  const { rotateX, rotateY, glareBackground, onMouseMove, onMouseLeave } = useTilt(
    7,
    'rgba(245,166,35,0.2)',
  )

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4 }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      className="glass glass-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5"
    >
      <motion.span
        aria-hidden
        style={{ background: glareBackground }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            {item.subcategory}
          </span>
          <ArrowUpRight
            size={16}
            className="text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
          />
        </div>
        <h3 className="mt-3 font-semibold leading-snug">{item.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{item.description}</p>
      </div>
      <div className="relative mt-4 text-xs text-faint">{domainOf(item.url)}</div>
    </motion.a>
  )
}

export function StartHere() {
  return (
    <section id="start-here" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start Here</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            New to The ZAO? These are the cleanest front doors — pick one and jump in.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {startHere.map((item, i) => (
          <StartHereCard key={item.url} item={item} index={i} />
        ))}
      </div>

      {whatsNew.length > 0 && (
        <div className="mt-14">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted">
            <Clock size={14} /> What&apos;s New
          </h3>
          <div className="glass overflow-x-auto rounded-2xl">
            <div className="flex min-w-max divide-x divide-[var(--card-border)]">
              {whatsNew.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-hover flex w-64 shrink-0 flex-col gap-1.5 p-4"
                >
                  <span className="text-xs text-faint">{item.addedDate}</span>
                  <span className="line-clamp-2 text-sm font-medium">{item.title}</span>
                  <span className="text-xs text-gold">{item.category}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
