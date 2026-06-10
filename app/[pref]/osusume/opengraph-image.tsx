import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PREF_MAP: Record<string, string> = {
  hokkaido:'北海道',aomori:'青森県',iwate:'岩手県',miyagi:'宮城県',akita:'秋田県',
  yamagata:'山形県',fukushima:'福島県',ibaraki:'茨城県',tochigi:'栃木県',gunma:'群馬県',
  saitama:'埼玉県',chiba:'千葉県',tokyo:'東京都',kanagawa:'神奈川県',niigata:'新潟県',
  toyama:'富山県',ishikawa:'石川県',fukui:'福井県',yamanashi:'山梨県',nagano:'長野県',
  gifu:'岐阜県',shizuoka:'静岡県',aichi:'愛知県',mie:'三重県',shiga:'滋賀県',
  kyoto:'京都府',osaka:'大阪府',hyogo:'兵庫県',nara:'奈良県',wakayama:'和歌山県',
  tottori:'鳥取県',shimane:'島根県',okayama:'岡山県',hiroshima:'広島県',yamaguchi:'山口県',
  tokushima:'徳島県',kagawa:'香川県',ehime:'愛媛県',kochi:'高知県',fukuoka:'福岡県',
  saga:'佐賀県',nagasaki:'長崎県',kumamoto:'熊本県',oita:'大分県',miyazaki:'宮崎県',
  kagoshima:'鹿児島県',okinawa:'沖縄県'
}

export default async function Image({ params }: { params: Promise<{ pref: string }> }) {
  const { pref } = await params
  const prefName = PREF_MAP[pref] ?? '全国'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          borderLeft: '12px solid #f97316',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#111' }}>keibi</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#f97316' }}>.online</span>
          <div style={{ marginLeft: '16px', fontSize: '14px', padding: '4px 16px', borderRadius: '20px', background: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa', display: 'flex' }}>
            おすすめランキング
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '20px', color: '#888' }}>{prefName}</div>
          <div style={{ fontSize: '52px', fontWeight: 700, color: '#111', lineHeight: 1.2, display: 'flex', flexWrap: 'wrap' }}>
            おすすめ<span style={{ color: '#f97316' }}>警備会社</span>ランキング
          </div>
          <div style={{ fontSize: '18px', color: '#666', display: 'flex' }}>
            交通誘導・施設・イベント・駐車場　業務別に厳選
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', color: '#aaa' }}>keibi.online/{pref}/osusume</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ fontSize: '14px', padding: '4px 14px', borderRadius: '20px', background: '#f3f4f6', color: '#666', display: 'flex' }}>2026年最新版</div>
            <div style={{ fontSize: '14px', padding: '4px 14px', borderRadius: '20px', background: '#f3f4f6', color: '#666', display: 'flex' }}>全国47都道府県対応</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
