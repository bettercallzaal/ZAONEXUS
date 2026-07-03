import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import type { Theme } from '../hooks/useTheme'
import zaoLogo from '../assets/thezao-logo.jpg'

const NAV_LINKS = [
  { label: 'Start Here', href: '#start-here' },
  { label: 'Directory', href: '#directory' },
  { label: 'Members', href: '#members' },
]

export function Nav({
  theme,
  toggleTheme,
  onOpenSearch,
}: {
  theme: Theme
  toggleTheme: () => void
  onOpenSearch: () => void
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-40 transition-shadow ${scrolled ? 'nav-blur border-b border-[var(--card-border)] shadow-[0_8px_30px_-16px_rgba(0,0,0,0.6)]' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5 font-semibold tracking-tight">
          <motion.img
            src={zaoLogo}
            alt="The ZAO"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="h-9 w-9 rounded-full shadow-[0_0_20px_rgba(245,166,35,0.4)] ring-1 ring-gold/30"
          />
          <span className="hidden sm:inline">ZAO NEXUS</span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="glass glass-hover flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-muted"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-[var(--card-border)] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              /
            </kbd>
          </button>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
        </div>
      </div>
    </motion.header>
  )
}
