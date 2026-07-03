# ZAO NEXUS

A living directory for The ZAO — 479 links across 9 categories, searchable and filterable, rebuilt with a richer UI than the original.

## Stack

Vite + React + TypeScript + Tailwind CSS, with Framer Motion (animation), cmdk (command palette), and Fuse.js (fuzzy search).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
```

## Data

`src/data/links.json` is a snapshot of the live `nexus.thezao.com/api/links` feed (479 entries). Edit it directly to add/update links — `src/data/deriveStats.ts` recomputes categories, tags, members, and "what's new" from that file automatically.

## Features

- Global fuzzy search via `/` or `⌘K` (command palette, grouped by category)
- Filterable directory: category chips, audience toggle, tag pills, free-text search
- Animated hero stats, glassmorphic cards, aurora background, dark/light theme (persisted)
- Members Spotlight for the ZAO Members category
- Fully responsive, respects `prefers-reduced-motion`
