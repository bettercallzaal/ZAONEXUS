import rawLinks from '../../data/links.json';
import { groupLinks } from '../../data/links';

// Public read-only API for the canonical ZAO Nexus link data, so other ZAO
// surfaces (zaoos.com, zabalgamez.com, bots) can consume the same source of
// truth. GET /api/links with optional filters:
//   ?category=ZAO%20OS   ?audience=community   ?tag=wavewarz
//   ?featured=true       ?q=search-term        ?limit=50
//   ?status=live         ?subcategory=ZABAL    ?group=true
// CORS-open + cached at the edge.

type Link = {
  title: string;
  url: string;
  category: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  audience?: 'community' | 'ecosystem' | 'both';
  featured?: boolean;
  addedDate?: string;
  status?: 'live' | 'down' | 'paused';
};

const ALL = rawLinks as Link[];

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const audience = searchParams.get('audience');
  const tag = searchParams.get('tag');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  let items = ALL;
  if (category) items = items.filter(l => l.category.toLowerCase() === category.toLowerCase());
  if (subcategory) items = items.filter(l => (l.subcategory || '').toLowerCase() === subcategory.toLowerCase());
  if (audience) items = items.filter(l => !l.audience || l.audience === audience || l.audience === 'both');
  if (tag) items = items.filter(l => l.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
  // ?status=live treats a missing status as live (the implicit default), so
  // embedders can request only-healthy links: e.g. ZAO 201 hiding down/paused.
  if (status) items = items.filter(l => (l.status || 'live').toLowerCase() === status.toLowerCase());
  if (featured === 'true') items = items.filter(l => l.featured === true);
  if (q) items = items.filter(l =>
    l.title.toLowerCase().includes(q) ||
    (l.description || '').toLowerCase().includes(q) ||
    l.url.toLowerCase().includes(q) ||
    (l.tags || []).some(t => t.toLowerCase().includes(q))
  );
  if (limit > 0) items = items.slice(0, limit);

  // ?group=true returns the nested category -> subcategory -> links shape the
  // UI renders, so embedders (ZAO 101/201) don't re-implement grouping.
  const grouped = searchParams.get('group') === 'true';

  const body = JSON.stringify(
    {
      source: 'https://nexus.thezao.com',
      total: ALL.length,
      count: items.length,
      generatedAt: new Date().toISOString(),
      ...(grouped ? { categories: groupLinks(items) } : { links: items }),
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
