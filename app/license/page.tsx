'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SERVICE_TYPES = ['すべて', '交通誘導警備業務', '雑踏警備業務', '施設警備業務', '貴重品運搬警備業務', '核燃料物質等危険物運搬警備業務']
const GRADES = ['すべて', '1級', '2級']
const TARGETS = ['すべて', '警備員', '一般']

export default function LicensePage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceType, setServiceType] = useState('すべて')
  const [grade, setGrade] = useState('すべて')
  const [target, setTarget] = useState('すべて')
  const [pref, setPref] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      let query = supabase
        .from('training_schedules')
        .select('*')
        .order('start_date', { ascending: true })

      if (serviceType !== 'すべて') query = query.eq('service_type', serviceType)
      if (grade !== 'すべて') query = query.eq('grade', grade)
      if (target !== 'すべて') query = query.eq('target', target)
      if (pref) query = query.ilike('pref', `%${pref}%`)

      const { data } = await query
      setRecords(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [serviceType, grade, target, pref])

  const today = new Date().toISOString().split('T')[0]

  const SERVICE_SHORT: Record<string, string> = {
    '交通誘導警備業務': '交通誘導',
    '雑踏警備業務': '雑踏',
    '施設警備業務': '施設',
    '貴重品運搬警備業務': '貴重品',
    '核燃料物質等危険物運搬警備業務': '核燃料等',
  }

  const SERVICE_COLOR: Record<string, { bg: string; color: string }> = {
    '交通誘導警備業務': { bg: '#e6f7f4', color: '#0f6e56' },
    '雑踏警備業務': { bg: '#eef2ff', color: '#3b4fa8' },
    '施設警備業務': { bg: '#fff4e6', color: '#854f0b' },
    '貴重品運搬警備業務': { bg: '#fef3f2', color: '#b91c1c' },
    '核燃料物質等危険物運搬警備業務': { bg: '#f3f0ff', color: '#6b21a8' },
  }

  return (
    <main style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; 資格・講習情報
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px', color: '#1a1a2e' }}>警備員特別講習 日程一覧</h1>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>2026年度の講習日程です。絞り込んで検索できます。</p>

        {/* フィルター */}
        <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>業務種別</div>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', outline: 'none' }}>
              {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>級</div>
            <select value={grade} onChange={e => setGrade(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', outline: 'none' }}>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>対象</div>
            <select value={target} onChange={e => setTarget(e.target.value)} style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', outline: 'none' }}>
              {TARGETS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>都道府県</div>
            <input value={pref} onChange={e => setPref(e.target.value)} placeholder="例：広島" style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', outline: 'none', width: '100px' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#f4820a', fontWeight: 700, paddingBottom: '6px' }}>
            {loading ? '検索中...' : `${records.length}件`}
          </div>
        </div>

        {/* 一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>読み込み中...</div>
          ) : records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>該当する講習がありません</div>
          ) : records.map(r => {
            const isPast = r.start_date && r.start_date < today
            const col = SERVICE_COLOR[r.service_type] ?? { bg: '#f5f6fa', color: '#555' }
            return (
              <div key={r.id} style={{ background: isPast ? '#fafafa' : 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', opacity: isPast ? 0.6 : 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: col.bg, color: col.color }}>
                    {SERVICE_SHORT[r.service_type] ?? r.service_type}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#555' }}>{r.grade}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#888' }}>{r.target}</span>
                  {isPast && <span style={{ fontSize: '11px', color: '#aaa' }}>終了</span>}
                  {r.notes && r.notes.includes('中止') && <span style={{ fontSize: '11px', color: '#e63946', fontWeight: 700 }}>中止</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>
                      {r.start_date ? r.start_date.replace(/-/g, '/') : '-'}
                      {r.end_date && r.end_date !== r.start_date ? ` 〜 ${r.end_date.replace(/-/g, '/')}` : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    📍 {r.pref} {r.venue && `・${r.venue}`}
                  </div>
                  {r.capacity_main > 0 && <div style={{ fontSize: '12px', color: '#888' }}>定員 {r.capacity_main}名</div>}
                  {r.fee && <div style={{ fontSize: '12px', color: '#888' }}>受講料 {r.fee.toLocaleString()}円</div>}
                </div>
                {r.notes && !r.notes.includes('中止') && (
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>{r.notes}</div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '24px' }}>
          データ出典：一般社団法人 警備員特別講習事業センター（CSST）
        </div>
      </div>
    </main>
  )
}
