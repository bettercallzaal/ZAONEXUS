import { journeys } from '../../data/journeys';

// Public read-only API for the canonical member journeys (milestone timelines),
// companion to /api/links + /api/brands. GET /api/journeys?slug=zaal
// CORS-open + edge-cached.

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  const items = slug ? journeys.filter(j => j.slug === slug) : journeys;

  const body = JSON.stringify(
    {
      source: 'https://nexus.thezao.com',
      total: journeys.length,
      count: items.length,
      generatedAt: new Date().toISOString(),
      journeys: items,
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
