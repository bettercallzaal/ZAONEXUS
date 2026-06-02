import Link from 'next/link';
import { ChevronRight, Github, ExternalLink, Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import { brands, getBrandBySlug, getBrandChildren, type BrandStage } from '../../data/brands';
import LiveDataPanel from '../../components/LiveDataPanel';
import { getFarcasterStats, getGithubLastCommit, getTokenHolderCount } from '../../lib/live-data';

const STAGE_LABELS: Record<BrandStage, string> = {
  active: 'Active',
  incubating: 'Incubating',
  'zabal-track': 'ZABAL Track',
  graduated: 'Graduated',
  paused: 'Paused',
};

const STAGE_STYLE: Record<BrandStage, { bg: string; color: string }> = {
  active: { bg: '#f5a623', color: '#0a1628' },
  incubating: { bg: 'rgba(245,166,35,0.15)', color: '#f5a623' },
  'zabal-track': { bg: 'rgba(245,166,35,0.15)', color: '#f5a623' },
  graduated: { bg: 'rgba(245,166,35,0.15)', color: '#f5a623' },
  paused: { bg: 'rgba(228,226,221,0.07)', color: 'rgba(228,226,221,0.4)' },
};

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map(brand => ({ slug: brand.slug }));
}

export default async function BrandDetailPage(props: BrandDetailPageProps) {
  const params = await props.params;
  const brand = getBrandBySlug(params.slug);
  const children = getBrandChildren(params.slug);

  let liveData = {};
  if (brand) {
    const results = await Promise.allSettled([
      brand.farcaster?.handle ? getFarcasterStats(brand.farcaster.handle) : null,
      brand.github ? getGithubLastCommit(brand.github) : null,
      brand.tokenContract
        ? getTokenHolderCount(brand.tokenContract.chain, brand.tokenContract.address)
        : null,
    ]);
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value) liveData = { ...liveData, ...r.value };
    });
  }

  if (!brand) {
    return (
      <div
        style={{ backgroundColor: '#0a1628', color: '#e4e2dd' }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Brand not found</h1>
          <p className="text-sm mb-6" style={{ opacity: 0.55 }}>
            This brand doesn&apos;t exist in the ecosystem.
          </p>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: '#f5a623' }}
          >
            <ArrowLeft size={14} />
            Back to ecosystem
          </Link>
        </div>
      </div>
    );
  }

  const parentBrand = brand.parent ? getBrandBySlug(brand.parent) : null;
  const ss = STAGE_STYLE[brand.stage];

  const socialLinkClass =
    'flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-opacity duration-150 hover:opacity-75';
  const socialLinkStyle = {
    borderColor: 'rgba(245,166,35,0.2)',
    color: '#e4e2dd',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1628', color: '#e4e2dd' }}>

      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: 'rgba(228,226,221,0.08)' }}>
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span
            className="font-bold tracking-tight"
            style={{ fontSize: '0.9375rem', letterSpacing: '-0.02em' }}
          >
            ZAO NEXUS
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/community"
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-opacity duration-150 hover:opacity-80"
              style={{ color: '#e4e2dd', opacity: 0.48 }}
            >
              Community
            </Link>
            <Link
              href="/ecosystem"
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-opacity duration-150 hover:opacity-80"
              style={{ color: '#e4e2dd', opacity: 0.48 }}
            >
              Ecosystem
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-8 text-xs font-medium">
          <Link
            href="/ecosystem"
            className="transition-opacity hover:opacity-100"
            style={{ color: '#f5a623', opacity: 0.75 }}
          >
            Ecosystem
          </Link>
          {parentBrand && (
            <>
              <ChevronRight size={11} style={{ opacity: 0.35 }} />
              <Link
                href={`/ecosystem/${parentBrand.slug}`}
                className="transition-opacity hover:opacity-100"
                style={{ color: '#f5a623', opacity: 0.75 }}
              >
                {parentBrand.name}
              </Link>
            </>
          )}
          <ChevronRight size={11} style={{ opacity: 0.35 }} />
          <span style={{ opacity: 0.55 }}>{brand.name}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h1
                className="text-4xl font-bold mb-2 leading-tight"
                style={{ letterSpacing: '-0.025em' }}
              >
                {brand.name}
              </h1>
              <p className="text-base" style={{ opacity: 0.58 }}>
                {brand.tagline}
              </p>
            </div>
            <span
              className="flex-shrink-0 mt-1 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
              style={{ backgroundColor: ss.bg, color: ss.color }}
            >
              {STAGE_LABELS[brand.stage]}
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-5 max-w-2xl" style={{ opacity: 0.72 }}>
            {brand.description}
          </p>

          {/* Meta pills */}
          {(brand.founded || (brand.founders && brand.founders.length > 0) || brand.status) && (
            <div className="flex flex-wrap gap-2">
              {brand.founded && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: 'rgba(245,166,35,0.18)', color: 'rgba(228,226,221,0.65)' }}
                >
                  Founded {brand.founded}
                </span>
              )}
              {brand.founders?.map(f => (
                <span
                  key={f}
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: 'rgba(245,166,35,0.18)', color: 'rgba(228,226,221,0.65)' }}
                >
                  {f}
                </span>
              ))}
              {brand.status && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full border font-medium capitalize"
                  style={{ borderColor: 'rgba(245,166,35,0.18)', color: 'rgba(228,226,221,0.65)' }}
                >
                  {brand.status}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA */}
        {brand.homepage && (
          <div className="mb-10">
            <a
              href={brand.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-150 hover:opacity-90 hover:-translate-y-px"
              style={{
                backgroundColor: '#f5a623',
                color: '#0a1628',
                boxShadow: '0 2px 12px rgba(245,166,35,0.28)',
              }}
            >
              Visit {brand.name}
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Official Surfaces */}
        {(brand.github || brand.farcaster?.handle || brand.x || brand.telegram || brand.email) && (
          <div className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ opacity: 0.38 }}
            >
              Official Surfaces
            </h2>
            <div className="flex flex-wrap gap-2">
              {brand.github && (
                <a
                  href={brand.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  style={socialLinkStyle}
                >
                  <Github size={15} />
                  GitHub
                </a>
              )}
              {brand.farcaster?.handle && (
                <a
                  href={`https://warpcast.com/${brand.farcaster.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  style={socialLinkStyle}
                >
                  <svg width="15" height="15" viewBox="0 0 1000 1000" fill="currentColor">
                    <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
                    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
                    <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z" />
                  </svg>
                  Farcaster
                </a>
              )}
              {brand.x && (
                <a
                  href={`https://x.com/${brand.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  style={socialLinkStyle}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </a>
              )}
              {brand.telegram && (
                <a
                  href={`https://t.me/${brand.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={socialLinkClass}
                  style={socialLinkStyle}
                >
                  <MessageSquare size={15} />
                  Telegram
                </a>
              )}
              {brand.email && (
                <a
                  href={`mailto:${brand.email}`}
                  className={socialLinkClass}
                  style={socialLinkStyle}
                >
                  <Mail size={15} />
                  Email
                </a>
              )}
            </div>
          </div>
        )}

        {/* Live Data */}
        {Object.keys(liveData).length > 0 && <LiveDataPanel data={liveData as any} />}

        {/* Links & Resources */}
        {brand.links.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ opacity: 0.38 }}
            >
              Links &amp; Resources
            </h2>
            <div className="space-y-1.5">
              {brand.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border group transition-opacity duration-150 hover:opacity-75"
                  style={{
                    borderColor: 'rgba(245,166,35,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold mb-0.5 truncate">{link.title}</div>
                    {link.description && (
                      <div className="text-xs truncate" style={{ opacity: 0.48 }}>
                        {link.description}
                      </div>
                    )}
                  </div>
                  <ExternalLink
                    size={14}
                    className="flex-shrink-0"
                    style={{ opacity: 0.3, color: '#f5a623' }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Token Info */}
        {brand.tokenContract && (
          <div className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ opacity: 0.38 }}
            >
              Token
            </h2>
            <div
              className="p-4 rounded-xl border"
              style={{
                borderColor: 'rgba(245,166,35,0.18)',
                backgroundColor: 'rgba(245,166,35,0.03)',
              }}
            >
              <div className="flex flex-wrap gap-6 mb-3">
                <div>
                  <div className="text-xs mb-1" style={{ opacity: 0.42 }}>Symbol</div>
                  <div className="font-bold text-xl" style={{ color: '#f5a623' }}>
                    {brand.tokenContract.symbol}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ opacity: 0.42 }}>Chain</div>
                  <div className="font-semibold text-sm capitalize">{brand.tokenContract.chain}</div>
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ opacity: 0.42 }}>Contract Address</div>
                <div className="font-mono text-xs break-all" style={{ opacity: 0.6 }}>
                  {brand.tokenContract.address}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {brand.milestones && brand.milestones.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ opacity: 0.38 }}
            >
              Milestones
            </h2>
            <div>
              {brand.milestones.map((ms, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: '#f5a623', opacity: 0.7 }}
                    />
                    {idx < brand.milestones!.length - 1 && (
                      <div
                        className="w-px flex-1 mt-1.5"
                        style={{
                          backgroundColor: 'rgba(245,166,35,0.15)',
                          minHeight: '28px',
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-6 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2.5 mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#f5a623', opacity: 0.7 }}>
                        {ms.date}
                      </span>
                      <span className="text-sm font-semibold">{ms.title}</span>
                    </div>
                    {ms.description && (
                      <p className="text-xs leading-relaxed mb-2" style={{ opacity: 0.52 }}>
                        {ms.description}
                      </p>
                    )}
                    {ms.url && (
                      <a
                        href={ms.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold transition-opacity hover:opacity-75"
                        style={{ color: '#f5a623' }}
                      >
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children Brands */}
        {children.length > 0 && (
          <div className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ opacity: 0.38 }}
            >
              Projects under {brand.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {children.map(child => (
                <Link
                  key={child.slug}
                  href={`/ecosystem/${child.slug}`}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-150 hover:opacity-75 hover:-translate-y-px group"
                  style={{
                    borderColor: 'rgba(245,166,35,0.12)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold mb-0.5">{child.name}</div>
                    <div className="text-xs" style={{ opacity: 0.48 }}>{child.tagline}</div>
                  </div>
                  <ChevronRight
                    size={14}
                    className="flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                    style={{ opacity: 0.35, color: '#f5a623' }}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(228,226,221,0.08)' }}>
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#f5a623' }}
          >
            <ArrowLeft size={14} />
            Back to ecosystem
          </Link>
        </div>
      </div>
    </div>
  );
}
