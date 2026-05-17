'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Users } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function MusterilerPage() {
  const [musteriler, setMusteriler] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let q:any = supabase.from('site_users').select('*').order('created_at',{ascending:false})
    if(arama) q=q.or(`email.ilike.%${arama}%,ad.ilike.%${arama}%,soyad.ilike.%${arama}%`)
    q.then(({data}:any)=>{ setMusteriler(data||[]); setLoading(false) })
  },[arama])
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Müşteriler ({musteriler.length})</h1>
      </div>
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'16px 20px',marginBottom:'16px',display:'flex',gap:'12px'}}>
        <div style={{flex:1,display:'flex',alignItems:'center',gap:'8px',background:'#F8F7FC',borderRadius:'10px',padding:'0 14px'}}>
          <Search size={15} style={{color:'#9CA3AF'}}/>
          <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="İsim, e-posta ara..." style={{flex:1,background:'transparent',border:'none',padding:'10px 0',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/>
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#F8F7FC',borderBottom:'1px solid #F0ECF5'}}>
            {['Müşteri','E-posta','Telefon','Rol','Kayıt Tarihi'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9CA3AF'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} style={{padding:'24px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</td></tr>
            :musteriler.length===0?<tr><td colSpan={5} style={{padding:'48px',textAlign:'center'}}><Users size={32} style={{color:'#F0ECF5',margin:'0 auto 8px',display:'block'}}/><p style={{color:'#9CA3AF',fontSize:'13px'}}>Müşteri bulunamadı</p></td></tr>
            :musteriler.map((m,i)=>(
              <tr key={m.id} style={{borderBottom:'1px solid #F0ECF5',background:i%2===0?'#fff':'#FAFAF9'}}>
                <td style={{padding:'12px 16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#E07090,#3B9FCC)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff',flexShrink:0}}>{(m.ad||m.email||'?')[0].toUpperCase()}</div>
                    <span style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E'}}>{m.ad} {m.soyad}</span>
                  </div>
                </td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{m.email}</td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{m.telefon||'-'}</td>
                <td style={{padding:'12px 16px'}}><span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'50px',background:m.role==='admin'?'#EBF7FC':'#F8F7FC',color:m.role==='admin'?'#3B9FCC':'#9CA3AF'}}>{m.role}</span></td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{new Date(m.created_at).toLocaleDateString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
