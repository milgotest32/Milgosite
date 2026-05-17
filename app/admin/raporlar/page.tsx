'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { BarChart2, TrendingUp, Package } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function RaporlarPage() {
  const [stats, setStats] = useState<any>({})
  const [enCokSatan, setEnCokSatan] = useState<any[]>([])
  useEffect(()=>{
    supabase.from('site_siparisler').select('toplam,created_at,durum').eq('odeme_durumu','odendi').then(({data})=>{
      const toplam = (data||[]).reduce((t:number,s:any)=>t+(s.toplam||0),0)
      const bugun = new Date(); bugun.setHours(0,0,0,0)
      const hafta = new Date(); hafta.setDate(hafta.getDate()-7)
      const ay = new Date(); ay.setDate(ay.getDate()-30)
      setStats({
        toplam, bugun:(data||[]).filter((s:any)=>new Date(s.created_at)>=bugun).reduce((t:number,s:any)=>t+(s.toplam||0),0),
        hafta:(data||[]).filter((s:any)=>new Date(s.created_at)>=hafta).reduce((t:number,s:any)=>t+(s.toplam||0),0),
        ay:(data||[]).filter((s:any)=>new Date(s.created_at)>=ay).reduce((t:number,s:any)=>t+(s.toplam||0),0),
        siparis_sayisi:(data||[]).length
      })
    })
    supabase.from('site_siparis_kalemleri').select('urun_ad,adet,toplam').then(({data})=>{
      const grouped: Record<string,{adet:number,gelir:number}> = {}
      data?.forEach((k:any)=>{ if(!grouped[k.urun_ad]) grouped[k.urun_ad]={adet:0,gelir:0}; grouped[k.urun_ad].adet+=k.adet; grouped[k.urun_ad].gelir+=k.toplam })
      setEnCokSatan(Object.entries(grouped).sort((a,b)=>b[1].adet-a[1].adet).slice(0,10).map(([ad,d])=>({ad,...d})))
    })
  },[])
  return (
    <div>
      <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'24px'}}>Raporlar & Analitik</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {[['Bugün',stats.bugun],['Bu Hafta',stats.hafta],['Bu Ay',stats.ay],['Toplam Gelir',stats.toplam]].map(([l,v])=>(
          <div key={l} style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <div style={{fontSize:'12px',color:'#9CA3AF',marginBottom:'8px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.1em'}}>{l}</div>
            <div style={{fontSize:'24px',fontWeight:700,color:'#1C1B2E',fontFamily:'"Playfair Display",serif'}}>₺{(v||0).toLocaleString('tr-TR',{maximumFractionDigits:0})}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
        <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>En Çok Satan Ürünler</h2>
        {enCokSatan.length===0?<p style={{color:'#9CA3AF',fontSize:'13px'}}>Veri yok</p>:(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {enCokSatan.map((u,i)=>(
              <div key={u.ad} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:i===0?'linear-gradient(135deg,#FEF0F4,#EBF7FC)':'#F8F7FC',borderRadius:'10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{width:'24px',height:'24px',background:i===0?'linear-gradient(135deg,#E07090,#3B9FCC)':'#E8E4F0',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:i===0?'#fff':'#9CA3AF',flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E'}}>{u.ad}</span>
                </div>
                <div style={{display:'flex',gap:'16px',fontSize:'12px'}}>
                  <span style={{color:'#6B7280'}}>{u.adet} adet</span>
                  <span style={{fontWeight:700,color:'#E07090'}}>₺{u.gelir.toLocaleString('tr-TR',{maximumFractionDigits:0})}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
