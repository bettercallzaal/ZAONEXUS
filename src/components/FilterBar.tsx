import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { categories, tags } from '../data/deriveStats'
import { colorForCategory } from '../lib/categoryColors'
import type { Audience } from '../data/types'

const AUDIENCES: { value: Audience | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'community', label: 'Community' },
  { value: 'ecosystem', label: 'Ecosystem' },
  { value: 'both', label: 'Everyone' },
]

const TOP_TAGS = tags.slice(0, 18).map((t) => t.name)

interface FilterBarProps {
  query: string
  onQuery: (v: string) => void
  category: string | null
  onCategory: (v: string | null) => void
  audience: Audience | 'all'
  onAudience: (v: Audience | 'all') => void
  activeTags: string[]
  onToggleTag: (tag: string) => void
  resultCount: number
}

export function FilterBar({
  query,
  onQuery,
  category,
  onCategory,
  audience,
  onAudience,
  activeTags,
  onToggleTag,
  resultCount,
}: FilterBarProps) {
  const hasFilters = category || audience !== 'all' || activeTags.length > 0 || query

  return (
    <div className="sticky top-[57px] z-30 -mx-4 border-b border-[var(--card-border)] bg-surface/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="glass flex flex-1 items-center gap-2 rounded-full px-4 py-2">
            <Search size={15} className="text-faint" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Filter the directory…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
            />
            {query && (
              <button onClick={() => onQuery('')} aria-label="Clear search">
                <X size={14} className="text-faint hover:text-gold" />
              </button>
            )}
          </div>

          <div className="glass flex shrink-0 rounded-full p-1 text-xs">
            {AUDIENCES.map((a) => (
              <button
                key={a.value}
                onClick={() => onAudience(a.value)}
                className={`relative rounded-full px-3 py-1.5 font-medium transition-colors ${
                  audience === a.value ? 'text-navy' : 'text-muted hover:text-gold'
                }`}
              >
                {audience === a.value && (
                  <motion.span
                    layoutId="audience-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                  />
                )}
                <span className="relative">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const color = colorForCategory(c.name)
            const active = category === c.name
            return (
              <button
                key={c.name}
                onClick={() => onCategory(active ? null : c.name)}
                className="relative rounded-full border px-3 py-1 text-xs font-medium transition-all"
                style={
                  active
                    ? { borderColor: color, color, backgroundColor: `${color}18` }
                    : { borderColor: 'var(--card-border)' }
                }
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.borderColor = `${color}88`
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.borderColor = 'var(--card-border)'
                }}
              >
                <span className={active ? '' : 'text-muted'}>{c.name}</span>
                <span className="ml-1 text-faint">{c.count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOP_TAGS.map((tag) => {
            const active = activeTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'bg-[var(--card-bg)] text-faint hover:text-muted'
                }`}
              >
                #{tag}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-faint">
          <span>
            {resultCount.toLocaleString()} result{resultCount === 1 ? '' : 's'}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                onQuery('')
                onCategory(null)
                onAudience('all')
                activeTags.forEach(onToggleTag)
              }}
              className="hover:text-gold"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
