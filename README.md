# ZAO NEXUS - Links Hub

A modern, responsive links hub for the ZAO community. Built with Next.js, React, TypeScript, and TailwindCSS.

## Features

- 🔍 **Smart Search** - Search across titles, descriptions, and URLs
- 🎨 **Dark/Light Mode** - Toggle between themes
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Modern** - Built with Next.js 14
- 🎯 **Organized** - Hierarchical categories and subcategories
- ✨ **Smooth Animations** - Beautiful fade-in effects

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

Edit `app/data/links.ts` and add your links following the existing structure:

```typescript
{
  mainCategory: "Your Category",
  subcategories: [
    {
      subTitle: "Your Subcategory",
      links: [
        {
          title: "Link Title",
          url: "https://example.com",
          description: "Link description"
        }
      ]
    }
  ]
}
```

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

## Support

For issues or questions, reach out to the ZAO community.
