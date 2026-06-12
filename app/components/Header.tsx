'use client'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [jobTooltip, setJobTooltip] = useState(false)

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #e8e8e8', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <a href="/" style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          keibi<span style={{ color: '#f4820a' }}>.online</span>
        </a>
        <nav style={{ display: 'flex', gap: '14px', fontSize: '13px', flexWrap: 'wrap' }} className="pc-nav">
          <a href="/prefecture" style={{ color: '#555', textDecoration: 'none' }}>警備会社一覧</a>
          <a href="/news" style={{ color: '#555', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: '#555', textDecoration: 'none' }}>資格情報</a>
          <span
            style={{ color: '#bbb', textDecoration: 'none', cursor: 'default', position: 'relative' }}
            onMouseEnter={() => setJobTooltip(true)}
            onMouseLeave={() => setJobTooltip(false)}
          >
            警備求人
            {jobTooltip && (
              <span style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: 'white', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 200 }}>
                近日公開予定
              </span>
            )}
          </span>
          <a href="/prefecture" style={{ color: '#555', textDecoration: 'none' }}>おすすめ警備会社</a>
          <a href="/nearby" style={{ color: '#555', textDecoration: 'none' }}>近くの警備会社</a>
          <a href="/request" style={{ color: '#555', textDecoration: 'none' }}>警備依頼</a>
          <a href="/column" style={{ color: '#555', textDecoration: 'none' }}>コラム</a>
          <a href="/contact" style={{ color: '#555', textDecoration: 'none' }}>お問い合わせ</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none', flexDirection: 'column', gap: '5px' }} aria-label="メニュー">
          <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a2e', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a2e', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a2e', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
      {open && (
        <nav style={{ background: 'white', borderTop: '1px solid #e8e8e8', padding: '8px 0' }}>
          {[
            { label: '警備会社一覧', href: '/prefecture' },
            { label: 'ニュース', href: '/news' },
            { label: '資格情報', href: '/license' },
            { label: '警備求人（近日公開）', href: '#', disabled: true },
            { label: 'おすすめ警備会社', href: '/prefecture' },
            { label: '近くの警備会社', href: '/nearby' },
            { label: '警備依頼', href: '/request' },
            { label: 'コラム', href: '/column' },
            { label: 'お問い合わせ', href: '/contact' },
          ].map(item => (
            <a
              key={item.label}
              href={item.disabled ? undefined : item.href}
              onClick={() => { if (!item.disabled) setOpen(false) }}
              style={{ display: 'block', padding: '14px 24px', color: item.disabled ? '#bbb' : '#1a1a2e', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid #f0f0f0', cursor: item.disabled ? 'default' : 'pointer' }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
      <style>{`
        @media (max-width: 768px) {
          .pc-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
