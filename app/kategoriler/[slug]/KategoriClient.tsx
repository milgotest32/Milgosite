'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/product/ProductCard'
import type { Urun } from '@/lib/types'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function KategoriClient({ kategori }: { kategori: any }) {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    supabase.from('site_products').select('*,site_product_images(*),site_kategoriler(name,slug)').eq('durum','active').eq('kategori_id',kategori.id).order('created_at',{ascending:false})
      .then(({data}:any)=>{ setUrunler(data||[]); setLoading(false) })
  },[kategori.id])
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
          <p style={{fontSize:'13px',color:'#9CA3AF',marginTop:'8px'}}>{urunler.length} ürün</p>
        </div>
      </div>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
        {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
