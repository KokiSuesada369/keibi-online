import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function extractSchedulesWithAI(html: string, pref: string, source: string, url: string) {
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
        content: `以下のHTMLから指導教育責任者講習・機械警備業務管理者講習の日程情報を抽出してください。
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

情報がない項目はnullにしてください。日程情報が全くない場合は{"schedules":[]}を返してください。

HTML:
${html.slice(0, 8000)}`
      }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text || '{}'

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return parsed.schedules || []
  } catch {
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const testOnly = searchParams.get('test') === 'true'

  const { data: sources } = await supabase
    .from('crawl_sources')
    .select('*')
    .eq('is_active', true)
    .limit(testOnly ? 1 : 999)

  if (!sources) return NextResponse.json({ error: 'No sources' }, { status: 500 })

  const results = []

  for (const source of sources) {
    try {
      const res = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' },
        signal: AbortSignal.timeout(8000)
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

      if (existing?.html_hash === hash) {
        results.push({ pref: source.pref, url: source.url, status: '変更なし' })
        continue
      }

      // 変更あり→AIで抽出
      const schedules = await extractSchedulesWithAI(html, source.pref, source.source, source.url)

      if (schedules.length > 0) {
        // 既存データを削除して新しいデータを挿入
        await supabase
          .from('supervisor_schedules')
          .delete()
          .eq('pref', source.pref)
          .eq('url', source.url)

        const records = schedules
          .filter((s: any) => s.type)
          .map((s: any) => ({
            pref: source.pref,
            source: source.source,
            url: source.url,
            qualification: s.qualification,
            type: s.type,
            date_start: s.date_start,
            date_end: s.date_end,
            deadline: s.deadline,
            notes: s.notes,
          }))

        if (records.length > 0) {
          await supabase.from('supervisor_schedules').insert(records)
        }
      }

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
        extracted: schedules.length
      })

    } catch (e: any) {
      results.push({ pref: source.pref, url: source.url, status: 'エラー', error: e.message })
    }
  }

  return NextResponse.json({ checked: sources.length, results })
}
