/**
 * Canonical origin for this site.
 *
 * Used by metadataBase, the sitemap and robots.txt. Set NEXT_PUBLIC_SITE_URL
 * in the deploy environment — the fallback is only so local builds work, and
 * shipping with it would put the wrong host in every canonical and OG tag.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const isSiteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
