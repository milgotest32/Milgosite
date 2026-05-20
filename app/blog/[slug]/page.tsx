import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = createServerClient()
  const { data } = await db.from('site_blog_yazilar').select('baslik,ozet,seo_title,seo_description,gorsel_url').eq('slug', slug).single()
  if (!data) return { title: 'Blog Yazısı Bulunamadı' }
  return { title: data.seo_title || data.baslik, description: data.seo_description || data.ozet, openGraph: { images: data.gorsel_url ? [{ url: data.gorsel_url }] : [] } }
}

export default async function BlogDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = createServerClient()
  const { data: yazi } = await db.from('site_blog_yazilar').select('*,site_blog_kategoriler(name),site_users(ad,soyad)').eq('slug', slug).single()
  if (!yazi || yazi.durum !== 'yayinda') notFound()
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'32px 24px'}}>
      <div style={{maxWidth:'760px',margin:'0 auto'}}>
        <nav style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#9CA3AF',marginBottom:'24px'}}>
          <Link href="/" style={{color:'#9CA3AF',textDecoration:'none'}}>Ana Sayfa</Link><ChevronRight size={12}/>
          <Link href="/blog" style={{color:'#9CA3AF',textDecoration:'none'}}>Blog</Link><ChevronRight size={12}/>
          <span style={{color:'#1C1B2E'}}>{yazi.baslik}</span>
        </nav>
        <div style={{background:'#fff',borderRadius:'24px',overflow:'hidden',border:'1px solid #F0ECF5'}}>
          {yazi.gorsel_url && <img src={yazi.gorsel_url} alt={yazi.baslik} style={{width:'100%',height:'340px',objectFit:'cover'}}/>}
          <div style={{padding:'36px'}}>
            {(yazi as any).site_blog_kategoriler && <span style={{fontSize:'10px',fontWeight:700,background:'#FEF0F4',color:'#E07090',padding:'4px 12px',borderRadius:'50px'}}>{(yazi as any).site_blog_kategoriler.name}</span>}
            <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',color:'#1C1B2E',margin:'16px 0 12px',lineHeight:1.2}}>{yazi.baslik}</h1>
            <div style={{display:'flex',alignItems:'center',gap:'16px',fontSize:'12px',color:'#9CA3AF',marginBottom:'24px',paddingBottom:'24px',borderBottom:'1px solid #F0ECF5'}}>
              {(yazi as any).site_users && <span>{(yazi as any).site_users.ad} {(yazi as any).site_users.soyad}</span>}
              <span>{new Date(yazi.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</span>
              <span style={{display:'flex',alignItems:'center',gap:'4px'}}><Clock size={12}/>{yazi.okuma_suresi} dk</span>
            </div>
            {yazi.icerik && <div style={{fontSize:'15px',lineHeight:'1.9',color:'#374151',whiteSpace:'pre-wrap'}} dangerouslySetInnerHTML={{__html:yazi.icerik?.replace(/<script[^>]*>.*?<\/script>/gi,'').replace(/on\w+="[^"]*"/gi,'') || ''}}/>}
          </div>
        </div>
      </div>
    </div>
  )
}
