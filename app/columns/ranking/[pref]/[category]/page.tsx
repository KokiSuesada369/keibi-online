import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import hiroshimaRanking from '@/data/ranking/hiroshima'
import type { PrefRankingData, RankingCategory } from '@/data/ranking/hiroshima'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PREF_MAP: Record<string, string> = {
  hokkaido: '北海道', aomori: '青森県', iwate: '岩手県', miyagi: '宮城県',
  akita: '秋田県', yamagata: '山形県', fukushima: '福島県', ibaraki: '茨城県',
  tochigi: '栃木県', gunma: '群馬県', saitama: '埼玉県', chiba: '千葉県',
  tokyo: '東京都', kanagawa: '神奈川県', niigata: '新潟県', toyama: '富山県',
  ishikawa: '石川県', fukui: '福井県', yamanashi: '山梨県', nagano: '長野県',
  gifu: '岐阜県', shizuoka: '静岡県', aichi: '愛知県', mie: '三重県',
  shiga: '滋賀県', kyoto: '京都府', osaka: '大阪府', hyogo: '兵庫県',
  nara: '奈良県', wakayama: '和歌山県', tottori: '鳥取県', shimane: '島根県',
  okayama: '岡山県', hiroshima: '広島県', yamaguchi: '山口県', tokushima: '徳島県',
  kagawa: '香川県', ehime: '愛媛県', kochi: '高知県', fukuoka: '福岡県',
  saga: '佐賀県', nagasaki: '長崎県', kumamoto: '熊本県', oita: '大分県',
  miyazaki: '宮崎県', kagoshima: '鹿児島県', okinawa: '沖縄県',
}

const RANKINGS_BY_PREF: Partial<Record<string, PrefRankingData>> = {
  hiroshima: hiroshimaRanking,
}

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  warning: { bg: '#fff8e1', color: '#b45309' },
  danger:  { bg: '#fef2f2', color: '#b91c1c' },
  success: { bg: '#f0fdf4', color: '#166534' },
  info:    { bg: '#eff6ff', color: '#1d4ed8' },
}

type SupabaseCompany = {
  slug: string
  name: string
  pref: string
  city: string
  tel: string
  url: string
  numbers: number[]
}

export const revalidate = 86400

