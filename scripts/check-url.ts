import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function main() {
  const { count: total } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  const { count: noUrl } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .or('url.is.null,url.eq.')

  console.log('総会社数:', total)
  console.log('URL未登録:', noUrl)
  console.log('URL登録済み:', (total ?? 0) - (noUrl ?? 0))
}

main()
