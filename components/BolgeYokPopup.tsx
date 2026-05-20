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
    const kontrol = () => {
      const hizmet = localStorage.getItem('milgo_hizmet')
      const bolge = localStorage.getItem('milgo_konum') || ''
      const bolgeId = localStorage.getItem('milgo_bolge_id')

      // Konum var, hizmet bölgesinde ama ürün yoksa
      if (hizmet === 'true' && bolgeId && bolge) {
        supabase.from('site_products')
          .select('id', { count: 'exact', head: true })
          .eq('durum', 'active')
          .contains('bolge_ids', [bolgeId])
          .then(({ count }) => {
            if ((count || 0) === 0) {
              setBolgeAdi(bolge)
              // Daha önce gösterilmediyse göster
              const gosterildi = localStorage.getItem(`bolge_yok_popup_${bolgeId}`)
              if (!gosterildi) setGoster(true)
            }
          })
      }
    }

    kontrol()
    window.addEventListener('milgo_konum_degisti', kontrol)
    return () => window.removeEventListener('milgo_konum_degisti', kontrol)
  }, [])

  const kapat = () => {
    const bolgeId = localStorage.getItem('milgo_bolge_id')
    if (bolgeId) localStorage.setItem(`bolge_yok_popup_${bolgeId}`, '1')
    setGoster(false)
  }

  const bildirimKayit = async () => {
    if (!email || !email.includes('@')) return
    setYukleniyor(true)
    await supabase.from('site_bolge_bildirim').insert({
      email,
      bolge_adi: bolgeAdi,
      bolge_id: localStorage.getItem('milgo_bolge_id'),
    }).catch(() => {})
    setGonderildi(true)
    setYukleniyor(false)
    setTimeout(kapat, 2000)
  }

  if (!goster) return null

  return (
    <div style={{position:'fixed',inset:0,zIndex:998,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}
      onClick={kapat}>
      <div onClick={e=>e.stopPropagation()}
        style={{background:'#fff',borderRadius:'24px',padding:'36px',maxWidth:'400px',width:'100%',textAlign:'center',boxShadow:'0 24px 80px rgba(0,0,0,0.2)',animation:'fadeInUp 0.3s ease',position:'relative'}}>

        {/* Kapat */}
        <button onClick={kapat} style={{position:'absolute',top:'14px',right:'14px',background:'#F8F7FC',border:'none',borderRadius:'50%',width:'32px',height:'32px',cursor:'pointer',fontSize:'16px',color:'#9CA3AF'}}>×</button>

        {/* İkon */}
        <div style={{fontSize:'48px',marginBottom:'16px'}}>🚚</div>

        {/* Başlık */}
        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:400,color:'#1C1B2E',marginBottom:'10px'}}>
          {bolgeAdi} bölgesine yakında hizmet vereceğiz!
        </h2>
        <p style={{fontSize:'14px',color:'#6B7280',lineHeight:1.7,marginBottom:'24px'}}>
          Şu an bu bölgede teslimat yapmıyoruz, ancak çok yakında burada da olacağız. E-posta adresinizi bırakın, hizmet başladığında sizi ilk haberdar edelim! 🎉
        </p>

        {gonderildi ? (
          <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:'14px',padding:'16px',color:'#16A34A',fontSize:'14px',fontWeight:600}}>
            ✅ Harika! Hizmet başladığında sizi bilgilendireceğiz.
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <input
              type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              onKeyDown={e=>e.key==='Enter'&&bildirimKayit()}
              style={{padding:'12px 16px',borderRadius:'12px',border:'1px solid #F0ECF5',fontSize:'14px',outline:'none',fontFamily:'inherit',textAlign:'center'}}
            />
            <button onClick={bildirimKayit} disabled={yukleniyor}
              style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'14px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',opacity:yukleniyor?0.7:1}}>
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
