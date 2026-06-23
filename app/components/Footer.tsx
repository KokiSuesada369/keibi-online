'use client'

export default function Footer() {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid #e8e8e8', padding: '32px 24px' }}>
      <div style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a2e', marginBottom: '4px' }}>
        keibi<span style={{ color: '#f4820a' }}>.online</span>
      </div>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>警備業界専門のポータルサイト</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: '警備会社一覧', href: '/prefecture' },
          { label: 'ニュース', href: '/news' },
          { label: '資格情報', href: '/license' },
          { label: '警備求人', href: '/recruit' },
          { label: '近くの警備会社を探す', href: '/nearby' },
          { label: 'かんたん警備依頼', href: '/request' },
          { label: 'コラム', href: '/column' },
          { label: '運営者情報', href: '/about' },
          { label: 'お問い合わせ', href: '/contact' },
          { label: '修正依頼', href: '/contact' },
        ].map(l => (
          <a
            key={l.label}
            href={l.href}
            style={{ fontSize: '13px', color: '#555', textDecoration: 'none' }}
          >
            {l.label}
          </a>
        ))}
        <span title="近日公開予定" style={{ fontSize: '13px', color: '#bbb', cursor: 'default' }}>警備求人</span>
      </div>
      <div style={{ fontSize: '11px', color: '#bbb' }}>© 2026 keibi.online All rights reserved.</div>
    </footer>
  )
}
