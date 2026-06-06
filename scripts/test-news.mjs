import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const { data, error } = await supabase.from('news').select('*')
console.log('data:', JSON.stringify(data))
console.log('error:', JSON.stringify(error))
