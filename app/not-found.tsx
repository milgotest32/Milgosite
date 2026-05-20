import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>

        {/* Büyük 404 */}
        <div style={{ fontSize: 'clamp(80px, 20vw, 140px)', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, #E8567A, #3B9FCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
          404
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1A0A12', marginBottom: 12 }}>
          Sayfa bulunamadı
        </h1>
        <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 32 }}>
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#E8567A', color: '#fff', padding: '12px 28px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/urunler" style={{ background: '#fff', color: '#1A0A12', padding: '12px 28px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1px solid #E5E7EB' }}>
            Ürünlere Bak
          </Link>
        </div>

      </div>
    </div>
  )
}
