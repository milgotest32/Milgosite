'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Package, X, ChevronRight } from 'lucide-react'
import { useSepet } from '@/lib/sepet'
import toast from 'react-hot-toast'

export default function PaketPopup({ urunId }: { urunId: string }) {
  const [paket, setPaket] = useState<any>(null)
  const [kapali, setKapali] = useState(false)
  const [sezonAktif, setSezonAktif] = useState(true)
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    supabase.from('site_ayarlar').select('deger').eq('grup', 'sezon').eq('anahtar', 'aktif').single()
      .then(({ data }: any) => { if (data) setSezonAktif(data.deger === '1') })
    // Bu ürünü içeren aktif bir paket var mı?
    supabase
      .from('site_paket_urunleri')
      .select('paket_id, site_paketler(*, site_paket_urunleri(adet, site_products(id,name,slug,fiyat,sezon_urun,site_product_images(*))))')
      .eq('product_id', urunId)
      .then(({ data }) => {
        const bulunan = data?.find((d: any) => d.site_paketler?.aktif)
        if (bulunan?.site_paketler) setPaket(bulunan.site_paketler)
      })
  }, [urunId])

  if (!paket || kapali) return null

  // Ayrı ayrı toplam
  const kalemler = paket.site_paket_urunleri || []
  const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
  const tasarruf = ayriToplam - paket.fiyat
  const tasarrufYuzde = Math.round((tasarruf / ayriToplam) * 100)

  const sepeteEkle = () => {
    // Pakette çiğ süt varsa ve sezon kapalıysa engelle
    const cigSutVar = kalemler.some((k: any) => k.site_products?.sezon_urun)
    if (cigSutVar && !sezonAktif) { toast.error('🌿 Çiğ süt sezonu kapalı, bu paketi ekleyemezsiniz'); return }
    // Paket indirim oranını hesapla
    const oran = ayriToplam > 0 ? paket.fiyat / ayriToplam : 1
    // Ürünlerin fiyatını paket oranına göre düşür
    kalemler.forEach((k: any) => {
      if (k.site_products) {
        const indirimlifiyat = Math.round(k.site_products.fiyat * oran * 100) / 100
        ekle({
          tip: 'fiziksel', durum: 'active', featured: false, yeni: false, indirimli: true,
          stok: 999, min_stok: 0, stok_takip: false, etiketler: [], ozellikler: {}, meta: {},
          ...k.site_products,
          fiyat: indirimlifiyat,
          eski_fiyat: k.site_products.fiyat,
        }, k.adet)
      }
    })
    toast.success(`🎁 ${paket.name} sepete eklendi!`)
    setKapali(true)
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
      width: '300px', background: '#fff', borderRadius: '20px',
      boxShadow: '0 8px 40px rgba(224,112,144,0.25), 0 2px 12px rgba(0,0,0,0.1)',
      border: '2px solid #F4A7B9', overflow: 'hidden',
      animation: 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Başlık */}
      <div style={{ background: 'linear-gradient(135deg,#E07090,#3B9FCC)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={16} color="#fff" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Bu ürün bir pakette!</span>
        </div>
        <button onClick={() => setKapali(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={13} color="#fff" />
        </button>
      </div>

      {/* İçerik */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>{paket.name}</p>
        {paket.aciklama && <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>{paket.aciklama}</p>}

        {/* Ürün listesi */}
        <div style={{ background: '#F8F7FC', borderRadius: '10px', padding: '8px', marginBottom: '10px' }}>
          {kalemler.map((k: any) => (
            <div key={k.site_products?.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', padding: '3px 0' }}>
              <span>• {k.site_products?.name} ×{k.adet}</span>
              <span>₺{((k.site_products?.fiyat || 0) * k.adet).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Fiyat */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through', display: 'block' }}>Ayrı ayrı: ₺{ayriToplam.toFixed(2)}</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1C1B2E' }}>₺{paket.fiyat.toFixed(2)}</span>
          </div>
          {tasarruf > 0 && (
            <span style={{ background: '#F0FDF4', color: '#22C55E', fontSize: '13px', fontWeight: 800, padding: '5px 10px', borderRadius: '50px' }}>
              %{tasarrufYuzde} tasarruf
            </span>
          )}
        </div>

        {/* Butonlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={sepeteEkle}
            style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Package size={14} />Paketi Sepete Ekle
          </button>
          <Link href={`/paketler/${paket.slug}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', color: '#9CA3AF', textDecoration: 'none', padding: '4px' }}>
            Paketi incele <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
