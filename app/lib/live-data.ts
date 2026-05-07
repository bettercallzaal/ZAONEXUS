import { LiveData } from '../data/brands';

interface FarcasterResponse {
  result?: {
    casts?: Array<{ hash: string; text: string; timestamp: string }>;
  };
}

interface GithubCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

export async function getFarcasterStats(handle: string): Promise<Partial<LiveData> | null> {
  try {
    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) return null;

    // Get user info and cast count
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 } // 1 hour cache
      }
    );

    if (!userResponse.ok) return null;

    const userData = await userResponse.json();
    const user = userData.user;
    if (!user) return null;

    // Get recent casts
    const castsResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${user.fid}&limit=1`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
      }
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
  } catch (error) {
    // Silently fail - return null
    return null;
  }
}

export async function getGithubLastCommit(repo: string): Promise<Partial<LiveData> | null> {
  try {
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
