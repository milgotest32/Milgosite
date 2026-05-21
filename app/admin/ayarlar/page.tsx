'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save, Upload, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AyarlarPage() {
  const [ayarlar, setAyarlar] = useState<Record<string,Record<string,string>>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aktifTab, setAktifTab] = useState('odeme')

  // Favicon state
  const [faviconUrl, setFaviconUrl] = useState('')
  const [faviconYukleniyor, setFaviconYukleniyor] = useState(false)
  const faviconRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('site_ayarlar').select('*').then(({data})=>{
      const a: Record<string,Record<string,string>> = {}
      data?.forEach((item:any)=>{ if(!a[item.grup]) a[item.grup]={}; a[item.grup][item.anahtar]=item.deger||'' })
      setAyarlar(a)
      // Mevcut favicon'u yükle
      const favicon = a['genel']?.['favicon_url'] || ''
      setFaviconUrl(favicon)
      setLoading(false)
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

  const faviconYukle = async (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    // Boyut kontrolü (max 1MB)
    if (file.size > 1024 * 1024) { toast.error('Favicon en fazla 1MB olabilir'); return }
    setFaviconYukleniyor(true)
    const ext = file.name.split('.').pop()
    const yol = `favicon/favicon-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('site-medya').upload(yol, file, { upsert: true })
    if (error) { toast.error('Yükleme hatası: ' + error.message); setFaviconYukleniyor(false); return }
    const { data: { publicUrl } } = supabase.storage.from('site-medya').getPublicUrl(yol)
    // Ayarlara kaydet
    await supabase.from('site_ayarlar').upsert({ grup: 'genel', anahtar: 'favicon_url', deger: publicUrl }, { onConflict: 'grup,anahtar' })
    setFaviconUrl(publicUrl)
    set('genel', 'favicon_url', publicUrl)
    toast.success('Favicon yüklendi ve kaydedildi!')
    setFaviconYukleniyor(false)
  }

  const faviconSil = async () => {
    if (!confirm('Favicon\'ı kaldırmak istediğinize emin misiniz?')) return
    await supabase.from('site_ayarlar').upsert({ grup: 'genel', anahtar: 'favicon_url', deger: '' }, { onConflict: 'grup,anahtar' })
    setFaviconUrl('')
    set('genel', 'favicon_url', '')
    toast.success('Favicon kaldırıldı')
  }

  const TABS = [
    {k:'anasayfa',ad:'🏠 Ana Sayfa'},
    {k:'odeme',ad:'💳 PayTR Ödeme'},
    {k:'kargo',ad:'🛵 Kurye'},
    {k:'mail',ad:'✉️ SMTP Mail'},
    {k:'seo',ad:'🔍 SEO'},
    {k:'genel',ad:'⚙️ Genel'},
    {k:'favicon',ad:'🌐 Favicon'},
    {k:'whatsapp',ad:'💬 WhatsApp'},
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

                {/* Ek Ödeme Yöntemleri */}
                <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'16px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Ek Ödeme Yöntemleri</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>

                    {/* Kapıda Ödeme */}
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#F8F7FC',borderRadius:'12px',padding:'14px 16px',border:'1px solid #F0ECF5'}}>
                      <div>
                        <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',margin:'0 0 2px'}}>🚪 Kapıda Ödeme</p>
                        <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>Müşteri kapıda nakit veya kart ile ödeme yapar</p>
                      </div>
                      <label style={{position:'relative',display:'inline-block',width:'44px',height:'24px',cursor:'pointer',flexShrink:0}}>
                        <input type="checkbox" checked={get('odeme','kapida_odeme_aktif')==='1'} onChange={e=>set('odeme','kapida_odeme_aktif',e.target.checked?'1':'0')} style={{opacity:0,width:0,height:0}}/>
                        <span style={{position:'absolute',inset:0,background:get('odeme','kapida_odeme_aktif')==='1'?'#E07090':'#D1D5DB',borderRadius:'24px',transition:'0.2s'}}>
                          <span style={{position:'absolute',left:get('odeme','kapida_odeme_aktif')==='1'?'22px':'2px',top:'2px',width:'20px',height:'20px',background:'#fff',borderRadius:'50%',transition:'0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                        </span>
                      </label>
                    </div>

                    {/* Kapıda Ödeme Ücreti */}
                    {get('odeme','kapida_odeme_aktif')==='1' && (
                      <div style={{paddingLeft:'16px'}}>
                        {inp('Kapıda Ödeme Ücreti (₺, 0 = ücretsiz)','odeme','kapida_odeme_ucreti','number','0')}
                      </div>
                    )}

                    {/* Havale/EFT */}
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#F8F7FC',borderRadius:'12px',padding:'14px 16px',border:'1px solid #F0ECF5'}}>
                      <div>
                        <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',margin:'0 0 2px'}}>🏦 Havale / EFT</p>
                        <p style={{fontSize:'11px',color:'#9CA3AF',margin:0}}>Müşteri banka hesabınıza havale/EFT ile ödeme yapar</p>
                      </div>
                      <label style={{position:'relative',display:'inline-block',width:'44px',height:'24px',cursor:'pointer',flexShrink:0}}>
                        <input type="checkbox" checked={get('odeme','havale_aktif')==='1'} onChange={e=>set('odeme','havale_aktif',e.target.checked?'1':'0')} style={{opacity:0,width:0,height:0}}/>
                        <span style={{position:'absolute',inset:0,background:get('odeme','havale_aktif')==='1'?'#3B9FCC':'#D1D5DB',borderRadius:'24px',transition:'0.2s'}}>
                          <span style={{position:'absolute',left:get('odeme','havale_aktif')==='1'?'22px':'2px',top:'2px',width:'20px',height:'20px',background:'#fff',borderRadius:'50%',transition:'0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
                        </span>
                      </label>
                    </div>

                    {/* Havale Banka Bilgileri */}
                    {get('odeme','havale_aktif')==='1' && (
                      <div style={{paddingLeft:'16px',display:'flex',flexDirection:'column',gap:'10px'}}>
                        {inp('Banka Adı','odeme','havale_banka','text','Ziraat Bankası')}
                        {inp('Hesap Sahibi','odeme','havale_hesap_sahibi','text','Keba Gıda San. Tic. A.Ş.')}
                        {inp('IBAN','odeme','havale_iban','text','TR00 0000 0000 0000 0000 0000 00')}
                        {inp('Açıklama (opsiyonel)','odeme','havale_aciklama','text','Sipariş numaranızı açıklamaya yazmayı unutmayın')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {aktifTab==='kargo' && (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Kurye Ayarları</h2>
                {inp('Standart Kurye Ücreti (₺)','kargo','standart_kargo_ucreti','number','49.90')}
                {inp('Ücretsiz Kurye Alt Tutarı (₺)','kargo','ucretsiz_kargo_tutari','number','500')}
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

                {/* ETBİS Logo */}
                <div style={{marginTop:'8px'}}>
                  <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'8px'}}>ETBİS Logo</label>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                    {get('genel','etbis_logo_url') ? (
                      <img src={get('genel','etbis_logo_url')} alt="ETBİS Logo" style={{height:'60px',objectFit:'contain',borderRadius:'8px',border:'1px solid #F0ECF5',padding:'4px',background:'#F8F7FC'}}
                        onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                    ) : (
                      <div style={{height:'60px',width:'120px',background:'#F8F7FC',border:'1px dashed #E0D8F0',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color:'#9CA3AF'}}>Logo yok</div>
                    )}
                    <div style={{flex:1,minWidth:'200px'}}>
                      <input type="text" value={get('genel','etbis_logo_url')} onChange={e=>set('genel','etbis_logo_url',e.target.value)}
                        placeholder="https://... (logo URL veya Medya'dan kopyalayın)"
                        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const}}/>
                      <p style={{fontSize:'11px',color:'#9CA3AF',marginTop:'4px'}}>Medya sayfasından logo yükleyip URL'sini buraya yapıştırabilirsiniz.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {aktifTab==='favicon' && (
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Favicon Ayarları</h2>
                  <p style={{fontSize:'13px',color:'#9CA3AF',margin:'0'}}>Tarayıcı sekmesinde görünen küçük ikon. ICO, PNG veya SVG önerilir (ideal: 32x32 px).</p>
                </div>
                <div style={{background:'#F8F7FC',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px',display:'flex',alignItems:'center',gap:'20px'}}>
                  <div style={{width:'80px',height:'80px',borderRadius:'14px',border:'2px solid #E8E4F0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}>
                    {faviconUrl ? (
                      <img src={faviconUrl} alt="Favicon" style={{width:'48px',height:'48px',objectFit:'contain'}} onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                    ) : (
                      <span style={{fontSize:'28px'}}>🌐</span>
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontSize:'14px',fontWeight:600,color:'#1C1B2E',marginBottom:'4px'}}>
                      {faviconUrl ? 'Mevcut Favicon' : 'Favicon Yüklenmemiş'}
                    </p>
                    <p style={{fontSize:'12px',color:'#9CA3AF',marginBottom:'12px',wordBreak:'break-all'}}>
                      {faviconUrl || 'Henüz bir favicon yüklenmedi.'}
                    </p>
                    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                      <button onClick={()=>faviconRef.current?.click()} disabled={faviconYukleniyor}
                        style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'8px 16px',borderRadius:'50px',border:'none',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:faviconYukleniyor?0.7:1}}>
                        <Upload size={13}/>{faviconYukleniyor?'Yükleniyor...':'Yeni Favicon Yükle'}
                      </button>
                      {faviconUrl && (
                        <button onClick={faviconSil}
                          style={{display:'flex',alignItems:'center',gap:'6px',background:'#FEF2F2',color:'#EF4444',padding:'8px 16px',borderRadius:'50px',border:'none',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                          <Trash2 size={13}/>Kaldır
                        </button>
                      )}
                    </div>
                    <input ref={faviconRef} type="file" accept=".ico,.png,.svg,.jpg,.jpeg,.webp" style={{display:'none'}} onChange={e=>faviconYukle(e.target.files)}/>
                  </div>
                </div>
                <div
                  onDragOver={e=>e.preventDefault()}
                  onDrop={e=>{e.preventDefault();faviconYukle(e.dataTransfer.files)}}
                  onClick={()=>faviconRef.current?.click()}
                  style={{border:'2px dashed #E8E4F0',borderRadius:'16px',padding:'32px',textAlign:'center',cursor:'pointer',background:'#FAFAF9',transition:'all .2s'}}>
                  <Upload size={28} style={{color:'#D1D5DB',margin:'0 auto 10px',display:'block'}}/>
                  <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',marginBottom:'4px'}}>Sürükleyip bırakın veya tıklayın</p>
                  <p style={{fontSize:'11px',color:'#9CA3AF'}}>ICO, PNG, SVG, WebP — maks. 1 MB</p>
                </div>
                <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:'12px',padding:'14px 16px',fontSize:'13px',color:'#075985'}}>
                  💡 Favicon değişikliği sonrasında Next.js uygulamasının yeniden deploy edilmesi gerekebilir. Tarayıcınızı yenileyerek (Ctrl+F5) sonucu görebilirsiniz.
                </div>
              </div>
            )}
            {aktifTab==='whatsapp' && (
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>WhatsApp Butonu</h2>
                <p style={{fontSize:'13px',color:'#9CA3AF',margin:'0 0 8px'}}>Numara ve yazı girilince site genelinde WhatsApp butonu aktif olur.</p>
                {inp('WhatsApp Numarası','whatsapp','numara','text','905321234567 (başında + olmadan)')}
                {inp('Buton Yazısı','whatsapp','yazi','text','Sipariş için WhatsApp')}
                {inp('Ön Mesaj','whatsapp','mesaj','text','Merhaba, sipariş vermek istiyorum.')}
                <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'12px',padding:'14px 16px',fontSize:'13px',color:'#166534'}}>
                  ✅ Numara girildiğinde buton otomatik aktif olur, boşsa gizlenir.
                </div>
              </div>
            )}
            {aktifTab==='anasayfa' && (
              <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
                <h2 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'0'}}>🏠 Ana Sayfa İçerikleri</h2>
                <p style={{fontSize:'12px',color:'#9CA3AF',margin:'0'}}>Bu bölümdeki değişiklikler Kaydet butonuna bastıktan sonra siteye yansır.</p>

                {/* HERO */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>🎯 Hero Bölümü</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                    {inp('Rozet Yazısı','anasayfa','hero_rozet','text','Çiftliğimizden Sofranıza')}
                    {inp('Başlık Satır 1','anasayfa','hero_baslik_1','text','Mutluluğun')}
                    {inp('Başlık Satır 2 (italik)','anasayfa','hero_baslik_2','text','Tadını')}
                    {inp('Başlık Satır 3','anasayfa','hero_baslik_3','text','Hissedin')}
                    <div>
                      <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Açıklama Metni</label>
                      <textarea value={get('anasayfa','hero_aciklama')} onChange={e=>set('anasayfa','hero_aciklama',e.target.value)} rows={3}
                        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none'}}/>
                    </div>
                    {inp('Sipariş Butonu','anasayfa','hero_btn_siparis','text','Hemen Sipariş Ver')}
                    {inp('Abonelik Butonu','anasayfa','hero_btn_abonelik','text','Abonelik')}
                    {inp('Görsel URL','anasayfa','hero_gorsel_url','text','https://...')}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {inp('İstat 1 Sayı','anasayfa','hero_stat_1_sayi','text','10.5K')}
                      {inp('İstat 1 Etiket','anasayfa','hero_stat_1_etiket','text','Büyükbaş')}
                      {inp('İstat 2 Sayı','anasayfa','hero_stat_2_sayi','text','✓')}
                      {inp('İstat 2 Etiket','anasayfa','hero_stat_2_etiket','text','Katkısız')}
                      {inp('İstat 3 Sayı','anasayfa','hero_stat_3_sayi','text','AB')}
                      {inp('İstat 3 Etiket','anasayfa','hero_stat_3_etiket','text','Onaylı')}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {inp('Kart 1 Emoji','anasayfa','hero_kart_1_emoji','text','🥛')}
                      {inp('Kart 1 Adı','anasayfa','hero_kart_1_ad','text','Çiğ Süt 2L')}
                      {inp('Kart 1 Alt Yazı','anasayfa','hero_kart_1_alt','text','₺130')}
                      {inp('Kart 2 Emoji','anasayfa','hero_kart_2_emoji','text','⭐')}
                      {inp('Kart 2 Adı','anasayfa','hero_kart_2_ad','text','4.9/5 Puan')}
                      {inp('Kart 2 Alt Yazı','anasayfa','hero_kart_2_alt','text','500+ Yorum')}
                    </div>
                  </div>
                </div>

                {/* TICKER */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>📢 Kayan Yazı (Ticker)</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {inp('1. Sol','anasayfa','ticker_1','text','Çiğ Süt')}
                    {inp('1. Sağ','anasayfa','ticker_1b','text','Günlük Taze')}
                    {inp('2. Sol','anasayfa','ticker_2','text','Peynir')}
                    {inp('2. Sağ','anasayfa','ticker_2b','text','5 Çeşit')}
                    {inp('3. Sol','anasayfa','ticker_3','text','Tereyağı')}
                    {inp('3. Sağ','anasayfa','ticker_3b','text','Katkısız')}
                    {inp('4. Sol','anasayfa','ticker_4','text','Abonelik')}
                    {inp('4. Sağ','anasayfa','ticker_4b','text','Her Cuma')}
                    {inp('5. Sol','anasayfa','ticker_5','text','AB Onaylı')}
                    {inp('5. Sağ','anasayfa','ticker_5b','text','Sertifikalı')}
                    {inp('6. Sol','anasayfa','ticker_6','text','İstanbul')}
                    {inp('6. Sağ','anasayfa','ticker_6b','text','Aynı Gün')}
                  </div>
                </div>

                {/* KATEGORİLER */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>🗂️ Kategoriler Bölümü</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {inp('Üst Etiket','anasayfa','kategoriler_tag','text','Kategoriler')}
                      {inp('Başlık','anasayfa','kategoriler_baslik','text','Doğallığı')}
                      {inp('Başlık (italik)','anasayfa','kategoriler_baslik_italik','text','Keşfedin')}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {inp('Kat 1 Etiket','anasayfa','kat_1_etiket','text','En Çok Satan')}
                      {inp('Kat 1 Adı','anasayfa','kat_1_ad','text','Çiğ İnek Sütü')}
                      {inp('Kat 2 Etiket','anasayfa','kat_2_etiket','text','Peynir')}
                      {inp('Kat 2 Adı','anasayfa','kat_2_ad','text','Sürülebilir Peynir')}
                      {inp('Kat 3 Etiket','anasayfa','kat_3_etiket','text','Tereyağı')}
                      {inp('Kat 3 Adı','anasayfa','kat_3_ad','text','Doğal Tereyağı')}
                      {inp('Kat 4 Etiket','anasayfa','kat_4_etiket','text','Özel')}
                      {inp('Kat 4 Adı','anasayfa','kat_4_ad','text','Abonelik')}
                    </div>
                  </div>
                </div>

                {/* ÜRÜNLER */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>🛍️ Ürünler Bölümü</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {inp('Üst Etiket','anasayfa','urunler_tag','text','En Çok Satanlar')}
                    {inp('Başlık','anasayfa','urunler_baslik','text','Çok')}
                    {inp('Başlık (italik)','anasayfa','urunler_baslik_italik','text','Sevilenler')}
                    {inp('Tümünü Gör Butonu','anasayfa','urunler_tumu','text','Tümünü Gör')}
                  </div>
                </div>

                {/* PAKETLER */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>🎁 Paketler Bölümü</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {inp('Üst Etiket','anasayfa','paketler_tag','text','🎁 Özel Fırsatlar')}
                    {inp('Başlık','anasayfa','paketler_baslik','text','Hazır Paketlerimiz')}
                    {inp('Tümünü Gör Butonu','anasayfa','paketler_tumu','text','Tümünü Gör →')}
                  </div>
                </div>

                {/* ABONELİK */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>🔄 Abonelik Bölümü</h3>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      {inp('Üst Etiket','anasayfa','abonelik_tag','text','⟳ Haftalık Abonelik')}
                      {inp('Başlık','anasayfa','abonelik_baslik','text','Her Hafta Taze,')}
                      {inp('Başlık (italik)','anasayfa','abonelik_baslik_italik','text','Hiç Düşünmeden')}
                      {inp('Buton','anasayfa','abonelik_btn','text','Abonelik Başlat')}
                    </div>
                    {inp('Madde 1','anasayfa','abonelik_madde_1','text','İstediğiniz zaman iptal')}
                    {inp('Madde 2','anasayfa','abonelik_madde_2','text','Miktarı değiştirme')}
                    {inp('Madde 3','anasayfa','abonelik_madde_3','text','Her Cuma teslimat')}
                    {inp('Madde 4','anasayfa','abonelik_madde_4','text','Abonelere %10 indirim')}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px'}}>
                      {inp('Plan 1 Adı','anasayfa','abonelik_plan_1_ad','text','Başlangıç')}
                      {inp('Plan 1 Detay','anasayfa','abonelik_plan_1_detay','text','2L · Haftada Bir')}
                      {inp('Plan 1 Fiyat','anasayfa','abonelik_plan_1_fiyat','text','520')}
                      {inp('Plan 2 Adı','anasayfa','abonelik_plan_2_ad','text','Aile')}
                      {inp('Plan 2 Detay','anasayfa','abonelik_plan_2_detay','text','4L · Haftada Bir')}
                      {inp('Plan 2 Fiyat','anasayfa','abonelik_plan_2_fiyat','text','980')}
                      {inp('Plan 3 Adı','anasayfa','abonelik_plan_3_ad','text','Premium')}
                      {inp('Plan 3 Detay','anasayfa','abonelik_plan_3_detay','text','6L · Haftada Bir')}
                      {inp('Plan 3 Fiyat','anasayfa','abonelik_plan_3_fiyat','text','1.380')}
                    </div>
                  </div>
                </div>

                {/* YORUMLAR */}
                <div style={{borderBottom:'1px solid #F0ECF5',paddingBottom:'20px'}}>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>⭐ Müşteri Yorumları</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {inp('Üst Etiket','anasayfa','yorumlar_tag','text','Müşterilerimiz')}
                    {inp('Başlık','anasayfa','yorumlar_baslik','text','Sizden')}
                    {inp('Başlık (italik)','anasayfa','yorumlar_baslik_italik','text','Gelenler')}
                  </div>
                  {[1,2,3].map(n=>(
                    <div key={n} style={{marginTop:'14px',background:'#F8F7FC',borderRadius:'12px',padding:'14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                      <p style={{fontSize:'11px',fontWeight:700,color:'#6B7280',margin:0}}>Yorum {n}</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
                        {inp(`Baş Harf`,'anasayfa',`yorum_${n}_harf`,'text','E')}
                        {inp(`Ad Soyad`,'anasayfa',`yorum_${n}_ad`,'text','Ebru G.')}
                        {inp(`Lokasyon`,'anasayfa',`yorum_${n}_lokasyon`,'text','İstanbul')}
                      </div>
                      <div>
                        <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Yorum Metni</label>
                        <textarea value={get('anasayfa',`yorum_${n}_metin`)} onChange={e=>set('anasayfa',`yorum_${n}_metin`,e.target.value)} rows={2}
                          style={{width:'100%',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none'}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BÜLTEN */}
                <div>
                  <h3 style={{fontSize:'13px',fontWeight:700,color:'#E8567A',marginBottom:'14px',letterSpacing:'.05em',textTransform:'uppercase'}}>📧 Bülten Bölümü</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {inp('Başlık','anasayfa','bulten_baslik','text','İlk Siparişte')}
                    {inp('Başlık (italik)','anasayfa','bulten_baslik_italik','text','%10 İndirim')}
                    {inp('Açıklama','anasayfa','bulten_aciklama','text','Bültene katılın...')}
                    {inp('Placeholder','anasayfa','bulten_placeholder','text','E-posta adresiniz')}
                    {inp('Buton','anasayfa','bulten_btn','text','Katıl')}
                  </div>
                </div>

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
