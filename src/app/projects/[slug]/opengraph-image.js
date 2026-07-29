import { ImageResponse } from 'next/og';
import { projectBySlug, projects } from '@/lib/content';

export const alt = 'Project write-up';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  // Satori treats each interpolation as its own child node, and any element
  // with more than one child must declare a display mode. Pre-compose instead.
  const kicker = `No. ${project.index} — ${project.subtitle}`;

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
              fontSize: 18,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#5a5a5c',
            }}
          >
            {kicker}
          </div>
          <div style={{ fontSize: 78, fontWeight: 600, marginTop: 20, lineHeight: 1.05, letterSpacing: -2.5 }}>
            {project.name}
          </div>
          <div style={{ fontSize: 30, color: '#1c1c1e', marginTop: 24, lineHeight: 1.4 }}>
            {project.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #e5e5e5',
            paddingTop: 26,
            fontSize: 22,
            color: '#5a5a5c',
          }}
        >
          <div style={{ display: 'flex' }}>Priyansh Gupta</div>
          <div style={{ display: 'flex' }}>{project.year}</div>
        </div>
      </div>
    ),
    size
  );
}
