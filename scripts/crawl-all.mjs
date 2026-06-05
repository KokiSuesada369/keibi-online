import puppeteer from 'puppeteer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY

const PROMPT = `このページから指導教育責任者講習・機械警備業務管理者講習・警備員特別講習の日程情報を全て抽出してください。
JSONのみ返してください。

{
  "schedules": [
    {
      "category": "種別（supervisor=指導教育責任者・機械警備, special=特別講習）",
      "qualification": "資格種別（1号警備業務・2号警備業務・3号警備業務・4号警備業務・機械警備業務管理者）",
      "type": "講習種別（新規取得・追加取得・定期講習）",
      "date_start": "開始日 YYYY-MM-DD",
      "date_end": "終了日 YYYY-MM-DD",
      "deadline": "申込締切 YYYY-MM-DD",
      "notes": "備考（定員など）"
    }
  ]
}

・情報がない項目はnullにしてください
・2026年以降のデータのみ抽出してください
・令和8年=2026年、令和9年=2027年
・JSONのみ返してください`

async function callClaude(text) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 3000,
      messages: [{ role: 'user', content: `${PROMPT}\n\nページ内容:\n${text.slice(0, 12000)}` }]
    })
  })
  const data = await res.json()
  const raw = data.content?.[0]?.text || '{}'
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return (parsed.schedules || []).filter(s => s.type && s.qualification)
  } catch {
    return []
  }
}

async function processSource(browser, source) {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
  try {
    await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 30000 })
    const pdfLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href$=".pdf"], a[href*=".pdf"]'))
        .map(a => a.href).slice(0, 5)
    )
    const text = await page.evaluate(() => document.body.innerText)
    let allSchedules = []
    const htmlSchedules = await callClaude(text)
    allSchedules.push(...htmlSchedules)
    for (const pdfUrl of pdfLinks) {
      try {
        const pdfRes = await fetch(pdfUrl)
        if (!pdfRes.ok) continue
        const buffer = await pdfRes.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': CLAUDE_API_KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({
            model: 'claude-opus-4-5',
            max_tokens: 2000,
            messages: [{ role: 'user', content: [
              { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
              { type: 'text', text: PROMPT }
            ]}]
          })
        })
        const data = await res.json()
        const raw = data.content?.[0]?.text || '{}'
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
        allSchedules.push(...(parsed.schedules || []).filter(s => s.type && s.qualification))
      } catch {}
      await new Promise(r => setTimeout(r, 500))
    }
    allSchedules = allSchedules
      .filter(s => !s.date_start || s.date_start >= '2026-01-01')
      .filter((s, i, arr) => arr.findIndex(x => x.qualification === s.qualification && x.type === s.type && x.date_start === s.date_start) === i)
    return { schedules: allSchedules, pdfCount: pdfLinks.length }
  } catch(e) {
    return { schedules: [], pdfCount: 0, error: e.message }
  } finally {
    await page.close()
  }
}

async function saveSchedules(schedules, pref, source, url) {
  if (schedules.length === 0) return 0
  const supervisorSchedules = schedules.filter(s => s.category !== 'special')
  const specialSchedules = schedules.filter(s => s.category === 'special')
  if (supervisorSchedules.length > 0) {
    await supabase.from('supervisor_schedules').delete().eq('pref', pref).eq('url', url)
    await supabase.from('supervisor_schedules').insert(
      supervisorSchedules.map(s => ({ pref, source, url, qualification: s.qualification, type: s.type, date_start: s.date_start, date_end: s.date_end, deadline: s.deadline, notes: s.notes }))
    )
  }
  if (specialSchedules.length > 0) {
    await supabase.from('training_schedules').delete().eq('pref', pref).eq('url', url)
    await supabase.from('training_schedules').insert(
      specialSchedules.map(s => ({ pref, source, url, qualification: s.qualification, type: s.type, date_start: s.date_start, date_end: s.date_end, deadline: s.deadline, notes: s.notes }))
    )
  }
  return schedules.length
}

const { data: sources } = await supabase.from('crawl_sources').select('*').eq('is_active', true)
const targetPref = process.env.TARGET_PREF
const targetRegion = process.env.TARGET_REGION
const REGIONS = {
  '中国': ['広島県', '山口県', '岡山県', '島根県', '鳥取県'],
  '四国': ['徳島県', '香川県', '愛媛県', '高知県'],
  '九州': ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
  '東北': ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  '関東': ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'],
  '中部': ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'],
  '近畿': ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'],
}
const filteredSources = targetPref
  ? sources.filter(s => s.pref === targetPref)
  : targetRegion && REGIONS[targetRegion]
  ? sources.filter(s => REGIONS[targetRegion].includes(s.pref))
  : sources

console.log(`${filteredSources.length}件処理開始...`)

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
let totalSaved = 0

for (const source of filteredSources) {
  process.stdout.write(`処理中: ${source.pref} (${source.source})... `)
  const result = await processSource(browser, source)
  if (result.error) { console.log(`エラー: ${result.error}`); continue }
  const saved = await saveSchedules(result.schedules, source.pref, source.source, source.url)
  totalSaved += saved
  console.log(`→ ${saved}件保存 (PDF:${result.pdfCount}件)`)
  await new Promise(r => setTimeout(r, 1000))
}

await browser.close()
console.log(`\n完了！合計${totalSaved}件保存`)
