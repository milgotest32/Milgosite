'use client'
import { useState, useEffect } from 'react'
import { MapPin, X, Check } from 'lucide-react'

const ISTANBUL_ILCELER: Record<string, [number, number]> = {
  'Adalar':        [40.8761, 29.0927],
  'Arnavutköy':    [41.1836, 28.7394],
  'Ataşehir':      [40.9923, 29.1244],
  'Avcılar':       [40.9798, 28.7219],
  'Bağcılar':      [41.0378, 28.8560],
  'Bahçelievler':  [41.0000, 28.8500],
  'Bakırköy':      [40.9822, 28.8720],
  'Başakşehir':    [41.0921, 28.8019],
  'Bayrampaşa':    [41.0464, 28.9139],
  'Beşiktaş':      [41.0422, 29.0067],
  'Beykoz':        [41.1233, 29.0978],
  'Beylikdüzü':    [40.9822, 28.6419],
  'Beyoğlu':       [41.0333, 28.9771],
  'Büyükçekmece':  [41.0203, 28.5831],
  'Çatalca':       [41.1436, 28.4606],
  'Çekmeköy':      [41.0436, 29.1806],
  'Esenler':       [41.0436, 28.8736],
  'Esenyurt':      [41.0281, 28.6728],
  'Eyüpsultan':    [41.0478, 28.9336],
  'Fatih':         [41.0186, 28.9397],
  'Gaziosmanpaşa': [41.0631, 28.9119],
  'Güngören':      [41.0197, 28.8726],
  'Kadıköy':       [40.9927, 29.0277],
  'Kağıthane':     [41.0782, 28.9703],
  'Kartal':        [40.9136, 29.1886],
  'Küçükçekmece':  [41.0008, 28.7783],
  'Maltepe':       [40.9353, 29.1331],
  'Pendik':        [40.8771, 29.2337],
  'Sancaktepe':    [41.0006, 29.2294],
  'Sarıyer':       [41.1671, 29.0570],
  'Silivri':       [41.0736, 28.2467],
  'Sultanbeyli':   [40.9628, 29.2694],
  'Sultangazi':    [41.1069, 28.8697],
  'Şile':          [41.1753, 29.6106],
  'Şişli':         [41.0602, 28.9870],
  'Tuzla':         [40.8167, 29.3003],
  'Ümraniye':      [41.0161, 29.1161],
  'Üsküdar':       [41.0231, 29.0150],
  'Zeytinburnu':   [40.9972, 28.9008],
}

