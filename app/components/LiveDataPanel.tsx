import { Clock, MessageSquare, GitBranch } from 'lucide-react';
import type { LiveData } from '../data/brands';

const AMBER = '#f5a623';
const MUTED = 'rgba(228,226,221,0.5)';
const FAINT = 'rgba(228,226,221,0.3)';

export default function LiveDataPanel({ data }: { data: LiveData | undefined }) {
  if (!data || (!data.farcasterCastCount && !data.githubLastCommit && !data.tokenHolderCount && !data.farcasterLastCast)) {
    return null;
  }

  const iconWrap = {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
    backgroundColor: 'rgba(245,166,35,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  } as const;

  const cell = {
    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
    borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
  } as const;

  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: FAINT, textTransform: 'uppercase', marginBottom: 12 }}>
        Live Activity
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
        {data.farcasterCastCount !== undefined && (
          <div style={cell}>
            <div style={iconWrap}><MessageSquare size={16} color={AMBER} /></div>
            <div>
              <p style={{ fontSize: 11, color: MUTED, margin: '0 0 3px' }}>Farcaster Casts</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: AMBER, margin: 0, letterSpacing: '-0.02em' }}>
                {data.farcasterCastCount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
        {data.tokenHolderCount !== undefined && (
          <div style={cell}>
            <div style={iconWrap}><Clock size={16} color={AMBER} /></div>
            <div>
              <p style={{ fontSize: 11, color: MUTED, margin: '0 0 3px' }}>Token Holders</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: AMBER, margin: 0, letterSpacing: '-0.02em' }}>
                {data.tokenHolderCount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
        {data.githubLastCommit && (
          <div style={{ ...cell, alignItems: 'flex-start' }}>
            <div style={iconWrap}><GitBranch size={16} color={AMBER} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: MUTED, margin: '0 0 3px' }}>Latest Commit</p>
              <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {data.githubLastCommit.message}
              </p>
              <p style={{ fontSize: 11, color: FAINT, margin: 0 }}>
                {new Date(data.githubLastCommit.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}
        {data.farcasterLastCast && (
          <div style={{ ...cell, flexDirection: 'column', alignItems: 'flex-start', gridColumn: 'span 2' }}>
            <p style={{ fontSize: 11, color: MUTED, margin: '0 0 8px' }}>Most Recent Cast</p>
            <p style={{ fontSize: 13, lineHeight: 1.55, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
              {data.farcasterLastCast.text}
            </p>
            <p style={{ fontSize: 11, color: FAINT, margin: 0 }}>
              {new Date(data.farcasterLastCast.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
