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
          background: '#f5f1ec',
          color: '#111111',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#626260',
            }}
          >
            {profile.role}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 500,
              marginTop: 18,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid #d3cec6',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 30, color: '#626260', lineHeight: 1.4 }}>
            Agentic AI platforms, RAG at enterprise scale, and the Kubernetes
          </div>
          <div style={{ fontSize: 30, color: '#626260', lineHeight: 1.4 }}>
            plumbing that keeps them alive.
          </div>
        </div>
      </div>
    ),
    size
  );
}
