export const metadata = {
  title: 'お問い合わせ | keibi.online',
  description: 'keibi.onlineへのお問い合わせはこちらから。掲載情報の修正・追加・その他ご要望をお受けしています。',
}

export default function ContactPage() {
  return (
    <main>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; お問い合わせ
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>お問い合わせ</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>掲載情報の修正・追加・その他ご要望はこちらからお問い合わせください。</p>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>お名前</label>
            <input type="text" placeholder="山田 太郎" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>メールアドレス</label>
            <input type="email" placeholder="example@email.com" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>お問い合わせ種別</label>
            <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const }}>
              <option>掲載情報の修正・削除</option>
              <option>新規掲載のご依頼</option>
              <option>その他</option>
            </select>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>お問い合わせ内容</label>
            <textarea placeholder="お問い合わせ内容をご記入ください" rows={6} style={{ width: '100%', padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' as const, resize: 'vertical' as const }} />
          </div>
          <div style={{ background: '#f9f9f9', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: '#666' }}>
            ※現在、お問い合わせフォームは準備中です。しばらくお待ちください。
          </div>
          <button disabled style={{ width: '100%', padding: '14px', background: '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'not-allowed' }}>
            送信する（準備中）
          </button>
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
