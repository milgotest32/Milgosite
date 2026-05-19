'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'
const slugify = (t:string)=>t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({goster:false,name:'',slug:'',aciklama:'',sira:'0'})
  const yukle = ()=>{ supabase.from('site_kategoriler').select('*').order('sira').then(({data})=>{ setKategoriler(data||[]); setLoading(false) }) }
  useEffect(()=>{ yukle() },[])
  const ekle = async()=>{
    if(!form.name){toast.error('Ad zorunlu');return}
    await supabase.from('site_kategoriler').insert({name:form.name,slug:form.slug||slugify(form.name),aciklama:form.aciklama,sira:parseInt(form.sira),aktif:true})
    toast.success('Kategori eklendi'); setForm({goster:false,name:'',slug:'',aciklama:'',sira:'0'}); yukle()
  }
  const sil = async(id:string,name:string)=>{
    if(!confirm(`"${name}" silinsin mi?\n\nBu kategorideki ürünler kategorisiz kalacak.`))return
    // Önce ürünleri kategorisiz yap
    await supabase.from('site_products').update({kategori_id:null}).eq('kategori_id',id)
    await supabase.from('site_kategoriler').delete().eq('id',id)
    toast.success('Silindi'); yukle()
  }
  const toggleAktif = async(id:string,aktif:boolean)=>{ await supabase.from('site_kategoriler').update({aktif}).eq('id',id); setKategoriler(prev=>prev.map(k=>k.id===id?{...k,aktif}:k)) }
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Kategoriler</h1>
        <button onClick={()=>setForm({...form,goster:true})} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}><Plus size={15}/>Ekle</button>
      </div>
      {form.goster&&(<div style={{background:'#fff',borderRadius:'16px',border:'2px solid #F4A7B9',padding:'24px',marginBottom:'16px'}}>
        <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Yeni Kategori</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
          {[['Ad *','name'],['Slug','slug'],['Açıklama','aciklama'],['Sıra','sira']].map(([l,k])=>(
            <div key={k}><label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'5px'}}>{l}</label>
            <input value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const}}/></div>
          ))}
        </div>
        <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
          <button onClick={()=>setForm({...form,goster:false})} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
          <button onClick={ekle} style={{padding:'10px 20px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>Kaydet</button>
        </div>
      </div>)}
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#F8F7FC',borderBottom:'1px solid #F0ECF5'}}>
            {['Ad','Slug','Sıra','Durum','İşlem'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9CA3AF'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5} style={{padding:'24px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</td></tr>
            :kategoriler.map((k,i)=>(
              <tr key={k.id} style={{borderBottom:'1px solid #F0ECF5',background:i%2===0?'#fff':'#FAFAF9'}}>
                <td style={{padding:'12px 16px',fontSize:'14px',fontWeight:600,color:'#1C1B2E'}}>{k.name}</td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280',fontFamily:'monospace'}}>{k.slug}</td>
                <td style={{padding:'12px 16px',fontSize:'13px',color:'#6B7280'}}>{k.sira}</td>
                <td style={{padding:'12px 16px'}}>
                  <button onClick={()=>toggleAktif(k.id,!k.aktif)} style={{fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px',border:'none',cursor:'pointer',background:k.aktif?'#F0FDF4':'#FEF2F2',color:k.aktif?'#22C55E':'#EF4444'}}>{k.aktif?'Aktif':'Pasif'}</button>
                </td>
                <td style={{padding:'12px 16px'}}>
                  <button onClick={()=>sil(k.id,k.name)} style={{width:'30px',height:'30px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
