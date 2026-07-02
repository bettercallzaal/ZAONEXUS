import { parseWebhookEvent, verifyAppKeyWithNeynar } from '@farcaster/miniapp-node';
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
// 1. Validate JFS envelope signature against app key via Neynar (MED-2 CLOSED)
// 2. Validate payload size to prevent DoS attacks
// 3. Rate-limit events per FID (max 20 events/minute per user)
// 4. Validate and allowlist notification callback URLs (no arbitrary SSRF)
// 5. Reject invalid/oversized tokens
// 6. Bind stored FID to verified signature, not client-claimed values

export async function POST(req: Request) {
  // Verify NEYNAR_API_KEY is configured for signature verification at runtime
  const neynarApiKey = process.env.NEYNAR_API_KEY;
  if (!neynarApiKey) {
    console.error('NEYNAR_API_KEY not configured for webhook signature verification');
    return new Response(JSON.stringify({ error: 'service unavailable' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
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

  // Parse and verify JFS envelope signature
  let bodyJson: unknown;
  try {
    bodyJson = JSON.parse(bodyString);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  let fid: number;
  let event: { event?: string; notificationDetails?: unknown };

  try {
    // Parse and verify the webhook event using Farcaster's JFS signature verification
    // This validates the signature against the app's registered key via Neynar
    const result = await parseWebhookEvent(bodyJson, verifyAppKeyWithNeynar);

    fid = result.fid;
    event = result.event as { event?: string; notificationDetails?: unknown };

    // Validate event structure
    if (typeof event?.event !== 'string') {
      return new Response(JSON.stringify({ error: 'invalid event' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
  } catch (error: unknown) {
    // Signature verification or parsing failed
    const errorMessage = error instanceof Error ? error.message : 'unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return new Response(JSON.stringify({ error: 'signature verification failed' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  // FID is now verified against the JFS signature, not a client-claimed value
  // Rate limit per verified FID
  if (!checkRateLimit(fid)) {
    return new Response(JSON.stringify({ error: 'rate limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Process the event
  try {
    const eventType = event.event;

    if (
      (eventType === 'miniapp_added' || eventType === 'notifications_enabled') &&
      event.notificationDetails
    ) {
      // Validate notification details (URL allowlist, size limits)
      const validation = validateNotificationDetails(event.notificationDetails);
      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }

      await saveToken(fid, event.notificationDetails as { url: string; token: string });
    } else if (eventType === 'miniapp_removed' || eventType === 'notifications_disabled') {
      await deleteToken(fid);
    }
  } catch {
    // Storage failure shouldn't 500 the webhook; the host retries on non-200
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
