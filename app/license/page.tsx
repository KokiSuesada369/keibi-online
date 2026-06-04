export const metadata = {
  title: '警備員の資格情報 | keibi.online',
  description: '警備業務検定・警備員指導教育責任者など警備員の資格情報をまとめています。',
}

export default function LicensePage() {
  return (
    <main>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; 資格情報
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>警備員の資格情報</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>警備業務に関する資格・検定情報をまとめています。</p>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#999' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>準備中</p>
          <p style={{ fontSize: '14px' }}>近日公開予定です。</p>
        </div>
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
