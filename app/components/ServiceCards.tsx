'use client'
import { useRef, useEffect } from 'react'

const arrowBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  fontSize: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}

export default function ServiceCards({ totalCompanies }: { totalCompanies: string | number }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const services = [
    { icon: '🏢', name: '警備会社検索', desc: '全国を都道府県・業務別に検索', count: `${totalCompanies}社掲載`, href: '/prefecture' },
    { icon: '📰', name: '業界ニュース', desc: '最新情報・法改正をお届け', count: 'ニュース掲載中', href: '/news' },
    { icon: '🎖️', name: '資格・検定情報', desc: '警備業務検定・資格取得ガイド', count: '講習日程掲載中', href: '/license' },
    { icon: '💼', name: '警備求人', desc: '全国の警備員・管理職の求人', count: '求人を見る →', href: '/recruit' },
    { icon: '🏆', name: 'おすすめ警備会社', desc: '地域・業務別ランキング掲載', count: 'ランキングを見る →', href: '/osusume' },
    { icon: '📝', name: '警備業界コラム', desc: '選び方・業界知識・ランキング', count: 'コラム掲載中', href: '/column' },
    { icon: '📍', name: '近くの警備会社を探す', desc: 'エリアを指定して検索', count: 'エリアから探す →', href: '/nearby' },
    { icon: '📋', name: 'かんたん警備依頼', desc: 'エリア・業務・予算を選ぶだけ', count: '無料で依頼する →', href: '/request' },
  ]

  const tripled = [...services, ...services, ...services]

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = el.scrollWidth / 3
    }
  }, [])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const oneSetWidth = el.scrollWidth / 3
    if (el.scrollLeft < oneSetWidth * 0.3) {
      el.scrollLeft += oneSetWidth
    } else if (el.scrollLeft > oneSetWidth * 2 - 200) {
      el.scrollLeft -= oneSetWidth
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* 左矢印 */}
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' })}
        style={{ ...arrowBtnStyle, left: '-16px' }}
        className="scroll-arrow"
        aria-label="前へ"
      >
        ◀
      </button>

      {/* カード列 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          paddingBottom: '8px',
          scrollbarWidth: 'none',
        }}
        className="hide-scrollbar"
      >
        {tripled.map((s, i) => (
          <a
            key={`${s.name}-${i}`}
            href={s.href}
            style={{ textDecoration: 'none', flexShrink: 0, width: '200px' }}
          >
            <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>{s.name}</div>
              <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, marginBottom: '6px' }}>{s.desc}</div>
              <div style={{ fontSize: '11px', color: '#f4820a', fontWeight: 700 }}>{s.count}</div>
            </div>
          </a>
        ))}
      </div>

      {/* 右矢印 */}
      <button
        onClick={() => scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' })}
        style={{ ...arrowBtnStyle, right: '-16px' }}
        className="scroll-arrow"
        aria-label="次へ"
      >
        ▶
      </button>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) { .scroll-arrow { display: none !important; } }
      `}</style>
    </div>
  )
}
