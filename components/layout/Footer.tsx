import Link from 'next/link'
const yr = new Date().getFullYear()
export default function Footer() {
  return (
    <footer style={{ background: '#1A0A12', color: 'rgba(255,255,255,0.6)', fontFamily: 'Syne, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(48px,6vw,72px) clamp(16px,5vw,80px) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }} className="footer-grid">
          <div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '30px', color: '#fff', marginBottom: '4px' }}>milgo<span style={{ color: '#E8567A' }}>.</span></div>
            <p style={{ fontSize: '10px', letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginBottom: '18px' }}>Mutluluğun Tadı</p>
            <p style={{ fontSize: '13px', lineHeight: '1.8', color: 'rgba(255,255,255,.5)', maxWidth: '240px', marginBottom: '20px' }}>Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[['📞', '(0212) 352 10 76', 'tel:02123521076'], ['✉️', 'bilgi@milgo.com.tr', 'mailto:bilgi@milgo.com.tr'], ['📍', 'Etiler, Beşiktaş / İstanbul', '#']].map(([i, t, h]) => (
                <a key={t} href={h} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>{i} {t}</a>
              ))}
            </div>
          </div>
          {[
            { h: 'Ürünler', l: [['Çiğ Süt', '/kategoriler/cig-sut'], ['Peynir', '/kategoriler/peynir'], ['Tereyağı', '/kategoriler/tereyagi'], ['Kampanyalar', '/kampanyalar'], ['İndirimdekiler', '/indirimler']] },
            { h: 'Keşfet', l: [['Hakkımızda', '/hakkimizda'], ['Çiftliğimiz', '/ciftligimiz'], ['Blog', '/blog'], ['SSS', '/sss'], ['İletişim', '/iletisim']] },
            { h: 'Yasal', l: [['Gizlilik', '/gizlilik'], ['İade', '/iade'], ['Mesafeli Satış', '/mesafeli']] },
          ].map(({ h, l }) => (
            <div key={h}>
              <h4 style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.25em', textTransform: 'uppercase', color: '#E8567A', marginBottom: '20px' }}>{h}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {l.map(([a, href]) => <Link key={a} href={href} style={{ fontSize: '13px', color: 'rgba(255,255,255,.5)', textDecoration: 'none' }}>{a}</Link>)}
              </div>
            </div>
          ))}
        </div>

        {/* Sertifikalar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {['🇪🇺 AB Onaylı', '✓ Hastalıklardan Ari', '🌿 %100 Doğal', '🔒 SSL Güvenli'].map(s => (
            <span key={s} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', padding: '6px 14px', borderRadius: '50px', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,.6)' }}>{s}</span>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.25)' }}>© {yr} milgo. · Keba Gıda San. Tic. A.Ş.</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['📸', 'https://instagram.com/milgosut'], ['▶', 'https://youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'], ['f', 'https://facebook.com/milgosut']].map(([i, h]) => (
              <a key={h} href={h} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', textDecoration: 'none', color: 'rgba(255,255,255,.5)' }}>{i}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
