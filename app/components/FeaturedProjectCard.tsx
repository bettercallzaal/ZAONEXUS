'use client';

import { ArrowRight } from 'lucide-react';

interface FeaturedProjectCardProps {
  name: string;
  tagline: string;
  linkCount: number;
  onClick: () => void;
}

export default function FeaturedProjectCard({
  name,
  tagline,
  linkCount,
  onClick,
}: FeaturedProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="hero-card group relative p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] text-left w-full"
      style={{
        backgroundColor: 'var(--accent-bg)',
        color: 'var(--accent-text)',
      }}
    >
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm opacity-75 mb-3">{tagline}</p>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{linkCount} links</span>
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </button>
  );
}
