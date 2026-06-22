import { createClient } from '@supabase/supabase-js'
import ServiceCards from '@/app/components/ServiceCards'
import { safeJsonLd } from '@/app/lib/jsonld'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  alternates: { canonical: 'https://keibi.online' },
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const revalidate = 3600

const PREF_REGIONS = [
  { name: '北海道・東北', prefs: [
    {slug:'hokkaido',name:'北海道'},{slug:'aomori',name:'青森県'},{slug:'iwate',name:'岩手県'},
    {slug:'miyagi',name:'宮城県'},{slug:'akita',name:'秋田県'},{slug:'yamagata',name:'山形県'},{slug:'fukushima',name:'福島県'},
  ]},
  { name: '関東', prefs: [
    {slug:'ibaraki',name:'茨城県'},{slug:'tochigi',name:'栃木県'},{slug:'gunma',name:'群馬県'},
    {slug:'saitama',name:'埼玉県'},{slug:'chiba',name:'千葉県'},{slug:'tokyo',name:'東京都'},{slug:'kanagawa',name:'神奈川県'},
  ]},
  { name: '中部', prefs: [
    {slug:'niigata',name:'新潟県'},{slug:'toyama',name:'富山県'},{slug:'ishikawa',name:'石川県'},
    {slug:'fukui',name:'福井県'},{slug:'yamanashi',name:'山梨県'},{slug:'nagano',name:'長野県'},
    {slug:'gifu',name:'岐阜県'},{slug:'shizuoka',name:'静岡県'},{slug:'aichi',name:'愛知県'},
  ]},
  { name: '近畿', prefs: [
    {slug:'mie',name:'三重県'},{slug:'shiga',name:'滋賀県'},{slug:'kyoto',name:'京都府'},
    {slug:'osaka',name:'大阪府'},{slug:'hyogo',name:'兵庫県'},{slug:'nara',name:'奈良県'},{slug:'wakayama',name:'和歌山県'},
  ]},
  { name: '中国・四国', prefs: [
    {slug:'tottori',name:'鳥取県'},{slug:'shimane',name:'島根県'},{slug:'okayama',name:'岡山県'},
    {slug:'hiroshima',name:'広島県'},{slug:'yamaguchi',name:'山口県'},{slug:'tokushima',name:'徳島県'},
    {slug:'kagawa',name:'香川県'},{slug:'ehime',name:'愛媛県'},{slug:'kochi',name:'高知県'},
  ]},
  { name: '九州・沖縄', prefs: [
    {slug:'fukuoka',name:'福岡県'},{slug:'saga',name:'佐賀県'},{slug:'nagasaki',name:'長崎県'},
    {slug:'kumamoto',name:'熊本県'},{slug:'oita',name:'大分県'},{slug:'miyazaki',name:'宮崎県'},
    {slug:'kagoshima',name:'鹿児島県'},{slug:'okinawa',name:'沖縄県'},
  ]},
]

