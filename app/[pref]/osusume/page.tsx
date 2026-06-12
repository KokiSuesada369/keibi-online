import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { generateIntro } from '@/data/companyIntro'
import { safeJsonLd } from '@/app/lib/jsonld'
import { SECURITY_TYPE_LABELS } from '@/constants/securityTypes'
import { PREF_MAP } from '@/constants/prefs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PREF_FEATURES: Record<string, string> = {
  hokkaido: '北海道は広大な土地と豊富な観光資源を持ち、施設警備・イベント警備の需要が高い地域です。冬季の積雪対応や観光シーズンの雑踏警備など、地域特有のニーズに対応できる会社を選ぶことが重要です。',
  aomori: '青森県は観光業・農業が盛んな地域で、季節ごとのイベント警備や施設警備の需要があります。地域密着型の警備会社が多く、地元の現場事情に精通した業者を選ぶことが大切です。',
  iwate: '岩手県は広い県土を持ち、建設現場や道路工事での交通誘導警備の需要が高い地域です。地域全域をカバーできる警備会社を選ぶことが重要です。',
  miyagi: '宮城県は東北最大の都市・仙台を擁し、商業施設・オフィスビル・イベント会場での警備需要が高い地域です。復興関連の建設現場でも交通誘導警備の需要が続いています。',
  akita: '秋田県は工業地帯や観光地を持ち、施設警備・交通誘導警備の需要があります。広い県土をカバーできる機動力のある警備会社を選ぶことが重要です。',
  yamagata: '山形県は製造業・観光業が盛んな地域で、工場や観光施設での警備需要があります。季節ごとのイベント警備にも対応できる会社を選びましょう。',
  fukushima: '福島県は復興関連工事や工業地帯での交通誘導警備の需要が高い地域です。広い県土をカバーできる体制を持つ警備会社を選ぶことが大切です。',
  ibaraki: '茨城県は工業地帯・農業地帯が広がり、工場・建設現場での警備需要が高い地域です。つくば市周辺の研究施設や商業施設での施設警備も盛んです。',
  tochigi: '栃木県は製造業・観光業が盛んな地域で、工場警備・観光施設警備・交通誘導警備の需要があります。日光などの観光地でのイベント警備も重要です。',
  gunma: '群馬県は製造業が盛んな地域で、工場・建設現場での警備需要が高い地域です。観光地でのイベント警備にも対応できる会社を選びましょう。',
  saitama: '埼玉県は首都圏に位置し、商業施設・オフィスビル・建設現場での警備需要が非常に高い地域です。交通誘導から施設警備まで幅広く対応できる会社が多く揃っています。',
  chiba: '千葉県は成田空港・東京ディズニーリゾート周辺など特殊な警備ニーズも多い地域です。空港保安・施設警備・交通誘導など幅広い業務に対応できる会社を選びましょう。',
  tokyo: '東京都は全国最多の警備会社が集中する地域です。大規模施設・オフィスビル・イベント会場など多様な現場に対応できる会社が揃っています。実績と対応業務の幅広さを重視して選びましょう。',
  kanagawa: '神奈川県は横浜・川崎を中心に商業施設・工場・港湾施設での警備需要が高い地域です。大規模イベントへの対応実績がある会社を選ぶことが重要です。',
  niigata: '新潟県は日本海側最大の都市を擁し、工業・農業・観光業が盛んな地域です。冬季の積雪対応ができる警備会社を選ぶことも重要なポイントです。',
  toyama: '富山県は製造業が盛んな工業県で、工場・建設現場での警備需要が高い地域です。立山連峰の観光地でのイベント警備にも対応できる会社を選びましょう。',
  ishikawa: '石川県は金沢を中心に観光業・製造業が盛んな地域です。観光施設・文化施設での施設警備や、イベント時の雑踏警備に対応できる会社を選びましょう。',
  fukui: '福井県は製造業が盛んな地域で、工場・建設現場での交通誘導警備の需要があります。北陸新幹線延伸に伴う建設現場での警備需要も高まっています。',
  yamanashi: '山梨県は富士山周辺の観光地を持ち、観光シーズンの雑踏警備・イベント警備の需要が高い地域です。ブドウ・ワイン産業関連施設の警備も重要です。',
  nagano: '長野県は山岳観光・スキーリゾートを持ち、季節ごとの観光客対応が必要な地域です。広い県土をカバーできる警備会社を選ぶことが重要です。',
  gifu: '岐阜県は製造業・観光業が盛んな地域で、工場警備・観光施設警備の需要があります。白川郷などの観光地でのイベント警備にも対応できる会社を選びましょう。',
  shizuoka: '静岡県は製造業・観光業・農業が盛んな地域です。富士山周辺の観光警備から工場・物流施設の警備まで幅広いニーズに対応できる会社を選びましょう。',
  aichi: '愛知県は製造業・自動車産業の中心地で、工場・物流施設での警備需要が非常に高い地域です。大規模施設・イベント会場への対応実績がある会社を選ぶことが重要です。',
  mie: '三重県は伊勢神宮を擁する観光県で、観光シーズンの雑踏警備・施設警備の需要が高い地域です。製造業関連施設の警備にも対応できる会社を選びましょう。',
  shiga: '滋賀県は製造業が盛んな工業県で、工場・物流施設での警備需要が高い地域です。琵琶湖周辺の観光・イベント警備にも対応できる会社を選びましょう。',
  kyoto: '京都府は伝統的な観光地を多く持ち、観光施設・文化財施設での警備需要が高い地域です。観光シーズンの雑踏警備や特別警備に対応できる会社を選ぶことが重要です。',
  osaka: '大阪府は関西経済の中心地として、商業施設・工場・イベント会場での警備需要が高い地域です。交通誘導から施設警備まで幅広く対応できる会社が多く揃っています。',
  hyogo: '兵庫県は神戸港を擁する港湾都市で、港湾施設・商業施設・工場での警備需要が高い地域です。大規模イベント対応の実績がある警備会社を選ぶことが重要です。',
  nara: '奈良県は世界遺産・観光地を多く持ち、観光施設・文化財施設での警備需要が高い地域です。観光シーズンの雑踏警備や文化財保護に対応できる会社を選びましょう。',
  wakayama: '和歌山県は観光業・農業が盛んな地域で、観光施設・リゾートホテルでの警備需要があります。熊野古道などの観光地でのイベント警備にも対応できる会社を選びましょう。',
  tottori: '鳥取県は観光業・農業が盛んな地域で、鳥取砂丘などの観光地での警備需要があります。広い県土をカバーできる機動力のある警備会社を選ぶことが重要です。',
  shimane: '島根県は出雲大社などの観光地を持ち、観光施設での警備需要があります。広い県土をカバーできる体制を持つ警備会社を選ぶことが大切です。',
  okayama: '岡山県は製造業・農業が盛んな地域で、工場・建設現場での警備需要が高い地域です。倉敷美観地区などの観光地でのイベント警備にも対応できる会社を選びましょう。',
  hiroshima: '広島県は製造業・造船業が盛んな工業県であり、観光地としても多くの来訪者を迎える地域です。工場・建設現場での交通誘導警備から観光施設の施設警備まで、幅広いニーズに対応できる警備会社が集まっています。',
  yamaguchi: '山口県は製造業・化学工業が盛んな地域で、工場・建設現場での警備需要が高い地域です。観光地でのイベント警備にも対応できる会社を選びましょう。',
  tokushima: '徳島県は阿波踊りなど大規模イベントを持つ地域で、雑踏警備・イベント警備の需要が高い地域です。観光施設・建設現場での警備にも対応できる会社を選びましょう。',
  kagawa: '香川県は観光業・製造業が盛んな地域で、観光施設・工場での警備需要があります。小豆島などの離島を含む広い地域をカバーできる警備会社を選ぶことが重要です。',
  ehime: '愛媛県は製造業・観光業が盛んな地域で、工場・観光施設での警備需要があります。松山城などの観光地でのイベント警備にも対応できる会社を選びましょう。',
  kochi: '高知県は観光業・農業が盛んな地域で、よさこい祭りなどの大規模イベントでの雑踏警備需要が高い地域です。広い県土をカバーできる警備会社を選ぶことが重要です。',
  fukuoka: '福岡県は九州最大の都市・福岡市を擁し、商業施設・オフィスビル・イベント会場での警備需要が非常に高い地域です。大規模施設への対応実績がある警備会社を選ぶことが重要です。',
  saga: '佐賀県は製造業・農業が盛んな地域で、工場・建設現場での警備需要があります。バルーンフェスタなどの大規模イベントでの雑踏警備にも対応できる会社を選びましょう。',
  nagasaki: '長崎県は観光業・造船業が盛んな地域で、観光施設・工場での警備需要があります。長崎くんちなどの伝統的なイベントでの雑踏警備にも対応できる会社を選びましょう。',
  kumamoto: '熊本県は製造業・農業が盛んな地域で、工場・建設現場での警備需要が高い地域です。熊本城周辺の観光地でのイベント警備にも対応できる会社を選びましょう。',
  oita: '大分県は観光業・製造業が盛んな地域で、温泉施設・観光地での警備需要があります。別府・湯布院などの観光地でのイベント警備にも対応できる会社を選びましょう。',
  miyazaki: '宮崎県は観光業・農業が盛んな地域で、観光施設・リゾートホテルでの警備需要があります。広い県土をカバーできる機動力のある警備会社を選ぶことが重要です。',
  kagoshima: '鹿児島県は観光業・農業が盛んな地域で、観光施設・鹿児島港での警備需要があります。離島を含む広い地域をカバーできる体制を持つ警備会社を選ぶことが大切です。',
  okinawa: '沖縄県は観光業が盛んな地域で、リゾートホテル・観光施設での警備需要が高い地域です。米軍基地関連施設の警備など特殊なニーズにも対応できる会社が揃っています。',
}

