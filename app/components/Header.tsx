export default function Header() {
  return (
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
  )
}
