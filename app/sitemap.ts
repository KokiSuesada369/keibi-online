import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'
import { articles } from '@/app/column/data'
import { PREF_SLUGS, PREF_NAMES } from '@/constants/prefs'

export const revalidate = 3600

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const NOW = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const baseUrl = 'https://keibi.online'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: NOW, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/prefecture`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/column`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/license`, lastModified: NOW, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: NOW, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/nearby`, lastModified: NOW, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/request`, lastModified: NOW, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const prefPages: MetadataRoute.Sitemap = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const columnPages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/column/${a.slug}`,
    lastModified: NOW,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const licensePages: MetadataRoute.Sitemap = PREF_NAMES.map(pref => ({
    url: `${baseUrl}/license/${encodeURIComponent(pref)}`,
    lastModified: NOW,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const { data: cities } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city_slug')

  const cityPages: MetadataRoute.Sitemap = (cities ?? []).map(c => ({
    url: `${baseUrl}/${c.pref_slug}/${c.city_slug}`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const osusumePages: MetadataRoute.Sitemap = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}/osusume`,
    lastModified: NOW,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const rankingPages: MetadataRoute.Sitemap = PREF_SLUGS.flatMap(pref =>
    ['kotsu', 'event', 'shisetsu', 'parking'].map(cat => ({
      url: `${baseUrl}/columns/ranking/${pref}/${cat}`,
      lastModified: NOW,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const { data: newsItems } = await supabase
    .from('news')
    .select('slug, published_at')
    .order('published_at', { ascending: false })

  const newsPages: MetadataRoute.Sitemap = (newsItems ?? []).map(n => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: n.published_at ? new Date(n.published_at) : NOW,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const companyPages: MetadataRoute.Sitemap = []
  const pageSize = 1000
  let from = 0
  let hasMore = true

  while (hasMore) {
    const { data } = await supabase
      .from('companies')
      .select('slug')
      .range(from, from + pageSize - 1)

    if (!data || data.length === 0) {
      hasMore = false
    } else {
      data.forEach(c => {
        companyPages.push({
          url: `${baseUrl}/companies/${c.slug}`,
          lastModified: NOW,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      })
      from += pageSize
      if (data.length < pageSize) hasMore = false
    }
  }

  return [
    ...staticPages,
    ...prefPages,
    ...osusumePages,
    ...rankingPages,
    ...columnPages,
    ...newsPages,
    ...licensePages,
    ...cityPages,
    ...companyPages,
  ]
}
