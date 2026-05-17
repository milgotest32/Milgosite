'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, CreditCard, Truck, User, MapPin, Check, Lock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

type Adim = 'adres' | 'odeme'

export default function OdemePage() {
  const router = useRouter()
  const { items, araToplam, kargoUcreti, genelToplam, indirim, kupon, temizle } = useSepet()
  const [adim, setAdim] = useState<Adim>('adres')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [hizmetKontrol, setHizmetKontrol] = useState<{kontrol:boolean;sonuc?:boolean;hata?:string}>({ kontrol: false })
  const [form, setForm] = useState({ ad:'', soyad:'', email:'', telefon:'', adres:'', ilce:'', sehir:'İstanbul', posta:'', notlar:'', misafir: false })
  const [paytrToken, setPaytrToken] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      setUser(u)
      if (u) setForm(f => ({ ...f, email: u.email || '' }))
    })
  }, [])

  if (items.length === 0) { router.push('/sepet'); return null }

  const adresKontrol = async () => {
    if (!form.ad || !form.email || !form.adres) { toast.error('Lütfen zorunlu alanları doldurun'); return }
    
    // KMZ bölge kontrolü
    setHizmetKontrol({ kontrol: true })
    try {
      // Geocode adres
      const geocodeR = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${form.adres}, ${form.ilce}, ${form.sehir}`)}&limit=1`)
      const geocodeD = await geocodeR.json()
      
      if (geocodeD[0]) {
        const lat = parseFloat(geocodeD[0].lat)
        const lng = parseFloat(geocodeD[0].lon)
        const r = await fetch('/api/kmz', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ lat, lng }) })
        const d = await r.json()
        if (!d.hizmet) {
          setHizmetKontrol({ kontrol: false, sonuc: false, hata: d.hata })
          toast.error(d.hata || 'Bu adrese hizmet verilemiyor')
          return
        }
      }
    } catch { /* Geocoding başarısız, devam et */ }
    
    setHizmetKontrol({ kontrol: false, sonuc: true })
    setAdim('odeme')
  }

  const siparisOlustur = async () => {
    setYukleniyor(true)
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.product_id, variant_id: i.variant_id, urun_ad: i.urun.name, urun_gorsel: i.urun.site_product_images?.[0]?.url, fiyat: i.urun.fiyat, adet: i.adet })),
          adres: { ad: form.ad, soyad: form.soyad, telefon: form.telefon, adres: form.adres, ilce: form.ilce, sehir: form.sehir, email: form.email },
          musteri_id: user?.id, misafir_email: !user ? form.email : undefined,
          kupon_kod: kupon?.kod, indirim, notlar: form.notlar,
        })
      })
      const { data: siparis } = await r.json()
      if (!siparis) throw new Error('Sipariş oluşturulamadı')

      // PayTR token al
      const paytrR = await fetch('/api/paytr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siparis_id: siparis.id,
          tutar: genelToplam(),
          email: form.email,
          adres: form,
          sepet: items.map(i => [i.urun.name, i.urun.fiyat.toFixed(2), i.adet]),
        })
      })
      const { token, error } = await paytrR.json()
      
      if (error || !token) {
        // PayTR ayarı yoksa direkt onaya git (demo)
        temizle()
        router.push(`/siparis-onay?siparis=${siparis.siparis_no}`)
        return
      }

      setPaytrToken(token)
    } catch (e: any) {
      toast.error(e.message || 'Hata oluştu')
    }
    setYukleniyor(false)
  }

  const inp = (label: string, key: keyof typeof form, type='text', required=false, placeholder='') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}{required&&<span style={{color:'#E07090'}}> *</span>}</label>
      {key === 'notlar' ? (
        <textarea value={form[key] as string} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={placeholder}
          style={{width:'100%',background:'#F0EEF8',border:'1px solid #F0ECF5',borderRadius:'12px',padding:'12px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none',height:'80px'}}/>
      ) : (
        <input type={type} value={form[key] as string} onChange={e=>setForm({...form,[key]:e.target.value})} required={required} placeholder={placeholder}
          style={{width:'100%',background:'#F0EEF8',border:'1px solid #F0ECF5',borderRadius:'12px',padding:'12px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
      )}
    </div>
  )

  if (paytrToken) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#F0EEF8',padding:'24px'}}>
      <div style={{background:'#fff',borderRadius:'24px',padding:'32px',width:'100%',maxWidth:'600px',border:'1px solid #F0ECF5'}}>
        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',color:'#1C1B2E',marginBottom:'20px',textAlign:'center'}}>Ödeme Sayfasına Yönlendiriliyorsunuz</h2>
        <iframe src={`https://www.paytr.com/odeme?token=${paytrToken}`} style={{width:'100%',height:'500px',border:'none',borderRadius:'12px'}} title="PayTR Ödeme"/>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'32px 24px'}}>
      <div style={{maxWidth:'1000px',margin:'0 auto'}}>
        <Link href="/sepet" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'24px'}}><ArrowLeft size={14}/>Sepete Dön</Link>

        {/* Adımlar */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'32px'}}>
          {[['adres','1','Teslimat Bilgileri'],['odeme','2','Ödeme']].map(([id,no,ad],i)=>(
            <div key={id} style={{display:'flex',alignItems:'center',gap:'8px'}}>
              {i > 0 && <div style={{width:'32px',height:'1px',background:adim==='odeme'?'#E07090':'#F0ECF5'}}/>}
              <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',borderRadius:'50px',background:adim===id?'linear-gradient(135deg,#E07090,#3B9FCC)':'#fff',border:'1px solid #F0ECF5',transition:'all 0.25s'}}>
                <span style={{width:'20px',height:'20px',borderRadius:'50%',background:adim===id?'rgba(255,255,255,0.3)':'#F0ECF5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:adim===id?'#fff':'#9CA3AF'}}>{no}</span>
                <span style={{fontSize:'13px',fontWeight:600,color:adim===id?'#fff':'#9CA3AF'}}>{ad}</span>
              </div>
            </div>
          ))}
        </div>

        {/* KMZ uyarısı */}
        {hizmetKontrol.sonuc === false && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'16px',padding:'16px 20px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
            <AlertCircle size={20} style={{color:'#EF4444',flexShrink:0}}/>
            <div>
              <p style={{fontSize:'14px',fontWeight:700,color:'#EF4444',marginBottom:'2px'}}>Hizmet Bölgesi Dışında</p>
              <p style={{fontSize:'13px',color:'#EF4444'}}>{hizmetKontrol.hata || 'Bu adrese henüz hizmet verilemiyor.'}</p>
            </div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'24px',alignItems:'start'}}>
          {/* Form */}
          <div style={{background:'#fff',borderRadius:'24px',padding:'32px',border:'1px solid #F0ECF5'}}>
            {adim === 'adres' ? (
              <>
                <h2 style={{fontSize:'20px',fontWeight:700,color:'#1C1B2E',marginBottom:'24px',display:'flex',alignItems:'center',gap:'8px'}}><Truck size={18} style={{color:'#E07090'}}/>Teslimat Bilgileri</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                  {inp('Ad','ad','text',true,'Adınız')}
                  {inp('Soyad','soyad','text',false,'Soyadınız')}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginTop:'16px'}}>
                  {inp('E-posta','email','email',true,'ornek@email.com')}
                  {inp('Telefon','telefon','tel',false,'0532 xxx xx xx')}
                </div>
                <div style={{marginTop:'16px'}}>{inp('Adres','adres','text',true,'Sokak, mahalle, bina no')}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginTop:'16px'}}>
                  {inp('İlçe','ilce','text',false,'Beşiktaş')}
                  {inp('Şehir','sehir','text',false,'İstanbul')}
                  {inp('Posta Kodu','posta','text',false,'34000')}
                </div>
                <div style={{marginTop:'16px'}}>{inp('Sipariş Notu','notlar','text',false,'Teslimatla ilgili not...')}</div>
                <button onClick={adresKontrol} disabled={hizmetKontrol.kontrol}
                  style={{marginTop:'24px',width:'100%',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'16px',fontSize:'14px',fontWeight:700,cursor:'none',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                  {hizmetKontrol.kontrol ? 'Adres kontrol ediliyor...' : 'Ödemeye Geç →'}
                </button>
              </>
            ) : (
              <>
                <h2 style={{fontSize:'20px',fontWeight:700,color:'#1C1B2E',marginBottom:'24px',display:'flex',alignItems:'center',gap:'8px'}}><CreditCard size={18} style={{color:'#E07090'}}/>Ödeme Bilgileri</h2>
                <div style={{background:'#F0EEF8',borderRadius:'16px',padding:'20px',marginBottom:'20px'}}>
                  <p style={{fontSize:'13px',color:'#6B7280',display:'flex',alignItems:'center',gap:'8px'}}><Lock size={14} style={{color:'#E07090'}}/>Ödeme bilgileriniz PayTR güvencesiyle korunmaktadır. Kart bilgileriniz sitemizde saklanmaz.</p>
                </div>
                <div style={{background:'#fff',border:'2px solid #F0ECF5',borderRadius:'16px',padding:'24px',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
                  <CreditCard size={48} style={{color:'#F4A7B9'}}/>
                  <p style={{fontSize:'14px',color:'#6B7280',textAlign:'center'}}>Siparişi Onayla butonuna tıkladığınızda PayTR güvenli ödeme sayfasına yönlendirileceksiniz.</p>
                </div>
                <div style={{display:'flex',gap:'12px',marginTop:'24px'}}>
                  <button onClick={()=>setAdim('adres')} style={{padding:'14px 24px',background:'#fff',border:'2px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',fontWeight:600,cursor:'none',color:'#6B7280',fontFamily:'inherit'}}>← Geri</button>
                  <button onClick={siparisOlustur} disabled={yukleniyor}
                    style={{flex:1,background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'16px',fontSize:'14px',fontWeight:700,cursor:'none',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>
                    {yukleniyor?<><span style={{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>İşleniyor...</>:<><Lock size={15}/>Siparişi Onayla · ₺{genelToplam().toFixed(2)}</>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Özet */}
          <div style={{position:'sticky',top:'80px'}}>
            <div style={{background:'#fff',borderRadius:'24px',padding:'24px',border:'1px solid #F0ECF5'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Sipariş Özeti</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
                {items.map(({urun,adet})=>(
                  <div key={urun.id} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'#F0EEF8',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {urun.site_product_images?.[0]?.url?<img src={urun.site_product_images[0].url} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/>:<span style={{fontSize:'20px'}}>🥛</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{urun.name}</p>
                      <p style={{fontSize:'11px',color:'#9CA3AF'}}>x{adet}</p>
                    </div>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',flexShrink:0}}>₺{(urun.fiyat*adet).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                {[['Ara Toplam',`₺${araToplam().toFixed(2)}`],['Kargo',kargoUcreti()===0?'Ücretsiz':`₺${kargoUcreti().toFixed(2)}`],...(indirim>0?[['İndirim',`-₺${indirim.toFixed(2)}`]]:[])].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}><span style={{color:'#6B7280'}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
                ))}
                <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'10px',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontWeight:700,color:'#1C1B2E'}}>Toplam</span>
                  <span style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',color:'#1C1B2E'}}>₺{genelToplam().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
