'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/product/ProductCard'
import type { Urun } from '@/lib/types'
export const dynamic = 'force-dynamic'
export default function IndirimlerPage() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    supabase.from('site_products').select('*,site_product_images(*),site_kategoriler(name,slug)').eq('durum','active').eq('indirimli',true).not('eski_fiyat','is',null)
      .then(({data}:any)=>{ setUrunler(data||[]); setLoading(false) })
  },[])
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{background:'linear-gradient(135deg,#FEE8EF,#EBF7FC)',padding:'48px 24px',textAlign:'center'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'40px',color:'#1C1B2E',marginBottom:'8px'}}>💸 İndirimdekiler</h1>
        <p style={{color:'#6B7280',fontSize:'14px'}}>Özel fiyatlarla seçkin ürünler</p>
      </div>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
        {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p> : urunler.length===0 ? (
          <p style={{textAlign:'center',color:'#9CA3AF',padding:'48px'}}>Şu an indirimli ürün bulunmuyor</p>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
