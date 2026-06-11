import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'かんたん警備依頼・無料見積もり【2026年】 | keibi.online',
  description: 'エリア・業務・予算を選ぶだけで警備会社に無料で依頼できます。交通誘導・施設警備・イベント警備・駐車場警備に対応。一営業日以内に折り返しご連絡します。',
  openGraph: {
    title: 'かんたん警備依頼・無料見積もり【2026年】',
    description: 'エリア・業務を選ぶだけ。最短即日、理想の警備会社が見つかる。無料で依頼できます。',
  },
}

export default function RequestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
