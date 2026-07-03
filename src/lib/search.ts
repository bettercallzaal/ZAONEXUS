import Fuse from 'fuse.js'
import type { ZaoLink } from '../data/types'

export function createSearchIndex(links: ZaoLink[]) {
  return new Fuse(links, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.25 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'subcategory', weight: 0.15 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
  })
}
