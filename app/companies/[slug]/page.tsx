import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { generateDescription } from '@/app/companies/description'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備（施設警備）',
  2: '2号警備（交通誘導警備）',
  3: '3号警備（貴重品運搬警備）',
  4: '4号警備（身辺警備）',
}
const NUMBER_COLORS: Record<number, string> = {
  1: '#457b9d', 2: '#2a9d8f', 3: '#e76f51', 4: '#e63946',
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
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const allSlugs: { slug: string }[] = []
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
      allSlugs.push(...data)
      from += pageSize
      if (data.length < pageSize) hasMore = false
    }
  }
  return allSlugs.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: c } = await supabase
    .from('companies')
    .select('name, pref, city, numbers')
    .eq('slug', slug)
    .single()
  if (!c) return {}
  const desc = generateDescription({ name: c.name, pref: c.pref, city: c.city, zip: '', address: '', tel: '', url: '', numbers: c.numbers ?? [] })
  return {
    title: `${c.name} | ${c.pref}${c.city}の警備会社 | keibi.online`,
    description: desc.slice(0, 120),
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!company) notFound()
  const c = company as Company

  const description = generateDescription(c)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': c.name,
    'description': description,
    'address': {
      '@type': 'PostalAddress',
      'postalCode': c.zip,
      'addressRegion': c.pref,
      'addressLocality': c.city,
      'streetAddress': c.address,
      'addressCountry': 'JP',
    },
    ...(c.tel && { 'telephone': c.tel }),
    ...(c.url && { 'url': c.url }),
    'areaServed': c.pref,
  }

  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header style={{ background: '#1a1a2e', color: 'white', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <a href="/" style={{ fontWeight: 800, fontSize: '20px', color: 'white', textDecoration: 'none' }}>
            keibi<span style={{ color: '#e63946' }}>.online</span>
          </a>
          <nav style={{ display: 'flex', gap: '20px', fontSize: '13px', flexWrap: 'wrap' }}>
            <a href="/prefecture" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>都道府県から探す</a>
            <a href="/column" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>コラム</a>
            <a href="/contact" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>お問い合わせ</a>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '20px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt;{' '}
          <a href={`/${c.pref_slug}`} style={{ color: '#999' }}>{c.pref}</a> &gt;{' '}
          {c.name}
        </div>

        {/* 会社名 */}
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '24px', color: '#1a1a2e' }}>{c.name}</h1>

        {/* 基本情報カード */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', width: '100px', fontWeight: 600 }}>所在地</td>
                <td style={{ padding: '12px 0', color: '#1a1a2e' }}>
                  {c.zip && `〒${c.zip} `}{c.pref}{c.city}{c.address}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', fontWeight: 600 }}>電話番号</td>
                <td style={{ padding: '12px 0' }}>
                  {c.tel
                    ? <a href={`tel:${c.tel}`} style={{ color: '#e63946', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>📞 {c.tel}</a>
                    : <span style={{ color: '#999' }}>—</span>}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', fontWeight: 600 }}>ウェブサイト</td>
                <td style={{ padding: '12px 0' }}>
                  {c.url
                    ? <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: '#457b9d', wordBreak: 'break-all' }}>{c.url}</a>
                    : <span style={{ color: '#999' }}>—</span>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 対応業務 */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1a1a2e' }}>対応している警備業務</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(c.numbers ?? []).map((num: number) => (
              <div key={num} style={{ border: `1.5px solid ${NUMBER_COLORS[num]}`, borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ background: NUMBER_COLORS[num], color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', marginTop: '2px' }}>
                  {NUMBER_LABELS[num].split('（')[0]}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: NUMBER_COLORS[num], fontSize: '14px', marginBottom: '4px' }}>{NUMBER_LABELS[num]}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {num === 1 && '施設警備・巡回警備・機械警備・保安警備・空港保安警備などが含まれます'}
                    {num === 2 && '交通誘導警備・雑踏警備などが含まれます'}
                    {num === 3 && '現金・貴重品の輸送警備などが含まれます'}
                    {num === 4 && '要人・個人の身辺警護などが含まれます'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 自動生成紹介文 */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a2e' }}>会社紹介</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.9, color: '#444' }}>{description}</p>
        </div>

        {/* 関連リンク */}
        <div style={{ background: '#f0f4f8', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', fontWeight: 600 }}>
            {c.pref}の他の警備会社
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href={`/${c.pref_slug}`} style={{ padding: '6px 14px', borderRadius: '99px', border: '1px solid #1a1a2e', color: '#1a1a2e', fontSize: '13px', textDecoration: 'none', background: 'white' }}>
              {c.pref}の警備会社一覧
            </a>
            {(c.numbers ?? []).map((num: number) => (
              <a key={num} href={`/${c.pref_slug}/service/${num}`} style={{ padding: '6px 14px', borderRadius: '99px', border: `1px solid ${NUMBER_COLORS[num]}`, color: NUMBER_COLORS[num], fontSize: '13px', textDecoration: 'none', background: 'white' }}>
                {c.pref}の{NUMBER_LABELS[num].split('（')[0]}
              </a>
            ))}
          </div>
        </div>

        <a href={`/${c.pref_slug}`} style={{ color: '#457b9d', fontSize: '14px' }}>
          ← {c.pref}の警備会社一覧に戻る
        </a>
      </div>

      <footer style={{ background: '#1a1a2e', color: 'white', padding: '40px 24px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>
            keibi<span style={{ color: '#e63946' }}>.online</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <a href="/prefecture" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>都道府県から探す</a>
            <a href="/column" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>コラム</a>
            <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>お問い合わせ</a>
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '13px', opacity: 0.4 }}>
          © 2026 keibi.online All rights reserved.
        </div>
      </footer>
    </main>
  )
}
