'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'
export default function KuponlarPage() {
  const [kuponlar, setKuponlar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({goster:false,kod:'',ad:'',tip:'yuzde',deger:'10',min_tutar:'0',kullanim_limiti:''})
  const yukle = ()=>{ supabase.from('site_kuponlar').select('*').order('created_at',{ascending:false}).then(({data})=>{ setKuponlar(data||[]); setLoading(false) }) }
  useEffect(()=>{ yukle() },[])
  const ekle = async()=>{
    if(!form.kod||!form.deger){toast.error('Kod ve değer zorunlu');return}
    await supabase.from('site_kuponlar').insert({kod:form.kod.toUpperCase(),ad:form.ad,tip:form.tip,deger:parseFloat(form.deger),min_tutar:parseFloat(form.min_tutar||'0'),kullanim_limiti:form.kullanim_limiti?parseInt(form.kullanim_limiti):null,aktif:true})
    toast.success('Kupon eklendi'); setForm({goster:false,kod:'',ad:'',tip:'yuzde',deger:'10',min_tutar:'0',kullanim_limiti:''}); yukle()
  }
  const sil = async(id:string,kod:string)=>{ if(!confirm(`"${kod}" silinsin mi?`))return; await supabase.from('site_kuponlar').delete().eq('id',id); toast.success('Silindi'); yukle() }
  const toggleAktif = async(id:string,aktif:boolean)=>{ await supabase.from('site_kuponlar').update({aktif}).eq('id',id); setKuponlar(prev=>prev.map(k=>k.id===id?{...k,aktif}:k)) }
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Kuponlar & Kampanyalar</h1>
        <button onClick={()=>setForm({...form,goster:true})} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}><Plus size={15}/>Kupon Ekle</button>
      </div>
      {form.goster&&(<div style={{background:'#fff',borderRadius:'16px',border:'2px solid #F4A7B9',padding:'24px',marginBottom:'16px'}}>
        <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Yeni Kupon</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'12px',marginBottom:'12px'}}>
          {[['Kupon Kodu *','kod'],['Ad','ad'],['Değer *','deger'],['Min. Sepet (₺)','min_tutar'],['Kullanım Limiti','kullanim_limiti']].map(([l,k])=>(
            <div key={k}><label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'5px'}}>{l}</label>
            <input value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k==='kod'?'MILGO10':''} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/></div>
          ))}
          <div><label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'5px'}}>Tip</label>
          <select value={form.tip} onChange={e=>setForm({...form,tip:e.target.value})} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}>
            <option value="yuzde">Yüzde (%)</option><option value="sabit">Sabit (₺)</option>
          </select></div>
        </div>
        <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
          <button onClick={()=>setForm({...form,goster:false})} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
          <button onClick={ekle} style={{padding:'10px 20px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Kaydet</button>
        </div>
      </div>)}
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#F8F7FC',borderBottom:'1px solid #F0ECF5'}}>
            {['Kod','Ad','Tip/Değer','Kullanım','Durum','İşlem'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9CA3AF'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} style={{padding:'24px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</td></tr>
            :kuponlar.map((k,i)=>(
              <tr key={k.id} style={{borderBottom:'1px solid #F0ECF5',background:i%2===0?'#fff':'#FAFAF9'}}>
                <td style={{padding:'12px 16px',fontFamily:'monospace',fontSize:'14px',fontWeight:700,color:'#E07090'}}>{k.kod}</td>
                <td style={{padding:'12px 16px',fontSize:'13px',color:'#6B7280'}}>{k.ad||'-'}</td>
                <td style={{padding:'12px 16px',fontSize:'13px',color:'#1C1B2E',fontWeight:600}}>{k.tip==='yuzde'?`%${k.deger}`:`₺${k.deger}`}</td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280'}}>{k.kullanim_sayisi}/{k.kullanim_limiti||'∞'}</td>
                <td style={{padding:'12px 16px'}}>
                  <button onClick={()=>toggleAktif(k.id,!k.aktif)} style={{fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px',border:'none',cursor:'pointer',background:k.aktif?'#F0FDF4':'#FEF2F2',color:k.aktif?'#22C55E':'#EF4444'}}>{k.aktif?'Aktif':'Pasif'}</button>
                </td>
                <td style={{padding:'12px 16px'}}>
                  <button onClick={()=>sil(k.id,k.kod)} style={{width:'30px',height:'30px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
