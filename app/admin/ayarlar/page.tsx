'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AyarlarPage() {
  const [ayarlar, setAyarlar] = useState<Record<string,Record<string,string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aktifTab, setAktifTab] = useState('odeme')

  useEffect(() => {
    supabase.from('site_ayarlar').select('*').then(({data})=>{
      const a: Record<string,Record<string,string>> = {}
      data?.forEach((item:any)=>{ if(!a[item.grup]) a[item.grup]={}; a[item.grup][item.anahtar]=item.deger||'' })
      setAyarlar(a); setLoading(false)
    })
  }, [])

  const set = (grup:string, anahtar:string, deger:string) => setAyarlar(a=>({...a,[grup]:{...(a[grup]||{}),[anahtar]:deger}}))
  const get = (grup:string, anahtar:string) => ayarlar[grup]?.[anahtar] || ''

  const kaydet = async () => {
    setSaving(true)
    for (const [grup, keys] of Object.entries(ayarlar)) {
      for (const [anahtar, deger] of Object.entries(keys)) {
        await supabase.from('site_ayarlar').upsert({ grup, anahtar, deger }, { onConflict: 'grup,anahtar' })
      }
    }
    toast.success('Ayarlar kaydedildi!')
    setSaving(false)
  }

  const TABS = [
    {k:'odeme',ad:'💳 PayTR Ödeme'},
    {k:'kargo',ad:'🚚 Kargo'},
    {k:'mail',ad:'✉️ SMTP Mail'},
    {k:'seo',ad:'🔍 SEO'},
    {k:'genel',ad:'⚙️ Genel'},
    {k:'guvenlik',ad:'🔒 Güvenlik'},
  ]

  const inp = (label:string, grup:string, k:string, type='text', placeholder='') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}</label>
      <input type={type} value={get(grup,k)} onChange={e=>set(grup,k,e.target.value)} placeholder={placeholder}
        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Sistem Ayarları</h1>
        <button onClick={kaydet} disabled={saving} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Save size={15}/>{saving?'Kaydediliyor...':'Kaydet'}
        </button>
      </div>

      <div style={{display:'flex',gap:'16px',alignItems:'start'}}>
        {/* Tabs */}
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'8px',width:'200px',flexShrink:0}}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setAktifTab(t.k)} style={{display:'block',width:'100%',padding:'10px 14px',borderRadius:'10px',border:'none',textAlign:'left',fontSize:'13px',fontWeight:aktifTab===t.k?700:400,background:aktifTab===t.k?'linear-gradient(135deg,#FEF0F4,#EBF7FC)':' transparent',color:aktifTab===t.k?'#E07090':'#6B7280',cursor:'pointer',fontFamily:'inherit',marginBottom:'2px'}}>
              {t.ad}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div style={{flex:1,background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'28px'}}>
          {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p> : (
            <>
            {aktifTab==='odeme' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>PayTR Ödeme Ayarları</h2>
                <div style={{background:'#FEF3C7',borderRadius:'12px',padding:'12px 16px',fontSize:'12px',color:'#92400E'}}>⚠️ Bu bilgiler PayTR hesabınızdan alınmalıdır. Yanlış bilgi girişi ödeme hatalarına yol açar.</div>
                {inp('Merchant ID','odeme','paytr_merchant_id','text','XXXXXX')}
                {inp('Merchant Key','odeme','paytr_merchant_key','password','********************************')}
                {inp('Merchant Salt','odeme','paytr_merchant_salt','password','********************************')}
                <div>
                  <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'8px'}}>Mod</label>
                  <div style={{display:'flex',gap:'12px'}}>
                    {[['1','Test Modu'],['0','Canlı Mod']].map(([v,l])=>(
                      <label key={v} style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',color:'#1C1B2E'}}>
                        <input type="radio" name="test_mode" value={v} checked={get('odeme','paytr_test_mode')===v} onChange={()=>set('odeme','paytr_test_mode',v)} style={{cursor:'pointer'}}/> {l}
                      </label>
                    ))}
                  </div>
                </div>
                {inp('Taksit Seçenekleri (JSON)','odeme','taksit_secenekleri','text','[1,2,3,6,9,12]')}
              </div>
            )}
            {aktifTab==='kargo' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Kargo Ayarları</h2>
                {inp('Standart Kargo Ücreti (₺)','kargo','standart_kargo_ucreti','number','49.90')}
                {inp('Ücretsiz Kargo Alt Tutarı (₺)','kargo','ucretsiz_kargo_tutari','number','500')}
              </div>
            )}
            {aktifTab==='mail' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>SMTP Mail Ayarları</h2>
                {inp('SMTP Sunucu','mail','smtp_host','text','smtp.gmail.com')}
                {inp('SMTP Port','mail','smtp_port','number','587')}
                {inp('SMTP Kullanıcı','mail','smtp_user','email','ornek@gmail.com')}
                {inp('SMTP Şifre','mail','smtp_pass','password','')}
                {inp('Gönderen E-posta','mail','from_email','email','bilgi@milgo.com.tr')}
              </div>
            )}
            {aktifTab==='seo' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>SEO Ayarları</h2>
                {inp('Varsayılan Site Başlığı','seo','default_title','text','milgo. — Mutluluğun Tadı')}
                <div>
                  <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Varsayılan Meta Açıklama</label>
                  <textarea value={get('seo','default_description')} onChange={e=>set('seo','default_description',e.target.value)} rows={3} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none'}}/>
                </div>
              </div>
            )}
            {aktifTab==='genel' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Genel Ayarlar</h2>
                {inp('Site Adı','genel','site_adi','text','milgo.')}
                {inp('Site Açıklaması','genel','site_aciklama','text','Mutluluğun Tadı')}
                {inp('İletişim E-posta','genel','iletisim_email','email','bilgi@milgo.com.tr')}
                {inp('İletişim Telefon','genel','iletisim_telefon','tel','02123521076')}
                {inp('Adres','genel','adres','text','Etiler, Beşiktaş / İstanbul')}
              </div>
            )}
            {aktifTab==='guvenlik' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Güvenlik Ayarları</h2>
                {inp('Maks. Giriş Denemesi','guvenlik','max_login_attempts','number','5')}
                <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',fontSize:'13px',color:'#1C1B2E'}}>
                  <input type="checkbox" checked={get('guvenlik','rate_limit_enabled')==='1'} onChange={e=>set('guvenlik','rate_limit_enabled',e.target.checked?'1':'0')} style={{cursor:'pointer'}}/>
                  Rate Limit Aktif
                </label>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
