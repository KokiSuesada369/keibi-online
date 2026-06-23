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
    alternates: { canonical: `https://keibi.online/news/${slug}` },
    openGraph: {
      title: `${data.title} | keibi.online`,
      description: data.summary,
      url: `https://keibi.online/news/${slug}`,
      siteName: 'keibi.online',
      locale: 'ja_JP',
      type: 'article',
      images: [{ url: 'https://keibi.online/ogp.png', width: 1200, height: 630, alt: 'keibi.online' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${data.title} | keibi.online`,
      description: data.summary,
      images: ['https://keibi.online/ogp.png'],
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: news } = await supabase.from('news').select('*').eq('slug', slug).single()
  if (!news) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.summary,
    url: `https://keibi.online/news/${slug}`,
    mainEntityOfPage: `https://keibi.online/news/${slug}`,
    image: 'https://keibi.online/ogp.png',
    ...(news.published_at ? { datePublished: news.published_at, dateModified: news.published_at } : {}),
    author: { '@type': 'Organization', name: 'keibi.online' },
    publisher: {
      '@type': 'Organization',
      name: 'keibi.online',
      logo: { '@type': 'ImageObject', url: 'https://keibi.online/ogp.png' },
    },
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
      { '@type': 'ListItem', position: 2, name: 'ニュース', item: 'https://keibi.online/news' },
      { '@type': 'ListItem', position: 3, name: news.title, item: `https://keibi.online/news/${slug}` },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/news" style={{ color: '#999', textDecoration: 'none' }}>ニュース</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span>{news.title}</span>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '40px' }}>
          {news.category && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', background: '#fff3e0', color: '#f97316', border: '1px solid #fed7aa', fontWeight: 500, display: 'inline-block' }}>
                {news.category}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: '#999' }}>
              {news.published_at ? new Date(news.published_at).toLocaleDateString('ja-JP') : ''}
            </span>
            {news.source && (
              <span style={{ fontSize: '12px', color: '#999' }}>出典：{news.source_url ? <a href={news.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#f97316' }}>{news.source}</a> : news.source}</span>
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
