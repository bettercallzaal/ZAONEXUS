// Webhook security validation utilities for Mini App notifications.
// Implements: URL allowlisting, payload size limits, and per-FID rate limiting.

const ALLOWED_NOTIFICATION_HOSTS = [
  // Farcaster official notification endpoints
  'notifications.farcaster.xyz',
  'api.farcaster.xyz',
  'notify.farcaster.xyz',

  // Common notification service providers
  'api.neynar.com',
  'notifications.neynar.com',
];

const MAX_PAYLOAD_SIZE = 16 * 1024; // 16 KB
const MAX_NOTIFICATION_URLS_PER_FID = 5; // Prevent token spam per FID
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20; // Max 20 webhook events per minute per FID

// In-memory rate limit tracker. In production with multiple instances,
// this should use Redis (via the existing KV setup).
const rateLimitMap = new Map<number, number[]>(); // fid -> [timestamp, ...]

/** Validate that a notification callback URL is from an allowlisted host. */
export function isAllowlistedNotificationHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    // Exact match against allowlist
    return ALLOWED_NOTIFICATION_HOSTS.some(allowed =>
      hostname === allowed || hostname.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

/** Validate the size of the incoming webhook request. */
export function validatePayloadSize(bodyString: string): boolean {
  return Buffer.byteLength(bodyString, 'utf8') <= MAX_PAYLOAD_SIZE;
}

/** Rate-limit webhook events per FID. Returns true if request is allowed. */
export function checkRateLimit(fid: number): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (!rateLimitMap.has(fid)) {
    rateLimitMap.set(fid, [now]);
    return true;
  }

  const timestamps = rateLimitMap.get(fid)!;

  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => ts > windowStart);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  recentTimestamps.push(now);
  rateLimitMap.set(fid, recentTimestamps);
  return true;
}

/** Clean up old rate limit entries periodically to prevent memory leak. */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const windowStart = now - (RATE_LIMIT_WINDOW_MS * 2); // Keep 2x window for safety

  for (const [fid, timestamps] of Array.from(rateLimitMap.entries())) {
    const recentTimestamps = timestamps.filter(ts => ts > windowStart);
    if (recentTimestamps.length === 0) {
      rateLimitMap.delete(fid);
    } else {
      rateLimitMap.set(fid, recentTimestamps);
    }
  }
}

/** Validate notification details before storage. */
export function validateNotificationDetails(
  detail: unknown
): { valid: boolean; error?: string } {
  if (typeof detail !== 'object' || detail === null) {
    return { valid: false, error: 'notificationDetails must be an object' };
  }

  const obj = detail as Record<string, unknown>;

  // Validate URL
  if (typeof obj.url !== 'string' || !obj.url.trim()) {
    return { valid: false, error: 'url is required and must be a non-empty string' };
  }

  if (obj.url.length > 2048) {
    return { valid: false, error: 'url exceeds maximum length (2048 chars)' };
  }

  if (!isAllowlistedNotificationHost(obj.url)) {
    return { valid: false, error: 'notification host is not allowlisted' };
  }

  // Validate token
  if (typeof obj.token !== 'string' || !obj.token.trim()) {
    return { valid: false, error: 'token is required and must be a non-empty string' };
  }

  if (obj.token.length > 1024) {
    return { valid: false, error: 'token exceeds maximum length (1024 chars)' };
  }

  return { valid: true };
}
