'use client';

import { useState, useMemo } from 'react';
import { Search, X as XIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { brands, type BrandStage, getBrandsByStage } from '../data/brands';

const STAGES: BrandStage[] = ['active', 'incubating', 'zabal-track', 'graduated', 'paused'];
const STAGE_LABELS: Record<BrandStage, string> = {
  active: 'Active',
  incubating: 'Incubating',
  'zabal-track': 'ZABAL Track',
  graduated: 'Graduated',
  paused: 'Paused'
};

export default function EcosystemPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<Set<BrandStage>>(new Set());

  const toggleStage = (stage: BrandStage) => {
    const newSet = new Set(selectedStages);
    if (newSet.has(stage)) {
      newSet.delete(stage);
    } else {
      newSet.add(stage);
    }
    setSelectedStages(newSet);
  };

  const filteredBrands = useMemo(() => {
    let result = brands;

    // Filter by stage
    if (selectedStages.size > 0) {
      result = result.filter(b => selectedStages.has(b.stage));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.tagline.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.links.some(l => l.title.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery, selectedStages]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#0a1628', color: '#e4e2dd' }}>
      {/* Top Navigation */}
      <nav className="border-b" style={{ borderColor: 'rgba(224, 221, 170, 0.2)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ZAO NEXUS</h1>
          <div className="flex gap-4">
            <Link
              href="/community"
              className="px-4 py-2 rounded-lg transition-all duration-200 opacity-60 hover:opacity-100"
            >
              ZAO Community
            </Link>
            <div className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: '#f5a623', color: '#0a1628' }}>
              ZAO Ecosystem
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#f5a623' }}>
            ZABAL Ecosystem
          </h2>
          <p className="text-lg mb-6 max-w-3xl leading-relaxed opacity-90">
            Building ecosystem primitives so any digital creator can bring their brand and scale it. The ZAO operates as an impact network and incubator under the ZABAL umbrella, alongside BCZ Strategies LLC. Founded Jan 2024, progressively decentralizing through community governance.
          </p>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg border" style={{ borderColor: 'rgba(245, 166, 35, 0.3)', backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
              <h3 className="font-semibold mb-2">Artist Org</h3>
              <p className="text-sm opacity-75">Support independent creators</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: 'rgba(245, 166, 35, 0.3)', backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
              <h3 className="font-semibold mb-2">Autonomous Org</h3>
              <p className="text-sm opacity-75">AI agents for operations</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: 'rgba(245, 166, 35, 0.3)', backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
              <h3 className="font-semibold mb-2">Operating System</h3>
              <p className="text-sm opacity-75">ZAO OS as the substrate</p>
            </div>
            <div className="p-4 rounded-lg border" style={{ borderColor: 'rgba(245, 166, 35, 0.3)', backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
              <h3 className="font-semibold mb-2">Open Source</h3>
              <p className="text-sm opacity-75">Community-built tools</p>
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="mb-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
              <input
                type="text"
                placeholder="Search brands, projects, or links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#0a1628',
                  color: '#e4e2dd',
                  borderColor: '#e4e2dd'
                }}
              />
            </div>
          </div>

          {/* Stage Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStages(new Set())}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedStages.size === 0
                  ? 'font-semibold'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedStages.size === 0 ? '#f5a623' : 'transparent',
                color: selectedStages.size === 0 ? '#0a1628' : '#e4e2dd',
                border: selectedStages.size === 0 ? 'none' : '1px solid rgba(245, 166, 35, 0.3)'
              }}
            >
              All
            </button>
            {STAGES.map(stage => (
              <button
                key={stage}
                onClick={() => toggleStage(stage)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedStages.has(stage)
                    ? 'font-semibold'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedStages.has(stage) ? '#f5a623' : 'transparent',
                  color: selectedStages.has(stage) ? '#0a1628' : '#e4e2dd',
                  border: selectedStages.has(stage) ? 'none' : '1px solid rgba(245, 166, 35, 0.3)'
                }}
              >
                {STAGE_LABELS[stage]}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm opacity-75">
            Showing {filteredBrands.length} of {brands.length} brands
          </div>
        </section>

        {/* Brand Cards Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map(brand => (
              <div
                key={brand.slug}
                className="group rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderColor: 'rgba(245, 166, 35, 0.2)',
                  backgroundColor: 'rgba(245, 166, 35, 0.02)'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{brand.name}</h3>
                    <p className="text-sm opacity-75">{brand.tagline}</p>
                  </div>
                  <div className="ml-2 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap"
                    style={{
                      backgroundColor: brand.stage === 'active' ? '#f5a623' : 'rgba(245, 166, 35, 0.3)',
                      color: brand.stage === 'active' ? '#0a1628' : '#e4e2dd'
                    }}
                  >
                    {STAGE_LABELS[brand.stage]}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 opacity-85 line-clamp-3">{brand.description}</p>

                {/* Top Links */}
                {brand.links.length > 0 && (
                  <div className="mb-4 space-y-1">
                    {brand.links.slice(0, 3).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm opacity-75 hover:opacity-100 transition-opacity truncate"
                        title={link.title}
                      >
                        <span style={{ color: '#f5a623' }}>-</span> {link.title}
                      </a>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/ecosystem/${brand.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2 transition-all"
                  style={{ color: '#f5a623' }}
                >
                  View brand
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg opacity-75">No brands found matching your criteria</p>
              <p className="text-sm mt-2 opacity-60">Try adjusting your search or filter</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t" style={{ borderColor: 'rgba(224, 221, 170, 0.2)' }}>
          <p className="text-sm opacity-75">
            ZAO NEXUS Ecosystem © {new Date().getFullYear()} | Connecting {brands.length} brands in the ZABAL ecosystem
          </p>
        </footer>
      </div>
    </div>
  );
}
