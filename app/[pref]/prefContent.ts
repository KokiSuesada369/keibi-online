// 都道府県ページ用の固有コンテンツ生成
// pref_slug をシードにした決定論的生成で、47都道府県それぞれに
// 異なる解説文・FAQ を付与し、テンプレート重複（thin content）を防ぐ。

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
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

export type PrefContentInput = {
  pref: string
  prefSlug: string
  count: number
  cityCount: number
  serviceCounts: Record<number, number>
}

export function generatePrefDescription(input: PrefContentInput): string[] {
  const { pref, prefSlug, count, cityCount } = input
  const seed = hashSeed(prefSlug)

  const ranked = [1, 2, 3, 4]
    .filter(n => (input.serviceCounts[n] ?? 0) > 0)
    .sort((a, b) => (input.serviceCounts[b] ?? 0) - (input.serviceCounts[a] ?? 0))
  const topServices = ranked.slice(0, 2).map(n => SERVICE_LABEL[n])

  const intro = [
    `${pref}の警備会社を${count}社掲載しています。`,
    `このページでは、${pref}全域に対応する警備会社${count}社を紹介します。`,
    `${pref}で営業する警備会社は、当サイト掲載分で${count}社あります。`,
  ]
  let p1 = pick(intro, seed, 1)
  if (cityCount > 0) {
    const cityText = [
      `${cityCount}の市区町村から、エリアを絞って探すことができます。`,
      `市区町村別・業務別に、目的に合った会社を検索できます。`,
      `${pref}内の${cityCount}市区町村に対応した会社を掲載しています。`,
    ]
    p1 += pick(cityText, seed, 2)
  }

  let p2 = ''
  if (topServices.length >= 2) {
    const svc = [
      `${topServices[0]}や${topServices[1]}に対応する会社が多く、施設の常駐警備から工事現場の交通誘導、イベントの雑踏警備まで幅広く依頼できます。`,
      `特に${topServices[0]}・${topServices[1]}を扱う会社が中心です。施設管理から現場警備まで、${pref}内の様々なニーズに対応しています。`,
    ]
    p2 = pick(svc, seed, 3)
  } else if (topServices.length === 1) {
    p2 = `${topServices[0]}に対応する会社を中心に掲載しています。`
  }

  const p3 = [
    `警備会社を選ぶ際は、料金だけでなく、警備業の認定の有無・対応業務・地域での実績・損害賠償保険への加入・緊急時の体制を総合的に比較することが大切です。${pref}内の会社を比較し、複数社から相見積もりを取ることをおすすめします。`,
    `${pref}で警備を依頼するなら、まずは市区町村や業務でエリアを絞り、複数社に見積もりを依頼して比較しましょう。地域の事情を熟知した会社は現場対応力が高い傾向があります。`,
  ]

  return [p1, p2, pick(p3, seed, 4)].filter(Boolean)
}

export function generatePrefFaq(input: PrefContentInput): { q: string; a: string }[] {
  const { pref, prefSlug, count } = input
  const seed = hashSeed(prefSlug)

  const services = [1, 2, 3, 4]
    .filter(n => (input.serviceCounts[n] ?? 0) > 0)
    .map(n => SERVICE_LABEL[n])
  const svcText = services.length > 0 ? services.join('・') : '各種警備業務'

  const costA = [
    `業務によって異なります。交通誘導警備は警備員1名・8時間あたり15,000〜25,000円、施設の常駐警備は月額30〜50万円程度が目安です。${pref}内の複数社から相見積もりを取り、適正価格を確認しましょう。`,
    `交通誘導で1名1日15,000〜25,000円、施設警備で月額30〜50万円程度が一般的な相場です。地域や現場条件で変わるため、${pref}の会社に見積もりを依頼するのが確実です。`,
  ]
  const chooseA = [
    `警備業の認定（公安委員会の認定番号）の有無・対応業務・地域での実績・保険加入・料金の明確さを総合的に比較しましょう。${pref}内で最低3社から相見積もりを取るのがおすすめです。`,
    `認定の有無・実績・保険・料金の明確さを確認することが大切です。${pref}の会社を市区町村や業務で絞り込み、複数社を比較して選びましょう。`,
  ]
  const serviceA = `${pref}では、${svcText}に対応する警備会社${count}社を掲載しています。市区町村別・業務別に絞り込んで検索できます。`

  return [
    { q: `${pref}の警備会社の料金相場は？`, a: pick(costA, seed, 5) },
    { q: `${pref}で警備会社を選ぶときのポイントは？`, a: pick(chooseA, seed, 6) },
    { q: `${pref}ではどんな警備に対応していますか？`, a: serviceA },
  ]
}
