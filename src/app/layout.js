import { Inter, JetBrains_Mono } from 'next/font/google';
import { AgentOrb } from '@/components/agent-orb/agent-orb';
import { AuroraField } from '@/components/aurora-field/aurora-field';
import { LoadingScreen } from '@/components/loading-screen/loading-screen';
import { ThemeProvider } from '@/components/theme-provider';
import { links, profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jbmono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0c0e' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LoadingScreen />
          {/* Fixed site-wide backdrop — lives here rather than in the hero so
              it persists across scroll and across every route. */}
          <AuroraField />
          {children}
          {/* Persistent voice assistant — parks over the hero anchor, docks
              to the top-right corner on scroll and on every other route. */}
          <AgentOrb />
        </ThemeProvider>
      </body>
    </html>
  );
}
