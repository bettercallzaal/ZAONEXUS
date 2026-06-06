import { ImageResponse } from 'next/og'

export const alt = 'ZAO NEXUS — Links Hub'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a1628',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, color: '#f5a623', letterSpacing: -2 }}>
          ZAO NEXUS
        </div>
        <div style={{ display: 'flex', fontSize: 40, color: '#e4e2dd', marginTop: 16 }}>
          The central hub for all ZAO links, projects & brands
        </div>
      </div>
    ),
    { ...size },
  )
}
