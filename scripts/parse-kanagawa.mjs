async function parseKanagawa() {
  const res = await fetch('https://www.police.pref.kanagawa.jp/tetsuzuki/eigyokankei/keibi/mesd0099.html', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  })
  const html = await res.text()
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')

  const results = []

  // パターン: 令和X年X月X日～X月X日 または 令和X年X月X日～X日（同月）
  const pattern = /(警備員指導教育責任者講習|機械警備業務管理者講習)([^→]*)[→]\s*令和(\d+)年(\d+)月(\d+)日[～〜～](?:(\d+)月)?(\d+)日/g

  let m
  while ((m = pattern.exec(text)) !== null) {
    const typeStr = m[2] || ''
    const reiwaYear = 2018 + parseInt(m[3])
    const startMonth = m[4].padStart(2, '0')
    const startDay = m[5].padStart(2, '0')
    // 月をまたぐ場合はm[6]に終了月、同月の場合はm[4]を使う
    const endMonth = m[6] ? m[6].padStart(2, '0') : startMonth
    const endDay = m[7].padStart(2, '0')

    const qualification = m[1].includes('機械')
      ? '機械警備業務管理者'
      : typeStr.match(/[1１]号/) ? '1号警備業務'
      : typeStr.match(/[2２]号/) ? '2号警備業務'
      : typeStr.match(/[3３]号/) ? '3号警備業務'
      : typeStr.match(/[4４]号/) ? '4号警備業務'
      : null

    const type = typeStr.includes('新規') ? '新規取得'
      : typeStr.includes('追加') ? '追加取得'
      : typeStr.includes('定期') || typeStr.includes('現任') ? '定期講習'
      : '新規取得'

    if (!qualification) continue

    const record = {
      qualification,
      type,
      date_start: `${reiwaYear}-${startMonth}-${startDay}`,
      date_end: `${reiwaYear}-${endMonth}-${endDay}`,
    }
    results.push(record)
  }

  // 2026年以降のみ
  const filtered = results.filter(r => r.date_start >= '2026-01-01')

  console.log(`抽出結果: ${filtered.length}件`)
  filtered.forEach(r => console.log(JSON.stringify(r)))
}

parseKanagawa()
