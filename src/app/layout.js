import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { LoadingScreen } from '@/components/loading-screen/loading-screen';
import { ScrollProgress } from '@/components/scroll-progress/scroll-progress';
import { ThemeProvider } from '@/components/theme-provider';
import { links, profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

// Fraunces is the closest open license to Copernicus / Tiempos Headline — a
// serif with a soft, literary character and full negative-tracking support.
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
});

// Inter substitutes for StyreneB — the design system names it directly as
// the closest humanist sans available as a public web font.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jbMono = JetBrains_Mono({
  variable: '--font-jbmono',
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
    { media: '(prefers-color-scheme: light)', color: '#faf9f5' },
    { media: '(prefers-color-scheme: dark)', color: '#181715' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fraunces.variable} ${inter.variable} ${jbMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LoadingScreen />
          <ScrollProgress />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
