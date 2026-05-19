'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Search, Filter } from 'lucide-react'
export const dynamic = 'force-dynamic'

const DURUMLAR = ['all','bekliyor','onaylandi','kargoda','teslim','iptal']
const DURUM_RENK: Record<string,{bg:string,tx:string}> = {
  bekliyor:{bg:'#FEF3C7',tx:'#D97706'}, onaylandi:{bg:'#EBF7FC',tx:'#3B9FCC'},
  kargoda:{bg:'#FAF5FF',tx:'#8B5CF6'}, teslim:{bg:'#F0FDF4',tx:'#22C55E'}, iptal:{bg:'#FEF2F2',tx:'#EF4444'}
}

export default function AdminSiparislerPage() {
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [durum, setDurum] = useState('all')
  const [arama, setArama] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let q: any = supabase.from('site_siparisler').select('*,site_siparis_kalemleri(*)').order('created_at',{ascending:false}).limit(100)
    if (durum !== 'all') q = q.eq('durum', durum)
    if (arama) q = q.or(`siparis_no.ilike.%${arama}%,musteri_email.ilike.%${arama}%,musteri_ad.ilike.%${arama}%`)
    q.then(({data}:any)=>{ setSiparisler(data||[]); setLoading(false) })
  }, [durum, arama])

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    await supabase.from('site_siparisler').update({ durum: yeniDurum, updated_at: new Date().toISOString() }).eq('id', id)
    setSiparisler(prev => prev.map(s => s.id===id ? {...s, durum: yeniDurum} : s))
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Siparişler</h1>
      </div>

      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'16px 20px',marginBottom:'16px',display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
        <div style={{flex:1,display:'flex',alignItems:'center',gap:'8px',background:'#F8F7FC',borderRadius:'10px',padding:'0 14px',minWidth:'200px'}}>
          <Search size={15} style={{color:'#9CA3AF',flexShrink:0}}/>
          <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Sipariş no, müşteri ara..." style={{flex:1,background:'transparent',border:'none',padding:'10px 0',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
        </div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {DURUMLAR.map(d=>{
            const renk = DURUM_RENK[d] || {bg:'#F8F7FC',tx:'#9CA3AF'}
            return (
              <button key={d} onClick={()=>setDurum(d)} style={{padding:'6px 14px',borderRadius:'50px',border:'none',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:'inherit',background:durum===d?(d==='all'?'linear-gradient(135deg,#E07090,#3B9FCC)':renk.bg):'#F8F7FC',color:durum===d?(d==='all'?'#fff':renk.tx):'#9CA3AF'}}>
                {d==='all'?'Tümü':d}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F8F7FC',borderBottom:'1px solid #F0ECF5'}}>
              {['Sipariş No','Müşteri','Tarih','Tutar','Ürün','Durum','Güncelle'].map(h=>(
                <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9CA3AF'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{padding:'32px',textAlign:'center',color:'#9CA3AF',fontSize:'13px'}}>Yükleniyor...</td></tr>
            : siparisler.length===0 ? <tr><td colSpan={7} style={{padding:'32px',textAlign:'center',color:'#9CA3AF',fontSize:'13px'}}>Sipariş bulunamadı</td></tr>
            : siparisler.map((s,i)=>{
              const d = DURUM_RENK[s.durum] || {bg:'#F8F7FC',tx:'#9CA3AF'}
              return (
                <tr key={s.id} style={{borderBottom:'1px solid #F0ECF5',background:i%2===0?'#fff':'#FAFAF9'}}>
                  <td style={{padding:'12px 16px'}}><Link href={`/admin/siparisler/${s.id}`} style={{fontSize:'12px',fontWeight:700,color:'#E07090',textDecoration:'none',fontFamily:'monospace'}}>#{s.siparis_no}</Link></td>
                  <td style={{padding:'12px 16px'}}>
                    <div style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E'}}>{s.musteri_ad}</div>
                    <div style={{fontSize:'11px',color:'#9CA3AF'}}>{s.musteri_email}</div>
                  </td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{new Date(s.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={{padding:'12px 16px',fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>₺{s.toplam?.toFixed(2)}</td>
                  <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{s.site_siparis_kalemleri?.length||0} ürün</td>
                  <td style={{padding:'12px 16px'}}><span style={{fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px',background:d.bg,color:d.tx}}>{s.durum}</span></td>
                  <td style={{padding:'12px 16px'}}>
                    <select value={s.durum} onChange={e=>durumGuncelle(s.id,e.target.value)} style={{background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'6px 10px',fontSize:'12px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
                      {DURUMLAR.filter(d=>d!=='all').map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
