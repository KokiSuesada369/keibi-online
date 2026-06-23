import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'
import { generateDescription } from '@/app/companies/description'
import { safeJsonLd } from '@/app/lib/jsonld'
import { SECURITY_TYPE_LABELS, SECURITY_TYPE_COLORS } from '@/constants/securityTypes'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 86400

type Company = {
  id: number
  slug: string
  name: string
  zip: string
  pref: string
  pref_slug: string
  city: string
  address: string
  tel: string
  url: string
  numbers: number[]
  city_slug: string
  featured: boolean
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data } = await supabase.from('companies').select('*').eq('slug', slug).single()
  if (!data) return { title: '会社が見つかりません | keibi.online' }
  const company = data as Company
  const services = (company.numbers || []).map(n => SECURITY_TYPE_LABELS[n]).filter(Boolean).join('・')
  const title = `${company.name}｜${company.pref}${company.city}の警備会社 | keibi.online`
  const description = `${company.name}は${company.pref}${company.city}の警備会社です。${services}に対応しています。住所：${company.pref}${company.city}${company.address}`
  return {
    title,
    description,
    alternates: { canonical: `https://keibi.online/companies/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://keibi.online/companies/${slug}`,
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

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data } = await supabase.from('companies').select('*').eq('slug', slug).single()
  if (!data) notFound()
  const company = data as Company
  const services = company.numbers || []

  // 内部リンク強化: 同じ市区町村（不足時は同一県）の他の警備会社を取得
  // 企業ページ同士をつなぎ、クロール・インデックスを促進する
  let { data: nearbyData } = await supabase
    .from('companies')
    .select('slug, name, city, numbers')
    .eq('pref_slug', company.pref_slug)
    .eq('city_slug', company.city_slug)
    .neq('slug', company.slug)
    .limit(8)
  if (!nearbyData || nearbyData.length < 4) {
    const { data: prefData } = await supabase
      .from('companies')
      .select('slug, name, city, numbers')
      .eq('pref_slug', company.pref_slug)
      .neq('slug', company.slug)
      .limit(8)
    nearbyData = prefData ?? nearbyData
  }
  const nearby = (nearbyData ?? []) as { slug: string; name: string; city: string; numbers: number[] }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.name,
    address: {
      '@type': 'PostalAddress',
      postalCode: company.zip,
      addressPrefecture: company.pref,
      addressLocality: company.city,
      streetAddress: company.address,
      addressCountry: 'JP',
    },
    telephone: company.tel || undefined,
    url: company.url || undefined,
    areaServed: { '@type': 'AdministrativeArea', name: company.pref },
    description: `${company.name}は${company.pref}${company.city}の警備会社です。${services.map(n => SECURITY_TYPE_LABELS[n]).filter(Boolean).join('・')}に対応しています。`,
    ...(services.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '警備サービス',
        itemListElement: services.map(n => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: SECURITY_TYPE_LABELS[n] },
        })),
      },
    }),
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
              { '@type': 'ListItem', position: 2, name: company.pref, item: `https://keibi.online/${company.pref_slug}` },
              { '@type': 'ListItem', position: 3, name: company.name, item: `https://keibi.online/companies/${company.slug}` },
            ],
          })}}
        />

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/${company.pref_slug}`} style={{ color: '#999', textDecoration: 'none' }}>{company.pref}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{company.name}</span>
        </div>

        {/* メインカード */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '2rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
            {services.map(n => (
              <span key={n} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: `${SECURITY_TYPE_COLORS[n]}20`, color: SECURITY_TYPE_COLORS[n], border: `1px solid ${SECURITY_TYPE_COLORS[n]}40`, fontWeight: 500 }}>
                {SECURITY_TYPE_LABELS[n] || `${n}号警備`}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#111', margin: '0 0 4px', lineHeight: '1.4', wordBreak: 'break-all' }}>{company.name}</h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '0 0 1.5rem' }}>{company.pref}{company.city}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '13px', color: '#aaa', width: '80px', flexShrink: 0 }}>所在地</span>
              <span style={{ fontSize: '13px', color: '#444' }}>〒{company.zip} {company.pref}{company.city}{company.address}</span>
            </div>
            {company.tel && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#aaa', width: '80px', flexShrink: 0 }}>電話番号</span>
                <a href={`tel:${company.tel}`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>{company.tel}</a>
              </div>
            )}
            {company.url && (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#aaa', width: '80px', flexShrink: 0 }}>ウェブサイト</span>
                <a href={company.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none', wordBreak: 'break-all' }}>{company.url}</a>
              </div>
            )}
          </div>
        </div>

        {/* 対応業務カード */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>対応業務</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${services.includes(n) ? SECURITY_TYPE_COLORS[n] + '40' : '#f3f4f6'}`, background: services.includes(n) ? `${SECURITY_TYPE_COLORS[n]}10` : '#f9fafb', fontSize: '13px', color: services.includes(n) ? SECURITY_TYPE_COLORS[n] : '#aaa', fontWeight: services.includes(n) ? 500 : 400 }}>
                {services.includes(n) ? '✓ ' : ''}{SECURITY_TYPE_LABELS[n]}
              </div>
            ))}
          </div>
        </div>

        {/* 会社紹介カード */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>会社紹介</h2>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.8', margin: 0 }}>
            {generateDescription(company)}
          </p>
        </div>

        {/* 関連ランキング */}
        {services.some(n => [1, 2].includes(n)) && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>{company.pref}の警備会社ランキング</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.includes(2) && (
                <Link href={`/columns/ranking/${company.pref_slug}/kotsu`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
                  {company.pref}の交通誘導警備会社ランキングを見る →
                </Link>
              )}
              {services.includes(1) && (
                <Link href={`/columns/ranking/${company.pref_slug}/shisetsu`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
                  {company.pref}の施設警備会社ランキングを見る →
                </Link>
              )}
              {services.includes(2) && (
                <Link href={`/columns/ranking/${company.pref_slug}/event`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
                  {company.pref}のイベント警備会社ランキングを見る →
                </Link>
              )}
              <Link href={`/${company.pref_slug}/osusume`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
                {company.pref}のおすすめ警備会社ランキングを見る →
              </Link>
            </div>
          </div>
        )}

        {/* 同じエリアの警備会社（内部リンク強化） */}
        {nearby.length > 0 && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>
              {company.city ? `${company.city}の他の警備会社` : `${company.pref}の他の警備会社`}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
              {nearby.map(n => (
                <Link key={n.slug} href={`/companies/${n.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px 12px', height: '100%' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px', lineHeight: 1.4 }}>{n.name}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {(n.numbers ?? []).map(num => (
                        <span key={num} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '99px', background: SECURITY_TYPE_COLORS[num] + '22', color: SECURITY_TYPE_COLORS[num], fontWeight: 600 }}>
                          {SECURITY_TYPE_LABELS[num]}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 都道府県リンクカード */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>{company.pref}の警備会社を探す</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Link href={`/${company.pref_slug}`} style={{ display: 'inline-block', fontSize: '13px', padding: '8px 16px', background: '#f97316', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
              {company.pref}の警備会社一覧 →
            </Link>
            {company.city_slug && (
              <Link href={`/${company.pref_slug}/${company.city_slug}`} style={{ display: 'inline-block', fontSize: '13px', padding: '8px 16px', background: '#fff', color: '#f97316', border: '1px solid #f97316', borderRadius: '8px', textDecoration: 'none' }}>
                {company.city}の警備会社一覧 →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
