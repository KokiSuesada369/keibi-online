import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備',
  2: '2号警備',
  3: '3号警備',
  4: '4号警備',
}
const NUMBER_COLORS: Record<number, string> = {
  1: '#457b9d', 2: '#2a9d8f', 3: '#e76f51', 4: '#e63946',
}

const PREF_MAP: Record<string, string> = {
  hokkaido:'北海道', aomori:'青森県', iwate:'岩手県', miyagi:'宮城県',
  akita:'秋田県', yamagata:'山形県', fukushima:'福島県', ibaraki:'茨城県',
  tochigi:'栃木県', gunma:'群馬県', saitama:'埼玉県', chiba:'千葉県',
  tokyo:'東京都', kanagawa:'神奈川県', niigata:'新潟県', toyama:'富山県',
  ishikawa:'石川県', fukui:'福井県', yamanashi:'山梨県', nagano:'長野県',
  gifu:'岐阜県', shizuoka:'静岡県', aichi:'愛知県', mie:'三重県',
  shiga:'滋賀県', kyoto:'京都府', osaka:'大阪府', hyogo:'兵庫県',
  nara:'奈良県', wakayama:'和歌山県', tottori:'鳥取県', shimane:'島根県',
  okayama:'岡山県', hiroshima:'広島県', yamaguchi:'山口県', tokushima:'徳島県',
  kagawa:'香川県', ehime:'愛媛県', kochi:'高知県', fukuoka:'福岡県',
  saga:'佐賀県', nagasaki:'長崎県', kumamoto:'熊本県', oita:'大分県',
  miyazaki:'宮崎県', kagoshima:'鹿児島県', okinawa:'沖縄県',
}

export const revalidate = 86400

type Company = {
  id: number
  slug: string
  name: string
  zip: string
  city: string
  tel: string
  url: string
  numbers: number[]
}

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
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          {cd.city}の警備会社一覧
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          {companies.length}社掲載 — 2026年6月更新
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
                    <span key={num} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: NUMBER_COLORS[num] + '22', color: NUMBER_COLORS[num], fontWeight: 600, marginRight: '4px', marginBottom: '4px', display: 'inline-block' }}>
                      {NUMBER_LABELS[num]}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px', opacity: 0.7 }}>
        © 2026 keibi.online
      </footer>
    </main>
  )
}
