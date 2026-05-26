import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Çiftliğimiz | milgo.',
  description: 'ATASANCAK Çiftligimizi kesfedin. AB onayli, hastaliklardan ari surular, dogal yesillikler. Milgo urunlerinin kaynagina yakindan bakin.',
  openGraph: {
    title: 'Ciftligimiz | milgo.',
    description: 'ATASANCAK Ciftligi — Milgo urunlerinin kaynagi. AB onayli, dogal.',
  },
}
export default function CiftligimizPage() {
  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#fff', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '20px' }}>
          ATASANCAK Çiftliği
        </div>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.05, margin: 0 }}>
          Çiftliğimizi <em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400' }}>Keşfedin</em>
        </h1>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,32px)' }}>

        {/* Ana bölüm */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center', marginBottom: '56px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.15, margin: '0 0 20px' }}>
              Türkiye'nin En Büyük <em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400' }}>Damızlık Çiftliği</em>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: '#7A6070', marginBottom: '16px' }}>
              ATASANCAK Çiftliği, 24.000 dekar arazi üzerine kuruludur ve 4.800 sağmal olmak üzere toplam 10.500 büyükbaş ile Türkiye ve Avrupa'nın en büyük damızlık yetiştirme tesisidir.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.85, color: '#7A6070' }}>
              Ülkemizin ilk Hastalıklardan Ari ve AB onaylı süt işletmelerinden biriyiz.
            </p>
          </div>
          <div style={{ borderRadius: '28px', overflow: 'hidden', aspectRatio: '1', boxShadow: '0 16px 48px rgba(26,10,18,.1)' }}>
            <img
              src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600"
              alt="Çiftlik"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* İstatistikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          {[['10.500', 'Büyükbaş'], ['4.800', 'Sağmal İnek'], ['24.000', 'Dekar Arazi'], ['400T', 'Günlük Yem']].map(([sayi, ac]) => (
            <div key={ac} style={{ background: '#fff', border: '1px solid rgba(26,10,18,0.07)', borderRadius: '20px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,10,18,.04)' }}>
              <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '40px', color: '#E8567A', lineHeight: 1, fontWeight: 400 }}>{sayi}</div>
              <div style={{ fontSize: '12px', color: '#7A6070', marginTop: '8px', fontWeight: 600 }}>{ac}</div>
            </div>
          ))}
        </div>

        {/* Özellikler */}
        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { emoji: '🌿', baslik: 'Doğal Beslenme', aciklama: 'Hayvanlarımız doğal mera ve kendi ürettiğimiz yemlerle beslenir.' },
            { emoji: '🔬', baslik: 'AB Onaylı', aciklama: 'Avrupa Birliği standartlarında onaylı üretim tesisi.' },
            { emoji: '🥛', baslik: 'Günlük Taze', aciklama: 'Her gün sabah toplanan süt, aynı gün işleme alınır.' },
            { emoji: '✅', baslik: 'Hastalıklardan Ari', aciklama: 'Türkiye\'nin ilk HA belgeli süt işletmelerinden biriyiz.' },
          ].map(item => (
            <div key={item.baslik} style={{ background: '#fff', border: '1px solid rgba(26,10,18,0.07)', borderRadius: '20px', padding: '24px 20px', boxShadow: '0 2px 12px rgba(26,10,18,.04)' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.emoji}</div>
              <h3 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '18px', fontWeight: 400, color: '#1A0A12', margin: '0 0 8px' }}>{item.baslik}</h3>
              <p style={{ fontSize: '13px', color: '#7A6070', lineHeight: 1.7, margin: 0 }}>{item.aciklama}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
