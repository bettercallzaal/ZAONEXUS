# ZAO NEXUS - Canonical Link Hub

> **Version 1.2.0** - Two-audience portal for ZAO community and ecosystem discovery

A comprehensive two-route link directory featuring 145 curated links across 9 categories, plus 44 ecosystem brands. Built with Next.js 14, React 18, TypeScript, and TailwindCSS v3. Strategy D canonical rebuild per research/community/624.

## ✨ Features

### Core Functionality
- 🔍 **Smart Search** - Real-time search across titles, descriptions, and URLs
- 🎯 **Auto-Expand Results** - Automatically opens categories containing search matches
- 📂 **Dual-Audience Routes** - Community-focused and ecosystem-focused views
- 🔗 **145 Curated Links** - Across 9 categories, plus 44 ecosystem brands

### Two-Audience Architecture
- **/community** - Member-facing content (ZAO holder resources, internal tools, governance)
- **/ecosystem** - External-facing content (brand pages, projects, partner integrations)
- **Smart Filtering** - Each link tagged with audience (`community`, `ecosystem`, or `both`)

### Navigation & UX
- ⚡ **Quick Jump** - Instant scroll to any category
- 📌 **Sticky Search** - Always accessible search bar
- 🎨 **Dark/Light Mode** - Toggle between ZAO brand themes
- 📱 **Fully Responsive** - Optimized for all devices
- ✨ **Smooth Animations** - Professional transitions and hover effects
- ♿ **Accessible** - WCAG 2.1 AA compliant

### Performance
- ⚡ **Fast Loading** - Next.js 14 optimization
- 🚀 **Instant Search** - Sub-50ms response time
- 💾 **Efficient** - Optimized with React hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd NexusV2
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

## Embedding in Webflow

Once deployed, you can embed this in Webflow using an iframe:

```html
<iframe 
  src="https://your-nexus-url.vercel.app" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

Or simply link to it:

```html
<a href="https://your-nexus-url.vercel.app" target="_blank">
  Visit ZAO NEXUS
</a>
```

## Project Structure

```
NexusV2/
├── app/
│   ├── data/
│   │   └── links.ts          # All links data
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── public/                   # Static assets
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## Customization

### Adding New Links

Links live in the flat, canonical **`app/data/links.json`** — one object per link. The
site fetches this file at runtime from raw GitHub (`main` branch), so **editing
`links.json` on GitHub updates the live site without a redeploy** (the bundled copy
is used as a fallback if the fetch fails). `app/data/links.ts` groups this flat
list into the nested category view the UI renders.

Add an entry following this shape:

```json
{
  "title": "Link Title",
  "url": "https://example.com",
  "category": "The ZAO",
  "subcategory": "ZAO Platforms",
  "description": "Link description",
  "tags": ["music", "onchain"]
}
```

- `title`, `url`, `category` are required; `subcategory`, `description`, `tags` are optional.
- `category` must be one of the 9 canonical categories (order defined by `CATEGORY_ORDER` in `links.ts`): The ZAO, ZAO OS, Agents & Bots, ZAO Festivals, Community Projects, ZAO Members, Ecosystem & Tokens, ZAO Onchain, ZAO Stock.
- Categories and subcategories render in first-seen order within the canonical category order.

### Audience Tagging Guidelines

- **community**: ZAO member-only tools, governance, internal documentation
- **ecosystem**: Public brand pages, projects, partner integrations, artist profiles
- **both**: Core ZAO resources, social media, key onboarding pages

### Changing Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --bg-color: #141e27;
  --text-color: #e0ddaa;
  --accent-bg: #e0ddaa;
  --accent-text: #141e27;
}
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## License

MIT License - feel free to use this for your own projects!

## 🗺️ Roadmap

### Vision
ZAO Nexus is the **central discovery hub** for everything ZAO - an amalgamation of all our links and the go-to place to explore what we do.

### V1.2 - Discovery & Exploration (Next Release)
**Focus: Making ZAO Nexus the ultimate discovery engine**

#### Planned Features

**🆕 What's New Section**
- Highlight recently added links at the top of the page
- Show latest 5-10 additions with "NEW" badges
- Encourage repeat visits to discover fresh content
- Auto-display links added in the last 7-30 days

**⭐ Featured/Highlighted Links**
- Pin important links to the top of categories
- "Featured" badge for key projects and initiatives
- Spotlight current campaigns, new releases, active projects
- Manually curated to guide discovery

**🚀 "Start Here" Section**
- Beginner-friendly entry points for newcomers
- "New to ZAO? Start here" with essential links
- Onboarding path: Whitepaper → Main Socials → Key Projects
- Help people understand the ZAO ecosystem quickly

**📅 Activity Feed/Timeline**
- Show recent ZAO activities and updates
- "Latest from WaveWarZ", "New ZABAL update", etc.
- Give visitors a sense of an active, thriving ecosystem
- Can pull from social media or be manually updated

