import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { colorForName, initials, members, type Member } from '../data/deriveStats'
import { useTilt } from '../hooks/useTilt'

const INITIAL_COUNT = 12

function MemberCard({ member, index }: { member: Member; index: number }) {
  const primary = member.links[0]
  const color = colorForName(member.name)
  const { rotateX, rotateY, glareBackground, onMouseMove, onMouseLeave } = useTilt(
    9,
    `${color.replace('hsl(', 'hsla(').replace(')', ', 0.35)')}`,
  )

  return (
    <motion.a
      href={primary?.url ?? '#'}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % INITIAL_COUNT) * 0.03 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4 }}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      className="glass glass-hover group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl p-4 text-center"
    >
      <motion.span
        aria-hidden
        style={{ background: glareBackground }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        className="relative flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-[0_0_20px_-2px_var(--glow)]"
        style={{ backgroundColor: color, ['--glow' as string]: color }}
      >
        {initials(member.name)}
      </span>
      <div className="relative">
        <div className="flex items-center justify-center gap-1 text-sm font-semibold">
          {member.name}
          <ArrowUpRight
            size={12}
            className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
        <div className="mt-0.5 text-xs text-faint">
          {member.links.length} link{member.links.length === 1 ? '' : 's'}
        </div>
      </div>
    </motion.a>
  )
}

export function MembersSpotlight() {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? members : members.slice(0, INITIAL_COUNT)

  return (
    <section id="members" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Members Spotlight</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          {members.length} ZAO members with their own corner of the ecosystem: artists,
          builders, and creators shipping in the open.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>

      {members.length > INITIAL_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="glass glass-hover rounded-full px-6 py-2.5 text-sm font-medium"
          >
            {expanded ? 'Show fewer members' : `Show all ${members.length} members`}
          </button>
        </div>
      )}
    </section>
  )
}
