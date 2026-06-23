import { notFound } from 'next/navigation'
import { articles } from '@/app/column/data'
import { safeJsonLd } from '@/app/lib/jsonld'
import { renderRichText } from '@/app/column/richText'

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

// カテゴリごとのカラーテーマ（視覚的な変化で読み進めやすくする）
const CATEGORY_THEME: Record<string, { main: string; bg: string; soft: string }> = {
  'ガイド': { main: '#3b4fa8', bg: '#eef2ff', soft: '#f5f7ff' },
  '料金': { main: '#0f6e56', bg: '#e6f7f4', soft: '#f1faf8' },
  '資格・仕事': { main: '#854f0b', bg: '#fff4e6', soft: '#fffaf2' },
  '資格・講習': { main: '#854f0b', bg: '#fff4e6', soft: '#fffaf2' },
  '仕事': { main: '#854f0b', bg: '#fff4e6', soft: '#fffaf2' },
  '法律・制度': { main: '#7c3aed', bg: '#f3e8ff', soft: '#faf5ff' },
  '法律': { main: '#7c3aed', bg: '#f3e8ff', soft: '#faf5ff' },
  'マッチング': { main: '#be123c', bg: '#ffe4e6', soft: '#fff1f3' },
}
const DEFAULT_THEME = { main: '#1a1a2e', bg: '#eef0f4', soft: '#f7f8fa' }

function slugifyHeading(i: number): string {
  return `section-${i + 1}`
}

export default async function ColumnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  const theme = CATEGORY_THEME[article.category] ?? DEFAULT_THEME

  // 読了時間の目安（日本語: 約500字/分）
  const totalChars = article.sections.reduce((sum, s) => sum + s.body.length, 0) + article.summary.length
  const readingMinutes = Math.max(1, Math.round(totalChars / 500))

  // 目次に載せるセクション（FAQ・まとめ含む）
  const tocItems = article.sections.map((s, i) => ({ id: slugifyHeading(i), label: s.heading }))

  return (
    <main style={{ background: '#fbfbfd', fontFamily: "'Noto Sans JP', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            url: `https://keibi.online/column/${article.slug}`,
            publisher: { '@type': 'Organization', name: 'keibi.online', url: 'https://keibi.online' },
            datePublished: article.date ? `${article.date}T00:00:00.000Z` : '2026-01-01T00:00:00.000Z',
            dateModified: article.date ? `${article.date}T00:00:00.000Z` : '2026-06-23T00:00:00.000Z',
          }),
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
              { '@type': 'ListItem', position: 3, name: article.title, item: `https://keibi.online/column/${article.slug}` },
            ],
          }),
        }}
      />

      {/* ヘッダー帯（カテゴリカラー） */}
      <div style={{ background: `linear-gradient(135deg, ${theme.main} 0%, ${theme.main}cc 100%)`, padding: '40px 24px 56px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '16px' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>トップ</a>
            <span style={{ margin: '0 6px' }}>›</span>
            <a href="/column" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>コラム</a>
          </div>
          <span style={{ display: 'inline-block', fontSize: '12px', padding: '4px 14px', borderRadius: '99px', background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, marginBottom: '14px' }}>
            {article.category}
          </span>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#fff', lineHeight: 1.45, marginBottom: '16px' }}>
            {article.title}
          </h1>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
            <span>🕐 読了目安 約{readingMinutes}分</span>
            <span>📅 {article.date ? article.date.replace(/-/g, '/') : '2026年6月'}更新</span>
            <span>📝 {article.sections.length}つの見出し</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 64px' }}>
        {/* リード文 */}
        <p style={{ fontSize: '15px', color: '#374151', margin: '-28px 0 32px', lineHeight: 1.9, padding: '20px 22px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', borderTop: `4px solid ${theme.main}` }}>
          {article.description}
        </p>

        {/* 目次 */}
        <nav aria-label="目次" style={{ background: theme.soft, border: `1px solid ${theme.main}22`, borderRadius: '12px', padding: '20px 22px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: theme.main, marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>📑</span> この記事でわかること
          </div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {tocItems.map((t, i) => (
              <li key={t.id}>
                <a href={`#${t.id}`} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#374151', textDecoration: 'none', lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '6px', background: theme.main, color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <span>{t.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 本文セクション */}
        {article.sections.map((section, i) => {
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
              mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            }
            return (
              <section key={i} id={slugifyHeading(i)} style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 800, marginBottom: '18px', color: '#1f2937' }}>
                  <span style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '8px', background: theme.main, color: '#fff', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  {section.heading}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {faqs.map((faq, j) => (
                    <div key={j} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', background: theme.soft, fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>
                        <span style={{ color: theme.main, fontWeight: 800 }}>Q.</span>{faq.q}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', fontSize: '14px', color: '#4b5563', lineHeight: 1.8 }}>
                        <span style={{ color: '#f97316', fontWeight: 800 }}>A.</span><span>{faq.a}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }
          return (
            <section key={i} id={slugifyHeading(i)} style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
              <h2 style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: '#1f2937', lineHeight: 1.45, paddingBottom: '12px', borderBottom: `2px solid ${theme.bg}` }}>
                <span style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '8px', background: theme.main, color: '#fff', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i + 1}</span>
                <span>{section.heading}</span>
              </h2>
              <div style={{ fontSize: '15px', lineHeight: 1.95, color: '#374151' }}>
                {renderRichText(section.body, theme)}
              </div>
            </section>
          )
        })}

        {/* まとめ */}
        <div style={{ background: `linear-gradient(135deg, ${theme.soft} 0%, ${theme.bg} 100%)`, borderRadius: '16px', padding: '26px', marginTop: '8px', border: `1px solid ${theme.main}22` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800, color: theme.main, marginBottom: '12px' }}>
            <span>✅</span> この記事のまとめ
          </div>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#374151', margin: 0 }}>{article.summary}</p>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '40px', padding: '28px 24px', background: '#1a1a2e', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
          <p style={{ fontSize: '17px', fontWeight: 800, marginBottom: '8px' }}>お近くの警備会社を探す</p>
          <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '18px' }}>全国6,875社の警備会社から地域・業務別に検索できます</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/prefecture" style={{ display: 'inline-block', padding: '12px 28px', background: '#f97316', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
              都道府県から探す →
            </a>
            <a href="/request" style={{ display: 'inline-block', padding: '12px 28px', background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px', border: '1px solid rgba(255,255,255,0.25)' }}>
              無料で見積もり依頼
            </a>
          </div>
        </div>

        {/* 関連記事 */}
        {(() => {
          const sameCat = articles.filter(a => a.slug !== article.slug && a.category === article.category)
          const others = articles.filter(a => a.slug !== article.slug && a.category !== article.category)
          const related = [...sameCat, ...others].slice(0, 4)
          return related.length > 0 ? (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1f2937', margin: '0 0 14px' }}>あわせて読みたい</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
                {related.map(r => {
                  const rt = CATEGORY_THEME[r.category] ?? DEFAULT_THEME
                  return (
                    <a key={r.slug} href={`/column/${r.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
                      <span style={{ display: 'inline-block', fontSize: '11px', padding: '2px 10px', borderRadius: '99px', background: rt.bg, color: rt.main, fontWeight: 700, marginBottom: '8px' }}>{r.category}</span>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', lineHeight: 1.5 }}>{r.title}</div>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null
        })()}

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <a href="/column" style={{ color: theme.main, fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← コラム一覧に戻る</a>
        </div>
      </div>
    </main>
  )
}
