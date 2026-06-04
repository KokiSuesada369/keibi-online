'use client'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ background: '#1a1a2e', color: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <a href="/" style={{ fontWeight: 800, fontSize: '20px', color: 'white', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          keibi<span style={{ color: '#f4820a' }}>.online</span>
        </a>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }} className="pc-nav">
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
          <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>お問い合わせ</a>
        </nav>
        <button onClick={() => setOpen(!open)} className="hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none', flexDirection: 'column', gap: '5px' }} aria-label="メニュー">
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
          <span style={{ display: 'block', width: '24px', height: '2px', background: 'white', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
      {open && (
        <nav style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 0' }}>
          {[
            { label: '都道府県から探す', href: '/prefecture' },
            { label: 'ニュース', href: '/news' },
            { label: '資格情報', href: '/license' },
            { label: 'コラム', href: '/column' },
            { label: 'お問い合わせ', href: '/contact' },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 24px', color: 'white', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