type OsusumeCompany = {
  slug: string
  name: string
  pref: string
  city: string | null
  tel: string | null
  numbers: number[]
}

const NUM_COLORS: Record<number, { bg: string; color: string }> = {
  1: { bg: '#eef2ff', color: '#3b4fa8' },
  2: { bg: '#e6f7f4', color: '#0f6e56' },
  3: { bg: '#fff4e6', color: '#854f0b' },
  4: { bg: '#fef3f2', color: '#b91c1c' },
}

function deterministicShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr]
  let h = 0
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 0x7fffffff
  for (let i = copy.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) % 0x7fffffff
    const j = h % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const revalidate = 86400

export async function generateStaticParams() {
  return Object.keys(PREF_MAP).map(pref => ({ pref }))
}

export async function generateMetadata({ params }: { params: Promise<{ pref: string }> }): Promise<Metadata> {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) return { title: 'ページが見つかりません | keibi.online' }
  return {
    title: `${prefName}のおすすめ警備会社ランキング【2026年最新版】｜業務別に厳選 | keibi.online`,
    description: `${prefName}のおすすめ警備会社を業務別に厳選。交通誘導・施設警備・イベント警備・駐車場警備ごとにランキング形式でご紹介。失敗しない警備会社の選び方も解説。`,
    alternates: { canonical: `https://keibi.online/${pref}/osusume` },
    twitter: {
      card: 'summary_large_image',
      title: `${prefName}のおすすめ警備会社ランキング【2026年最新版】`,
      description: `${prefName}のおすすめ警備会社を業務別に厳選。交通誘導・施設警備・イベント・駐車場ごとにランキング形式でご紹介。`,
    },
  }
}

