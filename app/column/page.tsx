import { getSortedArticles } from '@/app/column/data'

export const metadata = {
  title: '警備業界コラム | keibi.online',
  description: '警備会社の選び方・警備料金の相場・警備業界の基礎知識などをコラム形式でお届けします。',
  openGraph: {
    title: '警備業界コラム｜警備会社の選び方・料金・資格を解説',
    description: '警備会社の選び方・料金相場・資格取得ガイドなど、警備業界に関する情報をわかりやすく解説するコラムです。',
  },
  twitter: { card: 'summary_large_image' as const },
}

const CATEGORY_COLORS: Record<string, string> = {
  'ガイド': '#457b9d',
  '料金': '#2a9d8f',
  '資格・仕事': '#6a4c93',
  '法律・制度': '#e76f51',
  'ニュース': '#e9c46a',
}

export default function ColumnPage() {
  return (
    <main>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; コラム
        </div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, marginBottom: '8px' }}>警備業界コラム</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>警備会社の選び方や業界の基礎知識をお届けします。</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {getSortedArticles().map(article => {
            const color = CATEGORY_COLORS[article.category] ?? '#1a1a2e'
            return (
              <a key={article.slug} href={`/column/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', background: 'white', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: color + '22', color, fontWeight: 600, display: 'inline-block' }}>
                      {article.category}
                    </span>
                    {article.date && (
                      <span style={{ fontSize: '11px', color: '#aaa' }}>{article.date.replace(/-/g, '/')}</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px', lineHeight: 1.5 }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
                    {article.description.slice(0, 60)}...
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </main>
  )
}
