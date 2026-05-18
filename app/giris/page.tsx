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
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) { setHata('E-posta veya şifre hatalı.'); setYukleniyor(false); return }
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Nunito, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Blob arka plan */}
      <div className="blob blob-p" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
      <div className="blob blob-b" style={{ width: '300px', height: '300px', bottom: '-80px', right: '-80px' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 2 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A6070', textDecoration: 'none', marginBottom: '32px' }}>
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </Link>

        <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '40px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '32px', color: '#1A0A12', marginBottom: '4px' }}>
              milgo<span style={{ color: '#E8567A' }}>.</span>
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px', letterSpacing: '.05em' }}>E-POSTA</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="ornek@email.com"
                style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box', transition: 'border-color .2s' }}
                onFocus={e => e.target.style.borderColor = '#E8567A'}
                onBlur={e => e.target.style.borderColor = 'rgba(26,10,18,0.1)'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1A0A12', letterSpacing: '.05em' }}>ŞİFRE</label>
                <Link href="/sifre-sifirla" style={{ fontSize: '12px', color: '#E8567A', textDecoration: 'none', fontWeight: 600 }}>Şifremi Unuttum</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={goster ? 'text' : 'password'} value={sifre} onChange={e => setSifre(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 48px 13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box', transition: 'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor = '#E8567A'}
                  onBlur={e => e.target.style.borderColor = 'rgba(26,10,18,0.1)'}
                />
                <button type="button" onClick={() => setGoster(!goster)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'none', color: '#7A6070', display: 'flex', alignItems: 'center' }}>
                  {goster ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={yukleniyor} style={{ width: '100%', background: yukleniyor ? '#7A6070' : '#1A0A12', color: '#fff', border: 'none', borderRadius: '50px', padding: '15px', fontSize: '14px', fontWeight: 700, cursor: 'none', fontFamily: 'Nunito, sans-serif', marginTop: '8px', transition: 'background .2s', letterSpacing: '.03em' }}>
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(26,10,18,0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#7A6070', margin: 0 }}>
              Hesabınız yok mu?{' '}
              <Link href="/kayit" style={{ color: '#E8567A', fontWeight: 700, textDecoration: 'none' }}>Üye Ol</Link>
            </p>
          </div>
        </div>

        {/* Güven */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['🔒 SSL Güvenli', '🌿 %100 Doğal', '🚚 Hızlı Teslimat'].map(b => (
            <span key={b} style={{ fontSize: '11px', color: 'rgba(26,10,18,0.5)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
