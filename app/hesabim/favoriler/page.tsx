'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
export const dynamic = 'force-dynamic'

export default function FavorilerPage() {
  const [urunler, setUrunler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({data})=>{
      if (!data.session) { router.push('/giris'); return }
      const { data: favs } = await supabase.from('site_favoriler').select('product_id,site_products(*,site_product_images(*))').eq('user_id',data.session.user.id)
      setUrunler((favs||[]).map((f:any)=>f.site_products).filter(Boolean))
      setLoading(false)
    })
  }, [router])

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'32px 24px'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto'}}>
        <Link href="/hesabim" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'24px'}}><ArrowLeft size={14}/>Hesabıma Dön</Link>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',color:'#1C1B2E',marginBottom:'24px'}}>Favorilerim <span style={{fontSize:'18px',color:'#9CA3AF'}}>({urunler.length})</span></h1>
        {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p>
        : urunler.length===0 ? (
          <div style={{background:'#fff',borderRadius:'24px',padding:'64px',textAlign:'center',border:'1px solid #F0ECF5'}}>
            <Heart size={48} style={{color:'#F4A7B9',margin:'0 auto 16px',display:'block'}}/>
            <p style={{fontSize:'16px',fontWeight:600,color:'#1C1B2E',marginBottom:'8px'}}>Henüz favori yok</p>
            <Link href="/urunler" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'12px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700}}>Ürünlere Göz At</Link>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
            {urunler.map(u=><ProductCard key={u.id} urun={u}/>)}
          </div>
        )}
      </div>
    </div>
  )
}
