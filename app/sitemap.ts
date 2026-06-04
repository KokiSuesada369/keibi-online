import { createClient } from '@supabase/supabase-js'
import { MetadataRoute } from 'next'
import { articles } from '@/app/column/data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PREF_SLUGS = [
  'hokkaido','aomori','iwate','miyagi','akita','yamagata','fukushima',
  'ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa',
  'niigata','toyama','ishikawa','fukui','yamanashi','nagano','gifu',
  'shizuoka','aichi','mie','shiga','kyoto','osaka','hyogo','nara',
  'wakayama','tottori','shimane','okayama','hiroshima','yamaguchi',
  'tokushima','kagawa','ehime','kochi','fukuoka','saga','nagasaki',
  'kumamoto','oita','miyazaki','kagoshima','okinawa',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const baseUrl = 'https://keibi.online'

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/prefecture`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/column`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/license`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const prefPages: MetadataRoute.Sitemap = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const prefServicePages: MetadataRoute.Sitemap = PREF_SLUGS.flatMap(pref =>
    [1, 2, 3, 4].map(service => ({
      url: `${baseUrl}/${pref}/service/${service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  )

  const columnPages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/column/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const { data: cities } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city_slug')

  const cityPages: MetadataRoute.Sitemap = (cities ?? []).map(c => ({
    url: `${baseUrl}/${c.pref_slug}/${c.city_slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
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
          lastModified: new Date(),
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
    ...prefServicePages,
    ...columnPages,
    ...cityPages,
    ...companyPages,
  ]
}
