import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('zao-nexus-theme', 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
