'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/product/ProductCard'
import type { Urun } from '@/lib/types'
import Link from 'next/link'
import { ChevronRight, MapPin } from 'lucide-react'

export default function KategoriClient({ kategori }: { kategori: any }) {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  const [hizmetYok, setHizmetYok] = useState(false)
  const [bolgeAd, setBolgeAd] = useState<string|null>(null)
  const [sezonAktif, setSezonAktif] = useState(true)

  const yukle = useCallback(async () => {
    setLoading(true)
    const hizmet = localStorage.getItem('milgo_hizmet')
    const bolgeId = localStorage.getItem('milgo_bolge_id')
    const bad = localStorage.getItem('milgo_bolge_ad')
    setBolgeAd(bad)

    if (hizmet === 'false') {
      setHizmetYok(true)
      setLoading(false)
      return
    }
    setHizmetYok(false)

    const { data } = await supabase
      .from('site_products')
      .select('*,site_product_images(*),site_kategoriler(name,slug)')
      .eq('durum', 'active')
      .eq('kategori_id', kategori.id)
      .order('created_at', { ascending: false })

    let tumUrunler: Urun[] = data || []
    if (bolgeId) {
      tumUrunler = tumUrunler.filter((u: any) => u.bolge_ids && u.bolge_ids.includes(bolgeId))
    } else {
      tumUrunler = []
    }
    setUrunler(tumUrunler)
    setLoading(false)
  }, [kategori.id])

  useEffect(() => {
    supabase.from('site_ayarlar').select('deger').eq('grup', 'sezon').eq('anahtar', 'aktif').single().then(({ data }) => {
      if (data) setSezonAktif(data.deger === '1')
    })

    yukle()
    window.addEventListener('milgo_konum_degisti', yukle)
    return () => window.removeEventListener('milgo_konum_degisti', yukle)
  }, [yukle])

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #F0ECF5',padding:'24px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto'}}>
          <nav style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#9CA3AF',marginBottom:'12px'}}>
            <Link href="/" style={{color:'#9CA3AF',textDecoration:'none'}}>Ana Sayfa</Link><ChevronRight size={12}/>
            <span style={{color:'#1C1B2E'}}>{kategori.name}</span>
          </nav>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',color:'#1C1B2E',marginBottom:'4px'}}>{kategori.name}</h1>
          {kategori.aciklama && <p style={{fontSize:'14px',color:'#9CA3AF'}}>{kategori.aciklama}</p>}
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'8px'}}>
            <p style={{fontSize:'13px',color:'#9CA3AF',margin:0}}>{urunler.length} ürün</p>
            {bolgeAd && (
              <span style={{fontSize:'12px',color:'#3B9FCC',background:'#EBF7FC',padding:'3px 10px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'4px'}}>
                <MapPin size={11}/>📍 {bolgeAd}
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
        {loading ? (
          <div style={{display:'flex',justifyContent:'center',padding:'48px'}}>
            <div style={{width:36,height:36,borderRadius:'50%',border:'3px solid #F4A7B9',borderTopColor:'#E8567A',animation:'spin 0.8s linear infinite'}}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : hizmetYok ? (
          <div style={{textAlign:'center',padding:'64px 24px'}}>
            <p style={{fontSize:'40px',marginBottom:'12px'}}>🚫</p>
            <p style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'8px'}}>Bu bölgeye hizmet verilmiyor</p>
            <p style={{fontSize:'14px',color:'#9CA3AF'}}>Konumunuzu değiştirerek hizmet bölgelerini görebilirsiniz.</p>
          </div>
        ) : urunler.length === 0 ? (
          <div style={{textAlign:'center',padding:'64px 24px'}}>
            <p style={{fontSize:'40px',marginBottom:'12px'}}>📦</p>
            <p style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'8px'}}>Bu kategoride ürün bulunamadı</p>
            {bolgeAd && <p style={{fontSize:'14px',color:'#9CA3AF'}}>{bolgeAd} bölgesi için ürün yok.</p>}
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u} sezonDisi={!sezonAktif}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
