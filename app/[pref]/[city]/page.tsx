import { createClient } from '@supabase/supabase-js'
import type { Company } from '@/types/company'
import { SECURITY_TYPE_LABELS, SECURITY_TYPE_COLORS } from '@/constants/securityTypes'
import { PREF_MAP } from '@/constants/prefs'
import { safeJsonLd } from '@/app/lib/jsonld'
import { generateCityDescription, generateCityFaq } from './cityContent'

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
  const title = `${data.city}の警備会社一覧｜施設警備・交通誘導などに対応 | keibi.online`
  const description = `${data.city}（${data.pref}）の警備会社を掲載。施設警備・交通誘導・雑踏警備など業務別に検索できます。料金相場や警備会社の選び方も解説。`
  return {
    title,
    description,
    alternates: { canonical: `https://keibi.online/${pref}/${city}` },
    openGraph: {
      title,
      description,
      url: `https://keibi.online/${pref}/${city}`,
      siteName: 'keibi.online',
      locale: 'ja_JP',
      type: 'website',
      images: [{ url: 'https://keibi.online/ogp.png', width: 1200, height: 630, alt: 'keibi.online' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: ['https://keibi.online/ogp.png'],
    },
  }
}

const SERVICE_LINKS = [
  { num: 1, label: '1号警備（施設）', color: '#457b9d' },
  { num: 2, label: '2号警備（交通誘導）', color: '#2a9d8f' },
  { num: 3, label: '3号警備（貴重品運搬）', color: '#e76f51' },
  { num: 4, label: '4号警備（身辺）', color: '#e63946' },
]

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
  const companyList = companies as Company[]

  // 対応業務（1〜4号）の社数を集計
  const serviceCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  companyList.forEach(c => {
    ;(c.numbers ?? []).forEach((n: number) => {
      if (serviceCounts[n] !== undefined) serviceCounts[n] += 1
    })
  })

  const contentInput = { pref: prefName, city: cd.city, citySlug: city, count: companyList.length, serviceCounts }
  const description = generateCityDescription(contentInput)
  const faqs = generateCityFaq(contentInput)

  // 構造化データ
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cd.city}の警備会社一覧`,
    numberOfItems: companyList.length,
    itemListElement: companyList.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: c.name,
        url: `https://keibi.online/companies/${c.slug}`,
        ...(c.tel && { telephone: c.tel }),
        address: { '@type': 'PostalAddress', addressRegion: prefName, addressLocality: cd.city, addressCountry: 'JP' },
      },
    })),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
      { '@type': 'ListItem', position: 2, name: '都道府県一覧', item: 'https://keibi.online/prefecture' },
      { '@type': 'ListItem', position: 3, name: prefName, item: `https://keibi.online/${pref}` },
      { '@type': 'ListItem', position: 4, name: cd.city, item: `https://keibi.online/${pref}/${city}` },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

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
        <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.8, marginBottom: '20px' }}>
          {companyList.length}社掲載 — {UPDATED_LABEL}
        </p>

        {/* 導入解説文 */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderLeft: '4px solid #f97316', borderRadius: '8px', padding: '18px 20px', marginBottom: '28px' }}>
          {description.map((p, i) => (
            <p key={i} style={{ fontSize: '14px', color: '#374151', lineHeight: 1.9, margin: i === 0 ? '0 0 10px' : 0 }}>{p}</p>
          ))}
        </div>

        {/* 対応業務の内訳 */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1f2937' }}>{cd.city}で対応している警備業務</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SERVICE_LINKS.map(s => (
              <a key={s.num} href={`/${pref}/service/${s.num}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: `1px solid ${s.color}40`, background: `${s.color}10`, color: s.color, fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                {s.label}
                <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>{serviceCounts[s.num] ?? 0}社</span>
              </a>
            ))}
          </div>
        </div>

        {/* 会社一覧 */}
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: '#1f2937' }}>掲載中の警備会社</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {companyList.map(c => (
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

        {/* FAQ */}
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: '#1f2937' }}>{cd.city}の警備会社に関するよくある質問</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '8px', padding: '13px 16px', background: '#f8f9fa', fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>
                <span style={{ color: '#f97316', fontWeight: 800 }}>Q.</span>{f.q}
              </div>
              <div style={{ display: 'flex', gap: '8px', padding: '13px 16px', fontSize: '13px', color: '#4b5563', lineHeight: 1.8 }}>
                <span style={{ color: '#2a9d8f', fontWeight: 800 }}>A.</span><span>{f.a}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 関連リンク */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <a href={`/${pref}`} style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>→ {prefName}の警備会社一覧</a>
          <a href={`/${pref}/osusume`} style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>→ {prefName}のおすすめ警備会社ランキング</a>
          <a href="/column/cost-001" style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>→ 交通誘導警備の料金相場</a>
          <a href="/column/guide-001" style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>→ 警備会社の選び方</a>
        </div>
      </div>
    </main>
  )
}
