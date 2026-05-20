'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

const ALANLAR = [
  { k: 'alt_baslik', label: 'Üst Etiket (küçük yazı)', tip: 'text', placeholder: 'Biz Kimiz' },
  { k: 'baslik', label: 'Ana Başlık', tip: 'text', placeholder: 'Kalitenin ve Doğallığın İzinde' },
  { k: 'giris_metni', label: 'Giriş Metni (hero altı)', tip: 'textarea', placeholder: 'Milgo Çiğ Süt...' },
  { k: 'misyon', label: 'Misyon / Temel Prensip', tip: 'textarea', placeholder: 'Temel prensibimiz...' },
  { k: 'ciftlik_baslik', label: 'Çiftlik Bölümü Başlığı', tip: 'text', placeholder: 'Milgo Süt Ürünleri: Mutluluğun Tadı' },
  { k: 'ciftlik_metin', label: 'Çiftlik Açıklama Metni', tip: 'textarea', placeholder: 'Ata Sancak Acıpayam...' },
  { k: 'urunler_metni', label: 'Ürünler Genel Açıklama', tip: 'textarea', placeholder: 'Milgo, sadece çiğ süt...' },
  { k: 'tereyag_metni', label: 'Tereyağı Kart Metni', tip: 'textarea', placeholder: "Milgo'nun enfes tereyağı..." },
  { k: 'peynir_metni', label: 'Peynir Kart Metni', tip: 'textarea', placeholder: "Milgo'nun sürülebilir..." },
  { k: 'vizyon', label: 'Vizyon / Kapanış Cümlesi', tip: 'textarea', placeholder: 'Milgo, çiğ süt ile başladığı...' },
]

export default function HakkimizdaAdminPage() {
  const [deger, setDeger] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup','hakkimizda').then(({data})=>{
      const a: Record<string,string> = {}
      data?.forEach((item:any)=>{ a[item.anahtar]=item.deger||'' })
      setDeger(a); setLoading(false)
    })
  }, [])

  const get = (k:string) => deger[k] || ''
  const set = (k:string, v:string) => setDeger(d=>({...d,[k]:v}))

  const kaydet = async () => {
    setSaving(true)
    for (const [anahtar, deg] of Object.entries(deger)) {
      await supabase.from('site_ayarlar').upsert({ grup:'hakkimizda', anahtar, deger: deg }, { onConflict:'grup,anahtar' })
    }
    toast.success('Hakkımızda içeriği kaydedildi!')
    setSaving(false)
  }

  if (loading) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</div>

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Hakkımızda Sayfası</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Site üzerindeki hakkımızda içeriklerini düzenleyin</p>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <Link href="/hakkimizda" target="_blank"
            style={{display:'flex',alignItems:'center',gap:'6px',background:'#F8F7FC',color:'#6B7280',padding:'10px 18px',borderRadius:'50px',border:'1px solid #F0ECF5',fontSize:'13px',fontWeight:600,textDecoration:'none'}}>
            <Eye size={14}/>Önizle
          </Link>
          <button onClick={kaydet} disabled={saving}
            style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            <Save size={15}/>{saving?'Kaydediliyor...':'Kaydet'}
          </button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {ALANLAR.map(alan => (
          <div key={alan.k}
            style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',gridColumn: alan.tip==='textarea' ? 'span 2' : 'span 1'}}>
            <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'8px'}}>{alan.label}</label>
            {alan.tip === 'textarea' ? (
              <textarea value={get(alan.k)} onChange={e=>set(alan.k,e.target.value)} placeholder={alan.placeholder} rows={3}
                style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'vertical',boxSizing:'border-box' as const}}/>
            ) : (
              <input type="text" value={get(alan.k)} onChange={e=>set(alan.k,e.target.value)} placeholder={alan.placeholder}
                style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const}}/>
            )}
          </div>
        ))}
      </div>

      <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:'12px',padding:'14px 16px',fontSize:'13px',color:'#075985',marginTop:'16px'}}>
        💡 Değişiklikler anında siteye yansır. Önizle butonuyla canlı sayfayı kontrol edebilirsiniz.
      </div>
    </div>
  )
}
