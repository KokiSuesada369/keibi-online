import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()
await page.goto('https://www.police.pref.chiba.jp/fuhoka/shidoukyoiku_kanrisya.html', { waitUntil: 'networkidle2', timeout: 30000 })
const text = await page.evaluate(() => document.body.innerText)
const idx = text.search(/令和|指導教育責任者/)
console.log(text.slice(idx, idx + 500))
await browser.close()
