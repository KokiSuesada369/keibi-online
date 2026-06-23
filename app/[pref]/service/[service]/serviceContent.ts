// 業務別ページ（県×号区分）用の固有コンテンツ生成
// pref+service をシードにした決定論的生成で、188ページそれぞれに
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

const SERVICE_NAME: Record<number, string> = {
  1: '施設警備',
  2: '交通誘導・雑踏警備',
  3: '貴重品運搬警備',
  4: '身辺警備',
}

// 号区分ごとの「現場イメージ」
const SCENES: Record<number, string[]> = {
  1: ['オフィスビルや商業施設の常駐警備', '病院・学校・工場の施設管理', 'マンション・テナントビルの巡回・防犯', '機械警備による24時間の異常監視'],
  2: ['道路工事現場での車両・歩行者の誘導', '建設現場周辺の安全確保', 'イベント・祭事会場での雑踏整理', '駐車場の出入庫誘導'],
  3: ['金融機関の現金輸送', '貴重品・重要書類の安全な配送', 'ATMへの現金補填'],
  4: ['経営者・要人の身辺警護', 'イベント来賓のボディーガード', 'ストーカー・トラブル対応を含む個人警護'],
}

// 号区分ごとの料金目安テキスト
const COST_TEXT: Record<number, string> = {
  1: '常駐警備で月額30〜50万円程度、夜間のみ・日中のみの部分警備で月額15〜25万円程度',
  2: '警備員1名・8時間あたり15,000〜25,000円程度（夜間は25%以上の割増）',
  3: '1回あたり10,000〜30,000円程度',
  4: '警備員1名・8時間あたり50,000〜150,000円程度',
}

// 号区分ごとの「選び方・注意点」
const NOTE_TEXT: Record<number, string[]> = {
  1: ['施設の規模・営業時間・夜間リスクに応じて、常駐警備と機械警備を組み合わせると効率的です。', '24時間体制が必要か、部分警備で十分かを見極めることがコスト最適化のポイントです。'],
  2: ['高速道路や都道府県の指定路線では、交通誘導警備業務検定の有資格者の配置が義務付けられています。資格者の在籍を確認しましょう。', '工事規模・交通量に応じた適切な人数配置が、安全と法令遵守の両面で重要です。'],
  3: ['現金・貴重品を扱うため、損害賠償保険への加入状況と、輸送時のセキュリティ管理体制を必ず確認しましょう。', '厳格な管理体制を持つ会社を選ぶことが、資産を守る上で欠かせません。'],
  4: ['高度な専門スキルが必要なため、身辺警備の実績と、警備員の訓練体制を確認することが重要です。', '依頼内容（期間・人数・リスク度合い）を具体的に伝えた上で見積もりを取りましょう。'],
}

export type ServiceContentInput = {
  pref: string
  serviceNum: number
  count: number
}

export function generateServiceDescription(input: ServiceContentInput): string[] {
  const { pref, serviceNum, count } = input
  const name = SERVICE_NAME[serviceNum]
  const seed = hashSeed(`${pref}-${serviceNum}`)
  const scenes = SCENES[serviceNum] ?? []
  const sceneA = pick(scenes, seed, 1)
  const sceneB = pick(scenes, seed, 5)

  const intro = [
    `${pref}で${name}に対応する警備会社を${count}社掲載しています。`,
    `このページでは、${pref}の${name}対応の警備会社${count}社を一覧で紹介します。`,
    `${pref}内で${name}を依頼できる警備会社は、当サイト掲載分で${count}社あります。`,
  ]
  let p1 = pick(intro, seed, 2)
  const sceneSentence = [
    `${sceneA}など、${pref}内の様々な現場に対応しています。`,
    `${sceneA}や${sceneB}といった業務を依頼できます。`,
    `${pref}の現場で、${sceneA}などのニーズに対応します。`,
  ]
  p1 += pick(sceneSentence, seed, 3)

  const note = pick(NOTE_TEXT[serviceNum] ?? [''], seed, 4)
  const p2 = [
    `${name}の料金は、${COST_TEXT[serviceNum]}が目安です。${note}`,
    `${note}料金相場は${COST_TEXT[serviceNum]}が目安です。${pref}内の複数社から相見積もりを取り、比較検討することをおすすめします。`,
  ]

  return [p1, pick(p2, seed, 6)]
}

export function generateServiceFaq(input: ServiceContentInput): { q: string; a: string }[] {
  const { pref, serviceNum, count } = input
  const name = SERVICE_NAME[serviceNum]
  const seed = hashSeed(`${pref}-${serviceNum}`)

  const costA = `${name}の料金相場は${COST_TEXT[serviceNum]}が目安です。地域や現場の条件によって変わるため、${pref}内の会社に見積もりを依頼するのが確実です。`
  const chooseA = `警備業の認定の有無・${name}の実績・損害賠償保険への加入・料金の明確さを確認しましょう。${pref}内で最低3社を比較し、相見積もりを取るのがおすすめです。`
  const countA = `${pref}では${count}社が${name}に対応しています。各社の対応業務は一覧でご確認いただけます。`

  // 号区分固有のQ
  const extraQ: Record<number, { q: string; a: string }> = {
    1: { q: `施設警備と機械警備はどちらがいいですか？`, a: `常駐警備は即時対応が可能ですが人件費が高く、機械警備はコストを抑えられます。リスクの高い時間帯は常駐、それ以外は機械警備と組み合わせるのが効率的です。` },
    2: { q: `${pref}で交通誘導警備に資格者は必要ですか？`, a: `高速道路や都道府県の指定路線では、交通誘導警備業務検定の有資格者の配置が義務付けられています。発注前に資格者の在籍を確認しましょう。` },
    3: { q: `貴重品運搬警備で確認すべき点は？`, a: `現金・貴重品を扱うため、損害賠償保険への加入状況と輸送時のセキュリティ管理体制を必ず確認しましょう。` },
    4: { q: `身辺警備は一般の人でも依頼できますか？`, a: `はい。ストーカーやDVなどで身の危険を感じる場合、一般の方でも依頼できます。まずは警備会社に相談しましょう。` },
  }

  const faqs = [
    { q: `${pref}の${name}の料金相場は？`, a: costA },
    { q: `${pref}で${name}の会社を選ぶときのポイントは？`, a: chooseA },
    { q: `${pref}で${name}に対応する会社は何社ありますか？`, a: countA },
  ]
  if (extraQ[serviceNum]) faqs.push(extraQ[serviceNum])
  // 表現のわずかな多様化のため順序を seed で軽く変える
  if ((seed & 1) === 1) {
    return [faqs[0], faqs[3] ?? faqs[2], faqs[1], faqs[2]].filter(Boolean)
  }
  return faqs
}
