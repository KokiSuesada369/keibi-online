'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SERVICE_TYPES_SPECIAL = ['すべて', '交通誘導警備業務', '雑踏警備業務', '施設警備業務', '貴重品運搬警備業務', '核燃料物質等危険物運搬警備業務']
const SERVICE_TYPES_SUPERVISOR = ['すべて', '1号警備業務', '2号警備業務', '3号警備業務', '4号警備業務', '機械警備業務管理者']
const GRADES = ['すべて', '1級', '2級']
const TARGETS = ['すべて', '警備員', '一般']
const TYPES = ['すべて', '新規取得', '追加取得', '定期講習']

const PREFS_SPECIAL = ['すべて', '北海道', '青森', '岩手', '宮城', '秋田', '山形', '福島', '茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川', '新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知', '三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山', '鳥取', '島根', '岡山', '広島', '山口', '徳島', '香川', '愛媛', '高知', '福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄', '特講セ']
const PREFS_SUPERVISOR = ['すべて', '北海道', '宮城県', '茨城県', '千葉県', '東京都', '神奈川県', '京都府', '大阪府', '兵庫県', '広島県', '愛知県', '福岡県']

const SERVICE_COLOR: Record<string, { bg: string; color: string }> = {
  '交通誘導警備業務': { bg: '#e6f7f4', color: '#0f6e56' },
  '雑踏警備業務': { bg: '#eef2ff', color: '#3b4fa8' },
  '施設警備業務': { bg: '#fff4e6', color: '#854f0b' },
  '貴重品運搬警備業務': { bg: '#fef3f2', color: '#b91c1c' },
  '核燃料物質等危険物運搬警備業務': { bg: '#f3f0ff', color: '#6b21a8' },
  '1号警備業務': { bg: '#fff4e6', color: '#854f0b' },
  '2号警備業務': { bg: '#e6f7f4', color: '#0f6e56' },
  '3号警備業務': { bg: '#fef3f2', color: '#b91c1c' },
  '4号警備業務': { bg: '#f3f0ff', color: '#6b21a8' },
}

const SERVICE_SHORT: Record<string, string> = {
  '交通誘導警備業務': '交通誘導', '雑踏警備業務': '雑踏', '施設警備業務': '施設',
  '貴重品運搬警備業務': '貴重品', '核燃料物質等危険物運搬警備業務': '核燃料等',
  '1号警備業務': '1号', '2号警備業務': '2号', '3号警備業務': '3号', '4号警備業務': '4号',
}

