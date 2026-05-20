'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Plus, MapPin, Trash2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AdreslerPage() {
  const [adresler, setAdresler] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({goster:false,baslik:'Ev',ad:'',soyad:'',telefon:'',adres:'',ilce:'',sehir:'İstanbul',posta_kodu:'',varsayilan:false})
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const yukle = async (uid:string) => {
    const {data} = await supabase.from('site_adresler').select('*').eq('user_id',uid).order('varsayilan',{ascending:false})
    setAdresler(data||[])
  }

  useEffect(()=>{
    supabase.auth.getSession().then(async({data})=>{
      if(!data.session){router.push('/giris');return}
      setUser(data.session.user)
      await yukle(data.session.user.id)
      setLoading(false)
    })
  },[router])

  const ekle = async () => {
    if (!form.ad||!form.adres) { toast.error('Ad ve adres zorunludur'); return }
    setSaving(true)
    await supabase.from('site_adresler').insert({ user_id:user.id, baslik:form.baslik, ad:form.ad, soyad:form.soyad, telefon:form.telefon, adres:form.adres, ilce:form.ilce, sehir:form.sehir, posta_kodu:form.posta_kodu, varsayilan:form.varsayilan })
    toast.success('Adres eklendi')
    setForm({goster:false,baslik:'Ev',ad:'',soyad:'',telefon:'',adres:'',ilce:'',sehir:'İstanbul',posta_kodu:'',varsayilan:false})
    await yukle(user.id)
    setSaving(false)
  }

  const sil = async (id:string) => {
    await supabase.from('site_adresler').delete().eq('id',id)
    toast.success('Adres silindi')
    await yukle(user.id)
  }

  const inp = (l:string,k:string,type='text',placeholder='') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'5px'}}>{l}</label>
      <input type={type} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={placeholder} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'32px 24px'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <Link href="/hesabim" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'24px'}}><ArrowLeft size={14}/>Hesabıma Dön</Link>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',color:'#1C1B2E'}}>Adreslerim</h1>
          <button onClick={()=>setForm({...form,goster:true})} style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 18px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Plus size={14}/>Adres Ekle
          </button>
        </div>

        {form.goster && (
          <div style={{background:'#fff',borderRadius:'20px',padding:'24px',border:'2px solid #F4A7B9',marginBottom:'16px'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Yeni Adres</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              {inp('Başlık','baslik','text','Ev, İş...')}
              {inp('Ad *','ad','text','Adınız')}
              {inp('Soyad','soyad','text','Soyadınız')}
              {inp('Telefon','telefon','tel','0532 xxx xx xx')}
            </div>
            <div style={{marginBottom:'12px'}}>{inp('Adres *','adres','text','Sokak, mahalle, bina no')}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>
              {inp('İlçe','ilce','text','Beşiktaş')}
              {inp('Şehir','sehir','text','İstanbul')}
              {inp('Posta Kodu','posta_kodu','text','34000')}
            </div>
            <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#6B7280',marginBottom:'16px',cursor:'pointer'}}>
              <input type="checkbox" checked={form.varsayilan} onChange={e=>setForm({...form,varsayilan:e.target.checked})} style={{cursor:'pointer'}}/> Varsayılan adres olarak ayarla
            </label>
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={()=>setForm({...form,goster:false})} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
              <button onClick={ekle} disabled={saving} style={{padding:'10px 20px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{saving?'Kaydediliyor...':'Kaydet'}</button>
            </div>
          </div>
        )}

        {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p>
        : adresler.length===0 ? (
          <div style={{background:'#fff',borderRadius:'20px',padding:'48px',textAlign:'center',border:'1px solid #F0ECF5'}}>
            <MapPin size={40} style={{color:'#F4A7B9',margin:'0 auto 12px',display:'block'}}/>
            <p style={{color:'#9CA3AF',fontSize:'14px'}}>Kayıtlı adresiniz yok</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {adresler.map(a=>(
              <div key={a.id} style={{background:'#fff',borderRadius:'20px',padding:'20px',border:`1px solid ${a.varsayilan?'#F4A7B9':'#F0ECF5'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                      <span style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>{a.baslik}</span>
                      {a.varsayilan && <span style={{fontSize:'10px',fontWeight:700,background:'#FEF0F4',color:'#E07090',padding:'2px 8px',borderRadius:'50px'}}>Varsayılan</span>}
                    </div>
                    <p style={{fontSize:'13px',color:'#1C1B2E',marginBottom:'2px'}}>{a.ad} {a.soyad}</p>
                    <p style={{fontSize:'13px',color:'#6B7280'}}>{a.adres}</p>
                    <p style={{fontSize:'13px',color:'#6B7280'}}>{a.ilce} / {a.sehir} {a.posta_kodu}</p>
                    {a.telefon && <p style={{fontSize:'13px',color:'#6B7280'}}>{a.telefon}</p>}
                  </div>
                  <button onClick={()=>sil(a.id)} style={{width:'32px',height:'32px',borderRadius:'8px',background:'#FEF2F2',border:'none',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
