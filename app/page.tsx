export default function Home() {
  return (
    <main>
      <header style={{
        background: '#1a1a2e',
        color: 'white',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontWeight: 700, fontSize: '20px' }}>
          keibi.online
        </div>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
        </nav>
      </header>

      <section style={{
        background: '#1a1a2e',
        color: 'white',
        textAlign: 'center',
        padding: '80px 24px',
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
          全国の警備会社・資格・ニュースを<br />まとめて探せる
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.7, marginBottom: '40px' }}>
          都道府県別の会社一覧・最新ニュース・資格情報を一か所に
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/prefecture" style={{
            background: '#e63946',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
          }}>
            都道府県から会社を探す
          </a>
          <a href="/license" style={{
            background: 'transparent',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            border: '2px solid white',
          }}>
            資格情報を見る
          </a>
        </div>
      </section>

      <section style={{ padding: '64px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, marginBottom: '40px' }}>
          カテゴリから探す
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {[
            { title: '都道府県別 警備会社', desc: '全国2,480社を47都道府県別に掲載', href: '/prefecture', color: '#e63946' },
            { title: '警備業界ニュース', desc: '法改正・事件・求人情報をまとめて', href: '/news', color: '#457b9d' },
            { title: '警備資格ガイド', desc: '検定・資格の取り方を詳しく解説', href: '/license', color: '#2a9d8f' },
            { title: 'お役立ちコラム', desc: '給与・仕事内容・キャリアを解説', href: '/column', color: '#e9c46a' },
          ].map((item) => (
            <a key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '24px',
                borderTop: `4px solid ${item.color}`,
                background: 'white',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#1a1a2e' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer style={{
        background: '#1a1a2e',
        color: 'white',
        textAlign: 'center',
        padding: '32px 24px',
        fontSize: '14px',
        opacity: 0.7,
      }}>
        © 2026 keibi.online — 警備業界の総合情報サイト
      </footer>
    </main>
  );
}