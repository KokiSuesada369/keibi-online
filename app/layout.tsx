import type { Metadata } from 'next'
import Header from '@/app/components/Header'

export const metadata: Metadata = {
  title: 'keibi.online - 警備業界の総合情報サイト',
  description: '全国の警備会社・資格・ニュースをまとめて探せる',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
