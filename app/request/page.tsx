'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PREFS = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]

const PREF_SLUG: Record<string, string> = {
  '北海道':'hokkaido','青森県':'aomori','岩手県':'iwate','宮城県':'miyagi',
  '秋田県':'akita','山形県':'yamagata','福島県':'fukushima','茨城県':'ibaraki',
  '栃木県':'tochigi','群馬県':'gunma','埼玉県':'saitama','千葉県':'chiba',
  '東京都':'tokyo','神奈川県':'kanagawa','新潟県':'niigata','富山県':'toyama',
  '石川県':'ishikawa','福井県':'fukui','山梨県':'yamanashi','長野県':'nagano',
  '岐阜県':'gifu','静岡県':'shizuoka','愛知県':'aichi','三重県':'mie',
  '滋賀県':'shiga','京都府':'kyoto','大阪府':'osaka','兵庫県':'hyogo',
  '奈良県':'nara','和歌山県':'wakayama','鳥取県':'tottori','島根県':'shimane',
  '岡山県':'okayama','広島県':'hiroshima','山口県':'yamaguchi','徳島県':'tokushima',
  '香川県':'kagawa','愛媛県':'ehime','高知県':'kochi','福岡県':'fukuoka',
  '佐賀県':'saga','長崎県':'nagasaki','熊本県':'kumamoto','大分県':'oita',
  '宮崎県':'miyazaki','鹿児島県':'kagoshima','沖縄県':'okinawa',
}

const SERVICES = [
  '交通誘導警備','施設警備','イベント警備','駐車場警備',
  '機械警備','貴重品運搬','まず相談したい',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#111',
  background: '#fff',
  boxSizing: 'border-box',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#444',
  marginBottom: '6px',
  display: 'block',
}

export default function RequestPage() {
  const router = useRouter()
  const [pref, setPref] = useState('')
  const [city, setCity] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')

  const toggleService = (s: string) => {
    setServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  const handleContact = () => {
    const params = new URLSearchParams()
    if (pref) params.set('pref', pref)
    if (city) params.set('city', city)
    if (services.length) params.set('services', services.join(','))
    if (name) params.set('name', name)
    if (contact) params.set('contact', contact)
    router.push(`/contact?${params.toString()}`)
  }

  const handleSearch = () => {
    const slug = PREF_SLUG[pref]
    if (slug) router.push(`/${slug}`)
    else alert('都道府県を選択してください')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</a>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>かんたん警備依頼</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111', margin: '0 0 6px' }}>
          かんたん警備依頼・見積もり無料
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
          エリア・業務・予算を選ぶだけ。最短即日、理想の警備会社が見つかります。
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* エリア */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '14px' }}>
              📍 エリア
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>都道府県</label>
                <select
                  value={pref}
                  onChange={e => setPref(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">選択してください</option>
                  {PREFS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>市区町村（任意）</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="例：広島市西区"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* 業務タグ */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '14px' }}>
              🛡️ 業務の種類（複数選択可）
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SERVICES.map(s => {
                const selected = services.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleService(s)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '99px',
                      border: `1px solid ${selected ? '#f97316' : '#e5e7eb'}`,
                      background: selected ? '#fff7ed' : '#fff',
                      color: selected ? '#f97316' : '#555',
                      fontSize: '13px',
                      fontWeight: selected ? 700 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {selected ? '✓ ' : ''}{s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 連絡先 */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '14px' }}>
              📋 連絡先（任意）
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={labelStyle}>会社名または氏名</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="例：株式会社〇〇 / 山田太郎"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>電話番号またはメールアドレス</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="例：090-0000-0000 / info@example.com"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* ボタン */}
          <button
            onClick={handleContact}
            style={{
              width: '100%',
              padding: '14px',
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            この条件で問い合わせる
          </button>

          <button
            onClick={handleSearch}
            style={{
              width: '100%',
              padding: '14px',
              background: '#fff',
              color: '#1a1a2e',
              border: '1px solid #1a1a2e',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            対応可能な警備会社を探す →
          </button>

          {/* nextkb.jp 誘導ボックス */}
          <div style={{ background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa', padding: '1.25rem' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#c2410c', marginBottom: '6px' }}>
              🔗 警備求人をお探しの方へ
            </div>
            <p style={{ fontSize: '13px', color: '#7c2d12', margin: '0 0 12px', lineHeight: 1.7 }}>
              警備会社への依頼・見積もり依頼は<strong>nextkb.jp</strong>をご利用ください。
              全国の警備会社を掲載しています。
            </p>
            <a
              href="https://nextkb.jp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#f97316',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              nextkb.jp で警備会社を探す →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
