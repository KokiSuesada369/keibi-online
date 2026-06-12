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
    { url: baseUrl, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/prefecture`, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/column`, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/license`, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2026-06-11'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/nearby`, lastModified: new Date('2026-06-11'), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/request`, lastModified: new Date('2026-06-11'), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const prefPages: MetadataRoute.Sitemap = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}`,
    lastModified: new Date('2026-06-11'),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))


  const columnPages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/column/${a.slug}`,
    lastModified: new Date('2026-06-11'),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const PREFS_JA = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']

  const licensePages: MetadataRoute.Sitemap = PREFS_JA.map(pref => ({
    url: `${baseUrl}/license/${encodeURIComponent(pref)}`,
    lastModified: new Date('2026-06-11'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const { data: cities } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city_slug')

  const cityPages: MetadataRoute.Sitemap = (cities ?? []).map(c => ({
    url: `${baseUrl}/${c.pref_slug}/${c.city_slug}`,
    lastModified: new Date('2026-06-11'),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const osusumePages: MetadataRoute.Sitemap = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}/osusume`,
    lastModified: new Date('2026-06-11'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const rankingPages: MetadataRoute.Sitemap = PREF_SLUGS.flatMap(pref =>
    ['kotsu', 'event', 'shisetsu', 'parking'].map(cat => ({
      url: `${baseUrl}/columns/ranking/${pref}/${cat}`,
      lastModified: new Date('2026-06-11'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

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
          lastModified: new Date('2026-06-01'),
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
    ...licensePages,
    ...cityPages,
    ...companyPages,
  ]
}
