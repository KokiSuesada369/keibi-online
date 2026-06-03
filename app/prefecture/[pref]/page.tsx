import companiesData from '@/data/companies.json'

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備',
  2: '2号警備',
  3: '3号警備',
  4: '4号警備',
}
const NUMBER_COLORS: Record<number, string> = {
  1: '#457b9d', 2: '#2a9d8f', 3: '#e76f51', 4: '#e63946',
}

const PREF_MAP: Record<string, string> = {
  hokkaido:'北海道', aomori:'青森県', iwate:'岩手県', miyagi:'宮城県',
  akita:'秋田県', yamagata:'山形県', fukushima:'福島県', ibaraki:'茨城県',
  tochigi:'栃木県', gunma:'群馬県', saitama:'埼玉県', chiba:'千葉県',
  tokyo:'東京都', kanagawa:'神奈川県', niigata:'新潟県', toyama:'富山県',
  ishikawa:'石川県', fukui:'福井県', yamanashi:'山梨県', nagano:'長野県',
  gifu:'岐阜県', shizuoka:'静岡県', aichi:'愛知県', mie:'三重県',
  shiga:'滋賀県', kyoto:'京都府', osaka:'大阪府', hyogo:'兵庫県',
  nara:'奈良県', wakayama:'和歌山県', tottori:'鳥取県', shimane:'島根県',
  okayama:'岡山県', hiroshima:'広島県', yamaguchi:'山口県', tokushima:'徳島県',
  kagawa:'香川県', ehime:'愛媛県', kochi:'高知県', fukuoka:'福岡県',
  saga:'佐賀県', nagasaki:'長崎県', kumamoto:'熊本県', oita:'大分県',
  miyazaki:'宮崎県', kagoshima:'鹿児島県', okinawa:'沖縄県',
}

export default async function PrefectureDynamicPage({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref]
  if (!prefName) return <div>都道府県が見つかりません</div>
  const companies = (companiesData as any[]).filter(c => c.prefSlug === pref)

  return (
    <main>
      <header style={{ background: '#1a1a2e', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '20px', color: 'white', textDecoration: 'none' }}>keibi.online</a>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
        </nav>
      </header>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt; {prefName}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{prefName}の警備会社一覧</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>{companies.length}社掲載 — 2026年6月更新</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {companies.map((c, i) => (
            <a key={i} href={`/companies/${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', background: 'white' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>〒{c.zip} {c.city}</div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>📞 {c.tel}</div>
                <div>
                  {(c.numbers as number[]).map(num => (
                    <span key={num} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: NUMBER_COLORS[num] + '22', color: NUMBER_COLORS[num], fontWeight: 600, marginRight: '4px' }}>
                      {NUMBER_LABELS[num]}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px', opacity: 0.7 }}>© 2026 keibi.online</footer>
    </main>
  )
}

export async function generateStaticParams() {
  const prefs = [...new Set((companiesData as any[]).map((c: any) => c.prefSlug))]
  return prefs.map(pref => ({ pref }))
}