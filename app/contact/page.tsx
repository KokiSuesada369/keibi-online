export const metadata = {
  title: 'お問い合わせ | keibi.online',
  description: 'keibi.onlineへのお問い合わせはこちらから。掲載情報の修正・追加・その他ご要望をお受けしています。',
}

const CONTACT_EMAIL = 'info@saizen.one'

export default function ContactPage() {
  return (
    <main>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; お問い合わせ
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '8px' }}>お問い合わせ</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>掲載情報の修正・追加・その他ご要望はこちらからお問い合わせください。</p>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1a1a2e' }}>メールでのお問い合わせ</h2>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, marginBottom: '24px' }}>
            以下のメールアドレスまでご連絡ください。<br />
            掲載情報の修正・削除・新規掲載依頼・その他のご要望に対応しております。
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=keibi.onlineへのお問い合わせ`}
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: '#f97316',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {CONTACT_EMAIL} にメールを送る
          </a>

          <div style={{ marginTop: '32px', padding: '16px', background: '#f9f9f9', borderRadius: '8px', fontSize: '13px', color: '#666', lineHeight: 1.7 }}>
            <strong>よくあるお問い合わせ内容：</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>掲載情報の修正・削除依頼</li>
              <li>新規掲載のご相談</li>
              <li>サイトの不具合・表示の問題</li>
              <li>その他のご要望</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
