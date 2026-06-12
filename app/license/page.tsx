'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PREF_NAMES } from '@/constants/prefs'

const SERVICE_TYPES_SPECIAL = ['すべて', '交通誘導警備業務', '雑踏警備業務', '施設警備業務', '貴重品運搬警備業務', '核燃料物質等危険物運搬警備業務']
const SERVICE_TYPES_SUPERVISOR = ['すべて', '1号警備業務', '2号警備業務', '3号警備業務', '4号警備業務', '機械警備業務管理者']
const GRADES = ['すべて', '1級', '2級']
const TARGETS = ['すべて', '警備員', '一般']
const TYPES = ['すべて', '新規取得', '追加取得', '定期講習']

const PREFS_SPECIAL_OPTIONS = PREF_NAMES
const PREFS_SUPERVISOR_OPTIONS = PREF_NAMES

function formatDateRange(start?: string | null, end?: string | null): string {
  const fmt = (d: string) => new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' }).format(new Date(d))
  if (!start) return ''
  if (!end || end === start) return fmt(start)
  return `${fmt(start)} 〜 ${fmt(end)}`
}

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

function PrefMultiSelect({
  options,
  selected,
  onChange,
  open,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  open: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>都道府県</div>
      <div style={{ position: 'relative' }}>
        <button
          onClick={onToggle}
          style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', cursor: 'pointer', minWidth: '140px', textAlign: 'left' }}
        >
          {selected.length === 0 ? 'すべての都道府県 ▾' : `${selected.length}件選択中 ▾`}
        </button>
        {open && (
          <>
            <div onClick={onToggle} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
            <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '8px', maxHeight: '220px', overflowY: 'auto', width: '180px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', marginTop: '4px' }}>
              {options.map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(p)}
                    onChange={() => onChange(selected.includes(p) ? selected.filter(x => x !== p) : [...selected, p])}
                    style={{ cursor: 'pointer' }}
                  />
                  {p}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
          {selected.map(p => (
            <span key={p} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: '#1a1a2e', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {p}
              <button onClick={() => onChange(selected.filter(x => x !== p))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0, fontSize: '12px', lineHeight: 1, marginLeft: '2px' }}>×</button>
            </span>
          ))}
          <button onClick={() => onChange([])} style={{ fontSize: '11px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>クリア</button>
        </div>
      )}
    </div>
  )
}

