import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { count: total, error: e1 } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { count: noUrl, error: e2 } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .or('url.is.null,url.eq.')

  if (e1) console.error('error1:', e1)
  if (e2) console.error('error2:', e2)
  console.log('総会社数:', total)
  console.log('URL未登録:', noUrl)
  console.log('URL登録済み:', (total ?? 0) - (noUrl ?? 0))
  console.log('取得進捗:', (((total ?? 0) - (noUrl ?? 0)) / (total ?? 1) * 100).toFixed(1) + '%')
}

main()
