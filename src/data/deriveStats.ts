import raw from './links.json'
import type { Audience, LinksPayload, ZaoLink } from './types'

const payload = raw as LinksPayload

export const links: ZaoLink[] = payload.links

export interface CategoryStat {
  name: string
  count: number
}

export interface TagStat {
  name: string
  count: number
}

function count<T extends string>(values: T[]): Map<T, number> {
  const m = new Map<T, number>()
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1)
  return m
}

export const categories: CategoryStat[] = Array.from(
  count(links.map((l) => l.category)),
  ([name, count]) => ({ name, count }),
).sort((a, b) => b.count - a.count)

export const tags: TagStat[] = Array.from(
  count(links.flatMap((l) => l.tags)),
  ([name, count]) => ({ name, count }),
).sort((a, b) => b.count - a.count)

export const audienceCounts: Record<Audience, number> = {
  community: 0,
  ecosystem: 0,
  both: 0,
}
for (const l of links) audienceCounts[l.audience]++

export const totalTags = tags.length
export const totalLinks = links.length
export const totalCategories = categories.length

// "ZAO Members" is people-centric — each subcategory is a member's namespace.
export interface Member {
  name: string
  links: ZaoLink[]
}

export const members: Member[] = (() => {
  const byName = new Map<string, ZaoLink[]>()
  for (const l of links) {
    if (l.category !== 'ZAO Members') continue
    const arr = byName.get(l.subcategory) ?? []
    arr.push(l)
    byName.set(l.subcategory, arr)
  }
  return Array.from(byName, ([name, links]) => ({ name, links })).sort(
    (a, b) => b.links.length - a.links.length,
  )
})()

export const totalMembers = members.length

// Curated onboarding set for newcomers.
export const startHere: ZaoLink[] = links.filter(
  (l) => l.subcategory === 'ZAO 101' || l.featured,
)

// Most recently added links, for a "What's New" rail.
export const whatsNew: ZaoLink[] = links
  .filter((l) => l.addedDate)
  .sort((a, b) => (b.addedDate ?? '').localeCompare(a.addedDate ?? ''))
  .slice(0, 10)

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const HUES = [8, 28, 45, 165, 190, 210, 260, 285, 320, 340]
export function colorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  const hue = HUES[hash % HUES.length]
  return `hsl(${hue}, 65%, 55%)`
}
