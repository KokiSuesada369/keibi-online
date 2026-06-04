import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const metadata = {
  title: '全国の警備会社を探す | keibi.online',
  description: '全国6,873社の警備会社を都道府県・業務別に検索。施設警備・交通誘導警備・雑踏警備・機械警備・身辺警備の会社を簡単に見つけられます。',
}

const PREF_REGIONS = [
  { name: '北海道・東北', prefs: [
    { slug: 'hokkaido', name: '北海道' }, { slug: 'aomori', name: '青森県' },
    { slug: 'iwate', name: '岩手県' }, { slug: 'miyagi', name: '宮城県' },
    { slug: 'akita', name: '秋田県' }, { slug: 'yamagata', name: '山形県' },
    { slug: 'fukushima', name: '福島県' },
  ]},
  { name: '関東', prefs: [
    { slug: 'ibaraki', name: '茨城県' }, { slug: 'tochigi', name: '栃木県' },
    { slug: 'gunma', name: '群馬県' }, { slug: 'saitama', name: '埼玉県' },
    { slug: 'chiba', name: '千葉県' }, { slug: 'tokyo', name: '東京都' },
    { slug: 'kanagawa', name: '神奈川県' },
  ]},
  { name: '中部', prefs: [
    { slug: 'niigata', name: '新潟県' }, { slug: 'toyama', name: '富山県' },
    { slug: 'ishikawa', name: '石川県' }, { slug: 'fukui', name: '福井県' },
    { slug: 'yamanashi', name: '山梨県' }, { slug: 'nagano', name: '長野県' },
    { slug: 'gifu', name: '岐阜県' }, { slug: 'shizuoka', name: '静岡県' },
    { slug: 'aichi', name: '愛知県' },
  ]},
  { name: '近畿', prefs: [
    { slug: 'mie', name: '三重県' }, { slug: 'shiga', name: '滋賀県' },
    { slug: 'kyoto', name: '京都府' }, { slug: 'osaka', name: '大阪府' },
    { slug: 'hyogo', name: '兵庫県' }, { slug: 'nara', name: '奈良県' },
    { slug: 'wakayama', name: '和歌山県' },
  ]},
  { name: '中国・四国', prefs: [
    { slug: 'tottori', name: '鳥取県' }, { slug: 'shimane', name: '島根県' },
    { slug: 'okayama', name: '岡山県' }, { slug: 'hiroshima', name: '広島県' },
    { slug: 'yamaguchi', name: '山口県' }, { slug: 'tokushima', name: '徳島県' },
    { slug: 'kagawa', name: '香川県' }, { slug: 'ehime', name: '愛媛県' },
    { slug: 'kochi', name: '高知県' },
  ]},
  { name: '九州・沖縄', prefs: [
    { slug: 'fukuoka', name: '福岡県' }, { slug: 'saga', name: '佐賀県' },
    { slug: 'nagasaki', name: '長崎県' }, { slug: 'kumamoto', name: '熊本県' },
    { slug: 'oita', name: '大分県' }, { slug: 'miyazaki', name: '宮崎県' },
    { slug: 'kagoshima', name: '鹿児島県' }, { slug: 'okinawa', name: '沖縄県' },
  ]},
]

const SERVICES = [
  { num: 1, label: '1号警備', desc: '施設警備・機械警備', color: '#457b9d', icon: '🏢' },
  { num: 2, label: '2号警備', desc: '交通誘導・雑踏警備', color: '#2a9d8f', icon: '🚦' },
  { num: 3, label: '3号警備', desc: '貴重品運搬警備', color: '#e76f51', icon: '💰' },
  { num: 4, label: '4号警備', desc: '身辺警備', color: '#e63946', icon: '🛡️' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'keibi.online',
  'url': 'https://keibi.online',
  'description': '全国の警備会社を都道府県・業務別に検索できるポータルサイト',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': 'https://keibi.online/prefecture',
    'query-input': 'required name=search_term_string',
  },
}

