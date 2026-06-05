import puppeteer from 'puppeteer'

const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.goto('https://www.police.pref.chiba.jp/fuhoka/shidoukyoiku_kanrisya.html', { waitUntil: 'networkidle2', timeout: 30000 })

const pdfLinks = await page.evaluate(() =>
  Array.from(document.querySelectorAll('a[href$=".pdf"], a[href*=".pdf"]')).map(a => a.href)
)
console.log('PDFリンク:', pdfLinks)

const text = await page.evaluate(() => document.body.innerText)
console.log('\nテキスト先頭500文字:')
console.log(text.slice(0, 500))

// Claude APIテスト
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': CLAUDE_API_KEY,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: `以下から指導教育責任者講習の日程をJSONで抽出してください。{"schedules":[{"qualification":"1号警備業務等","type":"新規取得等","date_start":"YYYY-MM-DD","date_end":"YYYY-MM-DD","deadline":null,"notes":null}]}\n\n${text.slice(0, 3000)}` }]
  })
})
const data = await res.json()
console.log('\nClaude API レスポンス:')
console.log(JSON.stringify(data.content?.[0]?.text?.slice(0, 500)))

await browser.close()
