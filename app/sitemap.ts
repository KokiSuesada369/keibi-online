import { createClient } from '@supabase/supabase-js'

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

export default async function sitemap() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const baseUrl = 'https://keibi.online'

  // 静的ページ
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/prefecture`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  ]

  // 都道府県ページ（47ページ）
  const prefPages = PREF_SLUGS.map(pref => ({
    url: `${baseUrl}/${pref}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // 地域×業務ページ（47×4=188ページ）
  const prefServicePages = PREF_SLUGS.flatMap(pref =>
    [1, 2, 3, 4].map(service => ({
      url: `${baseUrl}/${pref}/service/${service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  // 市区町村ページ
  const { data: cities } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city_slug')

  const cityPages = (cities ?? []).map(c => ({
    url: `${baseUrl}/${c.pref_slug}/${c.city_slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 会社詳細ページ
  const { data: companies } = await supabase
    .from('companies')
    .select('slug')

  const companyPages = (companies ?? []).map(c => ({
    url: `${baseUrl}/companies/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...prefPages,
    ...prefServicePages,
    ...cityPages,
    ...companyPages,
  ]
}
