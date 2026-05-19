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
    const hizmet = localStorage.getItem('milgo_hizmet')
    // Konum var ama hizmet durumu belirsizse modal'ı yeniden göster
    if (kayitli && hizmet !== null) { setKonum(kayitli); return }
    // Hizmet bilgisi yoksa temizle ve modal göster
    localStorage.removeItem('milgo_konum')
    localStorage.removeItem('milgo_bolge_id')
    localStorage.removeItem('milgo_bolge_ad')
    const t = setTimeout(() => setGoster(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Koordinatı kaydet ve bölge kontrolü yap
  const koordinatKaydetVeKontrolEt = async (lat: number, lng: number, ilceAdi: string) => {
    // Koordinatı kaydet
    localStorage.setItem('milgo_konum', ilceAdi)
    localStorage.setItem('milgo_lat', String(lat))
    localStorage.setItem('milgo_lng', String(lng))

    // Bölge kontrolü — hizmet verilip verilmediğini önceden öğren
    try {
      const res = await fetch('/api/kmz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      })
      const data = await res.json()
      if (data.bolge?.id) {
        localStorage.setItem('milgo_bolge_id', data.bolge.id)
        localStorage.setItem('milgo_bolge_ad', data.bolge.name)
      } else {
        localStorage.removeItem('milgo_bolge_id')
        localStorage.removeItem('milgo_bolge_ad')
      }
      localStorage.setItem('milgo_hizmet', data.hizmet ? 'true' : 'false')
    } catch {
      // API hatası → herkese göster (güvenli taraf)
      localStorage.setItem('milgo_hizmet', 'false')
    }

    setKonum(ilceAdi)
    setDurum('tamam')
    setTimeout(() => setGoster(false), 2000)
  }

  const konumAl = () => {
    setDurum('aliniyor')
    if (!navigator.geolocation) { setDurum('manuel'); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=tr`
          )
          const data = await res.json()
          const ilce = data.address?.suburb || data.address?.town || data.address?.city_district || data.address?.city || 'İstanbul'
          await koordinatKaydetVeKontrolEt(lat, lng, ilce)
        } catch { setDurum('manuel') }
      },
      () => setDurum('manuel'),
      { timeout: 8000 }
    )
  }

  const manuelSec = async () => {
    if (!secilenIlce) return
    setDurum('aliniyor')
    try {
      // İlçe adından koordinat al
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(secilenIlce + ', İstanbul, Türkiye')}&limit=1`
      )
      const data = await res.json()
      if (data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        await koordinatKaydetVeKontrolEt(lat, lng, secilenIlce)
      } else {
        // Koordinat bulunamazsa hizmet false - güvenli taraf
        localStorage.setItem('milgo_konum', secilenIlce)
        localStorage.setItem('milgo_hizmet', 'false')
        localStorage.removeItem('milgo_bolge_id')
        localStorage.removeItem('milgo_bolge_ad')
        setKonum(secilenIlce)
        setDurum('tamam')
        setTimeout(() => setGoster(false), 1500)
      }
    } catch {
      localStorage.setItem('milgo_konum', secilenIlce)
      localStorage.setItem('milgo_hizmet', 'false')
      localStorage.removeItem('milgo_bolge_id')
      localStorage.removeItem('milgo_bolge_ad')
      setKonum(secilenIlce)
      setDurum('tamam')
      setTimeout(() => setGoster(false), 1500)
    }
  }

  const kapat = () => {
    // Kapatınca hizmet bilgisini silme - konum belirlenmemiş sayılır
    // Ürünler sayfası bolge_id olmadığında ürün göstermez
    localStorage.removeItem('milgo_konum')
    localStorage.removeItem('milgo_hizmet')
    localStorage.removeItem('milgo_bolge_id')
    localStorage.removeItem('milgo_bolge_ad')
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
      <div onClick={kapat} style={{ position: 'fixed', inset: 0, background: 'rgba(26,10,18,0.5)', zIndex: 998, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />

      <div style={{
        position: 'fixed',
        bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        left: '16px', right: '16px',
        width: 'auto', maxWidth: '420px',
        background: '#fff', borderRadius: '28px', zIndex: 999,
        boxShadow: '0 24px 64px rgba(26,10,18,0.2)',
        padding: 'clamp(20px,4vw,28px)',
        fontFamily: 'Nunito, sans-serif',
        animation: 'fadeUp 0.4s ease forwards',
        boxSizing: 'border-box',
      }}>
        <button onClick={kapat} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(26,10,18,0.06)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <X size={15} color="#7A6070" />
        </button>

        {durum === 'tamam' ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: '56px', height: '56px', background: '#E8567A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={24} color="#fff" />
            </div>
            <p style={{ fontSize: '20px', color: '#1A0A12', margin: '0 0 4px' }}>Konumunuz Belirlendi</p>
            <p style={{ fontSize: '14px', color: '#E8567A', fontWeight: 700, margin: 0 }}>{konum}</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingRight: '36px' }}>
              <div style={{ width: '48px', height: '48px', background: '#FEE8EF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={22} color="#E8567A" />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#1A0A12', margin: '0 0 2px' }}>Konumunuz nerede?</h3>
                <p style={{ fontSize: '13px', color: '#7A6070', margin: 0 }}>Size yakın çiftlik ürünleri gösterelim</p>
              </div>
            </div>

            {(durum === 'bekliyor') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={konumAl} style={{ ...btnBase, background: '#1A0A12', color: '#fff' }}>
                  <MapPin size={16} /> Konumumu Otomatik Algıla
                </button>
                <button onClick={() => setDurum('manuel')} style={{ ...btnBase, background: 'rgba(26,10,18,0.06)', color: '#7A6070' }}>
                  İlçe Seç
                </button>
              </div>
            )}

            {(durum === 'aliniyor') && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8567A', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#7A6070', margin: 0 }}>Konumunuz kontrol ediliyor...</p>
              </div>
            )}

            {durum === 'manuel' && (
              <div>
                <p style={{ fontSize: '12px', color: '#7A6070', marginBottom: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>İlçenizi seçin</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '180px', overflowY: 'auto', marginBottom: '14px' }}>
                  {ISTANBUL_BOLGELER.map(b => (
                    <button key={b} onClick={() => setSecilenIlce(b)} style={{
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
                <button onClick={manuelSec} disabled={!secilenIlce} style={{ ...btnBase, background: secilenIlce ? '#1A0A12' : 'rgba(26,10,18,0.15)', color: '#fff', opacity: secilenIlce ? 1 : 0.6 }}>
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
