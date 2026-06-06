import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '警備員資格講習 日程一覧｜全国47都道府県対応 | keibi.online',
  description: '全国47都道府県の警備員指導教育責任者講習・機械警備業務管理者講習・特別講習の日程を掲載。都道府県・月・資格種別で絞り込み検索できます。',
}

export default function LicenseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
