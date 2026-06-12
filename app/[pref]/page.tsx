import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { safeJsonLd } from '@/app/lib/jsonld'
import type { Company } from '@/types/company'
import { SECURITY_TYPE_LABELS, SECURITY_TYPE_COLORS } from '@/constants/securityTypes'
import { PREF_MAP } from '@/constants/prefs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 86400

const UPDATED_LABEL = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' }) + '更新'

type CityTarget = {
  city: string
  city_slug: string
  company_count: number
}

export async function generateStaticParams() {
  return Object.keys(PREF_MAP).map(pref => ({ pref }))
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) return { title: 'ページが見つかりません | keibi.online' }
  return {
    title: `${prefName}の警備会社一覧 | keibi.online`,
    description: `${prefName}の警備会社を掲載。施設警備・交通誘導・雑踏警備・機械警備など業務別に検索できます。`,
    alternates: { canonical: `https://keibi.online/${pref}` },
    twitter: { card: 'summary_large_image' as const },
  }
}

export default async function PrefecturePage({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) notFound()

  const supabase = createClient(supabaseUrl, supabaseKey)

  const [{ data: companies, error }, { data: cities }] = await Promise.all([
    supabase
      .from('companies')
      .select('id, slug, name, zip, city, tel, url, numbers')
      .eq('pref_slug', pref)
      .order('featured', { ascending: false }).order('name'),
    supabase
      .from('city_page_targets')
      .select('city, city_slug, company_count')
      .eq('pref_slug', pref)
      .order('company_count', { ascending: false }),
  ])

  if (error || !companies) return <div>データの取得に失敗しました</div>

  // 構造化データ（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${prefName}の警備会社一覧`,
    'description': `${prefName}の警備会社${companies.length}社を掲載。施設警備・交通誘導警備・雑踏警備など業務別に検索できます。`,
    'numberOfItems': companies.length,
    'itemListElement': companies.slice(0, 10).map((c, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'LocalBusiness',
        'name': c.name,
        'url': `https://keibi.online/companies/${c.slug}`,
        ...(c.tel && { 'telephone': c.tel }),
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': prefName,
          'addressLocality': c.city,
          'addressCountry': 'JP',
        },
      },
    })),
  }

  const serviceLinks = [
    { num: 1, label: '1号警備', color: '#457b9d' },
    { num: 2, label: '2号警備', color: '#2a9d8f' },
    { num: 3, label: '3号警備', color: '#e76f51' },
    { num: 4, label: '4号警備', color: '#e63946' },
  ]

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
                { '@type': 'ListItem', position: 2, name: '警備会社一覧', item: 'https://keibi.online/prefecture' },
                { '@type': 'ListItem', position: 3, name: `${prefName}の警備会社`, item: `https://keibi.online/${pref}` },
              ]
            })
          }}
        />
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt; {prefName}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          {prefName}の警備会社一覧
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          {companies.length}社掲載 — {UPDATED_LABEL}
        </p>

        {cities && cities.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>市区町村から探す</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(cities as CityTarget[]).map(c => (
                <a key={c.city_slug} href={`/${pref}/${c.city_slug}`} style={{ padding: '6px 14px', borderRadius: '99px', border: '1px solid #e5e5e5', background: 'white', fontSize: '13px', color: '#1a1a2e', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  {c.city}
                  <span style={{ fontSize: '11px', color: '#999', marginLeft: '4px' }}>{c.company_count}社</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>業務から探す</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {serviceLinks.map(s => (
              <a key={s.num} href={`/${pref}/service/${s.num}`} style={{ padding: '6px 14px', borderRadius: '99px', border: `1px solid ${s.color}`, color: s.color, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap', fontWeight: 600 }}>
                {prefName}の{s.label}
              </a>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{prefName}の警備会社一覧</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {companies.map((c: Company) => (
            <a key={c.id} href={`/companies/${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', background: 'white', height: '100%' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                  {c.zip && `〒${c.zip} `}{c.city}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                  {c.tel && `📞 ${c.tel}`}
                </div>
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

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem', margin: '1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>
                {prefName}のおすすめ警備会社ランキング
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                交通誘導・施設・イベント・駐車場 業務別に厳選
              </div>
            </div>
            <a href={`/${pref}/osusume`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '12px' }}>
              ランキングを見る →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
