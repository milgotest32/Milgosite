'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import { Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaketOnerisi() {
  const items = useSepet(s => s.items)
  const ekle = useSepet(s => s.ekle)
  const [paket, setPaket] = useState<any>(null)

  useEffect(() => {
    if (items.length === 0) { setPaket(null); return }
    const productIds = items.map(i => i.product_id)

    supabase
      .from('site_paket_urunleri')
      .select('paket_id, site_paketler(id, name, fiyat, aktif, site_paket_urunleri(adet, site_products(id, name, fiyat)))')
      .in('product_id', productIds)
      .then(({ data }) => {
        if (!data || data.length === 0) { setPaket(null); return }
        const aktif = (data as any[]).find(d => d.site_paketler?.aktif)
        if (!aktif) { setPaket(null); return }
        const p = aktif.site_paketler
        // Paketteki tüm ürünler zaten sepette mi?
        const kalemler = p.site_paket_urunleri || []
        const hepsinde = kalemler.every((k: any) =>
          productIds.includes(k.site_products?.id)
        )
        if (hepsinde) { setPaket(null); return }
        setPaket(p)
      })
  }, [items])

  if (!paket) return null

  const kalemler = paket.site_paket_urunleri || []
  const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
  const tasarruf = ayriToplam - paket.fiyat
  const yuzde = ayriToplam > 0 ? Math.round((tasarruf / ayriToplam) * 100) : 0

  const paketeEkle = () => {
    kalemler.forEach((k: any) => {
      if (k.site_products) ekle(k.site_products, k.adet)
    })
    toast.success(`🎁 ${paket.name} sepete eklendi!`)
    setPaket(null)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', borderRadius: '16px', padding: '16px', border: '1px solid #F4A7B9', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Package size={16} color="#E8567A" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>Sepetinizdeki ürünler bir pakette!</span>
      </div>
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>{paket.name}</p>
      <p style={{ fontSize: '11px', color: '#7A6070', marginBottom: '10px' }}>
        {kalemler.map((k: any) => `${k.site_products?.name} ×${k.adet}`).join(' + ')}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through' }}>₺{ayriToplam.toFixed(2)}</span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#1C1B2E', marginLeft: '8px' }}>₺{paket.fiyat.toFixed(2)}</span>
          {yuzde > 0 && <span style={{ fontSize: '11px', fontWeight: 700, color: '#22C55E', marginLeft: '6px' }}>%{yuzde} tasarruf</span>}
        </div>
        <button onClick={paketeEkle}
          style={{ background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Paketi Ekle
        </button>
      </div>
    </div>
  )
}
