import { notFound } from 'next/navigation'
import { articles } from '@/app/column/data'
import { safeJsonLd } from '@/app/lib/jsonld'

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | keibi.online`,
    description: article.description,
    alternates: { canonical: `https://keibi.online/column/${slug}` },
    openGraph: {
      title: `${article.title} | keibi.online`,
      description: article.description,
      url: `https://keibi.online/column/${slug}`,
      siteName: 'keibi.online',
      locale: 'ja_JP',
      type: 'article',
      images: [{ url: 'https://keibi.online/ogp.png', width: 1200, height: 630, alt: 'keibi.online' }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${article.title} | keibi.online`,
      description: article.description,
      images: ['https://keibi.online/ogp.png'],
    },
  }
}

export default async function ColumnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article!.title,
            description: article!.description,
            url: `https://keibi.online/column/${article!.slug}`,
            publisher: {
              '@type': 'Organization',
              name: 'keibi.online',
              url: 'https://keibi.online',
            },
            datePublished: '2026-01-01T00:00:00.000Z',
            dateModified: '2026-06-12T00:00:00.000Z',
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
              { '@type': 'ListItem', position: 2, name: 'コラム', item: 'https://keibi.online/column' },
              { '@type': 'ListItem', position: 3, name: article!.title, item: `https://keibi.online/column/${article!.slug}` },
            ],
          })
        }}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt;{' '}
          <a href="/column" style={{ color: '#999' }}>コラム</a> &gt;{' '}
          {article!.title}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '99px', background: '#1a1a2e22', color: '#1a1a2e', fontWeight: 600 }}>
            {article!.category}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '24px', lineHeight: 1.4 }}>
          {article!.title}
        </h1>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '40px', lineHeight: 1.8, padding: '16px', background: '#f9f9f9', borderRadius: '8px', borderLeft: '4px solid #1a1a2e' }}>
          {article!.description}
        </p>
        {article!.sections.map((section, i) => {
          if (section.heading === 'よくある質問') {
            const faqs = section.body
              .split('\n\n')
              .filter(Boolean)
              .map(block => {
                const lines = block.split('\n')
                return {
                  q: lines[0]?.replace(/^Q\.\s*/, '') ?? '',
                  a: lines[1]?.replace(/^A\.\s*/, '') ?? '',
                }
              })
              .filter(f => f.q && f.a)
            const faqSchema = {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }
            return (
              <section key={i} style={{ marginBottom: '32px' }}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>
                  {i + 1}. {section.heading}
                </h2>
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                  {faqs.map((faq, j) => (
                    <div key={j} style={{ marginBottom: j < faqs.length - 1 ? '16px' : 0, paddingBottom: j < faqs.length - 1 ? '16px' : 0, borderBottom: j < faqs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>Q. {faq.q}</div>
                      <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>A. {faq.a}</div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }
          return (
            <section key={i} style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>
                {i + 1}. {section.heading}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#444' }}>{section.body}</p>
            </section>
          )
        })}
        <div style={{ background: '#f0f4f8', borderRadius: '12px', padding: '24px', marginTop: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>まとめ</h3>
          <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#444' }}>{article!.summary}</p>
        </div>
        <div style={{ marginTop: '48px', padding: '24px', background: '#1a1a2e', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>お近くの警備会社を探す</p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '16px' }}>全国6,875社の警備会社から地域・業務別に検索できます</p>
          <a href="/prefecture" style={{ display: 'inline-block', padding: '12px 32px', background: 'white', color: '#1a1a2e', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
            都道府県から探す
          </a>
        </div>
        {(() => {
          const related = articles.filter(a => a.slug !== article!.slug).slice(0, 3)
          return related.length > 0 ? (
            <div style={{ marginTop: '32px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 12px' }}>関連記事</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {related.map(r => (
                  <a key={r.slug} href={`/column/${r.slug}`} style={{ fontSize: '13px', color: '#f97316', textDecoration: 'none', lineHeight: 1.6 }}>
                    → {r.title}
                  </a>
                ))}
              </div>
            </div>
          ) : null
        })()}
        <div style={{ marginTop: '24px' }}>
          <a href="/column" style={{ color: '#457b9d', fontSize: '14px' }}>← コラム一覧に戻る</a>
        </div>
      </div>
    </main>
  )
}
