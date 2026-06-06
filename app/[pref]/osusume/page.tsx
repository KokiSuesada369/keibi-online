import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PREF_MAP: Record<string, string> = {
  hokkaido:'北海道',aomori:'青森県',iwate:'岩手県',miyagi:'宮城県',akita:'秋田県',
  yamagata:'山形県',fukushima:'福島県',ibaraki:'茨城県',tochigi:'栃木県',gunma:'群馬県',
  saitama:'埼玉県',chiba:'千葉県',tokyo:'東京都',kanagawa:'神奈川県',niigata:'新潟県',
  toyama:'富山県',ishikawa:'石川県',fukui:'福井県',yamanashi:'山梨県',nagano:'長野県',
  gifu:'岐阜県',shizuoka:'静岡県',aichi:'愛知県',mie:'三重県',shiga:'滋賀県',
  kyoto:'京都府',osaka:'大阪府',hyogo:'兵庫県',nara:'奈良県',wakayama:'和歌山県',
  tottori:'鳥取県',shimane:'島根県',okayama:'岡山県',hiroshima:'広島県',yamaguchi:'山口県',
  tokushima:'徳島県',kagawa:'香川県',ehime:'愛媛県',kochi:'高知県',fukuoka:'福岡県',
  saga:'佐賀県',nagasaki:'長崎県',kumamoto:'熊本県',oita:'大分県',miyazaki:'宮崎県',
  kagoshima:'鹿児島県',okinawa:'沖縄県'
}

const SERVICE_NAMES: Record<number, string> = {
  1: '1号警備（施設警備）',
  2: '2号警備（交通誘導）',
  3: '3号警備（貴重品運搬）',
  4: '4号警備（身辺警備）',
}

const SERVICE_COLORS: Record<number, {bg:string,color:string}> = {
  1: {bg:'#eef2ff',color:'#3b4fa8'},
  2: {bg:'#e6f7f4',color:'#0f6e56'},
  3: {bg:'#fff4e6',color:'#854f0b'},
  4: {bg:'#fef3f2',color:'#b91c1c'},
}

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

export const revalidate = 86400

export async function generateMetadata({ params }: { params: Promise<{ pref: string }> }): Promise<Metadata> {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) return { title: 'ページが見つかりません | keibi.online' }
  return {
    title: `${prefName}のおすすめ警備会社5選｜地域密着の優良企業を厳選 | keibi.online`,
    description: `${prefName}のおすすめ警備会社を厳選してご紹介。施設警備・交通誘導警備など業務別の特徴と選び方のポイントも解説します。`,
  }
}

export default async function OsusumeePage({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) notFound()

  const { data: companies } = await supabase
    .from('companies')
    .select('slug, name, pref, city, address, tel, url, numbers')
    .eq('pref_slug', pref)
    .neq('slug', 'saizen-666')
    .limit(100)

  const shuffled = (companies || []).sort(() => Math.random() - 0.5).slice(0, 4)

  const saizen = {
    slug: 'saizen-666',
    name: 'SAIZEN警備保障株式会社',
    pref: '広島県',
    city: '広島市西区',
    address: '横川町3丁目1-9-305',
    tel: '080-5624-1393',
    url: 'https://saizen.one',
    numbers: [2],
  }

  const displayCompanies = pref === 'hiroshima'
    ? [saizen, ...shuffled]
    : shuffled.slice(0, 5)

  const feature = PREF_FEATURES[pref] || `${prefName}の警備会社を選ぶ際は、対応業務・実績・料金体系・緊急時の対応体制を確認することが重要です。複数社から見積もりを取り、自社のニーズに最適な会社を選びましょう。`

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/${pref}`} style={{ color: '#999', textDecoration: 'none' }}>{prefName}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>おすすめ警備会社</span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111', margin: '0 0 8px' }}>
          {prefName}のおすすめ警備会社5選
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
          地域密着の優良企業を厳選してご紹介します。
        </p>

        {/* 会社一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '2.5rem' }}>
          {displayCompanies.map((company, index) => (
            <Link key={company.slug} href={`/companies/${company.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: '12px', border: index === 0 ? '2px solid #f97316' : '1px solid #e5e7eb', padding: '1.5rem', position: 'relative' }}>
                {index === 0 && (
                  <div style={{ position: 'absolute', top: '-12px', left: '16px', background: '#f97316', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '3px 12px', borderRadius: '20px' }}>
                    おすすめ No.1
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316' }}>{index + 1}</span>
                      <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: 0 }}>{company.name}</h2>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>{company.pref}{company.city}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      {(company.numbers || []).map((n: number) => {
                        const c = { 1:{bg:'#eef2ff',color:'#3b4fa8'}, 2:{bg:'#e6f7f4',color:'#0f6e56'}, 3:{bg:'#fff4e6',color:'#854f0b'}, 4:{bg:'#fef3f2',color:'#b91c1c'} }[n]
                        return c ? <span key={n} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: c.bg, color: c.color, fontWeight: 600 }}>{SERVICE_NAMES[n]}</span> : null
                      })}
                    </div>
                    {company.tel && (
                      <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>📞 {company.tel}</p>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#f97316', whiteSpace: 'nowrap' }}>詳細を見る →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 地域特性 */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>{prefName}の警備業界の特徴</h2>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.8, margin: 0 }}>{feature}</p>
        </div>

        {/* 選び方リンク */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111', margin: '0 0 12px' }}>警備会社の選び方</h2>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.8, margin: '0 0 12px' }}>
            警備会社を選ぶ際は、認定証の有無・対応業務・実績・料金体系・緊急時の対応体制を確認することが重要です。
          </p>
          <Link href="/column/guide-001" style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none' }}>
            警備会社の選び方を詳しく読む →
          </Link>
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
