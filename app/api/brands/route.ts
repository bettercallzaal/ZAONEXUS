import { brands } from '../../data/brands';

// Public read-only API for the ZAO ecosystem brand data — companion to
// /api/links. GET /api/brands with optional filters:
//   ?stage=active   ?tier=project   ?parent=the-zao   ?slug=wavewarz   ?q=term
// CORS-open + edge-cached.

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get('stage');
  const tier = searchParams.get('tier');
  const parent = searchParams.get('parent');
  const slug = searchParams.get('slug');
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  let items = brands;
  if (stage) items = items.filter(b => b.stage === stage);
  if (tier) items = items.filter(b => b.tier === tier);
  if (parent) items = items.filter(b => b.parent === parent);
  if (slug) items = items.filter(b => b.slug === slug);
  if (q) items = items.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.slug.toLowerCase().includes(q) ||
    (b.tagline || '').toLowerCase().includes(q) ||
    (b.description || '').toLowerCase().includes(q)
  );

  const body = JSON.stringify(
    {
      source: 'https://nexus.thezao.com',
      total: brands.length,
      count: items.length,
      generatedAt: new Date().toISOString(),
      brands: items,
    },
    null,
    2,
  );

  return new Response(body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      ...CORS,
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
