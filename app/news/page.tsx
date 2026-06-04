export const metadata = {
  title: '警備業界ニュース | keibi.online',
  description: '警備業界の最新ニュース・法改正・業界動向をお届けします。',
}

export default function NewsPage() {
  return (
    <main>
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
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; ニュース
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>警備業界ニュース</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>警備業界の最新情報をお届けします。</p>
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
