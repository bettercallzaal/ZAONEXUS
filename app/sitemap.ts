import type { MetadataRoute } from 'next'
import { brands } from './data/brands'

const SITE_URL = 'https://nexus.thezao.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/community`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/ecosystem`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/journeys`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${SITE_URL}/ecosystem/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...brandRoutes]
}
