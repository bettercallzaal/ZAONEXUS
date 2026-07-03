import { useCallback, useEffect, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { Directory } from './components/Directory'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { MembersSpotlight } from './components/MembersSpotlight'
import { Nav } from './components/Nav'
import { StartHere } from './components/StartHere'
import { ToastProvider } from './components/Toast'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable

      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface text-[var(--text)]">
        <Nav theme={theme} toggleTheme={toggle} onOpenSearch={openSearch} />
        <CommandPalette open={searchOpen} onClose={closeSearch} />
        {searchOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
          />
        )}
        <main>
          <Hero onOpenSearch={openSearch} />
          <StartHere />
          <Directory />
          <MembersSpotlight />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}
