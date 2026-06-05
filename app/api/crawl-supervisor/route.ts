import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function extractWithClaude(content: string, contentType: 'html' | 'pdf', pref: string, source: string, url: string) {
  const prompt = `以下の${contentType === 'pdf' ? 'PDF' : 'HTML'}から指導教育責任者講習・機械警備業務管理者講習の日程情報を抽出してください。
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

情報がない項目はnullにしてください。
日程情報が全くない場合は{"schedules":[]}を返してください。
2026年以降のデータのみ抽出してください。

内容:
${content.slice(0, 10000)}`

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
      messages: [{ role: 'user', content: prompt }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return (parsed.schedules || []).filter((s: any) => s.type)
  } catch {
    return []
  }
}

async function fetchPdfAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' },
      signal: AbortSignal.timeout(10000)
    })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  } catch {
    return null
  }
}

async function extractWithClaudePdf(pdfBase64: string, pref: string, source: string, url: string) {
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
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64
            }
          },
          {
            type: 'text',
            text: `このPDFから指導教育責任者講習・機械警備業務管理者講習の日程情報を抽出してください。
JSONのみ返してください。

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

情報がない項目はnullにしてください。2026年以降のデータのみ抽出してください。JSONのみ返してください。`
          }
        ]
      }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return (parsed.schedules || []).filter((s: any) => s.type)
  } catch {
    return []
  }
}

async function saveSchedules(schedules: any[], pref: string, source: string, url: string) {
  if (schedules.length === 0) return 0

  await supabase
    .from('supervisor_schedules')
    .delete()
    .eq('pref', pref)
    .eq('url', url)

  const records = schedules.map((s: any) => ({
    pref, source, url,
    qualification: s.qualification,
    type: s.type,
    date_start: s.date_start,
    date_end: s.date_end,
    deadline: s.deadline,
    notes: s.notes,
  }))

  const { error } = await supabase.from('supervisor_schedules').insert(records)
  if (error) console.error('保存エラー:', error.message)
  return records.length
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testPref = searchParams.get('pref')

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

      const { data: existing } = await supabase
        .from('crawl_cache')
        .select('html_hash')
        .eq('url', source.url)
        .single()

      if (existing?.html_hash === hash && !testPref) {
        results.push({ pref: source.pref, url: source.url, status: '変更なし' })
        continue
      }

      // PDFリンクを検出
      const pdfMatches = html.match(/href=["']([^"']*\.pdf[^"']*)/gi) || []
      const pdfUrls = pdfMatches
        .map(m => m.replace(/href=["']/i, ''))
        .map(u => u.startsWith('http') ? u : new URL(u, source.url).href)
        .filter(u => u.includes('keibi') || u.includes('keibigyo') || u.includes('shikyou') || u.includes('koushu') || u.includes('yotei') || u.includes('lecture') || u.includes('koshu') || pdfMatches.length <= 5)
        .slice(0, 3)

      let schedules: any[] = []

      if (pdfUrls.length > 0) {
        // PDFから抽出
        for (const pdfUrl of pdfUrls) {
          const pdfBase64 = await fetchPdfAsBase64(pdfUrl)
          if (pdfBase64) {
            const extracted = await extractWithClaudePdf(pdfBase64, source.pref, source.source, source.url)
            schedules.push(...extracted)
          }
        }
      }

      if (schedules.length === 0) {
        // HTMLから抽出
        const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
        schedules = await extractWithClaude(text, 'html', source.pref, source.source, source.url)
      }

      const saved = await saveSchedules(schedules, source.pref, source.source, source.url)

      await supabase.from('crawl_cache').upsert({
        url: source.url,
        html_hash: hash,
        updated_at: new Date().toISOString()
      })

      results.push({
        pref: source.pref,
        url: source.url,
        status: '更新',
        extracted: schedules.length,
        saved
      })

    } catch (e: any) {
      results.push({ pref: source.pref, url: source.url, status: 'エラー', error: e.message })
    }
  }

  return NextResponse.json({ checked: filteredSources.length, results })
}
