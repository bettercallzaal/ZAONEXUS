import { ImageResponse } from 'next/og'

// Dedicated 3:2 image for the Farcaster Mini App launch card (cast embed).
// The OG image is 1.91:1 and left-aligned, so the card crops it — this one is
// 1200x800 with centered content and safe margins so nothing gets cut off.
export const runtime = 'nodejs'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a1628',
          backgroundImage:
            'radial-gradient(circle at 50% 18%, rgba(245,166,35,0.18), rgba(10,22,40,0) 55%)',
          padding: '90px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            fontWeight: 800,
            color: '#f5a623',
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          ZAO NEXUS
        </div>
        <div
          style={{
            display: 'flex',
            width: 120,
            height: 6,
            backgroundColor: '#f5a623',
            borderRadius: 999,
            margin: '34px 0',
          }}
        />
        <div style={{ display: 'flex', fontSize: 44, color: '#e4e2dd', fontWeight: 500 }}>
          The central hub for ZAO, ZABAL and WaveWarZ
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(228,226,221,0.55)', marginTop: 22 }}>
          Links · Projects · Brands · Community
        </div>
      </div>
    ),
    { width: 1200, height: 800 },
  )
}
