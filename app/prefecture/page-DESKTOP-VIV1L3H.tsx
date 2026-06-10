export const metadata = {
  title: '都道府県から警備会社を探す | keibi.online',
  description: '全国47都道府県の警備会社一覧。お近くの施設警備・交通誘導警備・雑踏警備会社を都道府県別に検索できます。',
}

export default function PrefecturePage() {
  return (
    <main>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>
          <a href="/" style={{ color: '#999' }}>トップ</a> &gt; 都道府県一覧
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>都道府県から警備会社を探す</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>全国6,874社の警備会社を都道府県別に掲載しています。</p>
        
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>北海道・東北</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/hokkaido" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>北海道</a>
                <a href="/aomori" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>青森県</a>
                <a href="/iwate" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>岩手県</a>
                <a href="/miyagi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>宮城県</a>
                <a href="/akita" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>秋田県</a>
                <a href="/yamagata" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>山形県</a>
                <a href="/fukushima" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>福島県</a>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>関東</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/ibaraki" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>茨城県</a>
                <a href="/tochigi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>栃木県</a>
                <a href="/gunma" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>群馬県</a>
                <a href="/saitama" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>埼玉県</a>
                <a href="/chiba" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>千葉県</a>
                <a href="/tokyo" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>東京都</a>
                <a href="/kanagawa" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>神奈川県</a>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>中部</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/niigata" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>新潟県</a>
                <a href="/toyama" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>富山県</a>
                <a href="/ishikawa" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>石川県</a>
                <a href="/fukui" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>福井県</a>
                <a href="/yamanashi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>山梨県</a>
                <a href="/nagano" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>長野県</a>
                <a href="/gifu" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>岐阜県</a>
                <a href="/shizuoka" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>静岡県</a>
                <a href="/aichi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>愛知県</a>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>近畿</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/mie" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>三重県</a>
                <a href="/shiga" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>滋賀県</a>
                <a href="/kyoto" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>京都府</a>
                <a href="/osaka" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>大阪府</a>
                <a href="/hyogo" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>兵庫県</a>
                <a href="/nara" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>奈良県</a>
                <a href="/wakayama" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>和歌山県</a>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>中国・四国</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/tottori" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>鳥取県</a>
                <a href="/shimane" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>島根県</a>
                <a href="/okayama" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>岡山県</a>
                <a href="/hiroshima" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>広島県</a>
                <a href="/yamaguchi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>山口県</a>
                <a href="/tokushima" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>徳島県</a>
                <a href="/kagawa" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>香川県</a>
                <a href="/ehime" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>愛媛県</a>
                <a href="/kochi" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>高知県</a>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid #1a1a2e' }}>九州・沖縄</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                <a href="/fukuoka" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>福岡県</a>
                <a href="/saga" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>佐賀県</a>
                <a href="/nagasaki" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>長崎県</a>
                <a href="/kumamoto" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>熊本県</a>
                <a href="/oita" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>大分県</a>
                <a href="/miyazaki" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>宮崎県</a>
                <a href="/kagoshima" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>鹿児島県</a>
                <a href="/okinawa" style={{ padding: '10px 14px', border: '1px solid #e5e5e5', borderRadius: '8px', background: 'white', fontSize: '14px', color: '#1a1a2e', textDecoration: 'none', textAlign: 'center' }}>沖縄県</a>
              </div>
            </div>
      </div>
    </main>
  )
}
