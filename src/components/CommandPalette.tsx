import { useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { ArrowUpRight, Search } from 'lucide-react'
import { links } from '../data/deriveStats'
import { createSearchIndex } from '../lib/search'
import { domainOf } from '../lib/url'

const fuse = createSearchIndex(links)

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) {
      return links.filter((l) => l.featured).slice(0, 8)
    }
    return fuse
      .search(query)
      .slice(0, 30)
      .map((r) => r.item)
  }, [query])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>()
    for (const item of results) {
      const arr = map.get(item.category) ?? []
      arr.push(item)
      map.set(item.category, arr)
    }
    return Array.from(map.entries())
  }, [results])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      label="Search ZAO NEXUS"
      shouldFilter={false}
      className="fixed left-1/2 top-24 z-50 w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-surface shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-3">
        <Search size={16} className="text-muted" />
        <Command.Input
          autoFocus
          value={query}
          onValueChange={setQuery}
          placeholder="Search 479 links… try 'discord', 'artist', or a member name"
          className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
        />
        <kbd className="rounded border border-[var(--card-border)] px-1.5 py-0.5 font-mono text-[10px] text-faint">
          esc
        </kbd>
      </div>

      <Command.List className="max-h-[60vh] overflow-y-auto p-2">
        <Command.Empty className="py-10 text-center text-sm text-muted">
          No links found. Try a different term.
        </Command.Empty>

        {grouped.map(([category, items]) => (
          <Command.Group
            key={category}
            heading={category}
            className="px-2 py-2 text-xs uppercase tracking-widest text-faint [&_[cmdk-group-heading]]:px-1 [&_[cmdk-group-heading]]:pb-2"
          >
            {items.map((item) => (
              <Command.Item
                key={item.url}
                value={item.title}
                onSelect={() => {
                  window.open(item.url, '_blank', 'noreferrer')
                  onClose()
                }}
                className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm data-[selected=true]:bg-[var(--card-bg)]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{item.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {domainOf(item.url)} · {item.subcategory}
                  </span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-faint opacity-0 transition-opacity group-hover:opacity-100 group-data-[selected=true]:opacity-100"
                />
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  )
}