export default function KonumModal() {
  const [goster, setGoster] = useState(false)
  const [durum, setDurum] = useState<'bekliyor' | 'aliniyor' | 'manuel' | 'tamam'>('bekliyor')
  const [konum, setKonum] = useState<string | null>(null)
  const [secilenIlce, setSecilenIlce] = useState('')
  const [hizmetliIlceler, setHizmetliIlceler] = useState<Record<string,boolean>>({})
  const [ilceYukleniyor, setIlceYukleniyor] = useState(false)

  useEffect(() => {
    const kayitli = localStorage.getItem('milgo_konum')
    const hizmet = localStorage.getItem('milgo_hizmet')

    // Dışarıdan tetiklenebilir - her zaman dinle (return'den önce)
    const dis = () => { setDurum('bekliyor'); setSecilenIlce(''); setGoster(true) }
    window.addEventListener('milgo_konum_modal_ac', dis)

    // Konum zaten varsa modal'ı otomatik açma
    if (kayitli && hizmet !== null) {
      setKonum(kayitli)
      return () => window.removeEventListener('milgo_konum_modal_ac', dis)
    }

    // Hizmet bilgisi yoksa temizle ve modal göster
    localStorage.removeItem('milgo_konum')
    localStorage.removeItem('milgo_bolge_id')
    localStorage.removeItem('milgo_bolge_ad')
    const t = setTimeout(() => setGoster(true), 1500)
    return () => { clearTimeout(t); window.removeEventListener('milgo_konum_modal_ac', dis) }
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
    window.dispatchEvent(new Event('milgo_konum_degisti'))
    setTimeout(() => setGoster(false), 2000)
  }

  const konumAl = () => {
    setDurum('aliniyor')
    if (!navigator.geolocation) { setDurum('manuel'); return }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        // Önce ilçe adını al, sonra KMZ kontrol et
        let ilceAdi = 'Konumunuz'
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=tr`)
          const d = await r.json()
          ilceAdi = d.address?.suburb || d.address?.town || d.address?.city_district || d.address?.city || 'Konumunuz'
        } catch { /* Nominatim çalışmazsa GPS koordinatıyla devam et */ }
        await koordinatKaydetVeKontrolEt(lat, lng, ilceAdi)
      },
      () => setDurum('manuel'),
      { timeout: 8000 }
    )
  }

  // İstanbul ilçe koordinatları (Nominatim'e gerek yok)
  // Tüm ilçelerin hizmet durumunu paralel olarak kontrol et
  const ilceleriKontrolEt = async () => {
    if (ilceYukleniyor || Object.keys(hizmetliIlceler).length > 0) return
    setIlceYukleniyor(true)
    const sonuclar: Record<string, boolean> = {}
    await Promise.all(
      Object.entries(ISTANBUL_ILCELER).map(async ([ilce, [lat, lng]]) => {
        try {
          const res = await fetch('/api/kmz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng })
          })
          const data = await res.json()
          sonuclar[ilce] = data.hizmet === true
        } catch {
          sonuclar[ilce] = false
        }
      })
    )
    setHizmetliIlceler(sonuclar)
    setIlceYukleniyor(false)
  }

  const manuelSec = async () => {
    if (!secilenIlce) return
    setDurum('aliniyor')
    try {
      const coords = ISTANBUL_ILCELER[secilenIlce]
      if (!coords) { localStorage.setItem('milgo_hizmet', 'false'); setDurum('tamam'); return }
      const [lat, lng] = coords
      const res = await fetch('/api/kmz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      })
      const data = await res.json()
      localStorage.setItem('milgo_konum', secilenIlce)
      localStorage.setItem('milgo_hizmet', data.hizmet ? 'true' : 'false')
      if (data.bolge?.id) {
        localStorage.setItem('milgo_bolge_id', data.bolge.id)
        localStorage.setItem('milgo_bolge_ad', data.bolge.name)
      } else {
        localStorage.removeItem('milgo_bolge_id')
        localStorage.removeItem('milgo_bolge_ad')
      }
      setKonum(secilenIlce)
      setDurum('tamam')
      window.dispatchEvent(new Event('milgo_konum_degisti'))
      setTimeout(() => setGoster(false), 1500)
    } catch {
      localStorage.setItem('milgo_konum', secilenIlce)
      localStorage.setItem('milgo_hizmet', 'false')
      localStorage.removeItem('milgo_bolge_id')
      localStorage.removeItem('milgo_bolge_ad')
      setKonum(secilenIlce)
      setDurum('tamam')
      window.dispatchEvent(new Event('milgo_konum_degisti'))
      setTimeout(() => setGoster(false), 1500)
    }
  }

  const kapat = () => {
    // Modal kapatıldığında konum zaten seçilmediyse state boş kalır
    // Daha önce seçilmiş bir konum varsa dokunma
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
                <button onClick={() => { setDurum('manuel'); ilceleriKontrolEt() }} style={{ ...btnBase, background: 'rgba(26,10,18,0.06)', color: '#7A6070' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ fontSize: '12px', color: '#7A6070', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', margin: 0 }}>İlçenizi seçin</p>
                  {ilceYukleniyor && <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Kontrol ediliyor...</span>}
                  {!ilceYukleniyor && Object.keys(hizmetliIlceler).length > 0 && (
                    <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>
                      ✓ {Object.values(hizmetliIlceler).filter(Boolean).length} ilçede hizmet var
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '220px', overflowY: 'auto', marginBottom: '14px' }}>
                  {Object.keys(ISTANBUL_ILCELER).sort().map(b => {
                    const hizmetVar = hizmetliIlceler[b]
                    const yuklendi = Object.keys(hizmetliIlceler).length > 0
                    const secili = secilenIlce === b
                    return (
                      <button key={b} onClick={() => hizmetVar !== false && setSecilenIlce(b)}
                        disabled={yuklendi && hizmetVar === false}
                        style={{
                          padding: '9px 4px', borderRadius: '10px',
                          border: secili ? '1.5px solid #E8567A' : hizmetVar ? '1.5px solid #22C55E33' : '1.5px solid rgba(26,10,18,0.08)',
                          background: secili ? '#FEE8EF' : hizmetVar ? '#F0FDF4' : 'transparent',
                          color: secili ? '#E8567A' : yuklendi && hizmetVar === false ? '#D1C4D8' : '#1A0A12',
                          fontSize: '11px', fontWeight: secili ? 700 : 500,
                          cursor: yuklendi && hizmetVar === false ? 'not-allowed' : 'pointer',
                          fontFamily: 'Nunito, sans-serif',
                          transition: 'all .15s', WebkitTapHighlightColor: 'transparent',
                          opacity: yuklendi && hizmetVar === false ? 0.5 : 1,
                          position: 'relative' as const,
                        }}>
                        {b}
                        {yuklendi && hizmetVar === true && !secili && (
                          <span style={{ position: 'absolute', top: '3px', right: '3px', width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E', display: 'block' }}/>
                        )}
                      </button>
                    )
                  })}
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
