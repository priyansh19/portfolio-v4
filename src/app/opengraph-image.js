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
          background:
            'radial-gradient(120% 90% at 15% 0%, #cfe7ff 0%, #a8c8e8 38%, #ffffff 72%)',
          color: '#171717',
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#0d74ce',
              fontWeight: 600,
            }}
          >
            {profile.role}
          </div>
          <div style={{ fontSize: 92, fontWeight: 600, marginTop: 18, lineHeight: 1.05, letterSpacing: -2 }}>
            {profile.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid #dcdee0',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 28, color: '#60646c', lineHeight: 1.4 }}>
            Agentic AI platforms, RAG at enterprise scale, and the Kubernetes
          </div>
          <div style={{ fontSize: 28, color: '#60646c', lineHeight: 1.4 }}>
            plumbing that keeps them alive.
          </div>
        </div>
      </div>
    ),
    size
  );
}
