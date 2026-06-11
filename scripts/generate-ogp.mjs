import { createCanvas } from 'canvas'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, '..', 'public', 'ogp.png')

const W = 1200
const H = 630

const canvas = createCanvas(W, H)
const ctx = canvas.getContext('2d')

// Background
ctx.fillStyle = '#0f172a'
ctx.fillRect(0, 0, W, H)

// Subtle grid pattern
ctx.strokeStyle = 'rgba(255,255,255,0.04)'
ctx.lineWidth = 1
for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

// Orange accent bar
ctx.fillStyle = '#f4820a'
ctx.fillRect(80, 200, 6, 120)

// Logo: keibi
ctx.font = 'bold 80px sans-serif'
ctx.fillStyle = '#ffffff'
ctx.fillText('keibi', 100, 290)

// Logo: .online (orange)
ctx.fillStyle = '#f4820a'
const keibiWidth = ctx.measureText('keibi').width
ctx.fillText('.online', 100 + keibiWidth, 290)

// Tagline
ctx.font = '28px sans-serif'
ctx.fillStyle = 'rgba(255,255,255,0.7)'
ctx.fillText('警備業界専門のポータルサイト', 100, 345)

// Stats row
const stats = [
  { value: '6,875社', label: '全国警備会社掲載' },
  { value: '32記事', label: '警備業界コラム' },
  { value: '47都道府県', label: '全国対応' },
]
stats.forEach((s, i) => {
  const x = 100 + i * 340
  const y = 460
  ctx.font = 'bold 36px sans-serif'
  ctx.fillStyle = '#f4820a'
  ctx.fillText(s.value, x, y)
  ctx.font = '18px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(s.label, x, y + 30)
})

// Bottom domain
ctx.font = '22px sans-serif'
ctx.fillStyle = 'rgba(255,255,255,0.3)'
ctx.fillText('https://keibi.online', 100, 590)

writeFileSync(outPath, canvas.toBuffer('image/png'))
console.log('ogp.png generated:', outPath)
