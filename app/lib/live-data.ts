import { LiveData } from '../data/brands';

interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

// Farcaster reads via haatz.quilibrium.com (Cassie Heart's free Neynar v2 mirror)
// Free, no API key, ~140ms latency, identical Neynar v2 schema.
// Verified empirically 2026-05-02 in research/farcaster/589-haatz-coverage-cassie-casts-may2026/
// Override via FARCASTER_API_BASE env (e.g., to use api.neynar.com if haatz is down).
// If using Neynar fallback, set NEYNAR_API_KEY too; haatz needs no key.
const FARCASTER_API_BASE = process.env.FARCASTER_API_BASE || 'https://haatz.quilibrium.com';

function farcasterHeaders(): HeadersInit {
  const key = process.env.NEYNAR_API_KEY;
  const base: HeadersInit = { 'Content-Type': 'application/json' };
  if (FARCASTER_API_BASE.includes('neynar.com') && key) {
    return { ...base, 'x-api-key': key };
  }
  return base;
}

export async function getFarcasterStats(handle: string): Promise<Partial<LiveData> | null> {
  try {
    const userResponse = await fetch(
      `${FARCASTER_API_BASE}/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`,
      {
        headers: farcasterHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!userResponse.ok) return null;

    const userData = await userResponse.json();
    const user = userData.user;
    if (!user) return null;

    const castsResponse = await fetch(
      `${FARCASTER_API_BASE}/v2/farcaster/feed/user/casts?fid=${user.fid}&limit=1`,
      {
        headers: farcasterHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!castsResponse.ok) return null;

    const castsData = await castsResponse.json();
    const lastCast = castsData.casts?.[0];

    return {
      farcasterCastCount: user.statistics?.casts || 0,
      farcasterLastCast: lastCast
        ? {
            hash: lastCast.hash,
            text: lastCast.text,
            timestamp: lastCast.timestamp,
          }
        : undefined,
    };
  } catch {
    return null;
  }
}

export async function getGithubLastCommit(repoOrUrl: string): Promise<Partial<LiveData> | null> {
  try {
    // Accept either "owner/repo" or a full github.com URL (the brand.github field
    // stores full https:// URLs). Normalize to "owner/repo"; skip org/user-only values.
    const repo = repoOrUrl
      .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
      .replace(/\/+$/, '');
    if (!repo.includes('/')) return null; // org/user only, not a specific repo

    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'ZAONEXUS',
        },
        next: { revalidate: 3600 } // 1 hour cache
      }
    );

    if (!response.ok) return null;

    const commits: GithubCommit[] = await response.json();
    if (commits.length === 0) return null;

    const lastCommit = commits[0];
    return {
      githubLastCommit: {
        sha: lastCommit.sha.substring(0, 7),
        message: lastCommit.commit.message.split('\n')[0],
        date: lastCommit.commit.author.date,
      },
    };
  } catch (error) {
    // Silently fail - return null
    return null;
  }
}

export async function getTokenHolderCount(
  chain: string,
  address: string
): Promise<Partial<LiveData> | null> {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;
    if (!apiKey) return null;

    // Construct Alchemy API endpoint based on chain
    const chainMap: Record<string, string> = {
      base: 'base-mainnet',
      optimism: 'opt-mainnet',
      mainnet: 'eth-mainnet',
    };

    const alchemyChain = chainMap[chain];
    if (!alchemyChain) return null;

    const response = await fetch(
      `https://${alchemyChain}.g.alchemy.com/v2/${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getOwnersForToken',
          params: [address],
        }),
        next: { revalidate: 3600 } // 1 hour cache
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.result?.owners) {
      return {
        tokenHolderCount: data.result.owners.length,
      };
    }

    return null;
  } catch (error) {
    // Silently fail - return null
    return null;
  }
}
