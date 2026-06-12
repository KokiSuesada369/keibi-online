import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CLAUDE_PROMPT = `指導教育責任者講習・機械警備業務管理者講習の日程情報を抽出してください。
JSONのみ返してください。他の説明は不要です。

{
  "schedules": [
    {
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
・日程情報が全くない場合は{"schedules":[]}を返してください
・JSONのみ返してください`

async function callClaude(messages: any[]): Promise<any[]> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages
      })
    })
    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return (parsed.schedules || []).filter((s: any) => s.type && s.qualification)
  } catch {
    return []
  }
}

async function extractFromHtml(html: string): Promise<any[]> {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
  return await callClaude([{
    role: 'user',
    content: `${CLAUDE_PROMPT}\n\nHTML本文:\n${text.slice(0, 10000)}`
  }])
}

async function extractFromPdf(pdfUrl: string): Promise<any[]> {
  try {
    const res = await fetch(pdfUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' },
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) return []
    const buffer = await res.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    return await callClaude([{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 }
        },
        { type: 'text', text: CLAUDE_PROMPT }
      ]
    }])
  } catch {
    return []
  }
}

function extractPdfUrls(html: string, baseUrl: string): string[] {
  const baseHostname = new URL(baseUrl).hostname
  const matches = html.match(/href=["']([^"']*\.pdf[^"']*)/gi) || []
  return matches
    .map(m => m.replace(/href=["']/i, ''))
    .map(u => {
      try {
        const resolved = u.startsWith('http') ? u : new URL(u, baseUrl).href
        const resolvedHostname = new URL(resolved).hostname
        if (resolvedHostname !== baseHostname && !resolvedHostname.endsWith('.' + baseHostname)) return null
        return resolved
      } catch {
        return null
      }
    })
    .filter(Boolean) as string[]
}

function deduplicateSchedules(schedules: any[]): any[] {
  return schedules.filter((s, i, arr) =>
    arr.findIndex(x =>
      x.qualification === s.qualification &&
      x.type === s.type &&
      x.date_start === s.date_start
    ) === i
  )
}

async function saveSchedules(schedules: any[], pref: string, source: string, url: string): Promise<number> {
  if (schedules.length === 0) return 0
  await supabase.from('supervisor_schedules').delete().eq('pref', pref).eq('url', url)
  const records = schedules.map(s => ({ pref, source, url, ...s }))
  const { error } = await supabase.from('supervisor_schedules').insert(records)
  if (error) console.error('保存エラー:', error.message)
  return records.length
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  const secret = searchParams.get('secret') ?? ''
  try {
    const a = Buffer.from(secret.padEnd(cronSecret.length))
    const b = Buffer.from(cronSecret)
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testPref = searchParams.get('pref')
  const forceUpdate = searchParams.get('force') === 'true'

  const { data: sources } = await supabase
    .from('crawl_sources')
    .select('*')
    .eq('is_active', true)

  if (!sources) return NextResponse.json({ error: 'No sources' }, { status: 500 })

  const filteredSources = testPref
    ? sources.filter(s => s.pref === testPref)
    : sources

  const results = []

  for (const source of filteredSources) {
    try {
      const res = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' },
        signal: AbortSignal.timeout(10000)
      })

      if (!res.ok) {
        results.push({ pref: source.pref, url: source.url, status: 'エラー', error: `HTTP ${res.status}` })
        continue
      }

      const html = await res.text()
      const hash = Buffer.from(html).toString('base64').slice(0, 32)

      // 変更チェック（テスト時・force時はスキップ）
      if (!testPref && !forceUpdate) {
        const { data: existing } = await supabase
          .from('crawl_cache')
          .select('html_hash')
          .eq('url', source.url)
          .single()

        if (existing?.html_hash === hash) {
          results.push({ pref: source.pref, url: source.url, status: '変更なし' })
          continue
        }
      }

      let allSchedules: any[] = []

      // ① HTMLから直接抽出
      const htmlSchedules = await extractFromHtml(html)
      allSchedules.push(...htmlSchedules)

      // ② PDFリンクを検出して各PDFから抽出
      const pdfUrls = extractPdfUrls(html, source.url)
      for (const pdfUrl of pdfUrls.slice(0, 5)) {
        const pdfSchedules = await extractFromPdf(pdfUrl)
        allSchedules.push(...pdfSchedules)
        await new Promise(r => setTimeout(r, 500))
      }

      // 重複除去・2026年以降フィルタ
      allSchedules = deduplicateSchedules(
        allSchedules.filter(s => !s.date_start || s.date_start >= '2026-01-01')
      )

      const saved = await saveSchedules(allSchedules, source.pref, source.source, source.url)

      // キャッシュ更新
      await supabase.from('crawl_cache').upsert({
        url: source.url,
        html_hash: hash,
        updated_at: new Date().toISOString()
      })

      results.push({
        pref: source.pref,
        url: source.url,
        status: '更新',
        html_extracted: htmlSchedules.length,
        pdf_count: pdfUrls.length,
        total_saved: saved
      })

    } catch (e: any) {
      results.push({ pref: source.pref, url: source.url, status: 'エラー', error: e.message })
    }
  }

  return NextResponse.json({ checked: filteredSources.length, results })
}
