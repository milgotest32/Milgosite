'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/product/ProductCard'
import type { Urun } from '@/lib/types'
import { SlidersHorizontal } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SIRALA = [
  { v:'newest', ad:'En Yeni' },
  { v:'fiyat-as', ad:'Fiyat: Düşük → Yüksek' },
  { v:'fiyat-us', ad:'Fiyat: Yüksek → Düşük' },
]

function Icerik() {
  const params = useSearchParams()
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  const [sira, setSira] = useState('newest')
  const arama = params.get('q') || ''

  useEffect(() => {
    setLoading(true)
    let q: any = supabase.from('site_products').select('*, site_product_images(*), site_kategoriler(name,slug)').eq('durum', 'active')
    if (arama) q = q.or(`name.ilike.%${arama}%,aciklama.ilike.%${arama}%`)
    if (sira === 'fiyat-as') q = q.order('fiyat')
    else if (sira === 'fiyat-us') q = q.order('fiyat', { ascending: false })
    else q = q.order('created_at', { ascending: false })
    q.then(({ data }: any) => { setUrunler(data || []); setLoading(false) })
  }, [arama, sira])

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #F0ECF5',padding:'32px 24px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto'}}>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',fontWeight:400,color:'#1C1B2E',marginBottom:'8px'}}>
            {arama ? `"${arama}" sonuçları` : 'Tüm Ürünler'}
          </h1>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <p style={{fontSize:'13px',color:'#9CA3AF'}}>{urunler.length} ürün listeleniyor</p>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <SlidersHorizontal size={14} style={{color:'#9CA3AF'}}/>
              <select value={sira} onChange={e=>setSira(e.target.value)} style={{fontSize:'13px',color:'#1C1B2E',background:'#F0EEF8',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'8px 12px',outline:'none',fontFamily:'inherit'}}>
                {SIRALA.map(s=><option key={s.v} value={s.v}>{s.ad}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
        {loading ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {[1,2,3,4,5,6,7,8].map(i=><div key={i} style={{borderRadius:'20px',background:'#fff',aspectRatio:'3/4',animation:'pulse 1.5s ease-in-out infinite'}}/>)}
          </div>
        ) : urunler.length === 0 ? (
          <div style={{textAlign:'center',padding:'80px 0'}}>
            <div style={{fontSize:'64px',marginBottom:'16px'}}>🔍</div>
            <p style={{fontSize:'18px',fontWeight:600,color:'#1C1B2E',marginBottom:'8px'}}>Ürün bulunamadı</p>
            <p style={{fontSize:'14px',color:'#9CA3AF'}}>Farklı arama terimi deneyin</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr)',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u}/>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UrunlerPage() {
  return <Suspense fallback={<div style={{minHeight:'100vh',background:'#F0EEF8'}}/>}><Icerik/></Suspense>
}
