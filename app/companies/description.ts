export type Company = {
  slug: string
  name: string
  pref: string
  city: string
  zip: string
  address: string
  tel: string
  url: string
  numbers: number[]
}

// ───────────────────────────────────────────────
// 決定論的バリエーション生成
// slugをシードにすることで「同じ会社は常に同じ文章」を保ちつつ、
// 会社ごとに文章構成・語彙・含める事実が変わるようにし、
// テンプレート重複による「クロール済み・インデックス未登録」を防ぐ。
// ───────────────────────────────────────────────

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

const NUMBER_DETAIL: Record<number, string> = {
  1: 'ビル・商業施設・病院などの施設に常駐し、巡回・監視・入退館管理などを行う施設警備や、センサー・カメラを活用した機械警備',
  2: '工事現場・道路での車両・歩行者の誘導を行う交通誘導警備や、イベント・祭りなど人が集まる場所での雑踏警備',
  3: '現金・貴重品・重要書類などを安全に輸送する貴重品運搬警備',
  4: '要人・経営者・著名人などの身辺を警護する身辺警備（ボディーガード）',
}

const NUMBER_SHORT: Record<number, string> = {
  1: '施設警備（1号）',
  2: '交通誘導・雑踏警備（2号）',
  3: '貴重品運搬警備（3号）',
  4: '身辺警備（4号）',
}

const NUMBER_SCENE: Record<number, string[]> = {
  1: ['オフィスビルや商業施設の常駐警備', '病院・学校・工場などの施設管理', 'マンションやテナントビルの巡回・防犯', '機械警備による24時間の異常監視'],
  2: ['道路工事現場での車両・歩行者の誘導', '建設現場周辺の安全確保', 'イベント・祭事会場での雑踏整理', '駐車場の出入庫誘導'],
  3: ['金融機関の現金輸送', '貴重品・重要書類の安全な配送', 'ATMへの現金補填業務'],
  4: ['経営者・要人の身辺警護', 'イベント来賓のボディーガード', 'トラブル対応を含む個人警護'],
}

// SAIZEN専用紹介文
function templateSaizen(): string {
  return `SAIZEN警備保障株式会社は、広島市西区横川を拠点に2024年に創業した、広島の新しい交通誘導・雑踏警備の専門会社です。創業間もないながらも、現場への真摯な姿勢と丁寧な対応で、地域の建設会社やイベント主催者から着実に信頼を積み重ねています。料金体系は明朗会計で、見積もり内容が明確なため「思っていたより安かった」という声も多く、コストを気にする発注担当者にとって相談しやすい会社です。大手にはない柔軟な対応力と、広島の現場を熟知したフットワークの軽さが強み。これからの広島警備業界で最も勢いのある会社のひとつとして、keibi.online編集部が注目しています。`
}

