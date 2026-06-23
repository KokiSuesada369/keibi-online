// 市区町村ページ用の固有コンテンツ生成
// city_slug をシードにした決定論的生成で、420市区町村それぞれに
// 異なる解説文・FAQ を付与し、テンプレート重複（thin content）を防ぐ。

function hashSeed(slug: string): number {
  let h = 2166136261
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: T[], seed: number, salt: number): T {
  return arr[Math.abs((seed >> (salt % 24)) ^ (salt * 2654435761)) % arr.length]
}

const SERVICE_LABEL: Record<number, string> = {
  1: '施設警備（1号）',
  2: '交通誘導・雑踏警備（2号）',
  3: '貴重品運搬警備（3号）',
  4: '身辺警備（4号）',
}

export type CityContentInput = {
  pref: string
  city: string
  citySlug: string
  count: number
  serviceCounts: Record<number, number> // 1〜4号それぞれの対応社数
}

// 導入解説文（1〜2段落・会社ごとに表現を変える）
export function generateCityDescription(input: CityContentInput): string[] {
  const { pref, city, citySlug, count } = input
  const seed = hashSeed(citySlug)

  // 対応が多い業務トップ2を抽出
  const ranked = [1, 2, 3, 4]
    .filter(n => (input.serviceCounts[n] ?? 0) > 0)
    .sort((a, b) => (input.serviceCounts[b] ?? 0) - (input.serviceCounts[a] ?? 0))
  const topServices = ranked.slice(0, 2).map(n => SERVICE_LABEL[n])

  const intro = [
    `${city}には現在${count}社の警備会社が掲載されています。`,
    `${pref}${city}エリアの警備会社を${count}社掲載しています。`,
    `${city}で営業する警備会社は、当サイト掲載分で${count}社あります。`,
    `このページでは、${pref}${city}に対応する警備会社${count}社を一覧で紹介します。`,
  ]
  let p1 = pick(intro, seed, 1)

  if (topServices.length >= 2) {
    const svc = [
      `${topServices[0]}や${topServices[1]}に対応する会社が多く、施設の常駐警備から工事現場の交通誘導まで幅広く依頼できます。`,
      `特に${topServices[0]}・${topServices[1]}を扱う会社が中心で、地域のニーズに合わせて選べます。`,
      `${topServices[0]}を中心に、${topServices[1]}にも対応する会社が揃っています。`,
    ]
    p1 += pick(svc, seed, 2)
  } else if (topServices.length === 1) {
    p1 += `${topServices[0]}に対応する会社を中心に掲載しています。`
  } else {
    p1 += `各社の対応業務を確認しながら、目的に合った会社をお選びください。`
  }

  const p2candidates = [
    `警備会社を選ぶ際は、料金だけでなく、警備業の認定の有無・対応業務・実績・緊急時の体制を総合的に比較することが大切です。${city}内の会社を比較し、複数社から相見積もりを取ることをおすすめします。`,
    `${city}で警備を依頼するなら、まずは複数社に問い合わせて見積もりを比較しましょう。地域の道路事情や現場を熟知した会社は、現場対応力が高い傾向があります。`,
    `各社で対応できる警備業務や料金体系は異なります。${pref}${city}で警備会社をお探しの方は、対応業務・実績・料金を確認した上で、最適なパートナーを選びましょう。`,
    `下記の一覧から各社の対応業務をご確認いただけます。${city}で警備を発注する際の比較検討にお役立てください。`,
  ]
  const p2 = pick(p2candidates, seed, 3)

  return [p1, p2]
}

// 市区町村ごとのFAQ（決定論的に表現を変える）
export function generateCityFaq(input: CityContentInput): { q: string; a: string }[] {
  const { pref, city, citySlug, count } = input
  const seed = hashSeed(citySlug)

  const services = [1, 2, 3, 4]
    .filter(n => (input.serviceCounts[n] ?? 0) > 0)
    .map(n => SERVICE_LABEL[n])
  const svcText = services.length > 0 ? services.join('・') : '各種警備業務'

  const costA = [
    `警備の料金は業務の種類によって異なります。交通誘導警備は警備員1名・8時間あたり15,000〜25,000円、施設の常駐警備は月額30〜50万円程度が目安です。${city}内の複数社から相見積もりを取り、適正価格を確認しましょう。`,
    `交通誘導警備で1名1日15,000〜25,000円、施設警備で月額30〜50万円程度が一般的な相場です。地域や現場の条件で変わるため、${city}の会社に見積もりを依頼するのが確実です。`,
  ]

  const chooseA = [
    `警備業の認定（都道府県公安委員会の認定番号）の有無、対応業務、実績、損害賠償保険への加入、緊急時の対応体制を確認しましょう。${city}内で複数社を比較し、最低3社から見積もりを取るのがおすすめです。`,
    `認定の有無・対応業務・地域での実績・保険加入・料金の明確さを総合的に比較することが大切です。${city}の会社を複数比較して選びましょう。`,
  ]

  const serviceA = [
    `${city}では、${svcText}に対応する警備会社が掲載されています。各社の対応業務は一覧のタグでご確認いただけます。`,
    `掲載されている${count}社では、${svcText}などに対応しています。依頼したい業務に対応した会社をお選びください。`,
  ]

  return [
    { q: `${city}の警備会社の料金相場は？`, a: pick(costA, seed, 5) },
    { q: `${city}で警備会社を選ぶときのポイントは？`, a: pick(chooseA, seed, 6) },
    { q: `${city}ではどんな警備に対応していますか？`, a: pick(serviceA, seed, 7) },
  ]
}
