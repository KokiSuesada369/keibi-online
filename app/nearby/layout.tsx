import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '近くの警備会社を探す｜エリアから検索【2026年】 | keibi.online',
  description: '都道府県・市区町村から近くの警備会社を検索。全国6,875社掲載。交通誘導・施設警備・イベント警備・駐車場警備に対応する地域の警備会社をすぐに見つけられます。',
  openGraph: {
    title: '近くの警備会社を探す｜エリアから検索【2026年】',
    description: '都道府県・市区町村から近くの警備会社を検索。全国6,875社掲載。',
  },
}

export default function NearbyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
