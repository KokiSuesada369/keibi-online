import React from 'react'

export type RichTheme = { main: string; bg: string; soft: string }

// インライン装飾: **太字** と ==ハイライト==
function inline(text: string, theme: RichTheme, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|==[^=]+==)/g
  let lastIndex = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index))
    const token = m[0]
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={`${keyBase}-b${k++}`} style={{ color: theme.main, fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      )
    } else {
      nodes.push(
        <mark key={`${keyBase}-m${k++}`} style={{ background: theme.bg, color: theme.main, padding: '1px 4px', borderRadius: '3px', fontWeight: 600 }}>
          {token.slice(2, -2)}
        </mark>
      )
    }
    lastIndex = m.index + token.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

/**
 * 本文文字列をリッチな見た目に変換する軽量パーサー。
 * - 段落は空行(\n\n)で区切る
 * - 行頭「・」「-」… 箇条書き（✓マーカー）
 * - 行頭「①②…」「1.」… 番号付きリスト
 * - 行頭「>」… POINT 強調ボックス
 * - 文中 **太字** ==ハイライト==
 * 記法が無いプレーンな本文はそのまま段落として表示される。
 */
export function renderRichText(body: string, theme: RichTheme): React.ReactNode {
  const blocks = body.split(/\n\n+/).map(b => b.trim()).filter(Boolean)
  return blocks.map((block, bi) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)

    // POINT ボックス
    if (lines.length > 0 && lines.every(l => l.startsWith('>'))) {
      const content = lines.map(l => l.replace(/^>\s?/, '')).join(' ')
      return (
        <div key={bi} style={{ display: 'flex', gap: '12px', background: theme.soft, borderLeft: `4px solid ${theme.main}`, borderRadius: '8px', padding: '14px 16px', margin: '16px 0' }}>
          <span style={{ flexShrink: 0, fontSize: '12px', fontWeight: 800, color: '#fff', background: theme.main, borderRadius: '5px', padding: '2px 8px', height: 'fit-content' }}>POINT</span>
          <span style={{ fontSize: '14px', lineHeight: 1.85, color: '#374151' }}>{inline(content, theme, `c${bi}`)}</span>
        </div>
      )
    }

    // 箇条書き
    if (lines.length > 0 && lines.every(l => /^[・\-]/.test(l))) {
      return (
        <ul key={bi} style={{ margin: '14px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {lines.map((l, li) => (
            <li key={li} style={{ display: 'flex', gap: '10px', fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
              <span style={{ flexShrink: 0, color: theme.main, fontWeight: 800, marginTop: '1px' }}>✓</span>
              <span>{inline(l.replace(/^[・\-]\s?/, ''), theme, `l${bi}-${li}`)}</span>
            </li>
          ))}
        </ul>
      )
    }

    // 番号付きリスト
    if (lines.length > 1 && lines.every(l => /^([①-⑳]|\d+[.．])/.test(l))) {
      return (
        <ol key={bi} style={{ margin: '14px 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {lines.map((l, li) => (
            <li key={li} style={{ display: 'flex', gap: '12px', fontSize: '15px', lineHeight: 1.85, color: '#374151' }}>
              <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: theme.bg, color: theme.main, fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{li + 1}</span>
              <span>{inline(l.replace(/^([①-⑳]|\d+[.．])\s?/, ''), theme, `o${bi}-${li}`)}</span>
            </li>
          ))}
        </ol>
      )
    }

    // 通常段落
    return (
      <p key={bi} style={{ margin: '0 0 15px', fontSize: '15px', lineHeight: 1.95, color: '#374151' }}>
        {inline(lines.join(''), theme, `p${bi}`)}
      </p>
    )
  })
}
