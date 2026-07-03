import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import type { ZaoLink } from '../data/types'
import { LinkCard } from './LinkCard'

export function LinkGrid({ links }: { links: ZaoLink[] }) {
  if (links.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-2xl p-10 text-center"
      >
        <SearchX size={28} className="text-faint" />
        <p className="text-sm text-muted">
          No links match your filters. Try clearing a tag or category.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {links.map((link) => (
          <LinkCard key={link.url} link={link} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
