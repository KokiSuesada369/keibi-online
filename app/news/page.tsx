import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const metadata = {
  title: '警備業界ニュース | keibi.online',
  description: '警備業界の最新ニュース・法改正・業界動向をお届けします。',
}

export const revalidate = 3600

export default async function NewsPage() {
  const { data: newsList, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  console.log('newsList:', newsList, 'error:', error)

  return (
    <main>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</a>
          <span style={{ margin: '0 6px' }}>›</span>
          ニュース
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>警備業界ニュース</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>警備業界の最新情報をお届けします。</p>

        {!newsList || newsList.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#999' }}>
            <p style={{ fontSize: '16px' }}>現在掲載中のニュースはありません。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {newsList.map(news => (
              <Link key={news.id} href={`/news/${news.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', transition: 'box-shadow 0.2s' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    {news.category && (
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#fff3e0', color: '#f97316', border: '1px solid #fed7aa', fontWeight: 500 }}>
                        {news.category}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {news.published_at ? new Date(news.published_at).toLocaleDateString('ja-JP') : ''}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 8px', lineHeight: 1.5 }}>{news.title}</h2>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: 1.7 }}>{news.summary}</p>
                  {news.source && (
                    <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0' }}>出典：{news.source}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
