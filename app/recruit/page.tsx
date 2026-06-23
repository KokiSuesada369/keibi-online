import { safeJsonLd } from '@/app/lib/jsonld'
import { recruitCompanies, type Job } from './data'

export const metadata = {
  title: '警備員の求人｜未経験歓迎・交通誘導/雑踏警備の募集 | keibi.online',
  description: '警備会社の求人情報を掲載。交通誘導・雑踏警備を中心に、未経験歓迎・社会保険完備・研修制度ありの求人を紹介。アルバイト・パート・正社員の募集情報をまとめています。',
  alternates: { canonical: 'https://keibi.online/recruit' },
  openGraph: {
    title: '警備員の求人｜未経験歓迎の募集情報 | keibi.online',
    description: '交通誘導・雑踏警備を中心とした警備員の求人情報。未経験歓迎・研修制度あり。',
    url: 'https://keibi.online/recruit',
    siteName: 'keibi.online',
    locale: 'ja_JP',
    type: 'website',
  },
}

const UNIT_LABEL: Record<string, string> = { HOUR: 'HOUR', DAY: 'DAY', MONTH: 'MONTH', YEAR: 'YEAR' }

function jobPostingJsonLd(company: { name: string; pref: string; address?: string; website?: string }, job: Job) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: `${job.title}（${job.workType}）`,
    description: `${company.name}の${job.employmentType}求人。業務内容：${job.workType}。給与：${job.salary}。${job.qualification ?? ''} ${job.training ?? ''}`.trim(),
    datePosted: '2026-06-23',
    employmentType: job.schemaEmploymentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      ...(company.website ? { sameAs: company.website } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressRegion: company.pref,
        addressCountry: 'JP',
        ...(company.address ? { streetAddress: company.address } : {}),
      },
    },
    ...(job.salaryValue && job.salaryUnit
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'JPY',
            value: { '@type': 'QuantitativeValue', value: job.salaryValue, unitText: UNIT_LABEL[job.salaryUnit] },
          },
        }
      : {}),
  }
}

const EMP_COLOR: Record<string, { bg: string; color: string }> = {
  'アルバイト・パート': { bg: '#e6f7f4', color: '#0f6e56' },
  '正社員': { bg: '#eef2ff', color: '#3b4fa8' },
  '契約社員': { bg: '#fff4e6', color: '#854f0b' },
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{ width: '110px', flexShrink: 0, padding: '12px 14px', background: '#f8f9fa', fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>{label}</div>
      <div style={{ padding: '12px 14px', fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>{value}</div>
    </div>
  )
}

export default function RecruitPage() {
  return (
    <main style={{ background: '#fbfbfd', minHeight: '100vh' }}>
      {recruitCompanies.flatMap(c => c.jobs.map(j => (
        <script key={`${c.slug}-${j.employmentType}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jobPostingJsonLd(c, j)) }} />
      )))}

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</a>
          <span style={{ margin: '0 6px' }}>›</span>求人
        </div>

        <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, marginBottom: '12px', color: '#1f2937' }}>警備員の求人情報</h1>
        <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.9, marginBottom: '40px', padding: '18px 20px', background: '#fff', borderRadius: '12px', borderLeft: '4px solid #f97316' }}>
          交通誘導・雑踏警備を中心とした警備員の求人を掲載しています。<strong>未経験歓迎・研修制度あり・社会保険完備</strong>の募集が中心です。アルバイト・パートから正社員まで、ご希望の働き方でお探しいただけます。
        </p>

        {recruitCompanies.map(company => (
          <section key={company.slug} style={{ marginBottom: '48px' }}>
            {/* 会社ヘッダー */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderBottom: 'none', borderTop: '4px solid #f97316', borderRadius: '14px 14px 0 0', padding: '22px 24px' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>{company.pref}{company.address ? `・${company.address}` : ''}</div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#1f2937' }}>{company.name}</h2>
              {company.intro && <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.85, margin: '10px 0 0' }}>{company.intro}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
                {company.companyHref && (
                  <a href={company.companyHref} style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '7px 14px', textDecoration: 'none' }}>会社情報を見る →</a>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, color: '#fff', background: '#f97316', borderRadius: '6px', padding: '7px 14px', textDecoration: 'none' }}>会社のホームページはこちら →</a>
                )}
              </div>
            </div>

            {/* 求人カード群 */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {company.jobs.map((job, i) => {
                const emp = EMP_COLOR[job.employmentType] ?? { bg: '#f3f4f6', color: '#374151' }
                return (
                  <div key={i} style={{ border: '1px solid #e8e8e8', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 18px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', background: emp.bg, color: emp.color }}>{job.employmentType}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', background: '#fff4e6', color: '#854f0b' }}>{job.workType}</span>
                        {job.qualification && job.qualification.includes('未経験') && (
                          <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', background: '#fef2f2', color: '#dc2626' }}>未経験歓迎</span>
                        )}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#1f2937' }}>{job.title}</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#f97316', marginTop: '6px' }}>{job.salary}</div>
                      {job.highlights && job.highlights.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                          {job.highlights.map((h, k) => (
                            <span key={k} style={{ fontSize: '13px', fontWeight: 800, padding: '6px 14px', borderRadius: '8px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>🎁 {h}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 詳細テーブル */}
                    <div>
                      {job.careerUp && <Row label="キャリアアップ" value={job.careerUp} />}
                      <Row label="勤務地" value={job.location} />
                      <Row label="勤務時間" value={job.hours} />
                      {job.trial && <Row label="試用期間" value={job.trial} />}
                      {job.insurance && <Row label="社会保険" value={job.insurance} />}
                      {job.training && <Row label="研修制度" value={job.training} />}
                      {job.qualification && <Row label="資格・経験" value={job.qualification} />}
                    </div>

                    {/* 応募ボタン */}
                    <div style={{ padding: '16px 18px', background: '#fafafa' }}>
                      <a href="/contact" style={{ display: 'block', textAlign: 'center', background: '#f97316', color: '#fff', fontWeight: 800, fontSize: '15px', padding: '13px', borderRadius: '10px', textDecoration: 'none' }}>
                        この求人に応募する
                      </a>
                      <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', margin: '8px 0 0' }}>お問い合わせフォームより「{company.name}の求人応募」とお知らせください</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}

        {/* 掲載案内 */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '22px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1f2937', margin: '0 0 8px' }}>求人を掲載しませんか？</h2>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8, margin: '0 0 14px' }}>警備会社さまの求人をkeibi.onlineに掲載できます。掲載をご希望の場合はお問い合わせください。</p>
          <a href="/contact" style={{ display: 'inline-block', fontSize: '13px', fontWeight: 700, color: '#f97316', textDecoration: 'none', border: '1px solid #f97316', borderRadius: '8px', padding: '8px 20px' }}>掲載について問い合わせる →</a>
        </div>
      </div>
    </main>
  )
}