export default async function OsusumeePage({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) notFound()

  const supabase = createClient(supabaseUrl, supabaseKey)

  const [{ data: raw2 }, { data: raw1 }] = await Promise.all([
    supabase
      .from('companies')
      .select('slug, name, pref, city, tel, numbers')
      .eq('pref_slug', pref)
      .contains('numbers', [2])
      .neq('slug', 'saizen-666')
      .limit(50),
    supabase
      .from('companies')
      .select('slug, name, pref, city, tel, numbers')
      .eq('pref_slug', pref)
      .contains('numbers', [1])
      .limit(20),
  ])

  const shuffled2 = deterministicShuffle((raw2 ?? []) as OsusumeCompany[], pref)
  const shuffled1 = deterministicShuffle((raw1 ?? []) as OsusumeCompany[], pref)

  let saizen: OsusumeCompany | null = null
  if (pref === 'hiroshima') {
    const { data } = await supabase
      .from('companies')
      .select('slug, name, pref, city, tel, numbers')
      .eq('slug', 'saizen-666')
      .single()
    saizen = data
  }

  const usedSlugs = new Set<string>()
  if (saizen) usedSlugs.add('saizen-666')

  const pickUnique = (arr: OsusumeCompany[], n: number): OsusumeCompany[] => {
    const result: OsusumeCompany[] = []
    for (const c of arr) {
      if (!usedSlugs.has(c.slug) && result.length < n) {
        usedSlugs.add(c.slug)
        result.push(c)
      }
    }
    return result
  }

  let finalKotsu: OsusumeCompany[]
  let finalEvent: OsusumeCompany[]
  let finalParking: OsusumeCompany[]

  if (pref === 'hiroshima' && saizen) {
    finalKotsu = [saizen, ...pickUnique(shuffled2, 2)]
    finalEvent = [saizen, ...pickUnique(shuffled2, 2)]
    finalParking = [saizen, ...pickUnique(shuffled2, 2)]
  } else {
    finalKotsu = pickUnique(shuffled2, 3)
    finalEvent = pickUnique(shuffled2, 3)
    finalParking = pickUnique(shuffled2, 3)
  }
  const shisetsuTop3 = pickUnique(shuffled1, 3)

  const feature = PREF_FEATURES[pref] ?? `${prefName}の警備会社を選ぶ際は、対応業務・実績・料金体系・緊急時の対応体制を確認することが重要です。複数社から見積もりを取り、自社のニーズに最適な会社を選びましょう。`

  const allDisplayed = [...finalKotsu, ...shisetsuTop3, ...finalEvent, ...finalParking]
  const uniqueCompanies = allDisplayed.filter((c, i, arr) => arr.findIndex(x => x.slug === c.slug) === i).slice(0, 10)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${prefName}のおすすめ警備会社ランキング`,
    description: `${prefName}のおすすめ警備会社を業務別に厳選`,
    itemListElement: uniqueCompanies.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://keibi.online/companies/${c.slug}`,
    })),
  }

  const sections = [
    { id: 'kotsu', label: '交通誘導警備', desc: '道路工事・建設現場での交通誘導を専門とする会社', companies: finalKotsu },
    { id: 'shisetsu', label: '施設警備', desc: 'ビル・商業施設・病院などの常駐・巡回警備', companies: shisetsuTop3 },
    { id: 'event', label: '雑踏警備（イベント）', desc: '花火大会・スポーツイベント・商業イベントの警備', companies: finalEvent },
    { id: 'parking', label: '駐車場警備', desc: '駐車場・商業施設・工場の車両誘導・管理', companies: finalParking },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/${pref}`} style={{ color: '#999', textDecoration: 'none' }}>{prefName}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>おすすめ警備会社ランキング</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 8px' }}>
          {prefName}のおすすめ警備会社ランキング【2026年最新版】
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
          交通誘導・施設警備・イベント・駐車場など業務別に厳選。失敗しない選び方のポイントも解説します。
        </p>

        {/* 業務別セクション */}
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '20px', background: section.id === 'shisetsu' ? '#eff6ff' : '#f0fdf4', color: section.id === 'shisetsu' ? '#1d4ed8' : '#16a34a' }}>
                  {section.id === 'shisetsu' ? '1号警備' : '2号警備'}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#111' }}>{section.label}</span>
              </div>
              <Link href={`/columns/ranking/${pref}/${section.id}`} style={{ fontSize: '12px', color: '#457b9d', textDecoration: 'none' }}>
                もっと見る →
              </Link>
            </div>

            {section.companies.length === 0 ? (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                現在掲載中の会社はありません
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {section.companies.map((company, index) => (
                  <div
                    key={company.slug}
                    style={{
                      background: '#fff',
                      border: index === 0 ? '2px solid #f97316' : '0.5px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      {/* ランクバッジ */}
                      <div style={{
                        flexShrink: 0,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: index === 0 ? '#f97316' : index === 1 ? '#9ca3af' : '#d1a054',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {index + 1}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <Link
                            href={`/companies/${company.slug}`}
                            style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', textDecoration: 'none' }}
                          >
                            {company.name}
                          </Link>
                          {index === 0 && (
                            <span style={{ fontSize: '10px', background: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa', borderRadius: '4px', padding: '2px 6px', whiteSpace: 'nowrap', fontWeight: 700 }}>
                              おすすめ No.1
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '12px', color: '#888', margin: '0 0 6px' }}>
                          {company.pref}{company.city ?? ''}
                          {company.tel && <span style={{ marginLeft: '10px' }}>📞 {company.tel}</span>}
                        </p>

                        {company.numbers && company.numbers.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                            {company.numbers.map(n => {
                              const c = NUM_COLORS[n]
                              return c ? (
                                <span key={n} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: c.bg, color: c.color, fontWeight: 600 }}>
                                  {SECURITY_TYPE_LABELS[n]}
                                </span>
                              ) : null
                            })}
                          </div>
                        )}

                        <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.7, margin: 0 }}>
                          {generateIntro({ slug: company.slug, name: company.name, pref: company.pref, city: company.city, numbers: company.numbers })}
                        </p>

                        <div style={{ marginTop: '10px' }}>
                          <Link href={`/companies/${company.slug}`} style={{ fontSize: '12px', color: '#f97316', textDecoration: 'none', fontWeight: 600 }}>
                            詳細を見る →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <Link
                    href={`/columns/ranking/${pref}/${section.id}`}
                    style={{ fontSize: '12px', color: '#457b9d', textDecoration: 'none' }}
                  >
                    {prefName}の{section.label}会社ランキング10選を見る →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 3号・4号はリンクボックスのみ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '2.5rem' }}>
          {[
            { label: '3号警備（貴重品運搬）', desc: '現金輸送・貴重品配送に対応できる警備会社', href: `/${pref}` },
            { label: '4号警備（身辺警備）', desc: '要人警護・ボディーガードに対応できる警備会社', href: `/${pref}` },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{item.desc}</div>
                <div style={{ fontSize: '12px', color: '#f97316', fontWeight: 600 }}>{prefName}で対応会社を探す →</div>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 16px' }}>よくある質問</h2>
          {[
            {
              q: '警備会社を選ぶ際の重要なポイントは何ですか？',
              a: '認定証・警備業許可の有無、対応できる業務の範囲、緊急時の連絡体制、実績と評判の4点を確認することが重要です。また、複数社から見積もりを取り、料金体系が明確な会社を選びましょう。',
            },
            {
              q: '相見積もりは必要ですか？',
              a: '相見積もりは強くおすすめします。警備会社によって料金・サービス内容・対応エリアが大きく異なります。最低でも3社以上から見積もりを取ることで、適正価格と優良な会社を見極めることができます。',
            },
            {
              q: '急な依頼にも対応してもらえますか？',
              a: '会社によって異なりますが、多くの警備会社では前日や当日の急な依頼にも対応しています。ただし、警備員の確保には時間が必要なため、余裕を持って依頼することをおすすめします。',
            },
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? '16px' : 0, paddingBottom: i < 2 ? '16px' : 0, borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Q. {faq.q}</div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>A. {faq.a}</div>
            </div>
          ))}
        </div>

        {/* 地域特性 */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>{prefName}の警備業界の特徴</h2>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.8, margin: 0 }}>{feature}</p>
        </div>

        {/* 関連リンク */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>関連情報</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={`/${pref}`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              {prefName}の警備会社一覧を見る →
            </Link>
            <Link href={`/license/${encodeURIComponent(prefName)}`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              {prefName}の資格講習日程を確認する →
            </Link>
            <Link href="/column/guide-001" style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
              警備会社の選び方ガイド →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
