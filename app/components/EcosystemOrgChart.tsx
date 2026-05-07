'use client';

import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { brands, type BrandTier } from '../data/brands';

const TIER_LABELS: Record<BrandTier, string> = {
  umbrella: 'Umbrella',
  organization: 'Organization',
  project: 'Project',
  'sub-brand': 'Sub-brand',
};

const TIER_COLORS: Record<BrandTier, { bg: string; border: string }> = {
  umbrella: {
    bg: 'rgba(245, 166, 35, 0.15)',
    border: 'rgba(245, 166, 35, 0.4)',
  },
  organization: {
    bg: 'rgba(245, 166, 35, 0.12)',
    border: 'rgba(245, 166, 35, 0.3)',
  },
  project: {
    bg: 'rgba(245, 166, 35, 0.08)',
    border: 'rgba(245, 166, 35, 0.2)',
  },
  'sub-brand': {
    bg: 'rgba(245, 166, 35, 0.04)',
    border: 'rgba(245, 166, 35, 0.15)',
  },
};

function getChildren(parentSlug: string | undefined) {
  if (!parentSlug) {
    return brands.filter(b => !b.parent);
  }
  return brands.filter(b => b.parent === parentSlug);
}

interface NodeProps {
  slug: string;
  name: string;
  tier: BrandTier;
  hasChildren: boolean;
}

function OrgNode({ slug, name, tier, hasChildren }: NodeProps) {
  const [isExpanded, setIsExpanded] = useState(tier === 'umbrella' || tier === 'organization');
  const children = getChildren(slug);

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <Link
        href={`/ecosystem/${slug}`}
        className="group relative px-4 py-2 rounded-lg border-2 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer mb-4"
        style={{
          backgroundColor: TIER_COLORS[tier].bg,
          borderColor: TIER_COLORS[tier].border,
        }}
      >
        <div className="font-semibold text-sm">{name}</div>
        <div className="text-xs opacity-60">{TIER_LABELS[tier]}</div>
      </Link>

      {/* Children */}
      {hasChildren && children.length > 0 && (
        <>
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-2 p-1 opacity-60 hover:opacity-100 transition-opacity"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {isExpanded && children.length > 0 && (
            <div className="relative">
              {/* Connector line */}
              <div
                className="absolute top-0 left-1/2 w-0.5 h-4 -translate-x-1/2 -translate-y-full"
                style={{ backgroundColor: 'rgba(245, 166, 35, 0.2)' }}
              />

              {/* Children container */}
              <div className="flex gap-8 pt-6 px-4">
                {children.map(child => (
                  <div key={child.slug} className="relative flex flex-col items-center">
                    {/* Horizontal connector */}
                    <div
                      className="absolute top-0 left-1/2 h-4 w-12 border-t border-l"
                      style={{
                        borderColor: 'rgba(245, 166, 35, 0.2)',
                        transform: 'translateX(-50%)',
                      }}
                    />
                    <div className="pt-4">
                      <OrgNode
                        slug={child.slug}
                        name={child.name}
                        tier={child.tier}
                        hasChildren={getChildren(child.slug).length > 0}
                      />
                    </div>
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
  const [isExpanded, setIsExpanded] = useState(true);

  const umbrellas = getChildren(undefined);

  return (
    <div className="mb-12 p-6 rounded-lg border-2" style={{ borderColor: 'rgba(245, 166, 35, 0.2)' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Ecosystem Structure</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all opacity-75 hover:opacity-100"
          style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)' }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 min-w-max px-4">
            {umbrellas.map(umbrella => (
              <div key={umbrella.slug} className="flex flex-col items-center">
                <OrgNode
                  slug={umbrella.slug}
                  name={umbrella.name}
                  tier={umbrella.tier}
                  hasChildren={getChildren(umbrella.slug).length > 0}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
