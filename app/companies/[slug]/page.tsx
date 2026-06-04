import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備（施設警備）',
  2: '2号警備（交通誘導警備）',
  3: '3号警備（貴重品運搬警備）',
  4: '4号警備（身辺警備）',
}
const NUMBER_COLORS: Record<number, string> = {
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
    .select('name, pref, city')
    .eq('slug', slug)
    .single()
  if (!c) return {}
  return {
    title: `${c.name} | ${c.pref}${c.city}の警備会社 | keibi.online`,
    description: `${c.name}（${c.pref}${c.city}）の警備会社情報。対応業務・所在地・電話番号を掲載。施設警備・交通誘導警備など対応業務を確認できます。`,
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

  // 構造化データ（JSON-LD）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': c.name,
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
    'description': `${c.pref}${c.city}の警備会社。${(c.numbers ?? []).map((n: number) => NUMBER_LABELS[n]).join('・')}に対応。`,
  }

  return (
    <main>
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header style={{ background: '#1a1a2e', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '20px', color: 'white', textDecoration: 'none' }}>keibi.online</a>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', flexWrap: 'wrap' }}>
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
          <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>お問い合わせ</a>
        </nav>
      </header>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt;{' '}
          <a href={`/${c.pref_slug}`} style={{ color: '#999' }}>{c.pref}</a> &gt;{' '}
          {c.name}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>{c.name}</h1>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', width: '120px', fontWeight: 500 }}>所在地</td>
                <td style={{ padding: '12px 0' }}>
                  {c.zip && `〒${c.zip} `}{c.pref}{c.city}{c.address}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', fontWeight: 500 }}>電話番号</td>
                <td style={{ padding: '12px 0' }}>
                  {c.tel
                    ? <a href={`tel:${c.tel}`} style={{ color: '#1a1a2e' }}>{c.tel}</a>
                    : '—'}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px 12px 0', color: '#666', fontWeight: 500 }}>ホームページ</td>
                <td style={{ padding: '12px 0' }}>
                  {c.url
                    ? <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: '#457b9d' }}>{c.url}</a>
                    : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>対応している警備業務</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {(c.numbers ?? []).map((num: number) => (
            <div key={num} style={{ background: 'white', border: `2px solid ${NUMBER_COLORS[num]}`, borderRadius: '8px', padding: '16px 20px' }}>
              <div style={{ fontWeight: 700, color: NUMBER_COLORS[num], marginBottom: '4px' }}>{NUMBER_LABELS[num]}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {num === 1 && '施設警備・巡回警備・機械警備・保安警備・空港保安警備などが含まれます'}
                {num === 2 && '交通誘導警備・雑踏警備などが含まれます'}
                {num === 3 && '現金・貴重品の輸送警備などが含まれます'}
                {num === 4 && '要人・個人の身辺警護などが含まれます'}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: '#f0f4f8', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
            {c.pref}の他の警備会社も見る
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href={`/${c.pref_slug}`} style={{ padding: '6px 14px', borderRadius: '99px', border: '1px solid #1a1a2e', color: '#1a1a2e', fontSize: '13px', textDecoration: 'none' }}>
              {c.pref}の警備会社一覧
            </a>
            {(c.numbers ?? []).map((num: number) => (
              <a key={num} href={`/${c.pref_slug}/service/${num}`} style={{ padding: '6px 14px', borderRadius: '99px', border: `1px solid ${NUMBER_COLORS[num]}`, color: NUMBER_COLORS[num], fontSize: '13px', textDecoration: 'none' }}>
                {c.pref}の{NUMBER_LABELS[num].split('（')[0]}
              </a>
            ))}
          </div>
        </div>
        <a href={`/${c.pref_slug}`} style={{ color: '#457b9d', fontSize: '14px' }}>
          ← {c.pref}の警備会社一覧に戻る
        </a>
      </div>
      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>コラム</a>
          <a href="/contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.7 }}>お問い合わせ</a>
        </div>
        <div style={{ opacity: 0.5 }}>© 2026 keibi.online</div>
      </footer>
    </main>
  )
}