export default function LicensePage() {
  const [tab, setTab] = useState<'special' | 'supervisor'>('special')
  const today = new Date().toISOString().split('T')[0]

  // 特別講習
  const [specialRecords, setSpecialRecords] = useState<any[]>([])
  const [specialLoading, setSpecialLoading] = useState(true)
  const [serviceType, setServiceType] = useState('すべて')
  const [grade, setGrade] = useState('すべて')
  const [target, setTarget] = useState('すべて')
  const [specialPref, setSpecialPref] = useState('すべて')
  const [hideSpecialPast, setHideSpecialPast] = useState(true)

  // 指導教育責任者
  const [supervisorRecords, setSupervisorRecords] = useState<any[]>([])
  const [supervisorLoading, setSupervisorLoading] = useState(true)
  const [qualification, setQualification] = useState('すべて')
  const [lectureType, setLectureType] = useState('すべて')
  const [supervisorPref, setSupervisorPref] = useState('すべて')
  const [hideSupervisorPast, setHideSupervisorPast] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setSpecialLoading(true)
      let query = supabase.from('training_schedules').select('*').order('start_date', { ascending: true })
      if (serviceType !== 'すべて') query = query.eq('service_type', serviceType)
      if (grade !== 'すべて') query = query.eq('grade', grade)
      if (target !== 'すべて') query = query.eq('target', target)
      if (specialPref !== 'すべて') query = query.eq('pref', specialPref)
      const { data } = await query
      setSpecialRecords(data ?? [])
      setSpecialLoading(false)
    }
    fetch()
  }, [serviceType, grade, target, specialPref])

  useEffect(() => {
    const fetch = async () => {
      setSupervisorLoading(true)
      let query = supabase.from('supervisor_schedules').select('*').order('date_start', { ascending: true })
      if (qualification !== 'すべて') query = query.eq('qualification', qualification)
      if (lectureType !== 'すべて') query = query.eq('type', lectureType)
      if (supervisorPref !== 'すべて') query = query.eq('pref', supervisorPref)
      const { data } = await query
      setSupervisorRecords(data ?? [])
      setSupervisorLoading(false)
    }
    fetch()
  }, [qualification, lectureType, supervisorPref])

  const filteredSpecial = hideSpecialPast
    ? specialRecords.filter(r => !r.start_date || r.start_date >= today)
    : specialRecords

  const filteredSupervisor = hideSupervisorPast
    ? supervisorRecords.filter(r => !r.date_start || r.date_start >= today)
    : supervisorRecords

  const selectStyle = { border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', outline: 'none' }

  return (
    <main style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; 資格・講習情報
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px', color: '#1a1a2e' }}>資格・講習情報</h1>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>警備業に関する講習日程を検索できます。</p>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '4px' }}>
          {[{ key: 'special', label: '特別講習（検定）' }, { key: 'supervisor', label: '指導教育責任者講習' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: tab === t.key ? 700 : 400, fontSize: '13px', background: tab === t.key ? '#1a1a2e' : 'transparent', color: tab === t.key ? 'white' : '#555', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'special' && (
          <>
            <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>業務種別</div>
                  <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={selectStyle}>
                    {SERVICE_TYPES_SPECIAL.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>級</div>
                  <select value={grade} onChange={e => setGrade(e.target.value)} style={selectStyle}>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>対象</div>
                  <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
                    {TARGETS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>都道府県</div>
                  <select value={specialPref} onChange={e => setSpecialPref(e.target.value)} style={selectStyle}>
                    {PREFS_SPECIAL.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ fontSize: '12px', color: '#f4820a', fontWeight: 700, paddingBottom: '6px' }}>
                  {specialLoading ? '検索中...' : `${filteredSpecial.length}件`}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" checked={hideSpecialPast} onChange={e => setHideSpecialPast(e.target.checked)} style={{ width: '15px', height: '15px', cursor: 'pointer' }} />
                実施済みを非表示にする
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {specialLoading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>読み込み中...</div>
              ) : filteredSpecial.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>該当する講習がありません</div>
              ) : filteredSpecial.map(r => {
                const isPast = r.start_date && r.start_date < today
                const col = SERVICE_COLOR[r.service_type] ?? { bg: '#f5f6fa', color: '#555' }
                return (
                  <div key={r.id} style={{ background: isPast ? '#fafafa' : 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', opacity: isPast ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: col.bg, color: col.color }}>{SERVICE_SHORT[r.service_type] ?? r.service_type}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#555' }}>{r.grade}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#888' }}>{r.target}</span>
                      {isPast && <span style={{ fontSize: '11px', color: '#aaa' }}>終了</span>}
                      {r.notes && r.notes.includes('中止') && <span style={{ fontSize: '11px', color: '#e63946', fontWeight: 700 }}>中止</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>
                        {r.start_date?.replace(/-/g, '/')} {r.end_date && r.end_date !== r.start_date ? `〜 ${r.end_date.replace(/-/g, '/')}` : ''}
                      </span>
                      <span style={{ fontSize: '13px', color: '#555' }}>📍 {r.pref}</span>
                      {r.capacity_main > 0 && <span style={{ fontSize: '12px', color: '#888' }}>定員 {r.capacity_main}名</span>}
                      {r.fee && <span style={{ fontSize: '12px', color: '#888' }}>受講料 {r.fee.toLocaleString()}円</span>}
                    </div>

                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '24px' }}>
              データ出典：一般社団法人 警備員特別講習事業センター（CSST）
            </div>
          </>
        )}

        {tab === 'supervisor' && (
          <>
            <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>警備業務</div>
                  <select value={qualification} onChange={e => setQualification(e.target.value)} style={selectStyle}>
                    {SERVICE_TYPES_SUPERVISOR.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>講習種別</div>
                  <select value={lectureType} onChange={e => setLectureType(e.target.value)} style={selectStyle}>
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>都道府県</div>
                  <select value={supervisorPref} onChange={e => setSupervisorPref(e.target.value)} style={selectStyle}>
                    {PREFS_SUPERVISOR.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ fontSize: '12px', color: '#f4820a', fontWeight: 700, paddingBottom: '6px' }}>
                  {supervisorLoading ? '検索中...' : `${filteredSupervisor.length}件`}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" checked={hideSupervisorPast} onChange={e => setHideSupervisorPast(e.target.checked)} style={{ width: '15px', height: '15px', cursor: 'pointer' }} />
                実施済みを非表示にする
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {supervisorLoading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>読み込み中...</div>
              ) : filteredSupervisor.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#aaa' }}>該当する講習がありません</div>
              ) : filteredSupervisor.map(r => {
                const isPast = r.date_start && r.date_start < today
                const col = SERVICE_COLOR[r.qualification] ?? { bg: '#f5f6fa', color: '#555' }
                return (
                  <div key={r.id} style={{ background: isPast ? '#fafafa' : 'white', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '14px 16px', opacity: isPast ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: col.bg, color: col.color }}>{SERVICE_SHORT[r.qualification] ?? r.qualification}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#555' }}>{r.type}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#eef2ff', color: '#3b4fa8' }}>{r.pref}</span>
                      {isPast && <span style={{ fontSize: '11px', color: '#aaa' }}>終了</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>
                        {r.date_start?.replace(/-/g, '/')} {r.date_end && r.date_end !== r.date_start ? `〜 ${r.date_end.replace(/-/g, '/')}` : ''}
                      </span>
                      {r.deadline && <span style={{ fontSize: '12px', color: '#e63946' }}>締切 {r.deadline.replace(/-/g, '/')}</span>}
                      {r.notes && <span style={{ fontSize: '12px', color: '#888' }}>{r.notes}</span>}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#457b9d', textDecoration: 'none' }}>
                        📄 {r.source} →
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '24px' }}>
              ※現在登録済み：東京都・広島県・大阪府・愛知県・神奈川県。順次追加予定。
            </div>
          </>
        )}
      </div>
    </main>
  )
}
