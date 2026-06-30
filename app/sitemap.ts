import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nudgeem.app'
  const now = new Date()
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/impulse-lab`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/bias-simulators`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/anatomy`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
