'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function BolgeYokPopup() {
  const [goster, setGoster] = useState(false)
  const [bolgeAdi, setBolgeAdi] = useState('')
  const [email, setEmail] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)

  useEffect(() => {
    const kontrol = async () => {
      const hizmet = localStorage.getItem('milgo_hizmet')
      const konum = localStorage.getItem('milgo_konum') || ''
      const bolgeId = localStorage.getItem('milgo_bolge_id')

      if (!konum) return // Konum seçilmemişse hiçbir şey yapma

      // Daha önce bu bölge için gösterildiyse tekrar gösterme
      const gosterildiKey = `bolge_yok_popup_${konum}`
      if (localStorage.getItem(gosterildiKey)) return

      let urunYok = false

      if (hizmet === 'false' || !bolgeId) {
        // Hizmet bölgesi dışında - direkt popup göster
        urunYok = true
      } else {
        // Hizmet bölgesinde ama ürün yoksa
        const { count } = await supabase.from('site_products')
          .select('id', { count: 'exact', head: true })
          .eq('durum', 'active')
          .contains('bolge_ids', [bolgeId])
        urunYok = (count || 0) === 0
      }

      if (urunYok) {
        setBolgeAdi(konum)
        setGoster(true)
      }
    }

    // Sayfa ilk yüklendiğinde kontrol et
    kontrol()
    // Konum değiştiğinde tekrar kontrol et
    window.addEventListener('milgo_konum_degisti', kontrol)
    return () => window.removeEventListener('milgo_konum_degisti', kontrol)
  }, [])

  const kapat = () => {
    const konum = localStorage.getItem('milgo_konum') || ''
    if (konum) localStorage.setItem(`bolge_yok_popup_${konum}`, '1')
    setGoster(false)
  }

  const bildirimKayit = async () => {
    if (!email || !email.includes('@')) return
    setYukleniyor(true)
    try {
      await supabase.from('site_bolge_bildirim').insert({
        email,
        bolge_adi: bolgeAdi,
        bolge_id: localStorage.getItem('milgo_bolge_id'),
      })
    } catch {}
    setGonderildi(true)
    setYukleniyor(false)
    setTimeout(kapat, 2000)
  }

  if (!goster) return null

  return (
    <div
      style={{position:'fixed',inset:0,zIndex:998,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}
      onClick={kapat}>
      <div
        onClick={e => e.stopPropagation()}
        style={{background:'#fff',borderRadius:'24px',padding:'36px',maxWidth:'420px',width:'100%',textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,0.25)',position:'relative',animation:'fadeInUp 0.3s ease'}}>

        <button onClick={kapat} style={{position:'absolute',top:'14px',right:'14px',background:'#F8F7FC',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',fontSize:'18px',color:'#9CA3AF',lineHeight:'1',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>

        <div style={{fontSize:'52px',marginBottom:'16px'}}>🚚</div>

        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:400,color:'#1C1B2E',marginBottom:'12px',lineHeight:1.3}}>
          <strong>{bolgeAdi}</strong> bölgesine<br/>yakında hizmet vereceğiz!
        </h2>
        <p style={{fontSize:'14px',color:'#6B7280',lineHeight:1.8,marginBottom:'24px'}}>
          Şu an bu bölgede teslimat yapmıyoruz, ancak çok yakında burada da olacağız. E-posta adresinizi bırakın, hizmet başladığında sizi ilk haberdar edelim! 🎉
        </p>

        {gonderildi ? (
          <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'14px',padding:'16px',color:'#16A34A',fontSize:'14px',fontWeight:600}}>
            ✅ Harika! Hizmet başladığında sizi bilgilendireceğiz.
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              onKeyDown={e => e.key === 'Enter' && bildirimKayit()}
              style={{padding:'12px 16px',borderRadius:'12px',border:'1px solid #E8E4F0',fontSize:'14px',outline:'none',fontFamily:'inherit',textAlign:'center',width:'100%',boxSizing:'border-box' as const}}
            />
            <button onClick={bildirimKayit} disabled={yukleniyor}
              style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'14px',fontSize:'14px',fontWeight:700,cursor:yukleniyor?'not-allowed':'pointer',fontFamily:'inherit',opacity:yukleniyor?0.7:1}}>
              {yukleniyor ? 'Kaydediliyor...' : '🔔 Beni Haberdar Et'}
            </button>
            <button onClick={kapat} style={{background:'none',border:'none',color:'#9CA3AF',fontSize:'13px',cursor:'pointer',padding:'4px'}}>
              Şimdi değil
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
