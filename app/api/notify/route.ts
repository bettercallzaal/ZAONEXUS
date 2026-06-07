import { sendNotification, kvAvailable } from '../../lib/notifications';

// Admin-only sender: POST a notification to everyone who added the Mini App.
//   Authorization: Bearer <NOTIFY_SECRET>
//   body: { "title": "...", "body": "...", "targetUrl"?: "https://nexus.thezao.com/..." }
// Used for "new links added", "ZAOstock soon", workshop reminders, etc.

export async function POST(req: Request) {
  const secret = process.env.NOTIFY_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('unauthorized', { status: 401 });
  }
  if (!kvAvailable()) {
    return Response.json({ error: 'KV not configured' }, { status: 503 });
  }

  let payload: { title?: string; body?: string; targetUrl?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response('bad request', { status: 400 });
  }

  if (!payload.title || !payload.body) {
    return Response.json({ error: 'title and body are required' }, { status: 400 });
  }

  const result = await sendNotification({
    title: payload.title,
    body: payload.body,
    targetUrl: payload.targetUrl || 'https://nexus.thezao.com',
  });
  return Response.json(result);
}
