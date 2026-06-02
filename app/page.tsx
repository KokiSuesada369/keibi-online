export default function Home() {
  return (
    <main>
      <header style={{ background: '#1a1a2e', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: '20px' }}>keibi.online</div>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <a href='/prefecture' style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href='/news' style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href='/license' style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href='/column' style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
        </nav>
      </header>
      <section style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '80px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>全国の警備会社・資格・ニュースをまとめて探せる</h1>
        <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '40px' }}>都道府県別の会社一覧・最新ニュース・資格情報を一か所に</p>
        <a href='/prefecture' style={{ background: '#e63946', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>都道府県から会社を探す</a>
      </section>
      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px', opacity: 0.7 }}>© 2026 keibi.online</footer>
    </main>
  )
}
