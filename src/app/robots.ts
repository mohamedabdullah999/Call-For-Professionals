import type { MetadataRoute } from 'next';
import { SITE, basePath } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: `${basePath}/`, disallow: `${basePath}/api/` },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
