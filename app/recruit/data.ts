// 警備会社の求人データ
// 会社ごとに複数の求人を持てる構造。今後、他社の求人もここに追加していく。

export type Job = {
  employmentType: string // 雇用形態（例: アルバイト・パート / 正社員）
  schemaEmploymentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' // 構造化データ用
  title: string // 職種（例: 警備員）
  workType: string // 業務内容（例: 交通誘導・雑踏警備）
  salary: string // 給与（表示用）
  salaryValue?: number // 構造化データ用の金額
  salaryUnit?: 'HOUR' | 'DAY' | 'MONTH' | 'YEAR' // 構造化データ用の単位
  careerUp?: string
  location: string
  hours: string
  trial?: string // 試用期間
  insurance?: string // 社会保険
  training?: string // 研修制度
  qualification?: string // 資格・経験
  highlights?: string[] // 特典・アピール（入社祝い金など）
}

export type RecruitCompany = {
  slug: string
  name: string
  pref: string
  prefSlug?: string
  address?: string
  companyHref?: string // 企業詳細ページへのリンク
  intro?: string
  jobs: Job[]
}

export const recruitCompanies: RecruitCompany[] = [
  {
    slug: 'saizen',
    name: 'SAIZEN警備保障株式会社',
    pref: '広島県',
    prefSlug: 'hiroshima',
    address: '広島県広島市西区横川町3丁目1-9-305',
    companyHref: '/companies/saizen-666',
    intro: '広島市西区横川を拠点に、交通誘導・雑踏警備を手がける警備会社です。未経験者を一から育てる研修体制と、営業所長まで目指せるキャリアパスが特長。明朗会計で地域の建設会社やイベント主催者から信頼を集めています。',
    jobs: [
      {
        employmentType: 'アルバイト・パート',
        schemaEmploymentType: 'PART_TIME',
        title: '警備員',
        workType: '交通誘導・雑踏警備',
        salary: '日給 10,000円〜',
        salaryValue: 10000,
        salaryUnit: 'DAY',
        careerUp: '営業所長を目指せます。🏆 営業所長になれば月収50万円〜',
        location: '広島県内の指定する場所',
        hours: 'シフト制（現場による）',
        trial: 'なし',
        insurance: '完備（アルバイト・正社員問わず）',
        training: '入社後、現場に出る前に新任教育20時間あり',
        qualification: '不問・未経験歓迎',
      },
      {
        employmentType: '正社員',
        schemaEmploymentType: 'FULL_TIME',
        title: '警備員',
        workType: '交通誘導・雑踏警備',
        salary: '月給 210,000円〜・ボーナスあり',
        salaryValue: 210000,
        salaryUnit: 'MONTH',
        careerUp: '営業所長を目指せます。🏆 営業所長になれば月収50万円〜',
        location: '広島県内の指定する場所',
        hours: 'シフト制（現場による）',
        trial: 'なし',
        insurance: '完備',
        training: '入社後、現場に出る前に新任教育20時間あり',
        qualification: '不問・未経験歓迎',
        highlights: ['入社祝い金10万円あり'],
      },
    ],
  },
]