export default async function HomePage() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { count } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const totalCompanies = count ?? 6873

  return (
    <main style={{ fontFamily: "'Noto Sans JP', sans-serif", background: '#f8f9fa', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヘッダー */}
      <header style={{ background: '#1a1a2e', color: 'white', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <a href="/" style={{ fontWeight: 800, fontSize: '20px', color: 'white', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            keibi<span style={{ color: '#e63946' }}>.online</span>
          </a>
          <nav style={{ display: 'flex', gap: '20px', fontSize: '13px', flexWrap: 'wrap' }}>
            <a href="/prefecture" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>都道府県から探す</a>
            <a href="/column" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>コラム</a>
            <a href="/contact" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>お問い合わせ</a>
          </nav>
        </div>
      </header>

      {/* ヒーロー */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: 'white', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', background: 'rgba(230,57,70,0.2)', color: '#ff6b6b', padding: '6px 16px', borderRadius: '99px', display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
            全国{totalCompanies.toLocaleString()}社掲載
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>
            全国の警備会社を<br />かんたんに探せる
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.75, marginBottom: '40px', lineHeight: 1.7 }}>
            都道府県・業務内容から<br />お近くの警備会社を検索できます
          </p>
          <a href="/prefecture" style={{ display: 'inline-block', background: '#e63946', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '16px', boxShadow: '0 4px 16px rgba(230,57,70,0.4)' }}>
            都道府県から探す →
          </a>
        </div>
      </section>

      {/* 業務別 */}
      <section style={{ padding: '56px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>業務から探す</h2>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>警備業務の種類から会社を検索できます</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {SERVICES.map(s => (
              <div key={s.num}>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontWeight: 600 }}>{s.icon} {s.label} — {s.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['tokyo', 'osaka', 'aichi', 'fukuoka', 'hiroshima'].map(pref => (
                    <a key={pref} href={`/${pref}/service/${s.num}`} style={{ padding: '4px 10px', borderRadius: '99px', border: `1px solid ${s.color}`, color: s.color, fontSize: '12px', textDecoration: 'none', background: s.color + '11' }}>
                      {PREF_REGIONS.flatMap(r => r.prefs).find(p => p.slug === pref)?.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 都道府県一覧 */}
      <section style={{ padding: '56px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>都道府県から探す</h2>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>全47都道府県の警備会社一覧</p>
          {PREF_REGIONS.map(region => (
            <div key={region.name} style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e', display: 'inline-block' }}>
                {region.name}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {region.prefs.map(pref => (
                  <a key={pref.slug} href={`/${pref.slug}`} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e5e5', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', fontWeight: 500 }}>
                    {pref.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* コラム */}
      <section style={{ padding: '56px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>警備業界コラム</h2>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>警備会社の選び方・料金相場など役立つ情報</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { slug: 'guide-001', title: '警備会社の選び方｜失敗しないための7つのチェックポイント', category: 'ガイド' },
              { slug: 'cost-001', title: '交通誘導警備の料金相場｜費用を左右する5つの要因', category: '料金' },
              { slug: 'guide-002', title: '施設警備とは？仕事内容・役割をわかりやすく解説', category: 'ガイド' },
            ].map(article => (
              <a key={article.slug} href={`/column/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', background: 'white', height: '100%' }}>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: '#1a1a2e22', color: '#1a1a2e', fontWeight: 600, marginBottom: '10px', display: 'inline-block' }}>
                    {article.category}
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.5 }}>{article.title}</p>
                </div>
              </a>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/column" style={{ display: 'inline-block', padding: '10px 32px', border: '2px solid #1a1a2e', borderRadius: '8px', color: '#1a1a2e', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              コラム一覧を見る
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer style={{ background: '#1a1a2e', color: 'white', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                keibi<span style={{ color: '#e63946' }}>.online</span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.6, maxWidth: '240px', lineHeight: 1.6 }}>
                全国の警備会社情報を<br />無料で検索できるポータルサイト
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>検索</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="/prefecture" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>都道府県から探す</a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>コンテンツ</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="/column" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>コラム</a>
                  <a href="/news" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>ニュース</a>
                  <a href="/license" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>資格情報</a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>サポート</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '13px', opacity: 0.7 }}>お問い合わせ</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', textAlign: 'center', fontSize: '13px', opacity: 0.4 }}>
            © 2026 keibi.online All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
