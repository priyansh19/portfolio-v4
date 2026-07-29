import { VT323 } from 'next/font/google';
import { BootScreen } from '@/components/boot-screen/boot-screen';
import { ScrollProgress } from '@/components/scroll-progress/scroll-progress';
import { ThemeProvider } from '@/components/theme-provider';
import { links, profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

// The pixel-legend voice for micro chrome labels — this era's bitmap Arial,
// stood in for by a real pixel face rather than disabled anti-aliasing.
const vt323 = VT323({
  weight: '400',
  variable: '--font-vt323',
  subsets: ['latin'],
  display: 'swap',
});

// Runs before first paint so the correct theme is set with no flash.
// Kept inline rather than imported from the client theme module — exports
// crossing a 'use client' boundary arrive as references, not values.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.headline,
  keywords: [
    'Agentic AI',
    'RAG',
    'GraphRAG',
    'LangGraph',
    'Kubernetes',
    'Azure AI Foundry',
    'DevOps',
    'Forward Deployed Engineer',
  ],
  authors: [{ name: profile.name, url: links.linkedin }],
  openGraph: {
    type: 'website',
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    siteName: `${profile.name} — Portfolio`,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7a8aba' },
    { media: '(prefers-color-scheme: dark)', color: '#2a3252' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={vt323.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <BootScreen />
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
