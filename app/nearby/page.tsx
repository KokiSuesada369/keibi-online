'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PREFS = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
]

const CITY_PLACEHOLDER: Record<string, string> = {
  '北海道': '例：札幌市中央区',
  '青森県': '例：青森市',
  '岩手県': '例：盛岡市',
  '宮城県': '例：仙台市青葉区',
  '秋田県': '例：秋田市',
  '山形県': '例：山形市',
  '福島県': '例：福島市',
  '茨城県': '例：水戸市',
  '栃木県': '例：宇都宮市',
  '群馬県': '例：前橋市',
  '埼玉県': '例：さいたま市大宮区',
  '千葉県': '例：千葉市中央区',
  '東京都': '例：新宿区',
  '神奈川県': '例：横浜市西区',
  '新潟県': '例：新潟市中央区',
  '富山県': '例：富山市',
  '石川県': '例：金沢市',
  '福井県': '例：福井市',
  '山梨県': '例：甲府市',
  '長野県': '例：長野市',
  '岐阜県': '例：岐阜市',
  '静岡県': '例：静岡市葵区',
  '愛知県': '例：名古屋市中区',
  '三重県': '例：津市',
  '滋賀県': '例：大津市',
  '京都府': '例：京都市中京区',
  '大阪府': '例：大阪市北区',
  '兵庫県': '例：神戸市中央区',
  '奈良県': '例：奈良市',
  '和歌山県': '例：和歌山市',
  '鳥取県': '例：鳥取市',
  '島根県': '例：松江市',
  '岡山県': '例：岡山市北区',
  '広島県': '例：広島市西区',
  '山口県': '例：山口市',
  '徳島県': '例：徳島市',
  '香川県': '例：高松市',
  '愛媛県': '例：松山市',
  '高知県': '例：高知市',
  '福岡県': '例：福岡市博多区',
  '佐賀県': '例：佐賀市',
  '長崎県': '例：長崎市',
  '熊本県': '例：熊本市中央区',
  '大分県': '例：大分市',
  '宮崎県': '例：宮崎市',
  '鹿児島県': '例：鹿児島市',
  '沖縄県': '例：那覇市',
}

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備', 2: '2号警備', 3: '3号警備', 4: '4号警備',
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#457b9d', 2: '#2a9d8f', 3: '#e76f51', 4: '#e63946',
}

type Company = {
  slug: string
  name: string
  pref: string
  city: string
  tel: string
  numbers: number[]
}

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

export default function NearbyPage() {
  const [pref, setPref] = useState('')
  const [city, setCity] = useState('')
  const [results, setResults] = useState<Company[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!pref) {
      alert('都道府県を選択してください')
      return
    }
    setLoading(true)
    setSearched(true)

    let query = supabase
      .from('companies')
      .select('slug, name, pref, city, tel, numbers')
      .eq('pref', pref)
      .limit(50)

    if (city.trim()) {
      query = query.ilike('city', `%${city.trim()}%`)
    }

    const { data: raw } = await query

    let companies = raw ?? []
    if (pref === '広島県') {
      const { data: saizen } = await supabase
        .from('companies')
        .select('slug, name, pref, city, tel, numbers')
        .eq('slug', 'saizen-666')
        .single()
      if (saizen) {
        companies = [saizen, ...companies.filter(c => c.slug !== 'saizen-666')]
      }
    }

    setResults(companies)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* パンくず */}
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</a>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>近くの警備会社を探す</span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111', margin: '0 0 6px' }}>
          お近くの警備会社を探す
        </h1>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
          都道府県・市区町村から絞り込んで、エリアの警備会社を一覧表示します
        </p>

        {/* 検索フォーム */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '14px' }}>
            📍 エリアを選択
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
                placeholder={pref ? (CITY_PLACEHOLDER[pref] ?? '市区町村を入力') : '都道府県を先に選択してください'}
                style={inputStyle}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#fdba74' : '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '24px',
          }}
        >
          {loading ? '検索中...' : 'この条件で警備会社を探す'}
        </button>

        {/* ローディング */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              display: 'inline-block',
              width: '36px',
              height: '36px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #f97316',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* 検索結果 */}
        {!loading && searched && results !== null && (
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              {results.length > 0
                ? `${pref}${city ? `・${city}` : ''}の警備会社 ${results.length}件`
                : ''}
            </div>

            {results.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '2rem',
                textAlign: 'center',
                color: '#888',
                fontSize: '14px',
              }}>
                該当する警備会社が見つかりませんでした
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.map(c => (
                  <div key={c.slug} style={{
                    background: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    padding: '14px 16px',
                  }}>
                    <a
                      href={`/companies/${c.slug}`}
                      style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', textDecoration: 'none' }}
                    >
                      {c.name}
                    </a>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {c.pref}{c.city ?? ''}
                      {c.tel && <span style={{ marginLeft: '12px' }}>📞 {c.tel}</span>}
                    </div>
                    {c.numbers && c.numbers.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                        {c.numbers.map(n => (
                          <span key={n} style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '99px',
                            background: NUMBER_COLORS[n] ?? '#888',
                            color: '#fff',
                            fontWeight: 600,
                          }}>
                            {NUMBER_LABELS[n] ?? `${n}号警備`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
