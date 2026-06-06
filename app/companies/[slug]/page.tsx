import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const SERVICE_NAMES: Record<number, string> = {
  1: '1号警備（施設警備）',
  2: '2号警備（交通誘導）',
  3: '3号警備（貴重品運搬）',
  4: '4号警備（身辺警備）',
}

const SERVICE_COLORS: Record<number, string> = {
  1: '#457b9d',
  2: '#2a9d8f',
  3: '#e76f51',
  4: '#e63946',
}

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
  const services = (company.numbers || []).map(n => SERVICE_NAMES[n]).filter(Boolean).join('・')
  return {
    title: `${company.name}｜${company.pref}${company.city}の警備会社 | keibi.online`,
    description: `${company.name}は${company.pref}${company.city}の警備会社です。${services}に対応しています。住所：${company.pref}${company.city}${company.address}`,
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data } = await supabase.from('companies').select('*').eq('slug', slug).single()
  if (!data) notFound()
  const company = data as Company
  const services = company.numbers || []

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
    areaServed: company.pref,
    description: `${company.name}は${company.pref}${company.city}の警備会社です。${services.map(n => SERVICE_NAMES[n]).filter(Boolean).join('・')}に対応しています。`,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <span key={n} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: `${SERVICE_COLORS[n]}20`, color: SERVICE_COLORS[n], border: `1px solid ${SERVICE_COLORS[n]}40`, fontWeight: 500 }}>
                {SERVICE_NAMES[n] || `${n}号警備`}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 4px' }}>{company.name}</h1>
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
              <div key={n} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${services.includes(n) ? SERVICE_COLORS[n] + '40' : '#f3f4f6'}`, background: services.includes(n) ? `${SERVICE_COLORS[n]}10` : '#f9fafb', fontSize: '13px', color: services.includes(n) ? SERVICE_COLORS[n] : '#aaa', fontWeight: services.includes(n) ? 500 : 400 }}>
                {services.includes(n) ? '✓ ' : ''}{SERVICE_NAMES[n]}
              </div>
            ))}
          </div>
        </div>

        {/* 都道府県リンクカード */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', margin: '0 0 1rem' }}>{company.pref}の警備会社を探す</h2>
          <Link href={`/${company.pref_slug}`} style={{ display: 'inline-block', fontSize: '13px', padding: '8px 16px', background: '#f97316', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
            {company.pref}の警備会社一覧 →
          </Link>
        </div>

      </div>
    </div>
  )
}
