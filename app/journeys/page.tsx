import type { Metadata } from 'next';
import Link from 'next/link';
import { journeys } from '../data/journeys';

const BG = '#0c1420';
const CARD = 'rgba(255,255,255,0.04)';
const BORD = 'rgba(255,255,255,0.08)';
const TEXT = '#e4e2dd';
const MUTED = 'rgba(228,226,221,0.55)';
const FAINT = 'rgba(228,226,221,0.3)';
const AMBER = '#f5a623';

export const metadata: Metadata = {
  title: 'Journeys',
  description:
    'The canonical journeys of ZAO builders — milestone timelines of how the ZAO, ZABAL, and WaveWarZ ecosystem was built. Add your own.',
  alternates: { canonical: '/journeys' },
  openGraph: {
    title: 'ZAO NEXUS — Journeys',
    description: 'Milestone timelines of the people building the ZAO ecosystem.',
    url: '/journeys',
  },
};

const ADD_JOURNEY_URL =
  'https://github.com/bettercallzaal/ZAONEXUS/issues/new?title=' +
  encodeURIComponent('Add my journey: ') +
  '&labels=journey&body=' +
  encodeURIComponent(
    '**Name:**\n**Handle (X / Farcaster):**\n**Role / one-line:**\n**Summary:**\n**Links:** (label — url, one per line)\n\n**Milestones** (year — title — short summary, one per line, oldest first):\n- \n- \n',
  );

export default function JourneysPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT }}>
      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORD}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>ZAO NEXUS</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['/community', 'Community'], ['/ecosystem', 'Ecosystem'], ['/journeys', 'Journeys']].map(([href, label]) => (
              <Link key={href} href={href} style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 13,
                color: href === '/journeys' ? BG : TEXT,
                background: href === '/journeys' ? TEXT : 'transparent',
                opacity: href === '/journeys' ? 1 : 0.55, textDecoration: 'none', fontWeight: href === '/journeys' ? 600 : 400,
              }}>{label}</Link>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 20px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em' }}>Journeys</h1>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: MUTED, maxWidth: 560 }}>
              How the ZAO ecosystem got built — milestone timelines from the people building it. This is your canonical story; add yours.
            </p>
          </div>
          <a href={ADD_JOURNEY_URL} target="_blank" rel="noopener noreferrer" style={{
            flexShrink: 0, padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: AMBER, color: BG, textDecoration: 'none',
          }}>+ Add your journey</a>
        </div>

        {journeys.map(j => {
          const shown = [...j.milestones].reverse(); // newest first
          let lastYear = '';
          return (
            <section key={j.slug} style={{ marginBottom: 40 }}>
              {/* Journey header */}
              <div style={{ padding: '16px 18px', borderRadius: 14, border: `1px solid ${BORD}`, background: CARD, marginBottom: 18 }}>
                <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{j.name}</div>
                {j.role && <div style={{ fontSize: 13, color: AMBER, marginTop: 2 }}>{j.role}</div>}
                {j.summary && <p style={{ margin: '8px 0 0', fontSize: 13, color: MUTED }}>{j.summary}</p>}
                {j.links && j.links.length > 0 && (
                  <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
                    {j.links.map(l => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: AMBER, textDecoration: 'none' }}>{l.label} ↗</a>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 11, color: FAINT, marginTop: 10 }}>{j.milestones.length} milestones</div>
              </div>

              {/* Timeline */}
              <div style={{ position: 'relative', paddingLeft: 22 }}>
                <div style={{ position: 'absolute', left: 5, top: 4, bottom: 4, width: 1, background: BORD }} />
                {shown.map((m, i) => {
                  const core = m.importance === 'core';
                  const showYear = m.year !== lastYear;
                  lastYear = m.year;
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                      <div style={{
                        position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: '50%',
                        background: core ? AMBER : BG, border: `2px solid ${core ? AMBER : BORD}`,
                      }} />
                      {showYear && (
                        <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, marginBottom: 6, letterSpacing: '0.02em' }}>{m.year}</div>
                      )}
                      <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{m.title}</div>
                      {m.summary && <p style={{ margin: '3px 0 0', fontSize: 12.5, color: MUTED, lineHeight: 1.5 }}>{m.summary}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