export function generateDescription(c: Company): string {
  if (c.slug === 'saizen-666') return templateSaizen()

  const seed = hashSeed(c.slug)
  const loc = `${c.pref}${c.city ?? ''}`
  const nums = (c.numbers ?? []).filter(n => NUMBER_SHORT[n])
  const primary = nums[0] ?? 1

  // ── 第1文：会社紹介の導入（拠点・所在地を会社ごとに変えて表現） ──
  const intros = [
    `${c.name}は、${loc}に拠点を置く警備会社です。`,
    `${c.name}は、${loc}を中心に活動する警備会社です。`,
    `${loc}に所在する${c.name}は、地域に根ざした警備サービスを提供しています。`,
    `${c.name}は、${loc}を営業エリアとする警備会社です。`,
    `${loc}で警備業を営む${c.name}についてご紹介します。`,
    `${c.name}（${loc}）は、地域の安全を支える警備会社です。`,
  ]
  let body = pick(intros, seed, 1)

  // ── 第2文：対応業務の概要（実際の警備種別に基づく） ──
  if (nums.length >= 3) {
    const multi = [
      `施設警備から交通誘導、貴重品運搬まで幅広い警備業務に対応する総合警備会社で、`,
      `複数の警備区分に対応できる体制を整えた総合警備会社で、`,
      `${nums.map(n => NUMBER_SHORT[n]).join('・')}と多岐にわたる業務を手がけており、`,
    ]
    body += pick(multi, seed, 2)
  } else if (nums.length === 2) {
    const dual = [
      `${NUMBER_SHORT[nums[0]]}と${NUMBER_SHORT[nums[1]]}を中心に、`,
      `主に${NUMBER_SHORT[nums[0]]}・${NUMBER_SHORT[nums[1]]}の分野で実績を持ち、`,
    ]
    body += pick(dual, seed, 2)
  } else {
    const single = [
      `${NUMBER_SHORT[primary]}を専門とし、`,
      `${NUMBER_SHORT[primary]}に特化したサービスを提供しており、`,
      `${NUMBER_SHORT[primary]}を主力業務として、`,
    ]
    body += pick(single, seed, 2)
  }

  // ── 第3文：主力業務の具体的な現場イメージ ──
  const scenes = NUMBER_SCENE[primary] ?? NUMBER_SCENE[1]
  const sceneA = pick(scenes, seed, 3)
  const sceneB = pick(scenes, seed, 7)
  const sceneClosers = [
    `${sceneA}など、現場の状況に応じた対応を行っています。`,
    `${sceneA}や${sceneB}といった業務に取り組んでいます。`,
    `${sceneA}を得意としています。`,
  ]
  body += pick(sceneClosers, seed, 4)

  // ── 第4文：詳細な業務説明（種別ごとの定義文を1つ織り込む） ──
  const detailLeads = [
    `具体的には、${NUMBER_DETAIL[primary]}などを担います。`,
    `${NUMBER_DETAIL[primary]}を通じて、依頼主の安全を守ります。`,
    `業務内容は、${NUMBER_DETAIL[primary]}が中心です。`,
  ]
  body += pick(detailLeads, seed, 5)

  // ── 第5文：地域・所在地に紐づく独自情報 ──
  const areaParts: string[] = []
  if (c.city) {
    const cityCtx = [
      `${c.city}を含む${c.pref}内のエリアを幅広くカバーしています。`,
      `${c.pref}${c.city}周辺の現場を中心に、地域密着で対応しています。`,
      `${c.city}に拠点を構え、${c.pref}全域からの依頼に応じています。`,
    ]
    areaParts.push(pick(cityCtx, seed, 6))
  } else {
    areaParts.push(`${c.pref}内のエリアを中心に対応しています。`)
  }
  body += areaParts.join('')

  // ── 第6文：連絡・所在の事実情報（会社ごとに有無が変わる＝独自性） ──
  // 名詞句の事実（所在地・電話番号）のみをまとめ、URLは独立文として扱う
  const facts: string[] = []
  if (c.zip && c.address) {
    facts.push(`所在地は〒${c.zip} ${c.pref}${c.city ?? ''}${c.address}`)
  } else if (c.address) {
    facts.push(`所在地は${c.pref}${c.city ?? ''}${c.address}`)
  }
  if (c.tel) facts.push(`電話番号は${c.tel}`)
  if (facts.length > 0) {
    const factClosers = [
      `${facts.join('、')}です。警備の依頼や見積もりの相談時にご確認ください。`,
      `${facts.join('、')}です。${c.pref}で警備会社をお探しの際の比較検討にお役立てください。`,
      `${facts.join('、')}となっています。`,
    ]
    body += pick(factClosers, seed, 8)
  } else {
    const noFact = [
      `${c.pref}で警備会社をお探しの方の比較検討にお役立てください。`,
      `警備の発注先選びの参考にしてください。`,
    ]
    body += pick(noFact, seed, 8)
  }
  if (c.url) {
    const urlSentences = [
      `公式サイトでもサービス内容を確認できます。`,
      `詳細は公式サイトでも公開されています。`,
    ]
    body += pick(urlSentences, seed, 11)
  }

  return body
}
