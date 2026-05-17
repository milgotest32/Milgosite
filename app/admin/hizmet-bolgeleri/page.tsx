'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, MapPin, Trash2, Edit, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function HizmetBolgeleriPage() {
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [yeniForm, setYeniForm] = useState({ goster: false, name:'', aciklama:'', kargo_ucreti:'0', min_siparis:'0', renk:'#E07090' })
  const [kmzUrl, setKmzUrl] = useState('')

  const yukle = () => {
    supabase.from('site_hizmet_bolgeleri').select('*').order('created_at',{ascending:false}).then(({data})=>{ setBolgeler(data||[]); setLoading(false) })
  }
  useEffect(()=>{ yukle() },[])

  const ekle = async () => {
    if (!yeniForm.name) { toast.error('Bölge adı zorunludur'); return }
    await supabase.from('site_hizmet_bolgeleri').insert({
      name: yeniForm.name, aciklama: yeniForm.aciklama,
      kargo_ucreti: parseFloat(yeniForm.kargo_ucreti),
      min_siparis: parseFloat(yeniForm.min_siparis),
      renk: yeniForm.renk, aktif: true
    })
    toast.success('Hizmet bölgesi eklendi')
    setYeniForm({goster:false,name:'',aciklama:'',kargo_ucreti:'0',min_siparis:'0',renk:'#E07090'})
    yukle()
  }

  const aktifDegistir = async (id:string, aktif:boolean) => {
    await supabase.from('site_hizmet_bolgeleri').update({ aktif }).eq('id',id)
    setBolgeler(prev=>prev.map(b=>b.id===id?{...b,aktif}:b))
    toast.success(aktif?'Bölge aktif edildi':'Bölge pasif edildi')
  }

  const sil = async (id:string) => {
    if (!confirm('Bu bölgeyi silmek istediğinizden emin misiniz?')) return
    await supabase.from('site_hizmet_bolgeleri').delete().eq('id',id)
    toast.success('Bölge silindi')
    yukle()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>KMZ Hizmet Bölgeleri</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Hizmet verilen coğrafi alanları yönetin</p>
        </div>
        <button onClick={()=>setYeniForm({...yeniForm,goster:true})} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'none',fontFamily:'inherit'}}>
          <Plus size={15}/>Bölge Ekle
        </button>
      </div>

      {/* KMZ Yükleme */}
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px',marginBottom:'16px'}}>
        <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>KMZ/GeoJSON Yükleme</h2>
        <p style={{fontSize:'13px',color:'#9CA3AF',marginBottom:'16px'}}>KMZ veya GeoJSON dosyasının URL'ini girin. Dosya Supabase Storage'a yüklenmiş olmalıdır.</p>
        <div style={{display:'flex',gap:'8px'}}>
          <input value={kmzUrl} onChange={e=>setKmzUrl(e.target.value)} placeholder="https://... KMZ veya GeoJSON URL" style={{flex:1,background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
          <button onClick={()=>toast.success('KMZ yüklendi (demo)')} style={{background:'#1C1B2E',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 20px',fontSize:'13px',fontWeight:700,cursor:'none',fontFamily:'inherit'}}>Yükle</button>
        </div>
        <div style={{marginTop:'12px',background:'#EBF7FC',borderRadius:'12px',padding:'12px 16px',fontSize:'12px',color:'#3B9FCC'}}>
          <strong>Sistem Akışı:</strong> Kullanıcı ödeme adresini girer → Adres geocode edilir → Koordinat KMZ polygon içinde mi kontrol edilir → İçindeyse checkout devam eder, değilse engellenir.
        </div>
      </div>

      {/* Yeni bölge formu */}
      {yeniForm.goster && (
        <div style={{background:'#fff',borderRadius:'16px',border:'2px solid #F4A7B9',padding:'24px',marginBottom:'16px'}}>
          <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Yeni Bölge</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Bölge Adı *</label>
              <input value={yeniForm.name} onChange={e=>setYeniForm({...yeniForm,name:e.target.value})} placeholder="Örn: İstanbul Avrupa" style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Renk</label>
              <input type="color" value={yeniForm.renk} onChange={e=>setYeniForm({...yeniForm,renk:e.target.value})} style={{width:'100%',height:'41px',borderRadius:'10px',border:'1px solid #F0ECF5',padding:'4px',cursor:'none'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Kargo Ücreti (₺)</label>
              <input type="number" value={yeniForm.kargo_ucreti} onChange={e=>setYeniForm({...yeniForm,kargo_ucreti:e.target.value})} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/>
            </div>
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Min. Sipariş (₺)</label>
              <input type="number" value={yeniForm.min_siparis} onChange={e=>setYeniForm({...yeniForm,min_siparis:e.target.value})} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
            <button onClick={()=>setYeniForm({...yeniForm,goster:false})} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'none',fontFamily:'inherit'}}>İptal</button>
            <button onClick={ekle} style={{padding:'10px 20px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'none',fontFamily:'inherit'}}>Kaydet</button>
          </div>
        </div>
      )}

      {/* Bölge listesi */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
        {loading ? <p style={{color:'#9CA3AF',fontSize:'13px'}}>Yükleniyor...</p>
        : bolgeler.length===0 ? (
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'32px',textAlign:'center',gridColumn:'1/-1'}}>
            <MapPin size={32} style={{color:'#F0ECF5',margin:'0 auto 8px',display:'block'}}/>
            <p style={{color:'#9CA3AF',fontSize:'13px'}}>Henüz hizmet bölgesi tanımlanmamış</p>
          </div>
        ) : bolgeler.map(b=>(
          <div key={b.id} style={{background:'#fff',borderRadius:'16px',border:`1px solid ${b.aktif?b.renk+'40':'#F0ECF5'}`,padding:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'14px',height:'14px',borderRadius:'50%',background:b.renk,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>{b.name}</div>
                  {b.aciklama && <div style={{fontSize:'12px',color:'#9CA3AF'}}>{b.aciklama}</div>}
                </div>
              </div>
              <button onClick={()=>aktifDegistir(b.id,!b.aktif)} style={{padding:'4px 12px',borderRadius:'50px',border:'none',fontSize:'11px',fontWeight:700,cursor:'none',background:b.aktif?'#F0FDF4':'#FEF2F2',color:b.aktif?'#22C55E':'#EF4444'}}>
                {b.aktif?'Aktif':'Pasif'}
              </button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'12px'}}>
              <div style={{background:'#F8F7FC',borderRadius:'8px',padding:'8px 12px'}}>
                <div style={{fontSize:'10px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Kargo</div>
                <div style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>{b.kargo_ucreti===0?'Ücretsiz':`₺${b.kargo_ucreti}`}</div>
              </div>
              <div style={{background:'#F8F7FC',borderRadius:'8px',padding:'8px 12px'}}>
                <div style={{fontSize:'10px',color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'0.1em'}}>Min. Sipariş</div>
                <div style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>{b.min_siparis===0?'Yok':`₺${b.min_siparis}`}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={()=>sil(b.id)} style={{flex:1,padding:'8px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',fontSize:'12px',fontWeight:600,cursor:'none',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}><Trash2 size={12}/>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
