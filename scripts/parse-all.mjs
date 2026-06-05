import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabase = createClient(
  'https://rglhbaxcltzlywpcmjhp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbGhiYXhjbHR6bHl3cGNtamhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTM3NDksImV4cCI6MjA5NjA4OTc0OX0.Mua3WShVqbGbxn3lmcz6Y3N6YHsXCKZo4WI7vmp9zIU'
)

function parseReiwa(year, month, day) {
  const y = 2018 + parseInt(year)
  return `${y}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function extractSchedules(text, pref, source, url) {
  const results = []

  // パターン1: 〇号警備業務→令和X年X月X日～(X月)X日
  const p1 = /(警備員指導教育責任者講習|機械警備業務管理者講習)([^→\n]{0,30})[→]\s*令和(\d+)年(\d+)月(\d+)日[～〜～](?:(\d+)月)?(\d+)日/g
  let m
  while ((m = p1.exec(text)) !== null) {
    const typeStr = m[2] || ''
    const reiwaYear = parseInt(m[3])
    const startYear = 2018 + reiwaYear
    const startMonth = m[4]
    const startDay = m[5]
    const endMonth = m[6] || m[4]
    const endDay = m[7]

    const qualification = m[1].includes('機械')
      ? '機械警備業務管理者'
      : typeStr.match(/[1１]号/) ? '1号警備業務'
      : typeStr.match(/[2２]号/) ? '2号警備業務'
      : typeStr.match(/[3３]号/) ? '3号警備業務'
      : typeStr.match(/[4４]号/) ? '4号警備業務'
      : null

    if (!qualification) continue

    const type = typeStr.includes('新規') ? '新規取得'
      : typeStr.includes('追加') ? '追加取得'
      : typeStr.includes('定期') || typeStr.includes('現任') ? '定期講習'
      : '新規取得'

    results.push({
      pref, source, url, qualification, type,
      date_start: `${startYear}-${String(startMonth).padStart(2,'0')}-${String(startDay).padStart(2,'0')}`,
      date_end: `${startYear}-${String(endMonth).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`,
      deadline: null,
      notes: null,
    })
  }

  // パターン2: テーブル形式 令和X年X月X日～X月X日 + 前後のコンテキストから資格区分を取得
  const p2 = /([1-4１-４]号警備業務|機械警備業務管理者)[^令]*令和(\d+)年(\d+)月(\d+)日[^\n～〜～]*[～〜～][^\n]*?(?:令和\d+年)?(\d+)月(\d+)日/g
  while ((m = p2.exec(text)) !== null) {
    const qualStr = m[1]
    const startYear = 2018 + parseInt(m[2])
    const qualification = qualStr.match(/[1１]号/) ? '1号警備業務'
      : qualStr.match(/[2２]号/) ? '2号警備業務'
      : qualStr.match(/[3３]号/) ? '3号警備業務'
      : qualStr.match(/[4４]号/) ? '4号警備業務'
      : '機械警備業務管理者'

    const surrounding = text.slice(Math.max(0, m.index - 100), m.index + 200)
    const type = surrounding.includes('新規') ? '新規取得'
      : surrounding.includes('追加') ? '追加取得'
      : surrounding.includes('定期') || surrounding.includes('現任') ? '定期講習'
      : '新規取得'

    results.push({
      pref, source, url, qualification, type,
      date_start: `${startYear}-${String(m[3]).padStart(2,'0')}-${String(m[4]).padStart(2,'0')}`,
      date_end: `${startYear}-${String(m[5]).padStart(2,'0')}-${String(m[6]).padStart(2,'0')}`,
      deadline: null,
      notes: null,
    })
  }

  // 2026年以降のみ・重複除去
  const filtered = results.filter(r => r.date_start >= '2026-01-01')
  const unique = filtered.filter((r, i, arr) =>
    arr.findIndex(x => x.qualification === r.qualification && x.type === r.type && x.date_start === r.date_start) === i
  )
  return unique
}

// HTMLのソースを取得
const { data: sources } = await supabase
  .from('crawl_sources')
  .select('*')
  .eq('is_active', true)

const htmlSources = JSON.parse(fs.readFileSync('scripts/sources-check-result.json', 'utf8')).html

const allResults = []
let totalExtracted = 0

for (const src of htmlSources) {
  try {
    process.stdout.write(`パース中: ${src.pref} (${src.source})... `)
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)
    })
    const html = await res.text()
    const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
    const schedules = extractSchedules(text, src.pref, src.source, src.url)
    console.log(`→ ${schedules.length}件`)
    allResults.push({ ...src, schedules })
    totalExtracted += schedules.length
    await new Promise(r => setTimeout(r, 300))
  } catch(e) {
    console.log(`→ エラー: ${e.message}`)
  }
}

console.log(`\n===== 合計 ${totalExtracted}件抽出 =====`)
allResults.filter(r => r.schedules.length > 0).forEach(r => {
  console.log(`\n${r.pref} (${r.schedules.length}件):`)
  r.schedules.forEach(s => console.log(`  ${s.qualification} ${s.type} ${s.date_start}〜${s.date_end}`))
})

fs.writeFileSync('scripts/parse-all-result.json', JSON.stringify(allResults, null, 2))
console.log('\n結果をscripts/parse-all-result.jsonに保存しました')
