'use client'

const COMING_SOON = '近日公開予定です'

export default function ServiceCards({ totalCompanies }: { totalCompanies: string | number }) {
  const services = [
    { icon: '🏢', name: '警備会社検索', desc: '全国を都道府県・業務別に検索', count: `${totalCompanies}社掲載`, href: '/prefecture' },
    { icon: '📰', name: '業界ニュース', desc: '最新情報・法改正をお届け', count: 'ニュース掲載中', href: '/news' },
    { icon: '🎖️', name: '資格・検定情報', desc: '警備業務検定・資格取得ガイド', count: '講習日程掲載中', href: '/license' },
    { icon: '💼', name: '警備求人', desc: '全国の警備員・管理職の求人', count: '近日公開', href: '#' },
    { icon: '📝', name: '警備業界コラム', desc: '選び方・業界知識・ランキング', count: 'コラム掲載中', href: '/column' },
    { icon: '📋', name: 'かんたん警備依頼', desc: 'エリア・業務・予算を選ぶだけ', count: '無料で依頼する →', href: '/request' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
      {services.map(s => (
        <a
          key={s.name}
          href={s.href === '#' ? '#' : s.href}
          onClick={s.href === '#' ? (e) => { e.preventDefault(); alert(COMING_SOON) } : undefined}
          style={{ textDecoration: 'none' }}
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
  )
}
