'use client';

import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { brands, type BrandTier } from '../data/brands';

const AMBER = '#f5a623';
const TEXT  = '#e4e2dd';
const MUTED = 'rgba(228,226,221,0.45)';

const TIER_STYLE: Record<BrandTier, { border: string; bg: string; size: number }> = {
  umbrella:     { border: 'rgba(245,166,35,0.5)',  bg: 'rgba(245,166,35,0.1)',  size: 15 },
  organization: { border: 'rgba(245,166,35,0.3)',  bg: 'rgba(245,166,35,0.06)', size: 14 },
  project:      { border: 'rgba(245,166,35,0.18)', bg: 'rgba(245,166,35,0.04)', size: 13 },
  'sub-brand':  { border: 'rgba(245,166,35,0.12)', bg: 'rgba(245,166,35,0.02)', size: 12 },
};

const TIER_LABELS: Record<BrandTier, string> = {
  umbrella: 'Umbrella', organization: 'Organization', project: 'Project', 'sub-brand': 'Sub-brand',
};

function getChildren(slug?: string) {
  return slug ? brands.filter(b => b.parent === slug) : brands.filter(b => !b.parent);
}

function OrgNode({ slug, name, tier }: { slug: string; name: string; tier: BrandTier }) {
  const [open, setOpen] = useState(tier === 'umbrella' || tier === 'organization');
  const children = getChildren(slug);
  const ts = TIER_STYLE[tier];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link
        href={`/ecosystem/${slug}`}
        style={{
          padding: '8px 14px', borderRadius: 10, marginBottom: 10,
          border: `1px solid ${ts.border}`,
          backgroundColor: ts.bg,
          textAlign: 'center', textDecoration: 'none',
          transition: 'all 0.15s',
          minWidth: 90,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = AMBER;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = ts.border;
        }}
      >
        <div style={{ fontWeight: 700, fontSize: ts.size, color: TEXT, whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontSize: 10, color: AMBER, opacity: 0.65, marginTop: 2, fontWeight: 600 }}>
          {TIER_LABELS[tier]}
        </div>
      </Link>

      {children.length > 0 && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${name} children`}
            aria-expanded={open}
            style={{
              marginBottom: 8, padding: '2px 6px', borderRadius: 6,
              border: 'none', background: 'none', cursor: 'pointer',
              color: MUTED, display: 'flex', alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {open && (
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: 16, backgroundColor: 'rgba(245,166,35,0.18)', transform: 'translateY(-100%)' }} />
              <div style={{ display: 'flex', gap: 20, paddingTop: 18, paddingLeft: 8, paddingRight: 8 }}>
                {children.map(child => (
                  <div key={child.slug} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: 0, left: '50%', width: 1, height: 18, backgroundColor: 'rgba(245,166,35,0.18)', transform: 'translateX(-50%) translateY(-100%)' }} />
                    <OrgNode slug={child.slug} name={child.name} tier={child.tier} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function EcosystemOrgChart() {
  const [open, setOpen] = useState(true);
  const roots = getChildren(undefined);

  return (
    <div style={{
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      backgroundColor: 'rgba(255,255,255,0.03)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: '-0.01em' }}>Ecosystem Structure</p>
          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>Organization hierarchy</p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            border: 'none', backgroundColor: 'rgba(245,166,35,0.1)',
            color: AMBER, cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(245,166,35,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(245,166,35,0.1)')}
        >
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {open ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {open && (
        <div style={{ overflowX: 'auto', padding: '24px 24px 20px' }}>
          <div style={{ display: 'flex', gap: 32, minWidth: 'max-content' }}>
            {roots.map(r => (
              <OrgNode key={r.slug} slug={r.slug} name={r.name} tier={r.tier} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
