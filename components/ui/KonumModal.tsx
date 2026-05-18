'use client'
import { useState, useEffect } from 'react'
import { MapPin, X, Check } from 'lucide-react'

const ISTANBUL_BOLGELER = [
  'Beşiktaş', 'Şişli', 'Kağıthane', 'Beyoğlu', 'Sarıyer',
  'Kadıköy', 'Üsküdar', 'Ataşehir', 'Maltepe', 'Pendik',
  'Bakırköy', 'Bahçelievler', 'Bağcılar', 'Gaziosmanpaşa',
  'Fatih', 'Eyüpsultan', 'Zeytinburnu', 'Güngören',
]

export default function KonumModal() {
  const [goster, setGoster] = useState(false)
  const [durum, setDurum] = useState<'bekliyor' | 'aliniyor' | 'manuel' | 'tamam'>('bekliyor')
  const [konum, setKonum] = useState<string | null>(null)
  const [secilenIlce, setSecilenIlce] = useState('')

  useEffect(() => {
    const kayitli = localStorage.getItem('milgo_konum')
    if (kayitli) { setKonum(kayitli); return }
    const t = setTimeout(() => setGoster(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const konumAl = () => {
    setDurum('aliniyor')
    if (!navigator.geolocation) { setDurum('manuel'); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=tr`
          )
          const data = await res.json()
          const ilce = data.address?.suburb || data.address?.town || data.address?.city_district || data.address?.city || 'İstanbul'
          localStorage.setItem('milgo_konum', ilce)
          setKonum(ilce)
          setDurum('tamam')
          setTimeout(() => setGoster(false), 2000)
        } catch { setDurum('manuel') }
      },
      () => setDurum('manuel'),
      { timeout: 8000 }
    )
  }

  const manuelSec = () => {
    if (!secilenIlce) return
    localStorage.setItem('milgo_konum', secilenIlce)
    setKonum(secilenIlce)
    setDurum('tamam')
    setTimeout(() => setGoster(false), 1500)
  }

  const kapat = () => {
    localStorage.setItem('milgo_konum', 'İstanbul')
    setGoster(false)
  }

  if (!goster) return null

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    border: 'none', borderRadius: '50px', padding: '14px 20px', fontSize: '14px',
    fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', width: '100%',
    WebkitTapHighlightColor: 'transparent',
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={kapat}
        style={{ position: 'fixed', inset: 0, background: 'rgba(26,10,18,0.5)', zIndex: 998, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      {/* Modal — sabit genişlik, güvenli alt boşluk için env() */}
      <div style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(420px, calc(100vw - 32px))',
        background: '#fff',
        borderRadius: '28px',
        zIndex: 999,
        boxShadow: '0 24px 64px rgba(26,10,18,0.2)',
        padding: 'clamp(20px,4vw,28px)',
        fontFamily: 'Nunito, sans-serif',
        animation: 'fadeUp 0.4s ease forwards',
        boxSizing: 'border-box',
      }}>
        {/* Kapat */}
        <button
          onClick={kapat}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(26,10,18,0.06)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <X size={15} color="#7A6070" />
        </button>

        {durum === 'tamam' ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: '56px', height: '56px', background: '#E8567A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={24} color="#fff" />
            </div>
            <p style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '20px', color: '#1A0A12', margin: '0 0 4px' }}>Konumunuz Belirlendi</p>
            <p style={{ fontSize: '14px', color: '#E8567A', fontWeight: 700, margin: 0 }}>{konum}</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingRight: '36px' }}>
              <div style={{ width: '48px', height: '48px', background: '#FEE8EF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={22} color="#E8567A" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '20px', color: '#1A0A12', margin: '0 0 2px' }}>Konumunuz nerede?</h3>
                <p style={{ fontSize: '13px', color: '#7A6070', margin: 0 }}>Size yakın çiftlik ürünleri gösterelim</p>
              </div>
            </div>

            {durum === 'bekliyor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={konumAl} style={{ ...btnBase, background: '#1A0A12', color: '#fff' }}>
                  <MapPin size={16} /> Konumumu Otomatik Algıla
                </button>
                <button onClick={() => setDurum('manuel')} style={{ ...btnBase, background: 'rgba(26,10,18,0.06)', color: '#7A6070' }}>
                  İlçe Seç
                </button>
              </div>
            )}

            {durum === 'aliniyor' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8567A', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#7A6070', margin: 0 }}>Konumunuz alınıyor...</p>
              </div>
            )}

            {durum === 'manuel' && (
              <div>
                <p style={{ fontSize: '12px', color: '#7A6070', marginBottom: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>İlçenizi seçin</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '180px', overflowY: 'auto', marginBottom: '14px' }}>
                  {ISTANBUL_BOLGELER.map(b => (
                    <button key={b} onClick={() => setSecilenIlce(b)}
                      style={{
                        padding: '9px 6px', borderRadius: '10px',
                        border: `1.5px solid ${secilenIlce === b ? '#E8567A' : 'rgba(26,10,18,0.1)'}`,
                        background: secilenIlce === b ? '#FEE8EF' : 'transparent',
                        color: secilenIlce === b ? '#E8567A' : '#1A0A12',
                        fontSize: '12px', fontWeight: secilenIlce === b ? 700 : 500,
                        cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                        transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
                      }}>
                      {b}
                    </button>
                  ))}
                </div>
                <button onClick={manuelSec} disabled={!secilenIlce}
                  style={{ ...btnBase, background: secilenIlce ? '#1A0A12' : 'rgba(26,10,18,0.15)', color: '#fff', opacity: secilenIlce ? 1 : 0.6 }}>
                  {secilenIlce ? `${secilenIlce} → Devam Et` : 'İlçe Seçin'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
