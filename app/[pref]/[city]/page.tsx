import { createClient } from '@supabase/supabase-js'
import type { Company } from '@/types/company'
import { SECURITY_TYPE_LABELS, SECURITY_TYPE_COLORS } from '@/constants/securityTypes'
import { PREF_MAP } from '@/constants/prefs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 3600

const UPDATED_LABEL = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }) + '更新'

type CityData = {
  city: string
  company_count: number
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('city_page_targets')
    .select('pref_slug, city_slug')

  return (data ?? []).map(row => ({
    pref: row.pref_slug,
    city: row.city_slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string; city: string }> }) {
  const { pref, city } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data } = await supabase
    .from('city_page_targets')
    .select('city, pref')
    .eq('pref_slug', pref)
    .eq('city_slug', city)
    .single()

  if (!data) return {}
  return {
    title: `${data.city}の警備会社一覧 | keibi.online`,
    description: `${data.city}（${data.pref}）の警備会社を掲載。施設警備・交通誘導・雑踏警備など業務別に検索できます。`,
    alternates: { canonical: `https://keibi.online/${pref}/${city}` },
  }
}

export default async function CityPage({ params }: { params: Promise<{ pref: string; city: string }> }) {
  const { pref, city } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) return <div>都道府県が見つかりません</div>

  const supabase = createClient(supabaseUrl, supabaseKey)

  const [{ data: cityData }, { data: companies, error }] = await Promise.all([
    supabase
      .from('city_page_targets')
      .select('city, company_count')
      .eq('pref_slug', pref)
      .eq('city_slug', city)
      .single(),
    supabase
      .from('companies')
      .select('id, slug, name, zip, city, tel, url, numbers')
      .eq('pref_slug', pref)
      .eq('city_slug', city)
      .order('name'),
  ])

  if (!cityData) return <div>市区町村が見つかりません</div>
  if (error || !companies) return <div>データの取得に失敗しました</div>

  const cd = cityData as CityData

  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt;{' '}
          <a href={`/${pref}`} style={{ color: '#999' }}>{prefName}</a> &gt;{' '}
          {cd.city}
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '12px' }}>
          {cd.city}の警備会社一覧
        </h1>
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
          {companies.length}社掲載 — {UPDATED_LABEL}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {(companies as Company[]).map(c => (
            <a key={c.id} href={`/companies/${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', background: 'white', height: '100%' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>〒{c.zip} {c.city}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>📞 {c.tel}</div>
                <div>
                  {(c.numbers ?? []).map((num: number) => (
                    <span key={num} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: SECURITY_TYPE_COLORS[num] + '22', color: SECURITY_TYPE_COLORS[num], fontWeight: 600, marginRight: '4px', marginBottom: '4px', display: 'inline-block' }}>
                      {SECURITY_TYPE_LABELS[num]}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
