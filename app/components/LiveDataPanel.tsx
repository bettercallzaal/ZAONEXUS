import { Clock, MessageSquare, GitBranch } from 'lucide-react';
import type { LiveData } from '../data/brands';

interface LiveDataPanelProps {
  data: LiveData | undefined;
}

export default function LiveDataPanel({ data }: LiveDataPanelProps) {
  if (!data || (
    !data.farcasterCastCount &&
    !data.githubLastCommit &&
    !data.tokenHolderCount &&
    !data.farcasterLastCast
  )) {
    return null;
  }

  return (
    <div className="mb-8 p-6 rounded-lg border-2" style={{ borderColor: 'rgba(245, 166, 35, 0.2)' }}>
      <h2 className="text-lg font-bold mb-4">Live Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Farcaster Stats */}
        {data.farcasterCastCount !== undefined && (
          <div className="flex items-start gap-3 p-3 rounded" style={{ backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
            <MessageSquare size={20} className="flex-shrink-0 opacity-60" />
            <div>
              <div className="text-sm opacity-60">Farcaster Casts</div>
              <div className="font-semibold text-lg">{data.farcasterCastCount}</div>
            </div>
          </div>
        )}

        {/* GitHub Commit */}
        {data.githubLastCommit && (
          <div className="flex items-start gap-3 p-3 rounded" style={{ backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
            <GitBranch size={20} className="flex-shrink-0 opacity-60" />
            <div className="flex-1">
              <div className="text-sm opacity-60">Latest Commit</div>
              <div className="font-semibold text-sm truncate">{data.githubLastCommit.message}</div>
              <div className="text-xs opacity-60 mt-1">
                {new Date(data.githubLastCommit.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Last Farcaster Cast */}
        {data.farcasterLastCast && (
          <div className="col-span-1 md:col-span-2 p-3 rounded border" style={{ borderColor: 'rgba(245, 166, 35, 0.2)', backgroundColor: 'rgba(245, 166, 35, 0.03)' }}>
            <div className="text-sm opacity-60 mb-2">Most Recent Cast</div>
            <p className="text-sm line-clamp-3">{data.farcasterLastCast.text}</p>
            <div className="text-xs opacity-60 mt-2">
              {new Date(data.farcasterLastCast.timestamp).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Token Holders */}
        {data.tokenHolderCount !== undefined && (
          <div className="flex items-start gap-3 p-3 rounded" style={{ backgroundColor: 'rgba(245, 166, 35, 0.05)' }}>
            <Clock size={20} className="flex-shrink-0 opacity-60" />
            <div>
              <div className="text-sm opacity-60">Token Holders</div>
              <div className="font-semibold text-lg">{data.tokenHolderCount}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
