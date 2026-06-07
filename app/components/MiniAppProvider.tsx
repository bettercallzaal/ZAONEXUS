'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type MiniAppUser = { fid?: number; username?: string; displayName?: string; pfpUrl?: string };

type MiniAppCtx = {
  /** True once we've confirmed we're running inside a Farcaster Mini App host. */
  isMiniApp: boolean;
  /** The viewing Farcaster user, when available inside a Mini App host. */
  user: MiniAppUser | null;
  /** Open an external URL — natively in-client when in a Mini App, else a normal new tab. */
  openUrl: (url: string) => void;
  /** Compose a cast — native composer in a Mini App, else Warpcast web compose. */
  composeCast: (text: string, embedUrl?: string) => void;
  /** Prompt the user to add/save the Mini App (no-op outside a Mini App). */
  addMiniApp: () => void;
};

const Ctx = createContext<MiniAppCtx>({
  isMiniApp: false,
  user: null,
  openUrl: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
  composeCast: (text, embedUrl) =>
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}` +
        (embedUrl ? `&embeds[]=${encodeURIComponent(embedUrl)}` : ''),
      '_blank',
      'width=550,height=600'
    ),
  addMiniApp: () => {},
});

export function useMiniApp() {
  return useContext(Ctx);
}

export default function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [user, setUser] = useState<MiniAppUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const inMiniApp = await sdk.isInMiniApp();
        if (cancelled) return;
        if (inMiniApp) {
          setIsMiniApp(true);
          try {
            const ctx = await sdk.context;
            const u = ctx?.user;
            if (!cancelled && u) {
              setUser({ fid: u.fid, username: u.username, displayName: u.displayName, pfpUrl: u.pfpUrl });
            }
          } catch { /* context optional */ }
          // Critical: dismiss the host splash screen once the app is rendered.
          // Without this the Mini App appears to hang on launch.
          await sdk.actions.ready();
        }
      } catch {
        // Not in a Mini App host (or SDK unavailable) — web fallbacks apply.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value: MiniAppCtx = {
    isMiniApp,
    user,
    openUrl: (url) => {
      if (isMiniApp) {
        import('@farcaster/miniapp-sdk').then(({ sdk }) => sdk.actions.openUrl(url)).catch(() => {});
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    composeCast: (text, embedUrl) => {
      if (isMiniApp) {
        import('@farcaster/miniapp-sdk')
          .then(({ sdk }) =>
            sdk.actions.composeCast({ text, embeds: embedUrl ? [embedUrl] : undefined })
          )
          .catch(() => {});
      } else {
        window.open(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}` +
            (embedUrl ? `&embeds[]=${encodeURIComponent(embedUrl)}` : ''),
          '_blank',
          'width=550,height=600'
        );
      }
    },
    addMiniApp: () => {
      if (isMiniApp) {
        import('@farcaster/miniapp-sdk').then(({ sdk }) => sdk.actions.addMiniApp()).catch(() => {});
      }
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
