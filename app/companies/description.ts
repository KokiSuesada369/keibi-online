// 会社紹介文の自動生成ロジック

const NUMBER_NAMES: Record<number, string> = {
  1: '施設警備・機械警備',
  2: '交通誘導警備・雑踏警備',
  3: '貴重品運搬警備',
  4: '身辺警備',
}

const NUMBER_DETAIL: Record<number, string> = {
  1: 'ビル・商業施設・病院などの施設に常駐し、巡回・監視・入退館管理などを行う施設警備や、センサー・カメラを活用した機械警備',
  2: '工事現場や道路での車両・歩行者の誘導を行う交通誘導警備や、イベント・祭りなど人が集まる場所での雑踏警備',
  3: '現金・貴重品・重要書類などを安全に輸送する貴重品運搬警備',
  4: '要人・経営者・著名人などの身辺を警護する身辺警備（ボディーガード）',
}

type Company = {
  name: string
  pref: string
  city: string
  address: string
  tel: string
  url: string
  numbers: number[]
}

// テンプレートA: 1号のみ
function templateA(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に拠点を置く警備会社です。${NUMBER_DETAIL[1]}を主な業務としています。ビルオーナー・施設管理者・病院・商業施設など、幅広い顧客の安全管理をサポートしています。${c.pref}内での実績を活かし、地域密着型の警備サービスを提供しています。`
}

// テンプレートB: 2号のみ
function templateB(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}を拠点とする警備会社です。${NUMBER_DETAIL[2]}を専門としています。道路工事・建設現場・イベント会場など、様々な現場での豊富な経験を持ち、${c.pref}全域で安全な交通誘導を提供しています。`
}

// テンプレートC: 1号+2号
function templateC(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に本社を置く総合警備会社です。${NUMBER_DETAIL[1]}と${NUMBER_DETAIL[2]}の両方に対応しており、施設管理から現場警備まで幅広いニーズに応えています。${c.pref}を中心に、地域の安全・安心を守るパートナーとして活動しています。`
}

// テンプレートD: 1号+2号+3号
function templateD(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}を拠点とする総合警備会社です。施設警備・交通誘導警備・貴重品運搬警備と、幅広い警備業務に対応しています。特に${NUMBER_DETAIL[3]}においても豊富な実績を持ち、${c.pref}内の企業・官公庁・金融機関から信頼を得ています。`
}

// テンプレートE: 4号含む
function templateE(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に拠点を置く警備会社です。施設警備・交通誘導警備に加え、${NUMBER_DETAIL[4]}まで手がける高度な警備サービスを提供しています。専門的なトレーニングを受けた警備員が、${c.pref}を中心に幅広い警備ニーズに対応しています。`
}

// テンプレートF: 3号のみ・主体
function templateF(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}を拠点とする警備会社です。${NUMBER_DETAIL[3]}を中心に、現金輸送・貴重品配送の安全確保に特化したサービスを提供しています。厳格なセキュリティ管理のもと、${c.pref}内の金融機関・企業の資産を守るプロフェッショナル集団です。`
}

// テンプレートG: 全業務対応
function templateG(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に本社を置く総合警備会社です。施設警備・交通誘導警備・貴重品運搬警備・身辺警備と、警備業務のすべてに対応できる体制を整えています。${c.pref}を中心に、官公庁・大手企業・医療機関・個人まで、あらゆるセキュリティニーズに応えています。`
}

// テンプレートH: 2号+3号
function templateH(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}を拠点とする警備会社です。交通誘導警備・雑踏警備から貴重品運搬警備まで対応しており、現場の安全確保から資産の輸送まで幅広いサービスを提供しています。${c.pref}内での豊富な実績と信頼をもとに、地域の安全を支えています。`
}

// テンプレートI: 1号+4号
function templateI(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に拠点を置く警備会社です。施設警備・機械警備に加え、身辺警備（ボディーガード）サービスも提供しており、施設の安全管理から個人の警護まで対応しています。高度な専門知識を持つ警備員が、${c.pref}を中心に活動しています。`
}

// テンプレートJ: データ不足・汎用
function templateJ(c: Company): string {
  return `${c.name}は、${c.pref}${c.city}に拠点を置く警備会社です。地域に密着した警備サービスを提供し、${c.pref}の安全・安心を支えています。施設の警備から交通誘導まで、様々なセキュリティニーズにお応えします。`
}

export function generateDescription(c: Company): string {
  const nums = new Set(c.numbers ?? [])
  const has1 = nums.has(1)
  const has2 = nums.has(2)
  const has3 = nums.has(3)
  const has4 = nums.has(4)

  // 業務の組み合わせでテンプレートを選択
  if (has1 && has2 && has3 && has4) return templateG(c)
  if (has1 && has2 && has3) return templateD(c)
  if (has1 && has2 && has4) return templateE(c)
  if (has1 && has4) return templateI(c)
  if (has2 && has3) return templateH(c)
  if (has3 && !has1 && !has2) return templateF(c)
  if (has4) return templateE(c)
  if (has1 && has2) return templateC(c)
  if (has1) return templateA(c)
  if (has2) return templateB(c)
  return templateJ(c)
}
