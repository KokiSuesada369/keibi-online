import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabase = createClient(
  'https://rglhbaxcltzlywpcmjhp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbGhiYXhjbHR6bHl3cGNtamhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTM3NDksImV4cCI6MjA5NjA4OTc0OX0.Mua3WShVqbGbxn3lmcz6Y3N6YHsXCKZo4WI7vmp9zIU'
)

const DATE_PATTERN = /令和\d+年\d+月\d+日|\d{4}年\d+月\d+日|\d{4}[-\/]\d{1,2}[-\/]\d{1,2}/

async function checkSource(source) {
  try {
    const res = await fetch(source.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' },
      signal: AbortSignal.timeout(8000)
    })

    if (!res.ok) return { ...source, type: 'error', reason: `HTTP ${res.status}` }

    const html = await res.text()
    const hasDates = DATE_PATTERN.test(html)
    const hasPdfLinks = /href=["'][^"']*\.pdf["']/i.test(html)
    const hasScheduleKeywords = /講習|日程|実施予定|受講/.test(html)

    if (hasDates && hasScheduleKeywords) {
      return { ...source, type: 'html', reason: '日付データあり' }
    } else if (hasPdfLinks && hasScheduleKeywords) {
      return { ...source, type: 'pdf', reason: 'PDFリンクのみ' }
    } else if (hasScheduleKeywords) {
      return { ...source, type: 'unknown', reason: '日程キーワードあるが日付なし' }
    } else {
      return { ...source, type: 'no_schedule', reason: '日程情報なし' }
    }
  } catch (e) {
    return { ...source, type: 'error', reason: e.message }
  }
}

const { data: sources } = await supabase
  .from('crawl_sources')
  .select('*')
  .eq('is_active', true)

console.log(`${sources.length}件チェック開始...\n`)

const results = { html: [], pdf: [], unknown: [], no_schedule: [], error: [] }

for (const source of sources) {
  process.stdout.write(`チェック中: ${source.pref} (${source.source})... `)
  const result = await checkSource(source)
  results[result.type].push(result)
  console.log(`→ ${result.type}: ${result.reason}`)
  await new Promise(r => setTimeout(r, 500))
}

console.log('\n===== 仕分け結果 =====')
console.log(`✅ HTML（自動化可能）: ${results.html.length}件`)
results.html.forEach(r => console.log(`  - ${r.pref}: ${r.source}`))
console.log(`\n📄 PDF（手動更新）: ${results.pdf.length}件`)
results.pdf.forEach(r => console.log(`  - ${r.pref}: ${r.source}`))
console.log(`\n❓ 不明: ${results.unknown.length}件`)
results.unknown.forEach(r => console.log(`  - ${r.pref}: ${r.source} (${r.reason})`))
console.log(`\n⚠️ 日程なし: ${results.no_schedule.length}件`)
results.no_schedule.forEach(r => console.log(`  - ${r.pref}: ${r.source}`))
console.log(`\n❌ エラー: ${results.error.length}件`)
results.error.forEach(r => console.log(`  - ${r.pref}: ${r.source} (${r.reason})`))

fs.writeFileSync('scripts/sources-check-result.json', JSON.stringify(results, null, 2))
console.log('\n結果をscripts/sources-check-result.jsonに保存しました')
