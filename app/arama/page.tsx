'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/product/ProductCard'
import type { Urun } from '@/lib/types'
export const dynamic = 'force-dynamic'
function Icerik() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!q) { setLoading(false); return }
    supabase.from('site_products').select('*, site_product_images(*), site_kategoriler(name,slug)').eq('durum','active').or(`name.ilike.%${q}%,aciklama.ilike.%${q}%`)
      .then(({ data }: any) => { setUrunler(data||[]); setLoading(false) })
  }, [q])
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'48px 24px'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',color:'#1C1B2E',marginBottom:'8px'}}>
          {q ? `"${q}" için sonuçlar` : 'Arama'}
        </h1>
        <p style={{color:'#9CA3AF',fontSize:'13px',marginBottom:'32px'}}>{urunler.length} ürün bulundu</p>
        {loading ? <p>Yükleniyor...</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
export default function AramaPage() {
  return <Suspense fallback={null}><Icerik/></Suspense>
}
