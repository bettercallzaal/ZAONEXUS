'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { type Link } from '../data/links';

interface LinkItemProps {
  link: Link;
}

export default function LinkItem({ link }: LinkItemProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToX = (url: string, title: string) => {
    const text = `I found "${title}" on the ZAO NEXUS! You should check it out: ${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFarcaster = (url: string, title: string) => {
    const text = `I found "${title}" on the ZAO NEXUS! You should check it out: ${url}`;
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(farcasterUrl, '_blank', 'width=550,height=600');
  };

  return (
    <li className="group">
      <div
        className="p-3 rounded-lg transition-all duration-200 hover:shadow-md border-2"
        style={{
          backgroundColor: 'var(--link-bg)',
          borderColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-bg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 group/link"
          >
            <div
              className="font-semibold group-hover/link:underline inline-flex items-center gap-1.5"
              style={{ color: 'var(--text-color)' }}
            >
              {link.title}
              <ExternalLink
                size={14}
                className="opacity-40 group-hover/link:opacity-70 transition-opacity"
              />
            </div>
            {link.description && (
              <div
                className="text-sm mt-1"
                style={{ color: 'var(--text-color)', opacity: 0.75 }}
              >
                {link.description}
              </div>
            )}
          </a>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => copyLink(link.url)}
              className="group/btn relative p-2 rounded-md transition-all duration-200"
              style={{
                backgroundColor:
                  copiedLink === link.url ? 'var(--accent-bg)' : 'transparent',
                color:
                  copiedLink === link.url
                    ? 'var(--accent-text)'
                    : 'var(--text-color)',
              }}
              onMouseEnter={(e) => {
                if (copiedLink !== link.url) {
                  e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                  e.currentTarget.style.color = 'var(--accent-text)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (copiedLink !== link.url) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-color)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {copiedLink === link.url ? <Check size={16} /> : <Copy size={16} />}
              <span
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                style={{
                  backgroundColor: 'var(--accent-text)',
                  color: 'var(--accent-bg)',
                }}
              >
                {copiedLink === link.url ? 'Copied!' : 'Copy link'}
              </span>
            </button>
            <div
              className="h-4 w-px"
              style={{ backgroundColor: 'var(--text-color)', opacity: 0.2 }}
            />
            <button
              onClick={() => shareToX(link.url, link.title)}
              className="group/btn relative p-2 rounded-md transition-all duration-200"
              style={{ color: 'var(--text-color)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                e.currentTarget.style.color = 'var(--accent-text)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-color)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                style={{
                  backgroundColor: 'var(--accent-text)',
                  color: 'var(--accent-bg)',
                }}
              >
                Share to X
              </span>
            </button>
            <button
              onClick={() => shareToFarcaster(link.url, link.title)}
              className="group/btn relative p-2 rounded-md transition-all duration-200"
              style={{ color: 'var(--text-color)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-bg)';
                e.currentTarget.style.color = 'var(--accent-text)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-color)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 1000 1000"
                fill="currentColor"
              >
                <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z" />
                <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z" />
                <path d="M871.111 253.333L842.222 351.111H817.778V746.667C830.051 746.667 840 756.616 840 768.889V795.556H844.444C856.717 795.556 866.667 805.505 866.667 817.778V844.445H617.778V817.778C617.778 805.505 627.727 795.556 640 795.556H644.444V768.889C644.444 756.616 654.394 746.667 666.667 746.667H693.333V253.333H871.111Z" />
              </svg>
              <span
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                style={{
                  backgroundColor: 'var(--accent-text)',
                  color: 'var(--accent-bg)',
                }}
              >
                Share to Farcaster
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
