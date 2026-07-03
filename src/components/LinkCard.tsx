import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Link2 } from 'lucide-react'
import type { ZaoLink } from '../data/types'
import { colorForCategory } from '../lib/categoryColors'
import { domainOf, faviconOf } from '../lib/url'
import { useTilt } from '../hooks/useTilt'
import { useToast } from './Toast'

const AUDIENCE_LABEL: Record<ZaoLink['audience'], string> = {
  community: 'Community',
  ecosystem: 'Ecosystem',
  both: 'Everyone',
}

export const LinkCard = forwardRef<HTMLAnchorElement, { link: ZaoLink }>(function LinkCard(
  { link },
  ref,
) {
  const showToast = useToast()
  const favicon = faviconOf(link.url)
  const accent = colorForCategory(link.category)
  const { rotateX, rotateY, glareBackground, onMouseMove, onMouseLeave } = useTilt(
    6,
    `${accent}2e`,
  )

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(link.url)
      showToast('Link copied to clipboard')
    } catch {
      showToast('Could not copy link')
    }
  }

  return (
    <motion.a
      ref={ref}
      layout
      href={link.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      className="glass glass-hover group relative flex flex-col overflow-hidden rounded-2xl p-4"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <motion.span
        aria-hidden
        style={{ background: glareBackground }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {favicon && (
            <img
              src={favicon}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="h-5 w-5 shrink-0 rounded"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
              }}
            />
          )}
          <span className="truncate text-sm font-semibold">{link.title}</span>
        </div>
        <ArrowUpRight
          size={15}
          className="shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
        />
      </div>

      <p className="relative mt-2 line-clamp-2 text-xs text-muted">{link.description}</p>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {link.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--card-bg)] px-2 py-0.5 text-[10px] text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-[11px] text-faint">
        <span className="truncate">{domainOf(link.url)}</span>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5"
            style={{ borderColor: `${accent}55`, color: accent }}
          >
            {AUDIENCE_LABEL[link.audience]}
          </span>
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="rounded-full p-1 opacity-0 transition-opacity hover:text-gold group-hover:opacity-100"
          >
            <Link2 size={13} />
          </button>
        </div>
      </div>
    </motion.a>
  )
})
