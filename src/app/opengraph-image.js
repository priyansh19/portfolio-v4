import { ImageResponse } from 'next/og';
import { profile } from '@/lib/content';

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#ffffff',
          color: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#5a5a5c',
            }}
          >
            {profile.role}
          </div>
          <div style={{ fontSize: 92, fontWeight: 600, marginTop: 18, lineHeight: 1.05, letterSpacing: -3 }}>
            {profile.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid #e5e5e5',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 28, color: '#1c1c1e', lineHeight: 1.4 }}>
            Agentic AI platforms, RAG at enterprise scale, and the Kubernetes
          </div>
          <div style={{ fontSize: 28, color: '#1c1c1e', lineHeight: 1.4 }}>
            plumbing that keeps them alive.
          </div>
        </div>
      </div>
    ),
    size
  );
}
