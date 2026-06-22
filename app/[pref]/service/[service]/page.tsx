import { createClient } from '@supabase/supabase-js'
import type { Company } from '@/types/company'
import { SECURITY_TYPE_LABELS, SECURITY_TYPE_COLORS, SECURITY_TYPE_DESCRIPTIONS } from '@/constants/securityTypes'
import { PREF_MAP } from '@/constants/prefs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 86400

export async function generateStaticParams() {
  const params = []
  for (const pref of Object.keys(PREF_MAP)) {
    for (const service of ['1', '2', '3', '4']) {
      params.push({ pref, service })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string; service: string }> }) {
  const { pref, service } = await params
  const prefName = PREF_MAP[pref]
  const num = parseInt(service)
  const label = SECURITY_TYPE_LABELS[num]
  if (!prefName || !label) return {}
  const title = `${prefName}の${label}会社一覧 | keibi.online`
  const description = `${prefName}の${label}（${SECURITY_TYPE_DESCRIPTIONS[num]}）対応警備会社を掲載。地域密着の警備会社を探せます。`
  return {
    title,
    description,
    alternates: { canonical: `https://keibi.online/${pref}/service/${service}` },
    openGraph: {
      title,
      description,
      url: `https://keibi.online/${pref}/service/${service}`,
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

export default async function PrefServicePage({ params }: { params: Promise<{ pref: string; service: string }> }) {
  const { pref, service } = await params
  const prefName = PREF_MAP[pref]
  const num = parseInt(service)
  const label = SECURITY_TYPE_LABELS[num]
  if (!prefName || !label) return <div>ページが見つかりません</div>

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, slug, name, zip, city, tel, url, numbers')
    .eq('pref_slug', pref)
    .contains('numbers', [num])
    .order('name')

  if (error || !companies) return <div>データの取得に失敗しました</div>

  // 広島2号警備はSAIZENを先頭に固定
  const sortedCompanies = (pref === 'hiroshima' && num === 2)
    ? [
        ...companies.filter((c: Company) => c.slug === 'saizen-666'),
        ...companies.filter((c: Company) => c.slug !== 'saizen-666'),
      ]
    : companies

  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt;{' '}
          <a href={`/${pref}`} style={{ color: '#999' }}>{prefName}</a> &gt;{' '}
          {label}
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '12px' }}>
          {prefName}の{label}会社一覧
        </h1>
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, marginBottom: '12px' }}>
          {SECURITY_TYPE_DESCRIPTIONS[num]}
        </p>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>
          {companies.length}社掲載 — 2026年6月更新
        </p>

        {/* 他の業務へのリンク */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].filter(n => n !== num).map(n => (
            <a
              key={n}
              href={`/${pref}/service/${n}`}
              style={{
                padding: '6px 14px',
                borderRadius: '99px',
                border: `1px solid ${SECURITY_TYPE_COLORS[n]}`,
                color: SECURITY_TYPE_COLORS[n],
                fontSize: '13px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {prefName}の{SECURITY_TYPE_LABELS[n]}
            </a>
          ))}
        </div>

        {/* おすすめ警備会社へのリンク */}
        <a href={`/${pref}/osusume`} style={{ textDecoration: 'none', display: 'block', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', borderRadius: '12px', border: '2px solid #f97316', padding: '16px 20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#c2410c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
              {prefName}のおすすめ警備会社ランキング
            </div>
            <div style={{ fontSize: '13px', color: '#f97316', fontWeight: 700 }}>
              ランキングを見る →
            </div>
          </div>
        </a>

        {sortedCompanies.length === 0 ? (
          <div style={{ color: '#999', textAlign: 'center', padding: '48px' }}>
            該当する警備会社が見つかりませんでした
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
            {sortedCompanies.map((c: Company) => (
              <a key={c.id} href={`/companies/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', background: 'white', height: '100%' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                    〒{c.zip} {c.city}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    📞 {c.tel}
                  </div>
                  <div>
                    {(c.numbers ?? []).map((n: number) => (
                      <span key={n} style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '99px',
                        background: SECURITY_TYPE_COLORS[n] + '22', color: SECURITY_TYPE_COLORS[n],
                        fontWeight: 600, marginRight: '4px', marginBottom: '4px',
                        display: 'inline-block'
                      }}>
                        {SECURITY_TYPE_LABELS[n]}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
