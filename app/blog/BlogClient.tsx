'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowRight } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function BlogClient() {
  const [yazilar, setYazilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    supabase.from('site_blog_yazilar').select('*,site_blog_kategoriler(name),site_users(ad,soyad)').eq('durum','yayinda').order('created_at',{ascending:false}).limit(20)
      .then(({data}:any)=>{ setYazilar(data||[]); setLoading(false) })
  },[])
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{background:'linear-gradient(135deg,#FEF0F4,#EBF7FC)',padding:'48px 24px',textAlign:'center',marginBottom:'0'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'40px',color:'#1C1B2E',marginBottom:'8px'}}>Blog & Tarifler</h1>
        <p style={{color:'#6B7280',fontSize:'14px'}}>Güncel haberler, sağlıklı tarifler ve çiftlik hikayeleri</p>
      </div>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'48px 24px'}}>
        {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p>
        : yazilar.length===0 ? (
          <div style={{background:'#fff',borderRadius:'24px',padding:'64px',textAlign:'center',border:'1px solid #F0ECF5'}}>
            <p style={{color:'#9CA3AF',fontSize:'14px'}}>Henüz blog yazısı yok</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'20px'}}>
            {yazilar.map(y=>(
              <Link key={y.id} href={`/blog/${y.slug}`} style={{background:'#fff',borderRadius:'20px',overflow:'hidden',textDecoration:'none',border:'1px solid #F0ECF5',display:'block',transition:'transform 0.25s',boxShadow:'0 2px 12px rgba(224,112,144,0.06)'}}>
                {y.gorsel_url && <img src={y.gorsel_url} alt={y.baslik} style={{width:'100%',height:'180px',objectFit:'cover'}}/>}
                <div style={{padding:'20px'}}>
                  {y.site_blog_kategoriler && <span style={{fontSize:'10px',fontWeight:700,background:'#FEF0F4',color:'#E07090',padding:'3px 10px',borderRadius:'50px',textTransform:'uppercase',letterSpacing:'0.1em'}}>{y.site_blog_kategoriler.name}</span>}
                  <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',color:'#1C1B2E',margin:'10px 0 8px',lineHeight:1.3}}>{y.baslik}</h2>
                  <p style={{fontSize:'13px',color:'#6B7280',lineHeight:'1.6',marginBottom:'14px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{y.ozet}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'11px',color:'#9CA3AF'}}>
                    <span>{new Date(y.created_at).toLocaleDateString('tr-TR')}</span>
                    <span style={{color:'#E07090',fontWeight:600,display:'flex',alignItems:'center',gap:'4px'}}>Oku <ArrowRight size={12}/></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
