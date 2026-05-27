'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, X, Save, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const slugify = (t:string) => t.toLowerCase()
  .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
  .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

const inpStyle: React.CSSProperties = {width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',boxSizing:'border-box'}
const labelStyle: React.CSSProperties = {display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'5px'}

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [duzenlenen, setDuzenlenen] = useState<any|null>(null)
  const [yeniForm, setYeniForm] = useState({goster:false,name:'',slug:'',aciklama:'',sira:'0',
    seo_title:'',seo_description:'',seo_keywords:''})
  const [sekme, setSekme] = useState<'genel'|'seo'>('genel')

  const yukle = () => {
    supabase.from('site_kategoriler').select('*').order('sira').then(({data})=>{
      setKategoriler(data||[])
      setLoading(false)
    })
  }
  useEffect(()=>{ yukle() },[])

  const ekle = async () => {
    if (!yeniForm.name){toast.error('Ad zorunlu');return}
    await supabase.from('site_kategoriler').insert({
      name:yeniForm.name,
      slug:yeniForm.slug||slugify(yeniForm.name),
      aciklama:yeniForm.aciklama,
      sira:parseInt(yeniForm.sira)||0,
      aktif:true,
      seo_title:yeniForm.seo_title,
      seo_description:yeniForm.seo_description,
      seo_keywords:yeniForm.seo_keywords,
    })
    toast.success('Kategori eklendi')
    setYeniForm({goster:false,name:'',slug:'',aciklama:'',sira:'0',seo_title:'',seo_description:'',seo_keywords:''})
    setSekme('genel')
    yukle()
  }

  const guncelle = async () => {
    if (!duzenlenen) return
    await supabase.from('site_kategoriler').update({
      name:duzenlenen.name,
      slug:duzenlenen.slug||slugify(duzenlenen.name),
      aciklama:duzenlenen.aciklama,
      sira:parseInt(duzenlenen.sira)||0,
      seo_title:duzenlenen.seo_title||'',
      seo_description:duzenlenen.seo_description||'',
      seo_keywords:duzenlenen.seo_keywords||'',
    }).eq('id',duzenlenen.id)
    toast.success('Kategori güncellendi')
    setDuzenlenen(null)
    setSekme('genel')
    yukle()
  }

  const sil = async (id:string, name:string) => {
    if (!confirm(`"${name}" silinsin mi?\n\nBu kategorideki ürünler kategorisiz kalacak.`)) return
    await supabase.from('site_products').update({kategori_id:null}).eq('kategori_id',id)
    await supabase.from('site_kategoriler').delete().eq('id',id)
    toast.success('Silindi')
    yukle()
  }

  const toggleAktif = async (id:string, aktif:boolean) => {
    await supabase.from('site_kategoriler').update({aktif}).eq('id',id)
    setKategoriler(prev=>prev.map(k=>k.id===id?{...k,aktif}:k))
  }

  const SekmeBtn = ({id,label}:{id:'genel'|'seo',label:string}) => (
    <button onClick={()=>setSekme(id)}
      style={{padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:'12px',fontWeight:700,
        background:sekme===id?'linear-gradient(135deg,#E07090,#3B9FCC)':'transparent',
        color:sekme===id?'#fff':'#9CA3AF'}}>
      {label}
    </button>
  )

  const FormIcerik = ({data,setData}:{data:any,setData:(v:any)=>void}) => (
    <div>
      <div style={{display:'flex',gap:'4px',marginBottom:'20px',background:'#F8F7FC',padding:'4px',borderRadius:'10px',width:'fit-content'}}>
        <SekmeBtn id="genel" label="Genel Bilgiler"/>
        <SekmeBtn id="seo" label="🔍 SEO Ayarları"/>
      </div>

      {sekme==='genel' ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'12px'}}>
          <div>
            <label style={labelStyle}>Ad *</label>
            <input value={data.name||''} onChange={e=>{
              const v=e.target.value
              setData({...data,name:v,slug:data.slug||slugify(v)})
            }} style={inpStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input value={data.slug||''} onChange={e=>setData({...data,slug:e.target.value})} style={inpStyle}/>
          </div>
          <div style={{gridColumn:'1/-1'}}>
            <label style={labelStyle}>Açıklama</label>
            <textarea value={data.aciklama||''} onChange={e=>setData({...data,aciklama:e.target.value})}
              rows={3} style={{...inpStyle,resize:'none'}}/>
          </div>
          <div>
            <label style={labelStyle}>Sıra Numarası</label>
            <input type="number" value={data.sira||'0'} onChange={e=>setData({...data,sira:e.target.value})} style={inpStyle}/>
          </div>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:'10px',padding:'12px 14px',fontSize:'12px',color:'#1C1B2E',display:'flex',gap:'8px'}}>
            <Globe size={14} style={{flexShrink:0,marginTop:'2px',color:'#3B9FCC'}}/>
            <span>SEO ayarları bu kategorinin Google arama sonuçlarında nasıl görüneceğini belirler. Boş bırakılırsa kategori adı kullanılır.</span>
          </div>
          <div>
            <label style={labelStyle}>SEO Başlık (max 60 karakter)</label>
            <input value={data.seo_title||''} onChange={e=>setData({...data,seo_title:e.target.value})}
              maxLength={60} placeholder={data.name||'Kategori başlığı'} style={inpStyle}/>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginTop:'4px'}}>{(data.seo_title||'').length}/60 karakter</p>
          </div>
          <div>
            <label style={labelStyle}>Meta Açıklama (max 160 karakter)</label>
            <textarea value={data.seo_description||''} onChange={e=>setData({...data,seo_description:e.target.value})}
              maxLength={160} rows={3} placeholder="Kategori açıklaması..." style={{...inpStyle,resize:'none'}}/>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginTop:'4px'}}>{(data.seo_description||'').length}/160 karakter</p>
          </div>
          <div>
            <label style={labelStyle}>Anahtar Kelimeler (virgülle ayır)</label>
            <input value={data.seo_keywords||''} onChange={e=>setData({...data,seo_keywords:e.target.value})}
              placeholder="organik, taze, doğal..." style={inpStyle}/>
          </div>
          {/* Önizleme */}
          {(data.name||data.seo_title) && (
            <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:'10px',padding:'14px 16px'}}>
              <p style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#9CA3AF',marginBottom:'8px'}}>Google Önizleme</p>
              <p style={{fontSize:'14px',fontWeight:600,color:'#1A73E8',margin:'0 0 2px'}}>{data.seo_title||data.name||'Kategori Adı'}</p>
              <p style={{fontSize:'12px',color:'#006621',margin:'0 0 4px'}}>milgo.com.tr › {data.slug||slugify(data.name||'kategori')}</p>
              <p style={{fontSize:'12px',color:'#4D5156',margin:0,lineHeight:'1.5'}}>{data.seo_description||data.aciklama||'Açıklama girilmemiş.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Kategoriler</h1>
        <button onClick={()=>setYeniForm({...yeniForm,goster:true})}
          style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Plus size={15}/>Kategori Ekle
        </button>
      </div>

      {/* Yeni Kategori Formu */}
      {yeniForm.goster && (
        <div style={{background:'#fff',borderRadius:'16px',border:'2px solid #F4A7B9',padding:'24px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',margin:0}}>Yeni Kategori</h2>
            <button onClick={()=>{setYeniForm({...yeniForm,goster:false});setSekme('genel')}} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}><X size={18}/></button>
          </div>
          <FormIcerik data={yeniForm} setData={(v)=>setYeniForm({...yeniForm,...v})}/>
          <div style={{display:'flex',gap:'8px',justifyContent:'flex-end',marginTop:'20px'}}>
            <button onClick={()=>setYeniForm({...yeniForm,goster:false})} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
            <button onClick={ekle} style={{padding:'10px 20px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'6px'}}>
              <Save size={13}/>Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Düzenleme Paneli */}
      {duzenlenen && (
        <div style={{background:'#fff',borderRadius:'16px',border:'2px solid #3B9FCC',padding:'24px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',margin:0}}>✏️ {duzenlenen.name} — Düzenle</h2>
            <button onClick={()=>{setDuzenlenen(null);setSekme('genel')}} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}><X size={18}/></button>
          </div>
          <FormIcerik data={duzenlenen} setData={setDuzenlenen}/>
          <div style={{display:'flex',gap:'8px',justifyContent:'flex-end',marginTop:'20px'}}>
            <button onClick={()=>setDuzenlenen(null)} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
            <button onClick={guncelle} style={{padding:'10px 20px',background:'linear-gradient(135deg,#3B9FCC,#22C55E)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'6px'}}>
              <Save size={13}/>Güncelle
            </button>
          </div>
        </div>
      )}

      {/* Tablo */}
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#F8F7FC',borderBottom:'1px solid #F0ECF5'}}>
              {['Ad','Slug','SEO','Sıra','Durum','İşlem'].map(h=>(
                <th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#9CA3AF'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{padding:'24px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</td></tr>
            ) : kategoriler.length===0 ? (
              <tr><td colSpan={6} style={{padding:'24px',textAlign:'center',color:'#9CA3AF'}}>Henüz kategori yok</td></tr>
            ) : kategoriler.map((k,i)=>(
              <tr key={k.id} style={{borderBottom:'1px solid #F0ECF5',background:i%2===0?'#fff':'#FAFAF9'}}>
                <td style={{padding:'12px 16px',fontSize:'14px',fontWeight:600,color:'#1C1B2E'}}>{k.name}</td>
                <td style={{padding:'12px 16px',fontSize:'12px',color:'#6B7280',fontFamily:'monospace'}}>{k.slug}</td>
                <td style={{padding:'12px 16px'}}>
                  {k.seo_title ? (
                    <span style={{fontSize:'11px',background:'#F0FDF4',color:'#22C55E',padding:'2px 8px',borderRadius:'50px',fontWeight:600}}>✓ Ayarlı</span>
                  ) : (
                    <span style={{fontSize:'11px',background:'#FEF3C7',color:'#D97706',padding:'2px 8px',borderRadius:'50px',fontWeight:600}}>Boş</span>
                  )}
                </td>
                <td style={{padding:'12px 16px',fontSize:'13px',color:'#6B7280'}}>{k.sira}</td>
                <td style={{padding:'12px 16px'}}>
                  <button onClick={()=>toggleAktif(k.id,!k.aktif)}
                    style={{fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px',border:'none',cursor:'pointer',
                      background:k.aktif?'#F0FDF4':'#FEF2F2',color:k.aktif?'#22C55E':'#EF4444'}}>
                    {k.aktif?'Aktif':'Pasif'}
                  </button>
                </td>
                <td style={{padding:'12px 16px'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={()=>{setDuzenlenen({...k});setSekme('genel')}}
                      style={{width:'30px',height:'30px',background:'#EBF7FC',border:'none',borderRadius:'8px',color:'#3B9FCC',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                      title="Düzenle">
                      <Pencil size={13}/>
                    </button>
                    <button onClick={()=>sil(k.id,k.name)}
                      style={{width:'30px',height:'30px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                      title="Sil">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
