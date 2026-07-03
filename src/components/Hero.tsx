import { motion } from 'framer-motion'
import { ArrowRight, Search } from 'lucide-react'
import { AuroraBackground } from './AuroraBackground'
import { Particles } from './Particles'
import { StatCounter } from './StatCounter'
import { totalCategories, totalLinks, totalMembers, totalTags } from '../data/deriveStats'
import { useParallax } from '../hooks/useParallax'
import zaoLogo from '../assets/thezao-logo.jpg'

export function Hero({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { x, y } = useParallax(14)

  return (
    <section id="top" className="relative overflow-hidden">
      <AuroraBackground />
      <Particles />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
          style={{ x, y }}
          className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28"
        >
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gold/40 blur-2xl" />
          <motion.img
            src={zaoLogo}
            alt="The ZAO"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative h-24 w-24 rounded-full shadow-[0_0_50px_rgba(245,166,35,0.45)] ring-2 ring-gold/40 sm:h-28 sm:w-28"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass mx-auto mb-6 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest text-gold"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          A decentralized impact network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto max-w-3xl text-center text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Every ZAO link,{' '}
          <span className="animate-shimmer bg-gradient-to-r from-gold via-fuchsia-300 via-50% to-gold bg-[length:200%_auto] bg-clip-text text-transparent">
            one living directory
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-center text-base text-muted sm:text-lg"
        >
          Artists, builders, tools, tokens, and members — all of The ZAO ecosystem, searchable
          in seconds and always up to date.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            onClick={onOpenSearch}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-soft px-5 py-2.5 text-sm font-semibold text-navy shadow-[0_0_30px_rgba(245,166,35,0.4)]"
          >
            <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-gold/50 blur-lg" />
            <Search size={16} />
            Search the Nexus
          </motion.button>
          <motion.a
            href="#start-here"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 rounded-full glass glass-hover px-5 py-2.5 text-sm font-semibold"
          >
            New here? Start here
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatCounter value={totalLinks} label="Links" />
          <StatCounter value={totalCategories} label="Categories" />
          <StatCounter value={totalTags} label="Tags" />
          <StatCounter value={totalMembers} label="Members" />
        </motion.div>
      </div>
    </section>
  )
}
