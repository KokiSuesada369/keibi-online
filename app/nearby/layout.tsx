import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '近くの警備会社を探す｜エリアから検索【2026年】',
  description: '都道府県・市区町村から絞り込んで、エリアの警備会社を一覧表示します。',
}

export default function NearbyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
