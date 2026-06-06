# Changelog

All notable changes to ZAO Nexus will be documented in this file.

## [1.4.0] - 2026-06-06

### ✨ Discovery features

- **Featured links** — links flagged `featured: true` render in a Featured grid at the top and get a star badge in-list. Seeded 6 marquee links (ZAO Website, ZAO OS App, Discord, WaveWarZ, $ZABAL Token, ZAO Artists).
- **What's New** — links with an `addedDate` surface in a grid with a NEW badge (shown for the last 45 days). Seeded the 7 most recently added links.
- **Tag filtering** — toolbar tag chips (top 18 by frequency) filter links across all categories; combine with search. Clear-all when active.
- Plumbing: `groupLinks` now passes `featured` / `addedDate` through from `links.json`; `FlatLink` gains both fields.

## [1.3.2] - 2026-06-06

### 🔗 Verified socials + cleanups

- **Artist socials** (verified via web search): added Goldilox (yesiamgoldilocks.com + Instagram) and NessytheRilla (SoundCloud + Facebook). Losi left as-is — the only "izzylosi" match is a different artist (Melbourne, AU), not the Cali/Colombia ZAO artist.
- **`zaomusic.xyz`** added as an alternate-domain link mirroring thezao.com. Total **146 links** — `/community` 69, `/ecosystem` 102.
- **README polish**: corrected `cd NexusV2` → `cd zaonexus`, updated the project-structure tree (links.json/links.ts/brands.ts/sitemap/robots), softened the unverified "WCAG 2.1 AA compliant" claim.

## [1.3.1] - 2026-06-06

### 🔗 Restored links + authoring tooling

- **Re-added 6 links** dropped during the canonical consolidation: ZAO Artists, Music Releases, ZTalent Ecosystem (ZAO CHART), ZAO Leaderboard, $ZAO Respect Token, and the ZTalent Whitepaper (HackMD). Total now **145 links** — `/community` = 68, `/ecosystem` = 101.
- **`scripts/add-link.js`** rewritten to append to the flat `app/data/links.json` (new schema: title/url/category/subcategory/description/tags/audience, with the canonical 9 categories) instead of the old nested `links.ts`.

## [1.3.0] - 2026-06-06

### 🔄 Canonical data consolidation + GitHub sync

- **Canonical link set** - Replaced the bundled link data with a consolidated set of **139 links across 9 categories** (The ZAO, ZAO OS, Agents & Bots, ZAO Festivals, Community Projects, ZAO Members, Ecosystem & Tokens, ZAO Onchain, ZAO Stock), merged from three previously-drifted sources.
- **Audience split** - Each link carries an `audience` (`community` / `ecosystem` / `both`). `/community` shows community + both (64); `/ecosystem` shows ecosystem + both (96). The 21 `both` links appear on each.
- **Flat JSON source of truth** - Link data now lives in `app/data/links.json` (flat, one object per link). `app/data/links.ts` groups it into the nested category view at load time.
- **Runtime GitHub sync** - The site fetches `links.json` from raw GitHub (`main`) at runtime, so edits to the file update the live site **without a redeploy**. The bundled copy is used as a fallback if the fetch fails.

## [1.1.0] - 2026-02-12

### ✨ New Features

#### **Social Sharing**
- **Share to X (Twitter)** - One-click sharing with custom message format
- **Share to Farcaster** - Direct sharing to Warpcast with pre-filled text
- **Copy Link** - Quick copy button with visual feedback
- **Share Message Template** - "I found [title] on the ZAO NEXUS! You should check it out: [url]"

#### **Stats Footer**
- **Total Links Counter** - Display total number of links in collection
- **Categories Counter** - Show number of main categories
- **Subcategories Counter** - Display total subcategories
- **Visual Stats Card** - Prominent display at bottom of page

#### **Enhanced Link Cards**
- **External Link Icon** - Visual indicator for external links
- **Action Buttons** - Copy, X, and Farcaster buttons on each link
- **Hover States** - Improved button interactions
- **Compact Layout** - Buttons integrated without cluttering design

