import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const { data } = await supabase.from('crawl_sources').select('pref, source, url').eq('is_active', true).order('pref')

const results = []
for (const s of data) {
  try {
    const res = await fetch(s.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)
    })
    results.push({ pref: s.pref, source: s.source, status: res.status, url: s.url })
    process.stdout.write(res.status === 200 ? '.' : 'x')
  } catch(e) {
    results.push({ pref: s.pref, source: s.source, status: 'error', error: e.message, url: s.url })
    process.stdout.write('E')
  }
}

console.log('')
const ok = results.filter(r => r.status === 200)
const ng = results.filter(r => r.status !== 200)
console.log('OK:', ok.length, 'NG:', ng.length)
console.log('\nNG一覧:')
ng.forEach(r => console.log(r.status, r.pref, r.source))
console.log('\nNG URL:')
ng.forEach(r => console.log(r.url))
