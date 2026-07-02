import { saveToken, deleteToken } from '../../lib/notifications';
import {
  validatePayloadSize,
  checkRateLimit,
  validateNotificationDetails,
  cleanupRateLimits,
} from '../../lib/webhook-validation';

// Farcaster Mini App webhook handler.
// The host POSTs a signed JFS envelope ({ header, payload, signature }) when a user
// adds/removes the app or toggles notifications.
//
// SECURITY FIXES (2026-06-28 godsticky audit):
// 1. Validate payload size to prevent DoS attacks
// 2. Rate-limit events per FID (max 20 events/minute per user)
// 3. Validate and allowlist notification callback URLs (no arbitrary SSRF)
// 4. Reject invalid/oversized tokens
//
// NOTE - JFS SIGNATURE VERIFICATION:
// This implementation does NOT yet verify the Farcaster JFS envelope signature.
// Future hardening: import @farcaster/miniapp-sdk and verify the signed envelope
// against the app's registered key via Neynar. This would prevent attackers from
// spoofing webhook events if they intercept the webhook endpoint URL.
// See github.com/farcaster/frame-node for verification patterns.

export async function POST(req: Request) {
  // Periodically clean up stale rate limit entries
  if (Math.random() < 0.01) cleanupRateLimits();

  // Validate payload size before processing
  let bodyString: string;
  try {
    bodyString = await req.text();
    if (!validatePayloadSize(bodyString)) {
      return new Response(JSON.stringify({ error: 'payload too large' }), {
        status: 413,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'bad request' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  let fid: number | undefined;
  let event: { event?: string; notificationDetails?: unknown } | undefined;

  try {
    const envelope = JSON.parse(bodyString);

    // Decode base64url-encoded header and payload
    const header = JSON.parse(Buffer.from(envelope.header, 'base64url').toString('utf8'));
    fid = header?.fid;

    const payload = JSON.parse(Buffer.from(envelope.payload, 'base64url').toString('utf8'));
    event = payload;

    // Validate header/payload structure
    if (!Number.isInteger(fid) || (fid as number) <= 0) {
      return new Response(JSON.stringify({ error: 'invalid fid' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (typeof event?.event !== 'string') {
      return new Response(JSON.stringify({ error: 'invalid event' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'invalid envelope' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Type assertion after validation - we've already checked these are valid above
  const validFid = fid as number;
  const validEvent = event as { event: string; notificationDetails?: unknown };

  // Rate limit per FID
  if (!checkRateLimit(validFid)) {
    return new Response(JSON.stringify({ error: 'rate limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Process the event
  try {
    const eventType = validEvent.event;

    if (
      (eventType === 'miniapp_added' || eventType === 'notifications_enabled') &&
      validEvent.notificationDetails
    ) {
      // Validate notification details (URL allowlist, size limits)
      const validation = validateNotificationDetails(validEvent.notificationDetails);
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }

      await saveToken(validFid, validEvent.notificationDetails as { url: string; token: string });
    } else if (eventType === 'miniapp_removed' || eventType === 'notifications_disabled') {
      await deleteToken(validFid);
    }
  } catch {
    // Storage failure shouldn't 500 the webhook; the host retries on non-200
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
