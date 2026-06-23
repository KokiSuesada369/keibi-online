import { safeJsonLd } from '@/app/lib/jsonld'

export const metadata = {
  title: '運営者情報・サイトについて | keibi.online',
  description: 'keibi.onlineは全国の警備会社を地域・業務別に検索できる警備業界専門のポータルサイトです。サイトの目的・掲載情報の方針・データの取り扱いについてご説明します。',
  alternates: { canonical: 'https://keibi.online/about' },
  openGraph: {
    title: '運営者情報・サイトについて | keibi.online',
    description: 'keibi.onlineの運営方針・掲載情報・データの取り扱いについて。',
    url: 'https://keibi.online/about',
    siteName: 'keibi.online',
    locale: 'ja_JP',
    type: 'website',
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: '運営者情報・サイトについて',
  url: 'https://keibi.online/about',
  mainEntity: {
    '@type': 'WebSite',
    name: 'keibi.online',
    url: 'https://keibi.online',
    description: '全国の警備会社を地域・業務別に検索できる警備業界専門のポータルサイト。警備会社検索・業界コラム・資格講習情報・ニュースを提供。',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'トップ', item: 'https://keibi.online' },
    { '@type': 'ListItem', position: 2, name: '運営者情報', item: 'https://keibi.online/about' },
  ],
}

const sections: { h: string; body: string[] }[] = [
  {
    h: 'keibi.onlineとは',
    body: [
      'keibi.online（警備オンライン）は、全国の警備会社を「地域」と「業務（1号〜4号）」から検索できる、警備業界専門のポータルサイトです。施設警備・交通誘導警備・雑踏警備・貴重品運搬警備・身辺警備など、目的に合った警備会社を効率よく探せます。',
      '警備を依頼したい企業・個人の方と、地域の警備会社をつなぐことを目的としています。あわせて、警備業界のコラム・資格講習の日程・業界ニュースなど、警備に関わるすべての方に役立つ情報を発信しています。',
    ],
  },
  {
    h: '掲載情報の方針',
    body: [
      '当サイトに掲載している警備会社の情報は、公開されている法人情報などをもとに整理・掲載しています。情報は可能な限り正確を期していますが、最新の対応業務・料金・連絡先については、各警備会社へ直接お問い合わせの上ご確認ください。',
      '掲載内容の修正・削除のご依頼や、掲載に関するお問い合わせは、お問い合わせフォームより承っております。',
    ],
  },
  {
    h: '警備会社を選ぶ方へ',
    body: [
      '警備会社を選ぶ際は、料金の安さだけで判断せず、警備業の認定（都道府県公安委員会の認定番号）の有無・対応業務・地域での実績・損害賠償保険への加入・緊急時の対応体制を総合的に比較することが大切です。',
      '当サイトでは、地域・業務別の警備会社一覧に加え、「警備会社の選び方」「料金相場」などのコラムも提供しています。複数社から相見積もりを取り、納得のいくパートナーをお選びください。',
    ],
  },
  {
    h: 'データの取り扱い',
    body: [
      '当サイトはユーザーの利便性向上のため、アクセス解析（Googleアナリティクス）を利用しています。取得した情報は、サイトの改善目的にのみ利用します。',
      'お問い合わせフォームを通じてご提供いただいた情報は、お問い合わせへの対応のみに使用し、第三者へ提供することはありません。',
    ],
  },
]

const links = [
  { href: '/prefecture', label: '都道府県から警備会社を探す' },
  { href: '/column', label: '警備業界コラムを読む' },
  { href: '/license', label: '警備員の資格講習日程を見る' },
  { href: '/contact', label: 'お問い合わせ' },
]

export default function AboutPage() {
  return (
    <main style={{ background: '#fbfbfd' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999', textDecoration: 'none' }}>トップ</a>
          <span style={{ margin: '0 6px' }}>›</span>
          運営者情報
        </div>

        <h1 style={{ fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 800, marginBottom: '12px', color: '#1f2937' }}>
          運営者情報・サイトについて
        </h1>
        <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.9, marginBottom: '36px', padding: '18px 20px', background: '#fff', borderRadius: '12px', borderLeft: '4px solid #f97316' }}>
          keibi.onlineは、全国の警備会社を地域・業務別に検索できる警備業界専門のポータルサイトです。サイトの目的・掲載情報の方針・データの取り扱いについてご説明します。
        </p>

        {sections.map((s, i) => (
          <section key={i} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#1f2937', paddingBottom: '10px', borderBottom: '2px solid #fff0e6' }}>
              <span style={{ color: '#f97316', marginRight: '8px' }}>■</span>{s.h}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} style={{ fontSize: '15px', color: '#374151', lineHeight: 1.95, margin: j === s.body.length - 1 ? 0 : '0 0 12px' }}>{p}</p>
            ))}
          </section>
        ))}

        {/* 運営情報テーブル */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: '#1f2937', paddingBottom: '10px', borderBottom: '2px solid #fff0e6' }}>
            <span style={{ color: '#f97316', marginRight: '8px' }}>■</span>サイト情報
          </h2>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { k: 'サイト名', v: 'keibi.online（警備オンライン）' },
              { k: '内容', v: '警備会社検索・警備業界コラム・資格講習情報・業界ニュースの提供' },
              { k: '対応エリア', v: '全国47都道府県' },
              { k: 'お問い合わせ', v: 'お問い合わせフォームより承ります' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ width: '120px', flexShrink: 0, padding: '13px 16px', background: '#f8f9fa', fontSize: '13px', fontWeight: 700, color: '#6b7280' }}>{row.k}</div>
                <div style={{ padding: '13px 16px', fontSize: '13px', color: '#374151', lineHeight: 1.7 }}>{row.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 関連リンク */}
        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>→ {l.label}</a>
          ))}
        </div>
      </div>
    </main>
  )
}