**💡 Project Spotlights**
- Rotating featured project cards
- Brief description + key links for each initiative
- Help people understand what each project does
- Example: "This week: WaveWarZ - Trade music on Solana"

**🔍 Explore by Type**
- Filter by content type: Tools, Social, Games, Content, Community
- Cross-category discovery
- "Show me all games" or "Show me all social platforms"
- Tag-based navigation system

**📊 Enhanced Link Metadata**
```typescript
{
  title: "Link Title",
  url: "https://example.com",
  description: "Description",
  addedDate: "2026-02-12",     // For "What's New"
  featured: true,               // For highlighting
  tags: ["game", "music"],      // For filtering
  category: "tool"              // For type-based exploration
}
```

### V1.3 - Community Engagement
**Focus: Making the Nexus interactive and community-driven**

- **Link Submission Form** - Community can suggest new links
- **Favorites/Bookmarks** - Users can save their favorite links (localStorage)
- **Link Ratings/Votes** - Community-driven curation
- **Collections/Playlists** - Users create custom link collections
- **Comments/Notes** - Personal notes on links (stored locally)

### V1.4 - Advanced Features
**Focus: Power user features and automation**

- **Link Health Monitoring** - Check for broken links, display status
- **Click Analytics** - Track popular links, show trending content
- **RSS/Newsletter** - RSS feed for new links, weekly digest
- **Keyboard Shortcuts** - `/` for search, arrow keys for navigation
- **API Endpoint** - Public API for link data, JSON export

### V2.0 - Platform Evolution
**Focus: Decentralized social integration**

- **Farcaster Frames Integration** - Interactive cards in social feeds
- **User Accounts** - Sign in with Farcaster/wallet, sync across devices
- **AI-Powered Features** - Smart categorization, recommendations
- **Mobile App** - Native iOS/Android with offline access

## 📝 Contributing

### Adding Missing Links

We're continuously expanding the Nexus! If you know of ZAO links that should be included:

1. **Via Pull Request** (or edit directly on GitHub — no redeploy needed):
   - Fork the repository (or edit in the GitHub UI)
   - Edit `app/data/links.json`
   - Add your links following the canonical flat schema above
   - Commit to `main` (or submit a PR) — the live site picks up changes from raw GitHub

2. **Via Link Management Script**:
   ```bash
   node scripts/add-link.js
   ```
   Follow the interactive prompts to add links easily.

3. **Via Issue**:
   - Open a GitHub issue with the link details
   - Include: Title, URL, Description, Category

### Link Discovery Checklist

When searching for missing links, check:
- [ ] Zaal's X/Twitter (@bettercallzaal)
- [ ] Zaal's Farcaster/Warpcast
- [ ] ZAO social media accounts
- [ ] Recent blog posts on Paragraph
- [ ] GitHub repositories
- [ ] Partner project pages
- [ ] Community Discord/Telegram announcements

## Support

For issues or questions, reach out to the ZAO community.

## Changelog

> **Current canonical totals:** 145 links across 9 categories and 44 ecosystem brands. Numbers in older entries below are historical (e.g. the original "126 links / 8 categories") and are kept as a record, not current counts.

### 1.2.0 - Strategy D Canonical Rebuild (2026-05-07)

**Major Features**
- Two-audience route architecture: `/community` and `/ecosystem`
- Extended Link interface with audience filtering, featured flag, addedDate, status, and tags fields
- Merged 87 URLs from BetterCallZaal nexus.html into canonical ZAONEXUS data
- Reorganized 8 main categories with ecosystem-first naming (The ZAO, ZAO OS, ZAO Festivals, ZAO Stock, Community Projects, BetterCallZaal, Ecosystem & Tokens, Artists & Sub-brands)
- Added top navigation bar with route switching
- Audience-aware search and filtering
- All 200+ links tagged by audience (community/ecosystem/both)

**Data Expansion**
- Existing 126 links → merged 200+ unique URLs
- Community audience: 45 links (member tools, governance, internal)
- Ecosystem audience: 90 links (brands, projects, artists)
- Both audience: 65+ links (core ZAO, socials, documentation)

**Next Steps (v1.3+)**
- What's New badges (via addedDate field)
- Health status indicators (via status field)
- Tag-based filtering (via tags field)
- Featured link pinning (via featured field)
- Separate bettercallzaal.com/nexus.html → nexus.thezao.com/ecosystem redirect flow

**Research Reference**
- Per research/community/624-nexus-portal-canon-may7/ Strategy D
- Deduped case-insensitive URLs, added missing ecosystem brands
- Preserved all existing ZAONEXUS data integrity

### 1.1.0 - Initial Release

- 5 main categories with subcategories
- Real-time search across 126 links
- Dark/light mode toggle
- Responsive design for all devices
- Quick jump navigation
- Copy, share to X, share to Farcaster buttons
