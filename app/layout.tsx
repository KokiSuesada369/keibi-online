import type { Metadata } from 'next'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'keibi.online - 警備業界の総合情報サイト',
  description: '全国の警備会社・資格・ニュースをまとめて探せる',
  openGraph: {
    title: '警備会社検索・資格講習日程・求人｜全国6,875社掲載 | keibi.online',
    description: '全国6,875社の警備会社を都道府県・業務別に検索。指導教育責任者講習・特別講習の日程も全国対応。',
    url: 'https://keibi.online',
    siteName: 'keibi.online',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://keibi.online/ogp.svg',
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
    images: ['https://keibi.online/ogp.svg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-Z1H7GSBJXD" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z1H7GSBJXD');
        `}</Script>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
