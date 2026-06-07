import './globals.css'
import type { Metadata, Viewport } from 'next'
import MiniAppProvider from './components/MiniAppProvider'

const SITE_URL = 'https://nexus.thezao.com'
const SITE_NAME = 'ZAO NEXUS'
const SITE_DESCRIPTION =
  'The central hub for all ZAO links, projects, brands, and community resources.'

export const viewport: Viewport = {
  themeColor: '#111820',
  // Let content extend into the safe areas so our env(safe-area-inset-*)
  // padding can position it correctly in the Mini App webview.
  viewportFit: 'cover',
}

// Farcaster Mini App embed — lets the Nexus launch in-feed on Farcaster.
// `fc:miniapp` is the current key; `fc:frame` is kept for back-compat.
const miniappEmbed = JSON.stringify({
  version: '1',
  imageUrl: `${SITE_URL}/opengraph-image`,
  button: {
    title: 'Open ZAO Nexus',
    action: {
      type: 'launch_miniapp',
      name: SITE_NAME,
      url: SITE_URL,
      splashImageUrl: `${SITE_URL}/icon.svg`,
      splashBackgroundColor: '#111820',
    },
  },
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Links Hub`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ['ZAO', 'ZAO NEXUS', 'ZABAL', 'WaveWarZ', 'ZAO OS', 'ZAO Festivals', 'web3', 'onchain', 'community'],
  authors: [{ name: 'BetterCallZaal' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Links Hub`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Links Hub`,
    description: SITE_DESCRIPTION,
    creator: '@thezao',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    'fc:miniapp': miniappEmbed,
    'fc:frame': miniappEmbed,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'The ZAO',
        url: 'https://thezao.com',
        description: SITE_DESCRIPTION,
        sameAs: [
          'https://thezao.com',
          'https://zaoos.com',
          'https://x.com/thezao',
          'https://warpcast.com/~/channel/zao',
          'https://github.com/bettercallzaal',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MiniAppProvider>{children}</MiniAppProvider>
      </body>
    </html>
  )
}
