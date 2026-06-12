import { ImageResponse } from 'next/og'
import { PREF_MAP } from '@/constants/prefs'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref] ?? '全国'

  const fontRes = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap'
  )
  const css = await fontRes.text()
  const fontUrl = css.match(/src: url\((.+?)\) format/)?.[1]
  let fontData: ArrayBuffer | undefined
  if (fontUrl) {
    const fontFile = await fetch(fontUrl)
    fontData = await fontFile.arrayBuffer()
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'white',
          display: 'flex',
          flexDirection: 'row',
          fontFamily: 'NotoSansJP',
        }}
      >
        {/* left orange bar */}
        <div style={{ width: '12px', background: '#f97316', flexShrink: 0, display: 'flex' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>keibi</span>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#f97316' }}>.online</span>
            <div style={{ marginLeft: '16px', fontSize: '14px', padding: '4px 16px', borderRadius: '20px', background: '#fff7ed', color: '#f97316', borderWidth: '1px', borderStyle: 'solid', borderColor: '#fed7aa', display: 'flex' }}>
              おすすめランキング
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '20px', color: '#888', display: 'flex' }}>{prefName}</div>
            <div style={{ fontSize: '52px', fontWeight: 700, color: '#111', lineHeight: '1.2', display: 'flex', flexWrap: 'wrap' }}>
              <span>おすすめ</span><span style={{ color: '#f97316' }}>警備会社</span><span>ランキング</span>
            </div>
            <div style={{ fontSize: '18px', color: '#666', display: 'flex' }}>
              <span>交通誘導・施設・イベント・駐車場　業務別に厳選</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', color: '#aaa', display: 'flex' }}>keibi.online/{pref}/osusume</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ fontSize: '14px', padding: '4px 14px', borderRadius: '20px', background: '#f3f4f6', color: '#666', display: 'flex' }}>2026年最新版</div>
              <div style={{ fontSize: '14px', padding: '4px 14px', borderRadius: '20px', background: '#f3f4f6', color: '#666', display: 'flex' }}>全国47都道府県対応</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData ? {
        fonts: [{
          name: 'NotoSansJP',
          data: fontData,
          weight: 700,
          style: 'normal',
        }]
      } : {}),
    }
  )
}
