import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nudgeem.app'
  const now = new Date()
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  ) => ({ url: `${base}${path}`, lastModified: now, changeFrequency, priority })

  return [
    page('/', 1, 'weekly'),
    page('/trophy-room', 0.85),
    page('/impulse-lab', 0.9),
    page('/life-simulator', 0.9),
    page('/bias-simulators', 0.9),
    page('/macro-lab', 0.9),
    page('/cafeteria', 0.85),
    page('/time-machine', 0.85),
    page('/habit-loop', 0.85),
    page('/planner', 0.85),
    page('/bias-radar', 0.85),
    page('/trap-scanner', 0.85),
    page('/community', 0.8),
    page('/anatomy', 0.8),
    page('/privacy', 0.3, 'yearly'),
    page('/terms', 0.3, 'yearly'),
    page('/disclaimer', 0.3, 'yearly'),
  ]
}