const COLUMN_ARTICLES = [
  { slug: 'guide-001', title: '警備会社の選び方｜失敗しないための7つのチェックポイント', category: 'ガイド', catColor: '#3b4fa8', catBg: '#eef2ff' },
  { slug: 'cost-001', title: '交通誘導警備の料金相場｜費用を左右する5つの要因と節約のコツ', category: '料金', catColor: '#0f6e56', catBg: '#e6f7f4' },
  { slug: 'job-001', title: '警備員の資格一覧｜取得方法・難易度・年収への影響を徹底解説', category: '資格・仕事', catColor: '#854f0b', catBg: '#fff4e6' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'keibi.online',
  'url': 'https://keibi.online',
  'description': '警備業界専門のポータルサイト。全国の警備会社検索・業界ニュース・資格情報・求人情報を提供。',
}

export default async function HomePage() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { count } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
  const totalCompanies = (count ?? 6873).toLocaleString()

  // ランダムで会社を取得（SAIZEN固定＋ランダム11社）
  // 各地方から1社ずつランダム取得（SAIZEN固定＋5社）
  const regions = ['hokkaido','tokyo','osaka','fukuoka','aichi']
  const regionCompanies = await Promise.all(
    regions.map(async (pref_slug) => {
      const { data } = await supabase
        .from('companies')
        .select('slug, name, pref, city, numbers')
        .eq('pref_slug', pref_slug)
        .limit(50)
      if (!data || data.length === 0) return null
      return data[Math.floor(Math.random() * data.length)]
    })
  )

  const displayCompanies = [
    { slug: 'saizen-666', name: 'SAIZEN警備保障株式会社', pref: '広島県', city: '広島市西区', numbers: [2] },
    ...regionCompanies.filter((c): c is NonNullable<typeof c> => c !== null)
  ]

  return (
    <main style={{ background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Noto Sans JP', sans-serif" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      {/* ヒーロー */}
      <section style={{ position: 'relative', padding: '56px 24px 48px', textAlign: 'center', background: '#0f172a', overflow: 'hidden' }}>
        <canvas id="particle-canvas" width="1" height="1" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: '#f4820a', color: 'white', fontSize: '12px', fontWeight: 700, padding: '5px 16px', borderRadius: '99px', marginBottom: '20px', letterSpacing: '0.5px' }}>
            警備業界専門のポータルサイト
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, color: 'white', lineHeight: 1.4, marginBottom: '12px' }}>
            全国{totalCompanies}社の警備会社を検索<br />資格・講習・求人・ニュースも全国対応
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.8 }}>
            都道府県・業務別に警備会社を検索｜資格講習日程・求人・業界ニュースを一か所に集約
          </p>
          <a href="/prefecture" style={{ display: 'inline-block', background: '#f4820a', color: 'white', borderRadius: '8px', padding: '12px 32px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            警備会社を探す →
          </a>
        </div>
        <Script src="/particle.js" strategy="lazyOnload" />
      </section>

      {/* サービス一覧 */}
      <section style={{ padding: '24px', background: 'white' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '14px' }}>サービス一覧</h2>
        <ServiceCards totalCompanies={totalCompanies} />
      </section>

      <div style={{ height: '8px', background: '#f5f6fa' }} />

      {/* 警備会社を探す */}
      <section style={{ padding: '24px', background: '#f5f6fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>警備会社を探す</h2>
          <a href="/prefecture" style={{ fontSize: '12px', color: '#1a1a2e', textDecoration: 'none', opacity: 0.5 }}>すべて見る →</a>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {['すべて', '1号警備', '2号警備', '3号警備', '4号警備'].map((label, i) => (
            <a key={label} href={i === 0 ? '/prefecture' : `/prefecture`} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '99px', border: '1px solid', borderColor: i === 0 ? '#1a1a2e' : '#ddd', background: i === 0 ? '#1a1a2e' : 'white', color: i === 0 ? 'white' : '#555', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {displayCompanies.map(c => (
            <a key={c.slug} href={`/companies/${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>{c.pref}{c.city}</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(c.numbers || []).map((n: number) => {
                    const labels: Record<number,{label:string,bg:string,color:string}> = {
                      1:{label:'1号警備',bg:'#eef2ff',color:'#3b4fa8'},
                      2:{label:'2号警備',bg:'#e6f7f4',color:'#0f6e56'},
                      3:{label:'3号警備',bg:'#fff4e6',color:'#854f0b'},
                      4:{label:'4号警備',bg:'#fef3f2',color:'#b91c1c'},
                    }
                    const l = labels[n]
                    return l ? <span key={n} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: l.bg, color: l.color, fontWeight: 600 }}>{l.label}</span> : null
                  })}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div style={{ height: '8px', background: '#f5f6fa' }} />

      {/* 都道府県から探す */}
      <section style={{ padding: '24px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>都道府県から探す</h2>
          <a href="/prefecture" style={{ fontSize: '12px', color: '#1a1a2e', textDecoration: 'none', opacity: 0.5 }}>すべて見る →</a>
        </div>
        {PREF_REGIONS.map(region => (
          <div key={region.name} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{region.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {region.prefs.map(pref => (
                <a key={pref.slug} href={`/${pref.slug}`} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '6px', border: '1px solid #e8e8e8', background: 'white', color: '#1a1a2e', textDecoration: 'none' }}>
                  {pref.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div style={{ height: '8px', background: '#f5f6fa' }} />

      {/* コラム */}
      <section style={{ padding: '24px', background: '#f5f6fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>警備業界コラム</h2>
          <a href="/column" style={{ fontSize: '12px', color: '#1a1a2e', textDecoration: 'none', opacity: 0.5 }}>もっと見る →</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {COLUMN_ARTICLES.map(a => (
            <a key={a.slug} href={`/column/${a.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: a.catBg, color: a.catColor, whiteSpace: 'nowrap', marginTop: '1px' }}>{a.category}</span>
                <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 600, lineHeight: 1.5 }}>{a.title}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  )
}