export async function generateStaticParams() {
  return Object.entries(RANKINGS_BY_PREF).flatMap(([pref, data]) =>
    Object.keys(data!.categories).map(category => ({ pref, category }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string; category: string }>
}): Promise<Metadata> {
  const { pref, category } = await params
  const prefName = PREF_MAP[pref]
  const data = RANKINGS_BY_PREF[pref]
  const cat = data?.categories[category as RankingCategory]
  if (!prefName || !cat) return { title: 'ページが見つかりません | keibi.online' }
  return {
    title: `${prefName}の${cat.label}会社おすすめランキング10選【${data!.updatedYear}年】 | keibi.online`,
    description: `${prefName}で${cat.label}会社をお探しの方へ。${cat.certLabel}に対応する地元優良警備会社をランキング形式で厳選。料金相場・失敗しない選び方も解説します。`,
    twitter: {
      card: 'summary_large_image',
      title: `${prefName}の${cat.label}会社おすすめランキング10選【${data!.updatedYear}年】`,
      description: `${prefName}で${cat.label}会社をお探しの方へ。${cat.certLabel}に対応する地元優良警備会社をランキング形式で厳選。`,
    },
  }
}

export default async function RankingPage({
  params,
}: {
  params: Promise<{ pref: string; category: string }>
}) {
  const { pref, category } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) notFound()
  const rankingData = RANKINGS_BY_PREF[pref]
  if (!rankingData) notFound()
  const cat = rankingData.categories[category as RankingCategory]
  if (!cat) notFound()

  // Fetch Supabase details for companies that have a slug
  const slugs = cat.companies.map(c => c.slug).filter((s): s is string => !!s)
  let supabaseMap: Record<string, SupabaseCompany> = {}
  if (slugs.length > 0) {
    const { data } = await supabase
      .from('companies')
      .select('slug, name, pref, city, tel, url, numbers')
      .in('slug', slugs)
    for (const c of data ?? []) {
      supabaseMap[c.slug] = c
    }
  }

  const bc = BADGE_COLORS[cat.badgeColor] ?? BADGE_COLORS.info
  const otherCategories = (Object.keys(rankingData.categories) as RankingCategory[]).filter(
    k => k !== category
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${prefName}の${cat.label}会社おすすめランキング`,
            description: cat.description,
            numberOfItems: cat.companies.length,
            itemListElement: cat.companies.map(company => ({
              '@type': 'ListItem',
              position: company.rank,
              name: company.name,
              url: company.slug ? `https://keibi.online/companies/${company.slug}` : `https://keibi.online/${pref}`,
            }))
          })
        }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/${pref}`} style={{ color: '#999', textDecoration: 'none' }}>{prefName}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{cat.label}ランキング</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 8px' }}>
          {prefName}の{cat.label}会社おすすめランキング10選【{rankingData.updatedYear}年最新版】
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem', lineHeight: 1.7 }}>
          {cat.description}
        </p>
        <p style={{ fontSize: '13px', color: '#999', marginBottom: '2rem' }}>
          {cat.companies.length}社掲載 — {rankingData.updatedYear}年6月更新
        </p>

        {/* 選び方のポイント */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: '0 0 10px' }}>
            選び方のポイント
          </h2>
          <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cat.points.map((p, i) => (
              <li key={i} style={{ fontSize: '13px', color: '#444', lineHeight: 1.7 }}>{p}</li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', margin: '0 0 10px' }}>よくある質問</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', margin: '0 0 4px' }}>Q. {prefName}で{cat.label}会社を選ぶ際のポイントは？</p>
              <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, margin: 0 }}>A. {cat.points[0]}</p>
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '14px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', margin: '0 0 4px' }}>Q. {cat.label}の料金相場はどのくらいですか？</p>
              <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, margin: 0 }}>A. {cat.certLabel}の料金は依頼内容・時間帯・人数によって異なります。複数社から見積もりを取り比較することを推奨します。まずはお気軽にお問い合わせください。</p>
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '14px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', margin: '0 0 4px' }}>Q. 急ぎで{cat.label}を依頼したい場合はどうすれば良いですか？</p>
              <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.8, margin: 0 }}>A. 対応スピードの早い地域密着型の警備会社への直接問い合わせが最も早い方法です。このページのランキング上位の会社は対応力が高い会社を厳選しています。</p>
            </div>
          </div>
        </div>

        {/* ランキング一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2.5rem' }}>
          {cat.companies.map((company) => {
            const sb = company.slug ? supabaseMap[company.slug] : undefined
            const isTop3 = company.rank <= 3
            const cardContent = (
              <div
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: company.rank === 1 ? '2px solid #f97316' : '1px solid #e5e7eb',
                  padding: '1.5rem',
                  position: 'relative',
                  cursor: sb ? 'pointer' : 'default',
                }}
              >
                {company.rank === 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '16px',
                      background: '#f97316',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '3px 12px',
                      borderRadius: '20px',
                    }}
                  >
                    No.1 おすすめ
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isTop3 ? '#f97316' : '#e5e7eb',
                      color: isTop3 ? '#fff' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '15px',
                    }}
                  >
                    {company.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 4px' }}>
                      {company.name}
                    </h2>
                    <p style={{ fontSize: '13px', color: '#666', margin: '0 0 4px' }}>
                      {company.address}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px' }}>
                      {company.certification}
                    </p>
                    {/* タグ */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {company.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: bc.bg,
                            color: bc.color,
                            fontWeight: 600,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: '13px', color: '#444', margin: '0 0 10px', lineHeight: 1.7 }}>
                      {company.description}
                    </p>
                    {/* おすすめポイント */}
                    <div
                      style={{
                        background: '#fafafa',
                        borderLeft: '3px solid #f97316',
                        padding: '8px 12px',
                        borderRadius: '0 6px 6px 0',
                        marginBottom: sb?.tel ? '8px' : 0,
                      }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f97316' }}>こんな方におすすめ</span>
                      <p style={{ fontSize: '13px', color: '#555', margin: '2px 0 0', lineHeight: 1.6 }}>
                        {company.recommendation}
                      </p>
                    </div>
                    {sb?.tel && (
                      <p style={{ fontSize: '13px', color: '#888', margin: '8px 0 0' }}>📞 {sb.tel}</p>
                    )}
                  </div>
                  {sb && (
                    <div style={{ fontSize: '12px', color: '#f97316', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      詳細を見る →
                    </div>
                  )}
                </div>
              </div>
            )

            return sb ? (
              <Link key={company.rank} href={`/companies/${sb.slug}`} style={{ textDecoration: 'none' }}>
                {cardContent}
              </Link>
            ) : (
              <div key={company.rank}>{cardContent}</div>
            )
          })}
        </div>

        {/* 他カテゴリへのリンク */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>
            他のカテゴリも見る
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {otherCategories.map(key => (
              <Link
                key={key}
                href={`/columns/ranking/${pref}/${key}`}
                style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}
              >
                {prefName}{rankingData.categories[key].label}ランキングを見る →
              </Link>
            ))}
          </div>
        </div>

        {/* 関連リンク */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>
            関連情報
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={`/${pref}`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              {prefName}の警備会社一覧を見る →
            </Link>
            <Link href={`/${pref}/osusume`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              {prefName}のおすすめ警備会社ランキングを見る →
            </Link>
            <Link href="/request" style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              かんたん警備依頼・無料で問い合わせる →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
