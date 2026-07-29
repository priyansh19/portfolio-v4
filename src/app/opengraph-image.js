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
          background: '#faf9f5',
          color: '#141413',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#cc785c',
            }}
          >
            {profile.role}
          </div>
          <div style={{ fontSize: 96, fontWeight: 400, marginTop: 18, lineHeight: 1.05 }}>
            {profile.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '2px solid #e6dfd8',
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 30, color: '#3d3d3a', lineHeight: 1.4 }}>
            Agentic AI platforms, RAG at enterprise scale, and the Kubernetes
          </div>
          <div style={{ fontSize: 30, color: '#3d3d3a', lineHeight: 1.4 }}>
            plumbing that keeps them alive.
          </div>
        </div>
      </div>
    ),
    size
  );
}
