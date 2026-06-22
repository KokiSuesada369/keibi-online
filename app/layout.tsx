import type { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://keibi.online'),
  title: 'keibi.online - 警備業界の総合情報サイト',
  description: '全国6,875社の警備会社を都道府県・業務別に無料検索。交通誘導・施設警備・イベント警備・駐車場警備に対応する地域の警備会社をすぐに見つけられます。資格講習日程・警備求人・業界ニュースも掲載。',
  openGraph: {
    title: '警備会社検索・資格講習日程・求人｜全国6,875社掲載 | keibi.online',
    description: '全国6,875社の警備会社を都道府県・業務別に検索。指導教育責任者講習・特別講習の日程も全国対応。',
    url: 'https://keibi.online',
    siteName: 'keibi.online',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://keibi.online/ogp.png',
        width: 1200,
        height: 630,
        alt: 'keibi.online - 警備業界専門のポータルサイト',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '警備会社検索・資格講習日程・求人｜全国6,875社掲載 | keibi.online',
    description: '全国6,875社の警備会社を都道府県・業務別に検索。指導教育責任者講習・特別講習の日程も全国対応。',
    images: ['https://keibi.online/ogp.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
