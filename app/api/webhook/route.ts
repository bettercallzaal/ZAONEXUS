import { saveToken, deleteToken } from '../../lib/notifications';

// Farcaster Mini App webhook. The host POSTs a signed JFS envelope
// ({ header, payload, signature }) when a user adds/removes the app or
// toggles notifications. We decode the event and persist/clear the user's
// notification token. Returns 200 quickly regardless so the host is happy.
//
// Note: production-grade verification would check the JFS signature against
// the user's app key; we decode the header/payload here and store only the
// notificationDetails the host provides.

export async function POST(req: Request) {
  let fid: number | undefined;
  let event: { event?: string; notificationDetails?: { url: string; token: string } } | undefined;

  try {
    const envelope = await req.json();
    const header = JSON.parse(Buffer.from(envelope.header, 'base64url').toString('utf8'));
    fid = header?.fid;
    event = JSON.parse(Buffer.from(envelope.payload, 'base64url').toString('utf8'));
  } catch {
    return new Response('bad request', { status: 400 });
  }

  if (!fid || !event?.event) return new Response('ok');

  const det = event.notificationDetails;
  try {
    if ((event.event === 'miniapp_added' || event.event === 'notifications_enabled') && det) {
      await saveToken(fid, det);
    } else if (event.event === 'miniapp_removed' || event.event === 'notifications_disabled') {
      await deleteToken(fid);
    }
  } catch {
    // Storage failure shouldn't 500 the webhook; the host retries on non-200.
  }

  return new Response('ok');
}
