'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function Popup() {
  const [goster, setGoster] = useState(false)
  const [ayar, setAyar] = useState<any>(null)

  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup','popup').then(({data}) => {
      if (!data?.length) return
      const a: any = {}
      data.forEach((item: any) => { a[item.anahtar] = item.deger })
      if (a.aktif !== '1') return
      // Tekrar gösterme kontrolü
      const tekrarSure = parseInt(a.tekrar_sure || '24') * 60 * 60 * 1000
      const sonGoster = localStorage.getItem('popup_son_goster')
      if (sonGoster && Date.now() - parseInt(sonGoster) < tekrarSure) return
      setAyar(a)
      const gecikme = parseInt(a.gecikme || '2') * 1000
      setTimeout(() => setGoster(true), gecikme)
    })
  }, [])

  const kapat = () => {
    setGoster(false)
    localStorage.setItem('popup_son_goster', Date.now().toString())
  }

  if (!goster || !ayar) return null

  return (
    <div style={{position:'fixed',inset:0,zIndex:999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}} onClick={kapat}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:ayar.arka_plan||'#FEF0F4',borderRadius:'24px',padding:'32px',maxWidth:'420px',width:'100%',position:'relative',textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,0.3)',animation:'fadeIn 0.3s ease'}}>
        {ayar.kapat_dugme !== '0' && (
          <button onClick={kapat} style={{position:'absolute',top:'12px',right:'12px',background:'rgba(0,0,0,0.08)',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',fontSize:'18px',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B7280'}}>×</button>
        )}
        {ayar.gorsel_url && (
          <img src={ayar.gorsel_url} alt="" style={{width:'100%',borderRadius:'14px',marginBottom:'20px',objectFit:'cover',maxHeight:'180px'}}/>
        )}
        {ayar.baslik && <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:400,color:'#1C1B2E',marginBottom:'12px'}}>{ayar.baslik}</h2>}
        {ayar.metin && <p style={{fontSize:'14px',color:'#6B7280',lineHeight:1.7,marginBottom:'20px'}}>{ayar.metin}</p>}
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {ayar.buton_yazi && ayar.buton_link && (
            <Link href={ayar.buton_link} onClick={kapat}
              style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'14px 24px',borderRadius:'50px',fontSize:'14px',fontWeight:700,textDecoration:'none',display:'block'}}>
              {ayar.buton_yazi}
            </Link>
          )}
          <button onClick={kapat} style={{background:'none',border:'none',color:'#9CA3AF',fontSize:'12px',cursor:'pointer',padding:'4px'}}>
            Kapat
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}
