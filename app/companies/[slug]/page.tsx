import companiesData from '@/data/companies.json'

const NUMBER_LABELS: Record<number, string> = {
  1: '1号警備（施設警備）',
  2: '2号警備（交通誘導警備）',
  3: '3号警備（貴重品運搬警備）',
  4: '4号警備（身辺警備）',
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#457b9d',
  2: '#2a9d8f',
  3: '#e76f51',
  4: '#e63946',
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = (companiesData as any[]).find(c => c.slug === params.slug)
  if (!company) return <div>会社が見つかりません</div>

  return (
    <main>
      <header style={{ background: '#1a1a2e', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontWeight: 700, fontSize: '20px', color: 'white', textDecoration: 'none' }}>keibi.online</a>
        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <a href="/prefecture" style={{ color: 'white', textDecoration: 'none' }}>都道府県から探す</a>
          <a href="/news" style={{ color: 'white', textDecoration: 'none' }}>ニュース</a>
          <a href="/license" style={{ color: 'white', textDecoration: 'none' }}>資格情報</a>
          <a href="/column" style={{ color: 'white', textDecoration: 'none' }}>コラム</a>
        </nav>
      </header>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; <a href="/prefecture" style={{ color: '#999' }}>都道府県一覧</a> &gt; <a href={`/prefecture/${company.prefSlug}`} style={{ color: '#999' }}>{company.pref}</a> &gt; {company.name}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{company.name}</h1>
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <tbody>
              {[
                ['所在地', `〒${company.zip} ${company.pref}${company.city}${company.address}`],
                ['電話番号', company.tel],
                ['ホームページ', company.url ? company.url : '—'],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px 12px 0', color: '#666', width: '120px', fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: '12px 0' }}>
                    {label === 'ホームページ' && company.url
                      ? <a href={company.url} target="_blank" rel="noopener noreferrer" style={{ color: '#457b9d' }}>{company.url}</a>
                      : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>対応している警備業務</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {(company.numbers as number[]).map(num => (
            <div key={num} style={{ background: 'white', border: `2px solid ${NUMBER_COLORS[num]}`, borderRadius: '8px', padding: '16px 20px' }}>
              <div style={{ fontWeight: 700, color: NUMBER_COLORS[num], marginBottom: '4px' }}>{NUMBER_LABELS[num]}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {num === 1 && '施設警備・巡回警備・機械警備・保安警備・空港保安警備などが含まれます'}
                {num === 2 && '交通誘導警備・雑踏警備などが含まれます'}
                {num === 3 && '現金・貴重品の輸送警備などが含まれます'}
                {num === 4 && '要人・個人の身辺警護などが含まれます'}
              </div>
            </div>
          ))}
        </div>
        <a href={`/prefecture/${company.prefSlug}`} style={{ color: '#457b9d', fontSize: '14px' }}>← {company.pref}の警備会社一覧に戻る</a>
      </div>
      <footer style={{ background: '#1a1a2e', color: 'white', textAlign: 'center', padding: '32px 24px', fontSize: '14px', opacity: 0.7 }}>© 2026 keibi.online</footer>
    </main>
  )
}

export async function generateStaticParams() {
  return (companiesData as any[]).map(c => ({ slug: c.slug }))
}
