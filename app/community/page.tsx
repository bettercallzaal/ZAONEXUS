import type { Metadata } from 'next';
import Home from '../page';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'ZAO community resources — member tools, governance, calendars, newsletters, and onchain projects across The ZAO, ZABAL, and WaveWarZ.',
  alternates: { canonical: '/community' },
  openGraph: {
    title: 'ZAO NEXUS — Community',
    description:
      'Member-facing ZAO resources: tools, governance, calendars, newsletters, and onchain projects.',
    url: '/community',
  },
};

export default function CommunityPage() {
  return <Home audience="community" />;
}
