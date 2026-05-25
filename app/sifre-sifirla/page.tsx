'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'
export default function SifreSifirlaPage() {
  const [email, setEmail] = useState('')
  const [gonderildi, setGonderildi] = useState(false)
  const [loading, setLoading] = useState(false)
  const gonder = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) { toast.error(error.message); setLoading(false); return }
    setGonderildi(true); setLoading(false)
  }
  if (gonderildi) return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'#fff',borderRadius:'24px',padding:'48px',maxWidth:'400px',textAlign:'center',border:'1px solid #F0ECF5'}}>
        <div style={{width:'64px',height:'64px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}><Check size={28} style={{color:'#fff'}}/></div>
        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',color:'#1C1B2E',marginBottom:'8px'}}>E-posta Gönderildi</h2>
        <p style={{fontSize:'14px',color:'#6B7280',marginBottom:'24px'}}>Şifre sıfırlama bağlantısı {email} adresine gönderildi.</p>
        <Link href="/giris" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'12px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700}}>Giriş Yap</Link>
      </div>
    </div>
  )
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'380px'}}>
        <Link href="/giris" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'24px'}}><ArrowLeft size={14}/>Giriş Sayfasına Dön</Link>
        <div style={{background:'#fff',borderRadius:'24px',padding:'36px',border:'1px solid #F0ECF5'}}>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',color:'#1C1B2E',marginBottom:'4px',textAlign:'center'}}>milgo<span style={{color:'#E07090'}}>.</span></div>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px',textAlign:'center'}}>Şifre Sıfırla</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF',marginBottom:'24px',textAlign:'center'}}>E-posta adresinize sıfırlama linki gönderilecek</p>
          <form onSubmit={gonder}>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>E-posta</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="ornek@email.com" style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'12px',padding:'12px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
            </div>
            <button type="submit" disabled={loading} style={{width:'100%',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'14px',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>{loading?'Gönderiliyor...':'Sıfırlama Linki Gönder'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
