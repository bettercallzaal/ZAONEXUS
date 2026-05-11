'use client';

import { useState, useMemo, Suspense } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { brands, type BrandStage } from '../data/brands';
import EcosystemOrgChart from '../components/EcosystemOrgChart';

const BG    = '#0c1420';
const CARD  = 'rgba(255,255,255,0.04)';
const HOVER = 'rgba(255,255,255,0.07)';
const BORD  = 'rgba(255,255,255,0.07)';
const TEXT  = '#e4e2dd';
const MUTED = 'rgba(228,226,221,0.5)';
const FAINT = 'rgba(228,226,221,0.28)';
const AMBER = '#f5a623';

const STAGES: BrandStage[] = ['active', 'incubating', 'zabal-track', 'graduated', 'paused'];
const STAGE_LABELS: Record<BrandStage, string> = {
  active: 'Active', incubating: 'Incubating', 'zabal-track': 'ZABAL Track',
  graduated: 'Graduated', paused: 'Paused',
};
const STAGE_BADGE: Record<BrandStage, { bg: string; color: string }> = {
  active:       { bg: AMBER,                       color: BG },
  incubating:   { bg: 'rgba(245,166,35,0.15)',     color: AMBER },
  'zabal-track':{ bg: 'rgba(245,166,35,0.15)',     color: AMBER },
  graduated:    { bg: 'rgba(245,166,35,0.15)',     color: AMBER },
  paused:       { bg: 'rgba(228,226,221,0.08)',    color: MUTED },
};

const PILLARS = [
  { title: 'Artist Org',       desc: 'Support independent creators' },
  { title: 'Autonomous Org',   desc: 'AI agents for operations' },
  { title: 'Operating System', desc: 'ZAO OS as the substrate' },
  { title: 'Open Source',      desc: 'Community-built tools' },
];

function EcosystemContent() {
  const [search, setSearch]       = useState('');
  const [stages, setStages]       = useState<Set<BrandStage>>(new Set());

  const toggleStage = (s: BrandStage) =>
    setStages(p => { const n = new Set(p); n.has(s) ? n.delete(s) : n.add(s); return n; });

  const filteredBrands = useMemo(() => {
    let r = brands;
    if (stages.size > 0) r = r.filter(b => stages.has(b.stage));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.links.some(l => l.title.toLowerCase().includes(q))
      );
    }
    return r;
  }, [search, stages]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, color: TEXT }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(12,20,32,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${BORD}`,
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em' }}>ZAO NEXUS</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, backgroundColor: CARD, color: MUTED }}>
              {brands.length} brands
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link
              href="/community"
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 400,
                color: TEXT, opacity: 0.48, textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.48')}
            >
              Community
            </Link>
            <div style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              backgroundColor: AMBER, color: BG,
            }}>
              Ecosystem
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── HERO ── */}
        <section style={{ paddingTop: 56, paddingBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: AMBER, opacity: 0.75, textTransform: 'uppercase', marginBottom: 16 }}>
            ZABAL Ecosystem
          </p>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, color: AMBER, margin: '0 0 20px' }}>
            Building Digital<br />Creator Infrastructure
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: MUTED, maxWidth: 600, margin: '0 0 40px' }}>
            Building ecosystem primitives so any digital creator can bring their brand and scale it.
            Founded Jan 2024, progressively decentralizing through community governance.
          </p>

          {/* 4 Pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 10 }}>
            {PILLARS.map(p => (
              <div
                key={p.title}
                style={{
                  padding: '16px 18px',
                  borderRadius: 14,
                  backgroundColor: CARD,
                  border: `1px solid rgba(245,166,35,0.12)`,
                  borderLeft: `3px solid rgba(245,166,35,0.5)`,
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 13, color: AMBER, margin: '0 0 6px' }}>{p.title}</p>
                <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ORG CHART ── */}
        <section style={{ marginBottom: 56 }}>
          <EcosystemOrgChart />
        </section>

        {/* ── BRAND DIRECTORY ── */}
        <section>
          {/* Header + search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', margin: 0 }}>All Brands</h2>
            <span style={{ fontSize: 13, color: FAINT }}>{filteredBrands.length} of {brands.length}</span>
          </div>

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: TEXT, opacity: 0.3, pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search brands, projects, links…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 36px 10px 38px', borderRadius: 12,
                border: `1px solid ${BORD}`, backgroundColor: CARD, color: TEXT,
                fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TEXT, opacity: 0.35, display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stage pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
            <button
              onClick={() => setStages(new Set())}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: `1px solid ${stages.size === 0 ? 'transparent' : 'rgba(245,166,35,0.2)'}`,
                backgroundColor: stages.size === 0 ? AMBER : 'transparent',
                color: stages.size === 0 ? BG : TEXT,
                opacity: stages.size === 0 ? 1 : 0.55,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (stages.size !== 0) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { if (stages.size !== 0) e.currentTarget.style.opacity = '0.55'; }}
            >
              All
            </button>
            {STAGES.map(s => {
              const on = stages.has(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleStage(s)}
                  style={{
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: `1px solid ${on ? 'transparent' : 'rgba(245,166,35,0.2)'}`,
                    backgroundColor: on ? AMBER : 'transparent',
                    color: on ? BG : TEXT,
                    opacity: on ? 1 : 0.55,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!on) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { if (!on) e.currentTarget.style.opacity = '0.55'; }}
                >
                  {STAGE_LABELS[s]}
                </button>
              );
            })}
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 12 }}>
            {filteredBrands.map(brand => {
              const badge = STAGE_BADGE[brand.stage];
              return (
                <div
                  key={brand.slug}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${BORD}`,
                    backgroundColor: CARD,
                    display: 'flex', flexDirection: 'column',
                    transition: 'border-color 0.15s, transform 0.15s',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(245,166,35,0.25)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = BORD;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ padding: '18px 18px 14px', flex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15, margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                          {brand.name}
                        </h3>
                        <p style={{ fontSize: 12, color: MUTED, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {brand.tagline}
                        </p>
                      </div>
                      <span style={{
                        flexShrink: 0, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                        backgroundColor: badge.bg, color: badge.color, whiteSpace: 'nowrap',
                      }}>
                        {STAGE_LABELS[brand.stage]}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: 13, color: MUTED, margin: '0 0 12px', lineHeight: 1.55,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {brand.description}
                    </p>

                    {/* Top links */}
                    {brand.links.slice(0, 3).map((l, i) => (
                      <a
                        key={i}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 7,
                          fontSize: 12, color: AMBER, opacity: 0.65, marginBottom: 5,
                          textDecoration: 'none', transition: 'opacity 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: AMBER, flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {l.title}
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div style={{ padding: '10px 18px 14px', borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                    <Link
                      href={`/ecosystem/${brand.slug}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 12, fontWeight: 700, color: AMBER, textDecoration: 'none',
                        transition: 'gap 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
                      onMouseLeave={e => (e.currentTarget.style.gap = '4px')}
                    >
                      View details
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBrands.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: FAINT }}>
              <p style={{ fontSize: 17, fontWeight: 600, margin: '0 0 6px' }}>No brands found</p>
              <p style={{ fontSize: 13, margin: 0 }}>Try adjusting your search or filter</p>
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${BORD}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: FAINT, margin: 0 }}>
            ZAO NEXUS Ecosystem © {new Date().getFullYear()} · {brands.length} brands
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 14, color: MUTED }}>Loading…</span>
      </div>
    }>
      <EcosystemContent />
    </Suspense>
  );
}
