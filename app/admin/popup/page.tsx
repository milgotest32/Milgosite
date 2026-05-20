'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function PopupAdminPage() {
  const [form, setForm] = useState({
    aktif: '0', baslik: '', metin: '', buton_yazi: '', buton_link: '',
    gorsel_url: '', arka_plan: '#FEF0F4', gecikme: '2', tekrar_sure: '24',
    kapat_dugme: '1', tip: 'bilgi'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup','popup').then(({data}) => {
      if (!data?.length) return
      const a: any = {}
      data.forEach((item: any) => { a[item.anahtar] = item.deger || '' })
      setForm(f => ({...f, ...a}))
    })
  }, [])

  const set = (k: string, v: string) => setForm(f => ({...f, [k]: v}))
  const get = (k: string) => (form as any)[k] || ''

  const kaydet = async () => {
    setSaving(true)
    for (const [k, v] of Object.entries(form)) {
      await supabase.from('site_ayarlar').upsert({grup:'popup', anahtar:k, deger:String(v)}, {onConflict:'grup,anahtar'})
    }
    toast.success('Popup ayarları kaydedildi!')
    setSaving(false)
  }

  const inp = (label: string, k: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}</label>
      <input type={type} value={get(k)} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const}}/>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Popup Yönetimi</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Ziyaretçilere gösterilecek popup penceresi</p>
        </div>
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {/* Aktif toggle */}
          <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
            <span style={{fontSize:'13px',fontWeight:600,color:form.aktif==='1'?'#22C55E':'#9CA3AF'}}>{form.aktif==='1'?'Aktif':'Pasif'}</span>
            <div style={{position:'relative',width:'44px',height:'24px'}}>
              <input type="checkbox" checked={form.aktif==='1'} onChange={e=>set('aktif',e.target.checked?'1':'0')} style={{opacity:0,width:0,height:0}}/>
              <span onClick={()=>set('aktif',form.aktif==='1'?'0':'1')} style={{position:'absolute',inset:0,background:form.aktif==='1'?'#22C55E':'#D1D5DB',borderRadius:'24px',cursor:'pointer',transition:'0.2s'}}>
                <span style={{position:'absolute',left:form.aktif==='1'?'22px':'2px',top:'2px',width:'20px',height:'20px',background:'#fff',borderRadius:'50%',transition:'0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
              </span>
            </div>
          </label>
          <button onClick={kaydet} disabled={saving}
            style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Save size={15}/>{saving?'Kaydediliyor...':'Kaydet'}
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'20px',alignItems:'start'}}>
        {/* Sol - Ayarlar */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

          {/* Tip */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Popup Tipi</h3>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {[['bilgi','💡 Bilgi'],['kampanya','🎉 Kampanya'],['duyuru','📢 Duyuru'],['urun','🛍 Ürün']].map(([v,l]) => (
                <button key={v} onClick={()=>set('tip',v)}
                  style={{padding:'8px 16px',borderRadius:'50px',border:`2px solid ${form.tip===v?'#E07090':'#F0ECF5'}`,background:form.tip===v?'#FEF0F4':'#fff',fontSize:'12px',fontWeight:600,cursor:'pointer',color:form.tip===v?'#E07090':'#6B7280'}}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* İçerik */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
            <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>İçerik</h3>
            {inp('Başlık','baslik','text','İlk Siparişe %10 İndirim!')}
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Açıklama Metni</label>
              <textarea value={get('metin')} onChange={e=>set('metin',e.target.value)} rows={3} placeholder="Popup açıklama metni..."
                style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'vertical',boxSizing:'border-box' as const}}/>
            </div>
            {inp('Görsel URL (opsiyonel)','gorsel_url','text','https://...')}
          </div>

          {/* Buton */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
            <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Buton</h3>
            {inp('Buton Yazısı','buton_yazi','text','Hemen Alışveriş Yap')}
            {inp('Buton Linki','buton_link','text','/urunler')}
          </div>

          {/* Ayarlar */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',display:'flex',flexDirection:'column',gap:'14px'}}>
            <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Görünüm & Zamanlama</h3>
            {inp('Arka Plan Rengi','arka_plan','color')}
            {inp('Gecikme (saniye)','gecikme','number','2')}
            {inp('Tekrar Gösterme Süresi (saat)','tekrar_sure','number','24')}
            <div>
              <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                <input type="checkbox" checked={get('kapat_dugme')==='1'} onChange={e=>set('kapat_dugme',e.target.checked?'1':'0')}/>
                <span style={{fontSize:'13px',color:'#1C1B2E'}}>Kapatma butonu göster</span>
              </label>
            </div>
          </div>
        </div>

        {/* Sağ - Önizleme */}
        <div style={{position:'sticky',top:'80px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'16px'}}>
            <h3 style={{fontSize:'12px',fontWeight:700,color:'#9CA3AF',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.1em'}}>Önizleme</h3>
            <div style={{background:'rgba(0,0,0,0.5)',borderRadius:'12px',padding:'20px',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'200px'}}>
              <div style={{background:form.arka_plan||'#FEF0F4',borderRadius:'16px',padding:'24px',maxWidth:'260px',width:'100%',position:'relative',textAlign:'center',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
                {form.kapat_dugme==='1' && (
                  <button style={{position:'absolute',top:'8px',right:'8px',background:'rgba(0,0,0,0.1)',border:'none',borderRadius:'50%',width:'24px',height:'24px',cursor:'pointer',fontSize:'14px',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                )}
                {form.gorsel_url && <img src={form.gorsel_url} alt="" style={{width:'100%',borderRadius:'10px',marginBottom:'12px',objectFit:'cover',maxHeight:'120px'}}/>}
                <p style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'8px'}}>{form.baslik || 'Popup Başlığı'}</p>
                <p style={{fontSize:'12px',color:'#6B7280',marginBottom:'16px',lineHeight:1.6}}>{form.metin || 'Popup açıklama metni buraya gelecek.'}</p>
                {form.buton_yazi && (
                  <div style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',fontSize:'12px',fontWeight:700}}>
                    {form.buton_yazi}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
