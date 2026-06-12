import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase.from('news').select('*').eq('slug', slug).single()
  if (!data) return { title: 'ニュースが見つかりません | keibi.online' }
  return {
    title: `${data.title} | keibi.online`,
    description: data.summary,
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: news } = await supabase.from('news').select('*').eq('slug', slug).single()
  if (!news) notFound()

  return (
    <main>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/news" style={{ color: '#999', textDecoration: 'none' }}>ニュース</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{news.title}</span>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '40px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
            {news.category && (
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#fff3e0', color: '#f97316', border: '1px solid #fed7aa', fontWeight: 500 }}>
                {news.category}
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#999' }}>
              {news.published_at ? new Date(news.published_at).toLocaleDateString('ja-JP') : ''}
            </span>
            {news.source && (
              <span style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>出典：{news.source_url ? <a href={news.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>{news.source}</a> : news.source}</span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#111', margin: '0 0 24px', lineHeight: 1.6 }}>{news.title}</h1>

          <div style={{ fontSize: '15px', color: '#444', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
            {news.body}
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/news" style={{ fontSize: '13px', color: '#999', textDecoration: 'none' }}>
            ← ニュース一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  )
}
