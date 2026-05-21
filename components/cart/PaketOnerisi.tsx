'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import { Package } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PaketOnerisi() {
  const { items, ekle } = useSepet()
  const [paket, setPaket] = useState<any>(null)

  useEffect(() => {
    if (items.length === 0) return
    const productIds = items.map(i => i.product_id)
    
    // Sepetteki ürünlerden herhangi biri bir pakette mi?
    supabase
      .from('site_paket_urunleri')
      .select('paket_id, site_paketler!inner(*, site_paket_urunleri(adet, site_products(id,name,fiyat,site_product_images(*))))')
      .in('product_id', productIds)
      .eq('site_paketler.aktif', true)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPaket((data[0] as any).site_paketler)
        }
      })
  }, [items])

  if (!paket) return null

  const kalemler = paket.site_paket_urunleri || []
  const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
  const tasarruf = ayriToplam - paket.fiyat
  const yuzde = ayriToplam > 0 ? Math.round((tasarruf / ayriToplam) * 100) : 0

  // Sepette zaten bu paketin tüm ürünleri var mı?
  const { items: sepetItems } = useSepet.getState()
  const hepsinde = kalemler.every((k: any) =>
    sepetItems.find(i => i.product_id === k.site_products?.id)
  )
  if (hepsinde) return null

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
