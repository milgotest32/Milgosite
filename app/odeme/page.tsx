'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, CreditCard, Truck, Lock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

type Adim = 'adres' | 'odeme'

export default function OdemePage() {
  const router = useRouter()
  const { items, araToplam, kargoUcreti, genelToplam, indirim, kupon, temizle } = useSepet()
  const [adim, setAdim] = useState<Adim>('adres')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [hizmetHata, setHizmetHata] = useState('')
  const [bolgeAdi, setBolgeAdi] = useState('')
  const [form, setForm] = useState({ ad:'', soyad:'', email:'', telefon:'', adres:'', ilce:'', sehir:'İstanbul', posta:'', notlar:'' })
  const [paytrToken, setPaytrToken] = useState('')
  const [odemeYontemi, setOdemeYontemi] = useState<'kart'|'kapida'|'havale'>('kart')
  const [odemeAyarlar, setOdemeAyarlar] = useState<any>({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user
      setUser(u)
      if (u) setForm(f => ({ ...f, email: u.email || '' }))
    })
  }, [])

  useEffect(() => {
    if (items.length === 0) router.push('/sepet')
  }, [items, router])

  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup','odeme').then(({data}) => {
      const a: any = {}
      data?.forEach((item: any) => { a[item.anahtar] = item.deger })
      setOdemeAyarlar(a)
    })
  }, [])

  if (items.length === 0) return null

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const adresKontrol = async () => {
    if (!form.ad || !form.email || !form.adres || !form.ilce) {
      toast.error('Lütfen zorunlu alanları doldurun'); return
    }
    setYukleniyor(true)
    setHizmetHata('')
    try {
      const geocodeR = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${form.adres}, ${form.ilce}, ${form.sehir}`)}&limit=1`)
      const geocodeD = await geocodeR.json()
      if (geocodeD[0]) {
        const lat = parseFloat(geocodeD[0].lat)
        const lng = parseFloat(geocodeD[0].lon)
        const r = await fetch('/api/kmz', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ lat, lng }) })
        const d = await r.json()
        if (!d.hizmet) {
          setHizmetHata(d.hata || 'Bu adrese hizmet verilemiyor.')
          setYukleniyor(false)
          return
        }
      }
    } catch { /* Geocoding hatası, devam et */ }
    setYukleniyor(false)
    setAdim('odeme')
  }

  const siparisOlustur = async () => {
    setYukleniyor(true)
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id: i.product_id, variant_id: i.variant_id,
            urun_ad: i.urun.name,
            urun_gorsel: i.urun.site_product_images?.[0]?.url,
            fiyat: i.urun.fiyat, adet: i.adet
          })),
          adres: form,
          musteri_id: user?.id,
          misafir_email: !user ? form.email : undefined,
          kupon_kod: kupon?.kod,
          indirim,
          notlar: form.notlar,
          odeme_yontemi: odemeYontemi,
          bolge_adi: bolgeAdi,
        })
      })
      const { data: siparis, error } = await r.json()
      if (!siparis || error) throw new Error(error || 'Sipariş oluşturulamadı')

      if (odemeYontemi !== 'kart') { temizle(); router.push(`/siparis-onay?siparis=${siparis.siparis_no}`); return }
      const paytrR = await fetch('/api/paytr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siparis_id: siparis.id, tutar: genelToplam(),
          email: form.email, adres: form,
          sepet: items.map(i => [i.urun.name, i.urun.fiyat.toFixed(2), i.adet]),
        })
      })
      const { token, error: paytrErr } = await paytrR.json()
      if (paytrErr || !token) {
        temizle()
        router.push(`/siparis-onay?siparis=${siparis.siparis_no}`)
        return
      }
      temizle()
      setPaytrToken(token)
    } catch (e: any) {
      toast.error(e.message || 'Bir hata oluştu')
      setYukleniyor(false)
    }
  }

  if (paytrToken) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F0EEF8',padding:'24px'}}>
      <div style={{background:'#fff',borderRadius:'24px',padding:'32px',width:'100%',maxWidth:'600px',border:'1px solid #F0ECF5'}}>
        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',color:'#1C1B2E',marginBottom:'20px',textAlign:'center'}}>Ödeme Sayfası</h2>
        <iframe src={`https://www.paytr.com/odeme?token=${paytrToken}`} style={{width:'100%',height:'500px',border:'none',borderRadius:'12px'}} title="PayTR Ödeme"/>
      </div>
    </div>
  )

  const inpStyle: React.CSSProperties = {
    width:'100%', background:'#F0EEF8', border:'1px solid #E8E4F0',
    borderRadius:'12px', padding:'12px 14px', fontSize:'14px',
    color:'#1C1B2E', outline:'none', fontFamily:'inherit', boxSizing:'border-box'
  }
  const labelStyle: React.CSSProperties = {
    display:'block', fontSize:'11px', fontWeight:700,
    letterSpacing:'0.08em', textTransform:'uppercase', color:'#6B7280', marginBottom:'6px'
  }

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <style>{`
        .odeme-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        @media (max-width: 768px) {
          .odeme-grid { grid-template-columns: 1fr; }
          .form-row-2 { grid-template-columns: 1fr; }
          .form-row-3 { grid-template-columns: 1fr 1fr; }
          .ozet-sticky { position: static !important; }
        }
        @media (max-width: 480px) {
          .form-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{maxWidth:'1000px',margin:'0 auto',padding:'24px 16px'}}>
        <Link href="/sepet" style={{display:'inline-flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'20px'}}>
          <ArrowLeft size={14}/>Sepete Dön
        </Link>

        {/* Adım göstergesi */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'24px',flexWrap:'wrap'}}>
          {[['adres','1','Teslimat'],['odeme','2','Ödeme']].map(([id,no,ad],i) => (
            <div key={id} style={{display:'flex',alignItems:'center',gap:'8px'}}>
              {i > 0 && <div style={{width:'24px',height:'1px',background:adim==='odeme'?'#E07090':'#D1D5DB'}}/>}
              <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'7px 14px',borderRadius:'50px',
                background:adim===id?'linear-gradient(135deg,#E07090,#3B9FCC)':'#fff',
                border:`1px solid ${adim===id?'transparent':'#E8E4F0'}`}}>
                <span style={{width:'18px',height:'18px',borderRadius:'50%',background:adim===id?'rgba(255,255,255,0.25)':'#F0EEF8',
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,
                  color:adim===id?'#fff':'#9CA3AF'}}>{no}</span>
                <span style={{fontSize:'13px',fontWeight:600,color:adim===id?'#fff':'#9CA3AF'}}>{ad}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hizmet hatası */}
        {hizmetHata && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'14px',padding:'14px 18px',marginBottom:'18px',display:'flex',alignItems:'center',gap:'10px'}}>
            <AlertCircle size={18} style={{color:'#EF4444',flexShrink:0}}/>
            <div>
              <p style={{fontSize:'14px',fontWeight:700,color:'#EF4444',margin:'0 0 2px'}}>Hizmet Bölgesi Dışında</p>
              <p style={{fontSize:'13px',color:'#EF4444',margin:0}}>{hizmetHata}</p>
            </div>
          </div>
        )}

        <div className="odeme-grid" style={{alignItems:'start'}}>
          {/* FORM */}
          <div style={{background:'#fff',borderRadius:'20px',padding:'24px',border:'1px solid #F0ECF5'}}>
            {adim === 'adres' ? (
              <>
                <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <Truck size={17} style={{color:'#E07090'}}/>Teslimat Bilgileri
                </h2>
                <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <div className="form-row-2">
                    <div>
                      <label style={labelStyle}>Ad <span style={{color:'#E07090'}}>*</span></label>
                      <input value={form.ad} onChange={e=>set('ad',e.target.value)} placeholder="Adınız" style={inpStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Soyad</label>
                      <input value={form.soyad} onChange={e=>set('soyad',e.target.value)} placeholder="Soyadınız" style={inpStyle}/>
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div>
                      <label style={labelStyle}>E-posta <span style={{color:'#E07090'}}>*</span></label>
                      <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="ornek@email.com" style={inpStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Telefon</label>
                      <input type="tel" value={form.telefon} onChange={e=>set('telefon',e.target.value)} placeholder="0532 xxx xx xx" style={inpStyle}/>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Adres <span style={{color:'#E07090'}}>*</span></label>
                    <input value={form.adres} onChange={e=>set('adres',e.target.value)} placeholder="Mahalle, sokak, bina no, daire" style={inpStyle}/>
                  </div>
                  <div className="form-row-3">
                    <div>
                      <label style={labelStyle}>İlçe <span style={{color:'#E07090'}}>*</span></label>
                      <input value={form.ilce} onChange={e=>set('ilce',e.target.value)} placeholder="Beşiktaş" style={inpStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Şehir</label>
                      <input value={form.sehir} onChange={e=>set('sehir',e.target.value)} placeholder="İstanbul" style={inpStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Posta Kodu</label>
                      <input value={form.posta} onChange={e=>set('posta',e.target.value)} placeholder="34000" style={inpStyle}/>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Sipariş Notu</label>
                    <textarea value={form.notlar} onChange={e=>set('notlar',e.target.value)}
                      placeholder="Kapı kodu, kat vb. notlar..."
                      style={{...inpStyle, resize:'none', height:'72px'}}/>
                  </div>
                  <button onClick={adresKontrol} disabled={yukleniyor}
                    style={{width:'100%',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'15px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',opacity:yukleniyor?0.7:1}}>
                    {yukleniyor ? 'Kontrol ediliyor...' : 'Ödemeye Geç →'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                  <CreditCard size={17} style={{color:'#E07090'}}/>Ödeme
                </h2>
                {/* Adres özeti */}
                <div style={{background:'#F0EEF8',borderRadius:'14px',padding:'14px 16px',marginBottom:'18px',fontSize:'13px',color:'#6B7280'}}>
                  <p style={{fontWeight:700,color:'#1C1B2E',marginBottom:'2px'}}>{form.ad} {form.soyad}</p>
                  <p style={{margin:'2px 0'}}>{form.adres}</p>
                  <p style={{margin:0}}>{form.ilce} / {form.sehir}</p>
                </div>
                {/* Ödeme Yöntemi Seçimi */}
                <div style={{marginBottom:'20px'}}>
                  <p style={{fontSize:'12px',fontWeight:700,color:'#6B7280',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'10px'}}>Ödeme Yöntemi</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {/* Kredi/Banka Kartı - her zaman aktif */}
                    <label style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderRadius:'14px',border:`2px solid ${odemeYontemi==='kart'?'#E07090':'#F0ECF5'}`,background:odemeYontemi==='kart'?'#FEF0F4':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
                      <input type="radio" name="odeme" value="kart" checked={odemeYontemi==='kart'} onChange={()=>setOdemeYontemi('kart')} style={{accentColor:'#E07090'}}/>
                      <span style={{fontSize:'18px'}}>💳</span>
                      <div>
                        <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',margin:0}}>Kredi / Banka Kartı</p>
                        <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>PayTR güvencesiyle</p>
                      </div>
                    </label>
                    {odemeAyarlar.kapida_odeme_aktif === '1' && (
                      <label style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderRadius:'14px',border:`2px solid ${odemeYontemi==='kapida'?'#E07090':'#F0ECF5'}`,background:odemeYontemi==='kapida'?'#FEF0F4':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
                        <input type="radio" name="odeme" value="kapida" checked={odemeYontemi==='kapida'} onChange={()=>setOdemeYontemi('kapida')} style={{accentColor:'#E07090'}}/>
                        <span style={{fontSize:'18px'}}>🚪</span>
                        <div>
                          <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',margin:0}}>Kapıda Ödeme</p>
                          <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>
                            {odemeAyarlar.kapida_odeme_ucreti && odemeAyarlar.kapida_odeme_ucreti !== '0' ? `+₺${odemeAyarlar.kapida_odeme_ucreti} ek ücret` : 'Ücretsiz'}
                          </p>
                        </div>
                      </label>
                    )}
                    {odemeAyarlar.havale_aktif === '1' && (
                      <label style={{display:'flex',alignItems:'center',gap:'12px',padding:'14px 16px',borderRadius:'14px',border:`2px solid ${odemeYontemi==='havale'?'#3B9FCC':'#F0ECF5'}`,background:odemeYontemi==='havale'?'#EBF7FC':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
                        <input type="radio" name="odeme" value="havale" checked={odemeYontemi==='havale'} onChange={()=>setOdemeYontemi('havale')} style={{accentColor:'#3B9FCC'}}/>
                        <span style={{fontSize:'18px'}}>🏦</span>
                        <div>
                          <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',margin:0}}>Havale / EFT</p>
                          <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>{odemeAyarlar.havale_banka || 'Banka transferi'}</p>
                        </div>
                      </label>
                    )}
                  </div>
                  {/* Havale bilgileri */}
                  {odemeYontemi === 'havale' && odemeAyarlar.havale_aktif === '1' && (
                    <div style={{marginTop:'12px',background:'#EBF7FC',borderRadius:'12px',padding:'14px 16px',fontSize:'13px',color:'#075985'}}>
                      <p style={{fontWeight:700,marginBottom:'6px'}}>Hesap Bilgileri</p>
                      <p style={{margin:'2px 0'}}>🏦 {odemeAyarlar.havale_banka}</p>
                      <p style={{margin:'2px 0'}}>👤 {odemeAyarlar.havale_hesap_sahibi}</p>
                      <p style={{margin:'2px 0',fontFamily:'monospace',fontWeight:700}}>{odemeAyarlar.havale_iban}</p>
                      {odemeAyarlar.havale_aciklama && <p style={{margin:'6px 0 0',fontSize:'11px',color:'#0369a1'}}>⚠️ {odemeAyarlar.havale_aciklama}</p>}
                    </div>
                  )}
                </div>
                {odemeYontemi === 'kart' && (
                  <div style={{background:'#F0EEF8',borderRadius:'14px',padding:'14px 16px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'8px'}}>
                    <Lock size={14} style={{color:'#E07090',flexShrink:0}}/>
                    <p style={{fontSize:'13px',color:'#6B7280',margin:0}}>Ödeme bilgileriniz PayTR güvencesiyle korunmaktadır.</p>
                  </div>
                )}
                <div style={{display:'flex',gap:'10px'}}>
                  <button onClick={()=>setAdim('adres')}
                    style={{padding:'14px 20px',background:'#fff',border:'2px solid #E8E4F0',borderRadius:'50px',fontSize:'13px',fontWeight:600,cursor:'pointer',color:'#6B7280',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                    ← Geri
                  </button>
                  <button onClick={siparisOlustur} disabled={yukleniyor}
                    style={{flex:1,background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'14px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:'0 6px 20px rgba(224,112,144,0.3)',opacity:yukleniyor?0.7:1}}>
                    {yukleniyor
                      ? <><span style={{width:'15px',height:'15px',border:'2px solid rgba(255,255,255,0.4)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>İşleniyor...</>
                      : <><Lock size={14}/>Siparişi Onayla · ₺{genelToplam().toFixed(2)}</>}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ÖZET */}
          <div className="ozet-sticky" style={{position:'sticky',top:'80px'}}>
            <div style={{background:'#fff',borderRadius:'20px',padding:'20px',border:'1px solid #F0ECF5'}}>
              <h3 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'14px'}}>Sipariş Özeti</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'14px'}}>
                {items.map(({urun,adet})=>(
                  <div key={urun.id} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#F0EEF8',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {urun.site_product_images?.[0]?.url
                        ? <img src={urun.site_product_images[0].url} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/>
                        : <span style={{fontSize:'18px'}}>🥛</span>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:'12px',fontWeight:600,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',margin:0}}>{urun.name}</p>
                      <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>x{adet}</p>
                    </div>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',flexShrink:0}}>₺{(urun.fiyat*adet).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                  <span style={{color:'#6B7280'}}>Ara Toplam</span>
                  <span style={{fontWeight:600}}>₺{araToplam().toFixed(2)}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                  <span style={{color:'#6B7280'}}>Kurye</span>
                  <span style={{fontWeight:600}}>{kargoUcreti()===0?'Ücretsiz':`₺${kargoUcreti().toFixed(2)}`}</span>
                </div>
                {indirim > 0 && (
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                    <span style={{color:'#22C55E'}}>İndirim</span>
                    <span style={{fontWeight:600,color:'#22C55E'}}>-₺{indirim.toFixed(2)}</span>
                  </div>
                )}
                <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,color:'#1C1B2E',fontSize:'14px'}}>Toplam</span>
                  <span style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',color:'#1C1B2E'}}>₺{genelToplam().toFixed(2)}</span>
                </div>
              </div>
              {araToplam() < 500 && (
                <div style={{marginTop:'12px',background:'#FEF0F4',borderRadius:'10px',padding:'10px 12px',fontSize:'12px',color:'#E07090',fontWeight:600}}>
                  ₺{(500-araToplam()).toFixed(2)} daha alışveriş yap, kurye bedava!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
