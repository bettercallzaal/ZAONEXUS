'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search, ChevronDown, Moon, Sun, Maximize2, Minimize2,
  Copy, Check, ExternalLink, X, Star, Sparkles, Archive,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { linksData, fetchLinksData, type MainCategory } from './data/links';
import { useMiniApp } from './components/MiniAppProvider';

type Audience = 'community' | 'ecosystem' | 'both';

function filterByAudience(data: MainCategory[], audience: Audience): MainCategory[] {
  return data
    .map(cat => ({
      ...cat,
      subcategories: cat.subcategories
        .map(sub => ({
          ...sub,
          links: sub.links.filter(
            l => !l.audience || l.audience === audience || l.audience === 'both'
          ),
        }))
        .filter(sub => sub.links.length > 0),
    }))
    .filter(cat => cat.subcategories.length > 0);
}

export default function Home({ audience = 'community' }: { audience?: 'community' | 'ecosystem' }) {
  const pathname = usePathname();
  const currentAudience: Audience = pathname === '/ecosystem' ? 'ecosystem' : 'community';

  const [searchQuery, setSearchQuery]   = useState('');
  const [lightMode, setLightMode]       = useState(false); // false = dark (default)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [copied, setCopied]             = useState<string | null>(null);
  const [linkData, setLinkData]         = useState<MainCategory[]>(linksData);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const { isMiniApp, user, composeCast, addMiniApp } = useMiniApp();

  // Sync the latest links from raw GitHub at runtime (no redeploy needed to
  // edit links). Bundled data renders immediately; the fetch silently falls
  // back to it on any failure.
  useEffect(() => {
    let active = true;
    fetchLinksData().then(d => { if (active) setLinkData(d); });
    return () => { active = false; };
  }, []);

  // Keyboard shortcuts: "/" focuses search, Esc clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && el === searchRef.current) {
        setSearchQuery('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const allData = useMemo(() => filterByAudience(linkData, currentAudience), [linkData, currentAudience]);

  const totalLinks = useMemo(
    () => allData.reduce((t, c) => t + c.subcategories.reduce((s, sub) => s + sub.links.length, 0), 0),
    [allData]
  );
  const totalCats = allData.length;
  const totalSubs = useMemo(() => allData.reduce((t, c) => t + c.subcategories.length, 0), [allData]);

  // Flat view of the current audience's links (for featured / what's new / tags).
  const allLinks = useMemo(() => {
    const out: { title: string; url: string; description: string; tags?: string[]; featured?: boolean; addedDate?: string }[] = [];
    allData.forEach(c => c.subcategories.forEach(s => s.links.forEach(l => out.push(l))));
    return out;
  }, [allData]);

  const featuredLinks = useMemo(() => allLinks.filter(l => l.featured), [allLinks]);

  const recentLinks = useMemo(
    () => allLinks
      .filter(l => l.addedDate)
      .sort((a, b) => (b.addedDate as string).localeCompare(a.addedDate as string))
      .slice(0, 8),
    [allLinks]
  );

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    allLinks.forEach(l => l.tags?.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 18).map(e => e[0]);
  }, [allLinks]);

  const isRecent = (d?: string) => {
    if (!d) return false;
    const t = Date.parse(d);
    return !isNaN(t) && Date.now() - t < 45 * 86400000;
  };

  const toggleTag = (t: string) =>
    setSelectedTags(p => { const n = new Set(p); n.has(t) ? n.delete(t) : n.add(t); return n; });

  const hasFilter = searchQuery.trim() !== '' || selectedTags.size > 0;

  const filtered = useMemo(() => {
    if (!hasFilter) return allData;
    const q = searchQuery.trim().toLowerCase();
    return allData
      .map(cat => ({
        ...cat,
        subcategories: cat.subcategories
          .map(sub => ({
            ...sub,
            links: sub.links.filter(l => {
              const matchesSearch = !q ||
                l.title.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q) ||
                l.url.toLowerCase().includes(q);
              const matchesTags = selectedTags.size === 0 ||
                (l.tags ? l.tags.some(t => selectedTags.has(t)) : false);
              return matchesSearch && matchesTags;
            }),
          }))
          .filter(sub => sub.links.length > 0),
      }))
      .filter(cat => cat.subcategories.length > 0);
  }, [searchQuery, selectedTags, allData, hasFilter]);

  useEffect(() => {
    if (!hasFilter) return;
    setExpandedCats(new Set(filtered.map(c => c.mainCategory)));
    const subs = new Set<string>();
    filtered.forEach(c => c.subcategories.forEach(s => subs.add(`${c.mainCategory}::${s.subTitle}`)));
    setExpandedSubs(subs);
  }, [hasFilter, filtered]);

  const toggleCat = (name: string) =>
    setExpandedCats(p => { const n = new Set(p); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const toggleSub = (key: string) =>
    setExpandedSubs(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const expandAll = () => {
    const data = searchQuery.trim() ? filtered : allData;
    setExpandedCats(new Set(data.map(c => c.mainCategory)));
    const subs: string[] = [];
    data.forEach(c => c.subcategories.forEach(s => subs.push(`${c.mainCategory}::${s.subTitle}`)));
    setExpandedSubs(new Set(subs));
  };

  const collapseAll = () => { setExpandedCats(new Set()); setExpandedSubs(new Set()); };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const copyURL = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const shareX = (url: string, title: string) =>
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${title}" on ZAO NEXUS: ${url}`)}`,
      '_blank', 'width=550,height=420'
    );

  const shareFarcaster = (url: string, title: string) =>
    composeCast(`"${title}" on ZAO NEXUS`, url);

  const filteredCount = filtered.reduce(
    (t, c) => t + c.subcategories.reduce((s, sub) => s + sub.links.length, 0), 0
  );

  /* ─── colour tokens that flip with lightMode ─── */
  const bg        = lightMode ? '#f0edc8' : '#111820';
  const surface   = lightMode ? 'rgba(0,0,0,0.05)'  : 'rgba(255,255,255,0.045)';
  const surfaceHov= lightMode ? 'rgba(0,0,0,0.08)'  : 'rgba(255,255,255,0.075)';
  const navBg     = lightMode ? 'rgba(240,237,200,0.88)' : 'rgba(17,24,32,0.88)';
  const text      = lightMode ? '#141e27' : '#e0ddaa';
  const muted     = lightMode ? 'rgba(20,30,39,0.5)' : 'rgba(224,221,170,0.5)';
  const faint     = lightMode ? 'rgba(20,30,39,0.28)' : 'rgba(224,221,170,0.28)';
  const border    = lightMode ? 'rgba(20,30,39,0.08)' : 'rgba(255,255,255,0.07)';
  const borderHov = lightMode ? 'rgba(20,30,39,0.18)' : 'rgba(255,255,255,0.14)';
  const rowHov    = lightMode ? 'rgba(0,0,0,0.055)'  : 'rgba(255,255,255,0.055)';
  const accent    = '#f5a623';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bg, color: text, transition: 'background 0.25s, color 0.25s' }}>

      {/* ── NAV ── */}
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          backgroundColor: navBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em', color: text }}>
              ZAO NEXUS
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              backgroundColor: surface, color: muted,
            }}>
              {totalLinks}
            </span>
            {user?.username && (
              <span style={{ fontSize: 12, color: muted, whiteSpace: 'nowrap' }}>
                gm, @{user.username}
              </span>
            )}
          </div>

          {/* Right: nav tabs + theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {([
              { href: '/community', label: 'Community', active: currentAudience === 'community' },
              { href: '/ecosystem', label: 'Ecosystem', active: currentAudience === 'ecosystem' },
            ] as const).map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: tab.active ? 600 : 400,
                  color: tab.active ? bg : text,
                  backgroundColor: tab.active ? text : 'transparent',
                  opacity: !tab.active ? 0.55 : 1,
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {tab.label}
              </Link>
            ))}
            {isMiniApp && (
              <button
                onClick={() => addMiniApp()}
                title="Add ZAO Nexus to your Farcaster apps"
                style={{
                  marginLeft: 4, padding: '5px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                  border: `1px solid ${border}`, background: 'transparent', color: text,
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = surface; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                + Add
              </button>
            )}
            <button
              onClick={() => setLightMode(l => !l)}
              title={lightMode ? 'Switch to dark' : 'Switch to light'}
              aria-label={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
              style={{
                marginLeft: 6, padding: 6, borderRadius: 7, border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: text, opacity: 0.42,
                display: 'flex', alignItems: 'center',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.42')}
            >
              {lightMode ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* ── STICKY TOOLBAR ── */}
        <div style={{
          position: 'sticky', top: 52, zIndex: 40,
          backgroundColor: bg,
          paddingTop: 16, paddingBottom: 12,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <Search
              size={15}
              style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: text, opacity: 0.32, pointerEvents: 'none',
              }}
            />
            <input
              ref={searchRef}
              type="text"
              aria-label="Search links"
              placeholder="Search links, tools, resources…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 38px',
                borderRadius: 12,
                border: `1px solid ${border}`,
                backgroundColor: surface,
                color: text,
                fontSize: 14,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = borderHov)}
              onBlur={e => (e.currentTarget.style.borderColor = border)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: text, opacity: 0.35, padding: 2,
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick-jump + actions row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {allData.map(cat => {
                const catCount = cat.subcategories.reduce((s, sub) => s + sub.links.length, 0);
                return (
                <button
                  key={cat.mainCategory}
                  onClick={() => scrollTo(cat.mainCategory.toLowerCase().replace(/\s+/g, '-'))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${border}`,
                    background: 'transparent', color: text,
                    opacity: 0.55, cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = text;
                    e.currentTarget.style.color = bg;
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0.55';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = text;
                    e.currentTarget.style.borderColor = border;
                  }}
                >
                  {cat.mainCategory}
                  <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.6 }}>{catCount}</span>
                </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { icon: <Maximize2 size={11} />, label: 'Expand', fn: expandAll },
                { icon: <Minimize2 size={11} />, label: 'Collapse', fn: collapseAll },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.fn}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${border}`,
                    background: 'transparent', color: text,
                    opacity: 0.5, cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.backgroundColor = text;
                    e.currentTarget.style.color = bg;
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '0.5';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = text;
                    e.currentTarget.style.borderColor = border;
                  }}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filter chips */}
          {topTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: faint, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 }}>
                Tags
              </span>
              {topTags.map(t => {
                const on = selectedTags.has(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    style={{
                      padding: '3px 9px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${on ? accent : border}`,
                      background: on ? accent : 'transparent',
                      color: on ? '#0a1628' : text,
                      opacity: on ? 1 : 0.6, cursor: 'pointer', transition: 'all 0.12s',
                    }}
                  >
                    {t}
                  </button>
                );
              })}
              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  style={{
                    padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                    border: 'none', background: 'transparent', color: accent, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 3,
                  }}
                >
                  <X size={11} /> clear
                </button>
              )}
            </div>
          )}

          {hasFilter && (
            <p style={{ marginTop: 8, fontSize: 12, color: faint }}>
              {filteredCount} result{filteredCount !== 1 ? 's' : ''}
              {searchQuery.trim() && <> for &ldquo;{searchQuery}&rdquo;</>}
              {selectedTags.size > 0 && <> · tagged {Array.from(selectedTags).join(', ')}</>}
            </p>
          )}
        </div>

        {/* ── START HERE (featured) ── */}
        {!hasFilter && featuredLinks.length > 0 && (
          <section style={{ marginTop: 8, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={13} style={{ color: accent }} fill={accent} />
                <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: text, letterSpacing: '-0.01em' }}>Start Here</h2>
              </div>
              <span style={{ fontSize: 12, color: muted }}>New to ZAO? These are the essentials.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
              {featuredLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', padding: '11px 13px', borderRadius: 12,
                    border: `1px solid ${border}`, background: surface,
                    textDecoration: 'none', transition: 'border-color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = borderHov; e.currentTarget.style.background = surfaceHov; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = surface; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 600, color: text, marginBottom: 3 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                    <ExternalLink size={10} style={{ opacity: 0.3, flexShrink: 0 }} />
                  </div>
                  {l.description && (
                    <p style={{ margin: 0, fontSize: 12, color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── WHAT'S NEW ── */}
        {!hasFilter && recentLinks.length > 0 && (
          <section style={{ marginTop: 8, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Sparkles size={13} style={{ color: accent }} />
              <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: text, letterSpacing: '-0.01em' }}>What&rsquo;s New</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 8 }}>
              {recentLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', padding: '11px 13px', borderRadius: 12,
                    border: `1px solid ${border}`, background: surface,
                    textDecoration: 'none', transition: 'border-color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = borderHov; e.currentTarget.style.background = surfaceHov; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = surface; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 600, color: text, marginBottom: 3 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                    {isRecent(l.addedDate) && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#0a1628', backgroundColor: accent, padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em', flexShrink: 0 }}>NEW</span>
                    )}
                  </div>
                  {l.description && (
                    <p style={{ margin: 0, fontSize: 12, color: muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── CATEGORY LIST ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          {filtered.map((cat, idx) => {
            const catCount   = cat.subcategories.reduce((t, s) => t + s.links.length, 0);
            const isExpanded = expandedCats.has(cat.mainCategory);
            const catId      = cat.mainCategory.toLowerCase().replace(/\s+/g, '-');

            return (
              <div
                key={cat.mainCategory}
                id={catId}
                className="fade-up scroll-mt-20"
                style={{
                  borderRadius: 16,
                  border: `1px solid ${border}`,
                  backgroundColor: surface,
                  overflow: 'hidden',
                  animationDelay: `${idx * 0.04}s`,
                }}
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCat(cat.mainCategory)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    padding: '14px 18px', gap: 12,
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {/* Left accent bar */}
                  <div style={{
                    width: 3, height: 18, borderRadius: 2, flexShrink: 0,
                    backgroundColor: text, opacity: isExpanded ? 1 : 0.3,
                    transition: 'opacity 0.2s',
                  }} />
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 15, color: text, letterSpacing: '-0.02em' }}>
                    {cat.mainCategory}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: faint }}>
                    {catCount}
                  </span>
                  <ChevronDown
                    size={15}
                    style={{
                      color: text, opacity: 0.35, flexShrink: 0,
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1)',
                    }}
                  />
                </button>

                {/* Category body */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${border}` }}>
                    {cat.subcategories.map((sub, sIdx) => {
                      const subKey     = `${cat.mainCategory}::${sub.subTitle}`;
                      const subExpanded= expandedSubs.has(subKey);

                      return (
                        <div
                          key={subKey}
                          style={sIdx > 0 ? { borderTop: `1px solid ${border}` } : {}}
                        >
                          {/* Subcategory header */}
                          <button
                            onClick={() => toggleSub(subKey)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center',
                              padding: '10px 18px 10px 33px', gap: 8,
                              background: 'none', border: 'none', cursor: 'pointer',
                              textAlign: 'left', transition: 'background 0.12s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: text }}>
                              {sub.subTitle}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: faint }}>
                              {sub.links.length}
                            </span>
                            <ChevronDown
                              size={12}
                              style={{
                                color: text, opacity: 0.3, flexShrink: 0,
                                transform: subExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.18s ease',
                              }}
                            />
                          </button>

                          {/* Link rows */}
                          {subExpanded && (
                            <div style={{ padding: '0 8px 8px 8px' }}>
                              {sub.links.map((link, lIdx) => (
                                <div
                                  key={lIdx}
                                  className="group/row"
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 12px',
                                    borderRadius: 10,
                                    transition: 'background 0.1s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  {/* Index */}
                                  <span style={{
                                    width: 20, textAlign: 'right', flexShrink: 0,
                                    fontSize: 12, color: faint, userSelect: 'none',
                                  }}>
                                    {lIdx + 1}
                                  </span>

                                  {/* Main link */}
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}
                                  >
                                    <div style={{
                                      fontWeight: 600, fontSize: 14, color: text,
                                      display: 'flex', alignItems: 'center', gap: 5,
                                      marginBottom: link.description ? 2 : 0,
                                    }}>
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {link.title}
                                      </span>
                                      {link.featured && (
                                        <Star size={11} fill={accent} style={{ color: accent, flexShrink: 0 }} />
                                      )}
                                      {isRecent(link.addedDate) && (
                                        <span style={{ fontSize: 9, fontWeight: 700, color: '#0a1628', backgroundColor: accent, padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em', flexShrink: 0 }}>NEW</span>
                                      )}
                                      {link.status === 'down' && (
                                        <span title="This link was unreachable in the latest health check" style={{ fontSize: 9, fontWeight: 700, color: '#fff', backgroundColor: '#c0392b', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em', flexShrink: 0 }}>⚠ DOWN</span>
                                      )}
                                      {link.status === 'paused' && (
                                        <span title="This project is paused" style={{ fontSize: 9, fontWeight: 700, color: muted, backgroundColor: surface, padding: '1px 5px', borderRadius: 4, letterSpacing: '0.04em', flexShrink: 0 }}>PAUSED</span>
                                      )}
                                      <ExternalLink size={11} style={{ opacity: 0.25, flexShrink: 0 }} />
                                    </div>
                                    {link.description && (
                                      <p style={{
                                        margin: 0, fontSize: 12, color: muted,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                      }}>
                                        {link.description}
                                      </p>
                                    )}
                                  </a>

                                  {/* Actions (hidden until row hover via opacity trick) */}
                                  <div
                                    className="row-actions"
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 1,
                                      flexShrink: 0, opacity: 0,
                                      transition: 'opacity 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                                  >
                                    {link.status === 'down' && (
                                      <a
                                        href={`https://web.archive.org/web/${link.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Link is down — view an archived snapshot (Wayback Machine)"
                                        aria-label="View archived snapshot"
                                        style={{
                                          padding: '5px 6px', borderRadius: 7, color: text,
                                          display: 'flex', textDecoration: 'none', transition: 'background 0.1s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                      >
                                        <Archive size={13} />
                                      </a>
                                    )}
                                    <button
                                      onClick={() => copyURL(link.url)}
                                      title="Copy URL"
                                      aria-label="Copy link URL"
                                      style={{
                                        padding: '5px 6px', borderRadius: 7, border: 'none',
                                        background: copied === link.url ? rowHov : 'transparent',
                                        color: text, cursor: 'pointer', display: 'flex',
                                        transition: 'background 0.1s',
                                      }}
                                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                                      onMouseLeave={e => {
                                        if (copied !== link.url) e.currentTarget.style.backgroundColor = 'transparent';
                                      }}
                                    >
                                      {copied === link.url ? <Check size={13} /> : <Copy size={13} />}
                                    </button>
                                    <button
                                      onClick={() => shareX(link.url, link.title)}
                                      title="Share to X"
                                      aria-label="Share on X"
                                      style={{
                                        padding: '5px 6px', borderRadius: 7, border: 'none',
                                        background: 'transparent', color: text,
                                        cursor: 'pointer', display: 'flex',
                                      }}
                                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => shareFarcaster(link.url, link.title)}
                                      title="Share to Farcaster"
                                      aria-label="Share on Farcaster"
                                      style={{
                                        padding: '5px 6px', borderRadius: 7, border: 'none',
                                        background: 'transparent', color: text,
                                        cursor: 'pointer', display: 'flex',
                                      }}
                                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = rowHov)}
                                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                      <svg width="13" height="13" viewBox="0 0 1000 1000" fill="currentColor">
                                        <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
                                        <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                                        <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"/>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: faint }}>
            <p style={{ fontSize: 17, fontWeight: 600, margin: '0 0 6px' }}>
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
            <p style={{ fontSize: 13, margin: 0 }}>Try a different search term</p>
          </div>
        )}

        {/* ── FOOTER STATS ── */}
        <div style={{
          marginTop: 48,
          padding: '20px 0',
          borderTop: `1px solid ${border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: 0,
        }}>
          {[
            { n: totalLinks, label: 'Links' },
            { n: totalSubs,  label: 'Topics' },
            { n: totalCats,  label: 'Categories' },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1, textAlign: 'center', padding: '8px 0',
                borderLeft: i > 0 ? `1px solid ${border}` : 'none',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: text, letterSpacing: '-0.03em' }}>
                {s.n}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 500, color: faint,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {/* ── SUGGEST A LINK ── */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a
            href={
              'https://github.com/bettercallzaal/ZAONEXUS/issues/new?title=' +
              encodeURIComponent('Add link: ') +
              '&body=' +
              encodeURIComponent(
                '**Title:**\n**URL:**\n**Category:** (The ZAO / ZAO OS / Agents & Bots / ZAO Festivals / Community Projects / ZAO Members / Ecosystem & Tokens / ZAO Onchain / ZAO Stock)\n**Description:**\n**Audience:** (community / ecosystem / both)\n'
              ) +
              '&labels=' + encodeURIComponent('link-suggestion')
            }
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              border: `1px solid ${border}`, background: surface, color: text,
              textDecoration: 'none', transition: 'border-color 0.12s, background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = borderHov; e.currentTarget.style.background = surfaceHov; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = surface; }}
          >
            + Suggest a link
          </a>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: faint, marginTop: 16 }}>
          ZAO NEXUS © {new Date().getFullYear()} · Built for the ZAO Community
          <span style={{ opacity: 0.6 }}> · press “/” to search</span>
        </p>
      </div>

      {/* Global hover reveal for row-actions */}
      <style>{`
        .group\\/row:hover .row-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
