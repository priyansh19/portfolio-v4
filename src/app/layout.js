import { Geist_Mono, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { links, profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

// Inter carries every UI surface — headings, body, labels. Geist Mono is
// reserved for code-ish chips and captions. No third typeface.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
