const companies = [
  { name: 'SAIZEN警備保障株式会社', area: '広島市中区', services: ['1号警備', '2号警備'], hiring: true, pr: true },
  { name: '○○警備保障株式会社', area: '広島市南区', services: ['1号警備', '2号警備', '3号警備'], hiring: false, pr: false },
  { name: '△△セキュリティサービス', area: '福山市', services: ['2号警備'], hiring: true, pr: false },
  { name: '□□総合警備株式会社', area: '東広島市', services: ['1号警備', '4号警備'], hiring: false, pr: false },
  { name: '××警備株式会社', area: '呉市', services: ['1号警備', '2号警備'], hiring: true, pr: false },
]

const serviceColors: { [key: string]: string } = {
  '1号警備': '#457b9d',
  '2号警備': '#2a9d8f',
  '3号警備': '#e9c46a',
  '4号警備': '#e63946',
}

export default function HiroshimaPage() {
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

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt; 広島県
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>広島県の警備会社一覧</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>{companies.length}社掲載 — 2026年6月更新</p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['すべて', '1号警備', '2号警備', '3号警備', '4号警備', '求人あり'].map((f) => (
            <div key={f} style={{ padding: '6px 14px', borderRadius: '99px', border: '1px solid #e5e5e5', fontSize: '13px', cursor: 'pointer', background: f === 'すべて' ? '#1a1a2e' : 'white', color: f === 'すべて' ? 'white' : '#333' }}>
              {f}
            </div>
          ))}
        </div>

        {companies.map((company) => (
          <div key={company.name} style={{ border: company.pr ? '2px solid #457b9d' : '1px solid #e5e5e5', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{company.name}</h2>
                  {company.pr && <span style={{ fontSize: '11px', background: '#e6f1fb', color: '#185fa5', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>PR</span>}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>{company.area}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {company.services.map((s) => (
                    <span key={s} style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '99px', background: `${serviceColors[s]}20`, color: serviceColors[s], fontWeight: 600 }}>{s}</span>
                  ))}
                  {company.hiring && <span style={{ fontSize: '12px', padding: '2px 10px', borderRadius: '99px', background: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}>求人あり</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px', opacity: 0.7 }}>
        © 2026 keibi.online
      </footer>
    </main>
  )
}