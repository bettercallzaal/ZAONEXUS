import Link from 'next/link';
import { ChevronRight, Github, ExternalLink, Mail, MessageSquare } from 'lucide-react';
import { brands, getBrandBySlug, getBrandChildren, type BrandStage } from '../../data/brands';

const STAGE_LABELS: Record<BrandStage, string> = {
  active: 'Active',
  incubating: 'Incubating',
  'zabal-track': 'ZABAL Track',
  graduated: 'Graduated',
  paused: 'Paused'
};

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map(brand => ({
    slug: brand.slug
  }));
}

export default async function BrandDetailPage(props: BrandDetailPageProps) {
  const params = await props.params;
  const brand = getBrandBySlug(params.slug);
  const children = getBrandChildren(params.slug);

  if (!brand) {
    return (
      <div style={{ backgroundColor: '#0a1628', color: '#e4e2dd' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Brand not found</h1>
          <p className="mb-4 opacity-75">The brand you are looking for does not exist.</p>
          <Link href="/ecosystem" className="text-sm font-semibold" style={{ color: '#f5a623' }}>
            Back to ecosystem
          </Link>
        </div>
      </div>
    );
  }

  const parentBrand = brand.parent ? getBrandBySlug(brand.parent) : null;

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
            <Link
              href="/ecosystem"
              className="px-4 py-2 rounded-lg transition-all duration-200 opacity-60 hover:opacity-100"
            >
              ZAO Ecosystem
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {parentBrand && (
          <div className="flex items-center gap-2 mb-6 text-sm opacity-75">
            <Link href={`/ecosystem/${parentBrand.slug}`} className="hover:opacity-100 transition-opacity" style={{ color: '#f5a623' }}>
              {parentBrand.name}
            </Link>
            <ChevronRight size={16} />
            <span>{brand.name}</span>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">{brand.name}</h1>
              <p className="text-xl opacity-75">{brand.tagline}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap"
              style={{
                backgroundColor: brand.stage === 'active' ? '#f5a623' : 'rgba(245, 166, 35, 0.3)',
                color: brand.stage === 'active' ? '#0a1628' : '#e4e2dd'
              }}
            >
              {STAGE_LABELS[brand.stage]}
            </div>
          </div>

          <p className="text-lg leading-relaxed opacity-90 max-w-2xl mb-6">{brand.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-sm">
            {brand.founded && (
              <div>
                <div className="opacity-60">Founded</div>
                <div className="font-semibold">{brand.founded}</div>
              </div>
            )}
            {brand.founders && brand.founders.length > 0 && (
              <div>
                <div className="opacity-60">Founders</div>
                <div className="font-semibold">{brand.founders.join(', ')}</div>
              </div>
            )}
            {brand.status && (
              <div>
                <div className="opacity-60">Status</div>
                <div className="font-semibold capitalize">{brand.status}</div>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        {brand.homepage && (
          <div className="mb-8">
            <a
              href={brand.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ backgroundColor: '#f5a623', color: '#0a1628' }}
            >
              Visit {brand.name}
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        {/* Surfaces Row */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Official Surfaces</h2>
          <div className="flex flex-wrap gap-4">
            {brand.github && (
              <a
                href={`https://github.com/${brand.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}
              >
                <Github size={18} />
                GitHub
              </a>
            )}
            {brand.farcaster?.handle && (
              <a
                href={`https://warpcast.com/${brand.farcaster.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 1000 1000" fill="currentColor">
                  <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
                  <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
                  <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z"/>
                </svg>
                Farcaster
              </a>
            )}
            {brand.x && (
              <a
                href={`https://x.com/${brand.x}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
            )}
            {brand.telegram && (
              <a
                href={`https://t.me/${brand.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}
              >
                <MessageSquare size={18} />
                Telegram
              </a>
            )}
            {brand.email && (
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}
              >
                <Mail size={18} />
                Email
              </a>
            )}
          </div>
        </div>

        {/* Links Section */}
        {brand.links.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Links & Resources</h2>
            <div className="space-y-3">
              {brand.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 p-4 rounded-lg border transition-all hover:shadow-md group"
                  style={{ borderColor: 'rgba(245, 166, 35, 0.2)' }}
                >
                  <div className="flex-1">
                    <div className="font-semibold group-hover:opacity-75">{link.title}</div>
                    <div className="text-sm opacity-60">{link.description}</div>
                  </div>
                  <ExternalLink size={16} className="flex-shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Token Info */}
        {brand.tokenContract && (
          <div className="mb-8 p-4 rounded-lg border-2" style={{ borderColor: 'rgba(245, 166, 35, 0.3)' }}>
            <h2 className="text-lg font-bold mb-4">Token</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm opacity-60">Symbol</div>
                <div className="font-semibold">{brand.tokenContract.symbol}</div>
              </div>
              <div>
                <div className="text-sm opacity-60">Chain</div>
                <div className="font-semibold capitalize">{brand.tokenContract.chain}</div>
              </div>
              <div>
                <div className="text-sm opacity-60">Contract Address</div>
                <div className="font-mono text-sm break-all">{brand.tokenContract.address}</div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {brand.milestones && brand.milestones.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Milestones</h2>
            <div className="space-y-4">
              {brand.milestones.map((milestone, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-24 text-sm font-semibold opacity-75">{milestone.date}</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{milestone.title}</div>
                    {milestone.description && (
                      <div className="text-sm opacity-75 mb-2">{milestone.description}</div>
                    )}
                    {milestone.url && (
                      <a href={milestone.url} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: '#f5a623' }}>
                        Learn more
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
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Projects under {brand.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map(child => (
                <Link
                  key={child.slug}
                  href={`/ecosystem/${child.slug}`}
                  className="p-4 rounded-lg border transition-all hover:shadow-md hover:-translate-y-0.5 group"
                  style={{ borderColor: 'rgba(245, 166, 35, 0.2)' }}
                >
                  <div className="font-semibold mb-1 group-hover:opacity-75">{child.name}</div>
                  <div className="text-sm opacity-75">{child.tagline}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(224, 221, 170, 0.2)' }}>
          <Link href="/ecosystem" className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-75" style={{ color: '#f5a623' }}>
            Back to ecosystem
          </Link>
        </div>
      </div>
    </div>
  );
}
