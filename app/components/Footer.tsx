export default function Footer() {
  return (
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
  )
}
