'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function GirisPage() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [goster, setGoster] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const router = useRouter()

  const girisYap = async (e: React.FormEvent) => {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) { setHata('E-posta veya şifre hatalı.'); setYukleniyor(false); return }
    // Admin kontrolü
    if (data.user) {
      const { data: profile } = await supabase.from('site_users').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'admin') { router.push('/admin'); return }
    }
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Nunito, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div className="blob blob-p" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
      <div className="blob blob-b" style={{ width: '300px', height: '300px', bottom: '-80px', right: '-80px' }} />
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 2 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A6070', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </Link>
        <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '40px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '32px', color: '#1A0A12', marginBottom: '4px' }}>
              <img src="https://jxfegluntgssrgpnvscs.supabase.co/storage/v1/object/public/site-medya/medya/1779186053874-lpldyhy0u38.png" alt="Milgo" style={{ height: "64px", width: "auto", objectFit: "contain", marginBottom: "8px" }} />
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', margin: 0 }}>Hoş Geldiniz</h1>
            <p style={{ fontSize: '13px', color: '#7A6070', margin: '4px 0 0' }}>Hesabınıza giriş yapın</p>
          </div>
          {hata && (
            <div style={{ background: '#FEE8EF', border: '1px solid #F4A7B9', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#E8567A', fontWeight: 600 }}>
              ⚠️ {hata}
            </div>
          )}
          <form onSubmit={girisYap} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px' }}>E-POSTA</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ornek@email.com"
                style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px' }}>ŞİFRE</label>
              <div style={{ position: 'relative' }}>
                <input type={goster ? 'text' : 'password'} value={sifre} onChange={e => setSifre(e.target.value)} required placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 48px 13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setGoster(!goster)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7A6070' }}>
                  {goster ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Link href="/sifre-sifirla" style={{ fontSize: '12px', color: '#E8567A', textDecoration: 'none' }}>Şifremi Unuttum</Link>
            </div>
            <button type="submit" disabled={yukleniyor}
              style={{ width: '100%', background: 'linear-gradient(135deg, #E8567A, #3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A6070', marginTop: '24px' }}>
            Hesabınız yok mu? <Link href="/kayit" style={{ color: '#E8567A', fontWeight: 700, textDecoration: 'none' }}>Kayıt Ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
