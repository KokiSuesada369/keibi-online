import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const QUAL_COLORS: Record<string, string> = {
  '1号警備業務': 'bg-blue-100 text-blue-800',
  '2号警備業務': 'bg-green-100 text-green-800',
  '3号警備業務': 'bg-purple-100 text-purple-800',
  '4号警備業務': 'bg-orange-100 text-orange-800',
  '機械警備業務管理者': 'bg-red-100 text-red-800',
}

const TYPE_COLORS: Record<string, string> = {
  '新規取得': 'bg-yellow-100 text-yellow-800',
  '追加取得': 'bg-indigo-100 text-indigo-800',
  '定期講習': 'bg-gray-100 text-gray-800',
}

export async function generateMetadata({ params }: { params: { pref: string } }): Promise<Metadata> {
  const pref = decodeURIComponent(params.pref)
  return {
    title: `${pref}の警備員資格講習 日程一覧 | keibi.online`,
    description: `${pref}で開催される警備員指導教育責任者講習・機械警備業務管理者講習・特別講習の日程一覧です。`,
    alternates: { canonical: `https://keibi.online/license/${encodeURIComponent(pref)}` },
  }
}

export default async function PrefLicensePage({ params }: { params: { pref: string } }) {
  const pref = decodeURIComponent(params.pref)
  const today = new Date().toISOString().split('T')[0]

  const { data: supervisor } = await supabase
    .from('supervisor_schedules')
    .select('*')
    .eq('pref', pref)
    .gte('date_start', today)
    .order('date_start', { ascending: true })

  const { data: special } = await supabase
    .from('training_schedules')
    .select('*')
    .eq('pref', pref)
    .gte('start_date', today)
    .order('start_date', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/license" className="text-sm text-gray-400 hover:text-gray-600">← 講習一覧に戻る</Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{pref}の警備員資格講習</h1>
        <p className="text-gray-500 text-sm mb-8">{pref}で開催される警備員資格講習の日程一覧です。</p>

        {/* 指導教育責任者・機械警備 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">指導教育責任者・機械警備業務管理者講習</h2>
          {!supervisor || supervisor.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-400">現在掲載中の講習はありません</div>
          ) : (
            <div className="space-y-3">
              {supervisor.map(s => (
                <div key={s.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {s.qualification && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${QUAL_COLORS[s.qualification] || 'bg-gray-100 text-gray-700'}`}>
                            {s.qualification}
                          </span>
                        )}
                        {s.type && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[s.type] || 'bg-gray-100 text-gray-700'}`}>
                            {s.type}
                          </span>
                        )}
                      </div>
                      <div className="text-base font-medium text-gray-900">
                        {s.date_start ? s.date_start.replace(/-/g, '/') : '日程未定'}
                        {s.date_end && s.date_end !== s.date_start && ` 〜 ${s.date_end.replace(/-/g, '/')}`}
                      </div>
                    </div>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-xs px-3 py-1.5 border rounded-lg text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                      >
                        詳細を確認 →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 特別講習 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">特別講習</h2>
          {!special || special.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-400">現在掲載中の講習はありません</div>
          ) : (
            <div className="space-y-3">
              {special.map(s => (
                <div key={s.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {s.service_type && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                        {s.service_type}
                      </span>
                    )}
                    {s.grade && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-900 text-white">
                        {s.grade}
                      </span>
                    )}
                  </div>
                  <div className="text-base font-medium text-gray-900">
                    {s.start_date ? s.start_date.replace(/-/g, '/') : '日程未定'}
                    {s.end_date && s.end_date !== s.start_date && ` 〜 ${s.end_date.replace(/-/g, '/')}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
