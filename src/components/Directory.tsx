import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { links } from '../data/deriveStats'
import type { Audience } from '../data/types'
import { createSearchIndex } from '../lib/search'
import { FilterBar } from './FilterBar'
import { LinkGrid } from './LinkGrid'

const fuse = createSearchIndex(links)
const PAGE_SIZE = 24

export function Directory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [audience, setAudience] = useState<Audience | 'all'>('all')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [visible, setVisible] = useState(PAGE_SIZE)

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setVisible(PAGE_SIZE)
  }

  const filtered = useMemo(() => {
    let base = query.trim() ? fuse.search(query).map((r) => r.item) : links

    if (category) base = base.filter((l) => l.category === category)
    if (audience !== 'all') base = base.filter((l) => l.audience === audience)
    if (activeTags.length > 0) {
      base = base.filter((l) => activeTags.every((t) => l.tags.includes(t)))
    }
    return base
  }, [query, category, audience, activeTags])

  const shown = filtered.slice(0, visible)

  return (
    <section id="directory" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The Full Directory</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Every link in the ecosystem: filter by category, audience, or tag to find exactly
          what you need.
        </p>
      </div>

      <FilterBar
        query={query}
        onQuery={(v) => {
          setQuery(v)
          setVisible(PAGE_SIZE)
        }}
        category={category}
        onCategory={(v) => {
          setCategory(v)
          setVisible(PAGE_SIZE)
        }}
        audience={audience}
        onAudience={(v) => {
          setAudience(v)
          setVisible(PAGE_SIZE)
        }}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        resultCount={filtered.length}
      />

      <div className="mt-6">
        <LinkGrid links={shown} />
      </div>

      {visible < filtered.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="glass glass-hover rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Show more ({filtered.length - visible} remaining)
          </button>
        </motion.div>
      )}
    </section>
  )
}
