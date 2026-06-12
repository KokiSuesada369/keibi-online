import { createClient } from '@supabase/supabase-js'
import { PREF_MAP } from '@/constants/prefs'
import PrefDropdown from './PrefDropdown'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 86400

export const metadata = {
  title: 'おすすめ警備会社を地域から探す | keibi.online',
  description: '都道府県・市区町村から地域のおすすめ警備会社ランキングを探せます。全国47都道府県に対応。',
  alternates: { canonical: 'https://keibi.online/osusume' },
}

const REGIONS = [
  { name: '北海道・東北', slugs: ['hokkaido','aomori','iwate','miyagi','akita','yamagata','fukushima'] },
  { name: '関東', slugs: ['ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa'] },
  { name: '中部', slugs: ['niigata','toyama','ishikawa','fukui','yamanashi','nagano','gifu','shizuoka','aichi'] },
  { name: '近畿', slugs: ['mie','shiga','kyoto','osaka','hyogo','nara','wakayama'] },
  { name: '中国・四国', slugs: ['tottori','shimane','okayama','hiroshima','yamaguchi','tokushima','kagawa','ehime','kochi'] },
  { name: '九州・沖縄', slugs: ['fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima','okinawa'] },
]

type CityRow = { pref_slug: string; city: string; city_slug: string; company_count: number }

export default async function OsusumeHubPage() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: cityRows } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city, city_slug, company_count')
    .order('company_count', { ascending: false })

  const cityByPref: Record<string, CityRow[]> = {}
  for (const row of (cityRows ?? []) as CityRow[]) {
    if (!cityByPref[row.pref_slug]) cityByPref[row.pref_slug] = []
    if (cityByPref[row.pref_slug].length < 5) cityByPref[row.pref_slug].push(row)
  }

  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; おすすめ警備会社
        </div>

        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '12px' }}>
          おすすめ警備会社を地域から探す
        </h1>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, marginBottom: '24px' }}>
          都道府県・市区町村を選んで、地域のおすすめ警備会社ランキングをご確認ください。
        </p>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px 24px', marginBottom: '40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
            都道府県から直接ランキングを見る
          </div>
          <PrefDropdown />
        </div>

        {REGIONS.map(region => (
          <div key={region.name} style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', borderBottom: '2px solid #f97316', paddingBottom: '8px', marginBottom: '20px' }}>
              {region.name}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {region.slugs.map(slug => {
                const prefName = PREF_MAP[slug]
                const cities = cityByPref[slug] ?? []
                return (
                  <div key={slug} style={{ border: '1px solid #e5e5e5', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
                    <a
                      href={`/${slug}/osusume`}
                      style={{ textDecoration: 'none', display: 'block', padding: '16px', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', borderBottom: '1px solid #fed7aa' }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#c2410c', marginBottom: '4px' }}>
                        {prefName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#f97316', fontWeight: 600 }}>
                        おすすめランキングを見る →
                      </div>
                    </a>

                    {cities.length > 0 && (
                      <div style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '11px', color: '#999', fontWeight: 700, marginBottom: '8px' }}>市区町村から探す</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {cities.map(c => (
                            <a
                              key={c.city_slug}
                              href={`/${slug}/${c.city_slug}`}
                              style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '99px', border: '1px solid #e5e5e5', color: '#444', textDecoration: 'none', whiteSpace: 'nowrap' }}
                            >
                              {c.city}
                              <span style={{ fontSize: '10px', color: '#aaa', marginLeft: '2px' }}>{c.company_count}</span>
                            </a>
                          ))}
                          <a
                            href={`/${slug}`}
                            style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '99px', border: '1px solid #e5e5e5', color: '#888', textDecoration: 'none', whiteSpace: 'nowrap' }}
                          >
                            もっと見る →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
