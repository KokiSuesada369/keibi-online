import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SOURCES = [
  {
    pref: '神奈川県',
    source: '神奈川県警察',
    url: 'https://www.police.pref.kanagawa.jp/tetsuzuki/eigyokankei/keibi/mesd0099.html',
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = []

  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; keibi.online bot)' }
      })
      const html = await res.text()
      const hash = Buffer.from(html).toString('base64').slice(0, 32)

      const { data: existing } = await supabase
        .from('crawl_cache')
        .select('html_hash')
        .eq('url', source.url)
        .single()

      if (existing?.html_hash === hash) {
        results.push({ url: source.url, status: '変更なし' })
        continue
      }

      await supabase.from('crawl_cache').upsert({
        url: source.url,
        html_hash: hash,
        updated_at: new Date().toISOString()
      })

      results.push({ url: source.url, status: '変更あり', html_length: html.length })

    } catch (e: any) {
      results.push({ url: source.url, status: 'エラー', error: e.message })
    }
  }

  return NextResponse.json({ results })
}
