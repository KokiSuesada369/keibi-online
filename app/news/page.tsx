export const metadata = {
  title: '警備業界ニュース | keibi.online',
  description: '警備業界の最新ニュース・法改正・業界動向をお届けします。',
}

export default function NewsPage() {
  return (
    <main>
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
    </main>
  )
}
