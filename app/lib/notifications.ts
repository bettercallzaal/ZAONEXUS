// Mini App notification storage + sender.
//
// Persists per-user Farcaster notification tokens in a Redis-compatible KV
// (Vercel KV / Upstash) via the REST API — no extra dependency. Everything
// here gracefully no-ops when KV env vars are absent, so the build and the
// webhook keep working before a store is connected.
//
// Env (set in Vercel when ready):
//   KV_REST_API_URL, KV_REST_API_TOKEN   (Vercel KV / Upstash REST)

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'nexus:miniapp:tokens'; // hash: fid -> JSON({ url, token })

export type NotificationDetails = { url: string; token: string };

export function kvAvailable(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

async function kv(path: string[]): Promise<any> {
  const res = await fetch(`${KV_URL}/${path.map(encodeURIComponent).join('/')}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV ${res.status}`);
  return res.json();
}

export async function saveToken(fid: number, detail: NotificationDetails): Promise<void> {
  if (!kvAvailable() || !detail?.url || !detail?.token) return;
  await kv(['hset', KEY, String(fid), JSON.stringify(detail)]);
}

export async function deleteToken(fid: number): Promise<void> {
  if (!kvAvailable()) return;
  await kv(['hdel', KEY, String(fid)]);
}

export async function getAllTokens(): Promise<NotificationDetails[]> {
  if (!kvAvailable()) return [];
  const r = await kv(['hgetall', KEY]);
  const arr: string[] = r?.result || [];
  const out: NotificationDetails[] = [];
  for (let i = 1; i < arr.length; i += 2) {
    try { out.push(JSON.parse(arr[i])); } catch { /* skip malformed */ }
  }
  return out;
}

/** Send a notification to every stored token, grouped by host url, batched ≤100. */
export async function sendNotification(opts: { title: string; body: string; targetUrl: string }) {
  const tokens = await getAllTokens();
  if (!tokens.length) return { sent: 0, recipients: 0 };

  const byUrl = new Map<string, string[]>();
  for (const t of tokens) {
    if (!byUrl.has(t.url)) byUrl.set(t.url, []);
    byUrl.get(t.url)!.push(t.token);
  }

  const notificationId = `nexus-${Date.now()}`;
  let sent = 0;
  for (const [url, toks] of Array.from(byUrl.entries())) {
    for (let i = 0; i < toks.length; i += 100) {
      const batch = toks.slice(i, i + 100);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            notificationId,
            title: opts.title.slice(0, 32),
            body: opts.body.slice(0, 128),
            targetUrl: opts.targetUrl,
            tokens: batch,
          }),
        });
        if (res.ok) sent += batch.length;
      } catch { /* ignore a failed host */ }
    }
  }
  return { sent, recipients: tokens.length };
}
