import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description:
    'Explore the ZAO ecosystem — brands, projects, and partner integrations across The ZAO, WaveWarZ, ZABAL, ZAO OS, and ZAO Festivals, with live project data.',
  alternates: { canonical: '/ecosystem' },
  openGraph: {
    title: 'ZAO NEXUS — Ecosystem',
    description:
      'Brands, projects, and partners across the ZAO ecosystem, with live GitHub, Farcaster, and token data.',
    url: '/ecosystem',
  },
};

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
