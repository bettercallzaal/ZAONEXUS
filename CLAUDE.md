# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies (Node 18+ required)
npm run dev        # start dev server at http://localhost:3000
npm run build      # production build
npm run lint       # ESLint via next lint
npm run start      # serve production build
```

There is no test suite. TypeScript type-checking runs as part of `next build`.

To add a link interactively:
```bash
node scripts/add-link.js
```

## Architecture

ZAO NEXUS is a Next.js 14 App Router site with two completely independent audience routes that share no components:

### `/community` route — link directory
- Entry: `app/community/page.tsx` renders `<Home audience="community" />` from `app/page.tsx`
- Data source: `app/data/links.ts` — a single `linksData: MainCategory[]` export
- Every link has an `audience` field (`'community' | 'ecosystem' | 'both'`). The `filterByAudience()` function in `app/page.tsx` filters the flat data array before rendering; links tagged `'community'` or `'both'` appear here
- All state (search, expanded categories, dark mode) is client-side `useState`/`useMemo` in the single `Home` component — there is no server component on this route
- Theme: CSS custom properties in `app/globals.css` — dark mode default (`#141e27` bg / `#e0ddaa` text), toggled by adding the `.dark-mode` class to the wrapper div

### `/ecosystem` route — brand showcase + detail pages
- Entry: `app/ecosystem/page.tsx` — brand card grid, filters by `BrandStage`, reads from `app/data/brands.ts`
- Detail pages: `app/ecosystem/[slug]/page.tsx` — **server component**, statically generated via `generateStaticParams()`, fetches live data server-side at request time (1 h `next.revalidate`)
- Data source: `app/data/brands.ts` — `brands: Brand[]` array with helper functions `getBrandBySlug`, `getBrandChildren`, `getBrandsByStage`
- Live data fetched in parallel in the `[slug]` server component: Farcaster cast stats, GitHub last commit, token holder count — all silently fail if unavailable, displayed via `app/components/LiveDataPanel.tsx`
- Org chart: `app/components/EcosystemOrgChart.tsx` — recursive `OrgNode` component that walks `brands` by `parent` slug field
- Theme: hardcoded inline styles (`#0a1628` bg / `#e4e2dd` text / `#f5a623` accent) — **not** using the CSS variables used by the community route

### Data shape

**Links** (`app/data/links.ts`):
```ts
{ title, url, description, audience?, featured?, addedDate?, status?, tags? }
```
Organized as `MainCategory → Subcategory → Link[]`. Add new links here; `audience` controls which route shows them.

**Brands** (`app/data/brands.ts`):
```ts
{ slug, name, tagline, description, stage, tier, parent?,
  homepage?, github?, farcaster?, x?, tokenContract?, milestones?, links[] }
```
Hierarchy is expressed via `parent: slug` — `getBrandChildren(slug)` queries this. `tier` controls org chart display level (`umbrella → organization → project → sub-brand`).

## Live data / environment variables

All env vars are optional. The app renders without them — live data blocks are hidden when data is unavailable.

| Variable | Purpose |
|---|---|
| `FARCASTER_API_BASE` | Defaults to `https://haatz.quilibrium.com` (free, no key). Set to `https://api.neynar.com` to use Neynar instead |
| `NEYNAR_API_KEY` | Required only when `FARCASTER_API_BASE` points at Neynar |
| `ALCHEMY_API_KEY` | Token holder counts on brand detail pages |

GitHub commit data uses the public API (60 req/h unauthenticated, no key needed).

## Design system

Community route uses CSS variables (editable in `app/globals.css`):
- Default (visually "dark"): `--bg-color: #141e27`, `--text-color: #e0ddaa`
- `.dark-mode` class inverts these (makes background light)

Ecosystem route uses hardcoded colors directly in JSX:
- Background: `#0a1628`, text: `#e4e2dd`, accent/highlight: `#f5a623`

Do not mix the two theming approaches — the routes are intentionally independent.
