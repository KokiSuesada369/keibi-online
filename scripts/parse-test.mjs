import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://rglhbaxcltzlywpcmjhp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbGhiYXhjbHR6bHl3cGNtamhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTM3NDksImV4cCI6MjA5NjA4OTc0OX0.Mua3WShVqbGbxn3lmcz6Y3N6YHsXCKZo4WI7vmp9zIU'
)

function parseJapaneseDate(str) {
  if (!str) return null
  const reiwa = str.match(/令和(\d+)年\s*(\d+)月\s*(\d+)日/)
  if (reiwa) {
    const y = 2018 + parseInt(reiwa[1])
    return `${y}-${String(reiwa[2]).padStart(2,'0')}-${String(reiwa[3]).padStart(2,'0')}`
  }
  const seireki = str.match(/(\d{4})年\s*(\d+)月\s*(\d+)日/)
  if (seireki) {
    return `${seireki[1]}-${String(seireki[2]).padStart(2,'0')}-${String(seireki[3]).padStart(2,'0')}`
  }
  const iso = str.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/)
  if (iso) {
    return `${iso[1]}-${String(iso[2]).padStart(2,'0')}-${String(iso[3]).padStart(2,'0')}`
  }
  return null
}

function extractDatesFromText(text) {
  const dates = []
  const patterns = [
    /令和(\d+)年\s*(\d+)月\s*(\d+)日/g,
    /(\d{4})年\s*(\d+)月\s*(\d+)日/g,
  ]
  for (const pat of patterns) {
    let m
    while ((m = pat.exec(text)) !== null) {
      const d = parseJapaneseDate(m[0])
      if (d) dates.push(d)
    }
  }
  return [...new Set(dates)].sort()
}

const TEST_URLS = [
  { pref: '神奈川県', url: 'https://www.police.pref.kanagawa.jp/tetsuzuki/eigyokankei/keibi/mesd0099.html' },
  { pref: '千葉県', url: 'https://www.police.pref.chiba.jp/fuhoka/shidoukyoiku_kanrisya.html' },
  { pref: '兵庫県', url: 'https://www.police.pref.hyogo.lg.jp/tetuduki/keibigyou/index2.htm' },
  { pref: '福岡県', url: 'https://www.police.pref.fukuoka.jp/seian/seikan/keibigyou/072_2.html' },
]

for (const src of TEST_URLS) {
  console.log(`\n===== ${src.pref} =====`)
  const res = await fetch(src.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const html = await res.text()
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
  const dates = extractDatesFromText(text)
  console.log(`抽出された日付（${dates.length}件）:`, dates.slice(0, 10))
}
