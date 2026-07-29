import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { links, profile } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

// Saans is proprietary to Intercom — Inter at weight 500 is the closest free
// substitute for display type, per the design system's own substitution note.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

// SaansMono substitute — only used for code-like content inside .prose.
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400'],
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
    { media: '(prefers-color-scheme: light)', color: '#f5f1ec' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
