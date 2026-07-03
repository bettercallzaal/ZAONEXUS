import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

export function ThemeToggle({ theme, toggle }: { theme: Theme; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="glass glass-hover relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-gold" />
          ) : (
            <Moon size={16} className="text-navy" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
