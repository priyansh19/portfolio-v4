import { projects } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export default function sitemap() {
  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'monthly' },
    { path: '/work', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/projects', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/freelance', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/open-source', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'yearly' },
  ];

  return [
    ...staticRoutes.map(route => ({
      url: `${siteUrl}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...projects.map(project => ({
      url: `${siteUrl}/projects/${project.slug}`,
      changeFrequency: 'yearly',
      priority: 0.7,
    })),
  ];
}