function MonthFilter({ selected, onChange }: { selected: number[]; onChange: (v: number[]) => void }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>月</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
          <button
            key={m}
            onClick={() => onChange(selected.includes(m) ? selected.filter(x => x !== m) : [...selected, m])}
            style={{ padding: '4px 8px', borderRadius: '99px', border: '1px solid', borderColor: selected.includes(m) ? '#1a1a2e' : '#ddd', background: selected.includes(m) ? '#1a1a2e' : 'white', color: selected.includes(m) ? 'white' : '#555', fontSize: '11px', cursor: 'pointer' }}
          >
            {m}月
          </button>
        ))}
        {selected.length > 0 && (
          <button onClick={() => onChange([])} style={{ fontSize: '11px', color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>クリア</button>
        )}
      </div>
    </div>
  )
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
  const [selectedSpecialPrefs, setSelectedSpecialPrefs] = useState<string[]>([])
  const [selectedSpecialMonths, setSelectedSpecialMonths] = useState<number[]>([])
  const [hideSpecialPast, setHideSpecialPast] = useState(true)
  const [showSpecialPrefDropdown, setShowSpecialPrefDropdown] = useState(false)

  // 指導教育責任者
  const [supervisorRecords, setSupervisorRecords] = useState<any[]>([])
  const [supervisorLoading, setSupervisorLoading] = useState(true)
  const [qualification, setQualification] = useState('すべて')
  const [lectureType, setLectureType] = useState('すべて')
  const [selectedSupervisorPrefs, setSelectedSupervisorPrefs] = useState<string[]>([])
  const [selectedSupervisorMonths, setSelectedSupervisorMonths] = useState<number[]>([])
  const [hideSupervisorPast, setHideSupervisorPast] = useState(true)
  const [showSupervisorPrefDropdown, setShowSupervisorPrefDropdown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setSpecialLoading(true)
      try {
        let query = supabase.from('training_schedules').select('*').order('start_date', { ascending: true })
        if (serviceType !== 'すべて') query = query.eq('service_type', serviceType)
        if (grade !== 'すべて') query = query.eq('grade', grade)
        if (target !== 'すべて') query = query.eq('target', target)
        const { data } = await query
        setSpecialRecords(data ?? [])
      } finally {
        setSpecialLoading(false)
      }
    }
    fetchData()
  }, [serviceType, grade, target])

  useEffect(() => {
    const fetchData = async () => {
      setSupervisorLoading(true)
      try {
        let query = supabase.from('supervisor_schedules').select('*').order('date_start', { ascending: true })
        if (qualification !== 'すべて') query = query.eq('qualification', qualification)
        if (lectureType !== 'すべて') query = query.eq('type', lectureType)
        const { data } = await query
        setSupervisorRecords(data ?? [])
      } finally {
        setSupervisorLoading(false)
      }
    }
    fetchData()
  }, [qualification, lectureType])

  const filteredSpecial = specialRecords.filter(r => {
    if (hideSpecialPast && r.start_date && r.start_date < today) return false
    if (selectedSpecialPrefs.length > 0 && !selectedSpecialPrefs.includes(r.pref)) return false
    if (selectedSpecialMonths.length > 0) {
      const month = r.start_date ? new Date(r.start_date).getMonth() + 1 : null
      if (!month || !selectedSpecialMonths.includes(month)) return false
    }
    return true
  })

  const filteredSupervisor = supervisorRecords.filter(r => {
    if (hideSupervisorPast && r.date_start && r.date_start < today) return false
    if (selectedSupervisorPrefs.length > 0 && !selectedSupervisorPrefs.includes(r.pref)) return false
    if (selectedSupervisorMonths.length > 0) {
      const month = r.date_start ? new Date(r.date_start).getMonth() + 1 : null
      if (!month || !selectedSupervisorMonths.includes(month)) return false
    }
    return true
  })

  const selectStyle = { border: '1px solid #ddd', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', background: 'white', outline: 'none' }

  return (
    <main style={{ background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; 資格・講習情報
        </div>
        <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, marginBottom: '4px', color: '#1a1a2e' }}>資格・講習情報</h1>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontWeight: 700 }}>業務種別</div>
                  <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={selectStyle}>
                    {SERVICE_TYPES_SPECIAL.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <PrefMultiSelect
                  options={PREFS_SPECIAL_OPTIONS}
                  selected={selectedSpecialPrefs}
                  onChange={setSelectedSpecialPrefs}
                  open={showSpecialPrefDropdown}
                  onToggle={() => setShowSpecialPrefDropdown(v => !v)}
                />
                <div style={{ fontSize: '12px', color: '#f4820a', fontWeight: 700, paddingTop: '18px' }}>
                  {specialLoading ? '検索中...' : `${filteredSpecial.length}件`}
                </div>
              </div>
              <MonthFilter selected={selectedSpecialMonths} onChange={setSelectedSpecialMonths} />
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                  <input type="checkbox" checked={hideSpecialPast} onChange={e => setHideSpecialPast(e.target.checked)} style={{ width: '15px', height: '15px', cursor: 'pointer' }} />
                  実施済みを非表示にする
                </label>
              </div>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: col.bg, color: col.color }}>{SERVICE_SHORT[r.service_type] ?? r.service_type}</span>
                      {isPast && <span style={{ fontSize: '11px', color: '#aaa' }}>終了</span>}
                      {r.notes && r.notes.includes('中止') && <span style={{ fontSize: '11px', color: '#e63946', fontWeight: 700 }}>中止</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                        {formatDateRange(r.start_date, r.end_date)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#555', display: 'flex', alignItems: 'flex-start', gap: '3px', flexWrap: 'wrap' }}>
                        📍<a href={`/license/${encodeURIComponent(r.pref)}`} style={{ color: '#457b9d', textDecoration: 'none', whiteSpace: 'nowrap' }}>{r.pref}</a>
                        {r.venue && <span style={{ color: '#888', wordBreak: 'break-all' }}>･ {r.venue}</span>}
                      </span>
                      <a href="https://www.csst.jp/04/04.html" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '11px', color: '#457b9d', textDecoration: 'none', padding: '5px 10px', border: '1px solid #457b9d', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                        詳細を確認 →
                      </a>
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
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
                <PrefMultiSelect
                  options={PREFS_SUPERVISOR_OPTIONS}
                  selected={selectedSupervisorPrefs}
                  onChange={setSelectedSupervisorPrefs}
                  open={showSupervisorPrefDropdown}
                  onToggle={() => setShowSupervisorPrefDropdown(v => !v)}
                />
                <div style={{ fontSize: '12px', color: '#f4820a', fontWeight: 700, paddingTop: '18px' }}>
                  {supervisorLoading ? '検索中...' : `${filteredSupervisor.length}件`}
                </div>
              </div>
              <MonthFilter selected={selectedSupervisorMonths} onChange={setSelectedSupervisorMonths} />
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#555', cursor: 'pointer' }}>
                  <input type="checkbox" checked={hideSupervisorPast} onChange={e => setHideSupervisorPast(e.target.checked)} style={{ width: '15px', height: '15px', cursor: 'pointer' }} />
                  実施済みを非表示にする
                </label>
              </div>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: col.bg, color: col.color }}>{SERVICE_SHORT[r.qualification] ?? r.qualification}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f5f6fa', color: '#555' }}>{r.type}</span>
                      {isPast && <span style={{ fontSize: '11px', color: '#aaa' }}>終了</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap' }}>
                        {formatDateRange(r.date_start, r.date_end)}
                      </span>
                      <span style={{ fontSize: '13px', color: '#555', display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                        📍<a href={`/license/${encodeURIComponent(r.pref)}`} style={{ color: '#457b9d', textDecoration: 'none' }}>{r.pref}</a>
                      </span>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '11px', color: '#457b9d', textDecoration: 'none', padding: '5px 10px', border: '1px solid #457b9d', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          詳細を確認 →
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginTop: '24px' }}>
              ※順次データを追加予定。
            </div>
          </>
        )}
      </div>
    </main>
  )
}