### 🎨 Design Improvements
- Stats displayed in highlighted card with brand colors
- Social sharing icons using official X and Farcaster logos
- Smooth button animations and hover effects
- Better visual hierarchy with external link indicators

### 🔧 Technical Updates
- Added social sharing utility functions
- Implemented clipboard API for copy functionality
- Window.open for social share popups
- URL encoding for share text

---

## [1.0.0] - 2026-02-12

### 🎉 Initial Release - ZAO Nexus V1

A modern, responsive link directory for the ZAO community with 200+ curated links across 5 main categories.

### ✨ Features

#### **Core Functionality**
- **Smart Search** - Real-time search across titles, descriptions, and URLs
- **Auto-Expand Search Results** - Automatically opens categories/subcategories containing search matches
- **Hierarchical Organization** - 5 main categories with multiple subcategories
- **200+ Curated Links** - Comprehensive collection of ZAO ecosystem resources

#### **Navigation**
- **Quick Jump Navigation** - Instant scroll to any category with smooth animations
- **Sticky Search Bar** - Always accessible search as you scroll
- **Expand/Collapse All** - Quick controls to open or close all sections
- **Smooth Scrolling** - Professional navigation experience with proper offsets

#### **Design & UX**
- **Dark/Light Mode Toggle** - Switch between ZAO brand color schemes
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Clean, Compact Layout** - Minimal design without visual clutter
- **Hover Effects** - Interactive border highlights and slide animations
- **Optimized Contrast** - WCAG-compliant color ratios for accessibility

#### **Performance**
- **Fast Loading** - Built with Next.js 14 for optimal performance
- **Efficient Filtering** - Instant search results with useMemo optimization
- **Smooth Animations** - Hardware-accelerated CSS transitions

### 📦 Categories Included

1. **ZAO Onchain** - Tokens, tracks, and on-chain assets
2. **ZAO Links** - Official platforms, calendars, social media, whitepaper
3. **ZAO Projects Links** - WaveWarZ, ZABAL, Festivals, $Loanz, Playlists, Interviews
4. **ZAO Community Links** - C.O.C ConcertZ, MidiPunkZ partnerships
5. **ZAO Community Members** - Founder links, interviews, media appearances

### 🛠️ Technical Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

### 🎨 Design System

- **Brand Colors**: 
  - Dark Mode: `#141e27` background, `#e0ddaa` text
  - Light Mode: `#e0ddaa` background, `#141e27` text
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Compact, consistent spacing system
- **Animations**: Subtle fade-in and hover effects

### 📝 Notable Links Added

- ZABAL Connector (zabal.lol)
- WaveWarZ comprehensive ecosystem (40+ links)
- Complete interview collection
- Social media profiles across platforms
- Community resources and tools

### 🚀 Deployment

- **Repository**: https://github.com/bettercallzaal/ZAONEXUS
- **Vercel Compatible**: Auto-deploy ready
- **Webflow Embeddable**: Clean iframe integration

### 🔧 Developer Features

- **Link Management Script** - `scripts/add-link.js` for easy link additions
- **TypeScript Types** - Full type safety for link data
- **Modular Structure** - Easy to maintain and extend
- **Git Workflow** - Clean commit history and version control

### 📚 Documentation

- Comprehensive README with setup instructions
- Link discovery guide for finding new resources
- Deployment instructions for Vercel
- Webflow embedding examples

### 🎯 Future Enhancements (Planned for V1.1+)

- [ ] Analytics integration (view counts, popular links)
- [ ] Link validation/health checks
- [ ] Export/share functionality
- [ ] RSS feed for new links
- [ ] Admin panel for easier link management
- [ ] Link categories/tags filtering
- [ ] Recently added links section
- [ ] Link submission form for community
- [ ] Social sharing buttons
- [ ] Keyboard shortcuts

---

## Development Notes

### Performance Metrics
- Initial load: < 2s
- Search response: < 50ms
- Lighthouse score: 95+

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on all interactive elements

---

**Contributors**: BetterCallZaal (@bettercallzaal)
**License**: MIT
**Repository**: https://github.com/bettercallzaal/ZAONEXUS
