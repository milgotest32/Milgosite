'use client'
export default function OfflinePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '24px' }}>🌾</div>
      <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '32px', color: '#1C1B2E', marginBottom: '12px' }}>İnternet Bağlantısı Yok</h1>
      <p style={{ fontSize: '15px', color: '#6B7280', maxWidth: '360px', lineHeight: 1.7, marginBottom: '32px' }}>
        Şu an çevrimdışısınız. Bağlantınız geldiğinde alışverişe devam edebilirsiniz.
      </p>
      <button onClick={() => window.location.reload()}
        style={{ background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 32px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        Tekrar Dene
      </button>
    </div>
  )
}
