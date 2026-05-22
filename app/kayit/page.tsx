'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function KayitPage() {
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', sifre: '', sifreTekrar: '', telefon: '' })
  const [goster, setGoster] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [basarili, setBasarili] = useState(false)
  const router = useRouter()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const kayitOl = async (e: React.FormEvent) => {
    e.preventDefault()
    setHata('')
    if (form.sifre !== form.sifreTekrar) { setHata('Şifreler eşleşmiyor.'); return }
    if (form.sifre.length < 6) { setHata('Şifre en az 6 karakter olmalı.'); return }
    setYukleniyor(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.sifre,
      options: { data: { ad: form.ad, soyad: form.soyad, telefon: form.telefon } }
    })
    if (error) { setHata(error.message); setYukleniyor(false); return }
    if (data.user) {
      await supabase.from('site_users').insert({ id: data.user.id, email: form.email, ad: form.ad, soyad: form.soyad, telefon: form.telefon, rol: 'musteri' }).select()
    }
    setBasarili(true)
    setYukleniyor(false)
  }

  const inp = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px', letterSpacing: '.05em' }}>{label.toUpperCase()}</label>
      <input
        type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)}
        placeholder={placeholder} required={key !== 'telefon'}
        style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box', transition: 'border-color .2s' }}
        onFocus={e => e.target.style.borderColor = '#E8567A'}
        onBlur={e => e.target.style.borderColor = 'rgba(26,10,18,0.1)'}
      />
    </div>
  )

  if (basarili) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF, #EBF5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '32px', padding: '48px 40px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
        <div style={{ width: '64px', height: '64px', background: '#E8567A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={28} color="#fff" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '28px', color: '#1A0A12', marginBottom: '12px' }}>Kayıt Başarılı!</h2>
        <p style={{ fontSize: '14px', color: '#7A6070', lineHeight: 1.7, marginBottom: '28px' }}>
          <strong>{form.email}</strong> adresine doğrulama e-postası gönderdik. Lütfen e-postanızı kontrol edin.
        </p>
        <Link href="/giris" style={{ display: 'inline-block', background: '#1A0A12', color: '#fff', padding: '13px 32px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}>
          Giriş Yap →
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Nunito, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <div className="blob blob-p" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px' }} />
      <div className="blob blob-b" style={{ width: '300px', height: '300px', bottom: '-80px', left: '-80px' }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 2 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#7A6070', textDecoration: 'none', marginBottom: '28px' }}>
          <ArrowLeft size={14} /> Ana Sayfaya Dön
        </Link>

        <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '36px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '30px', color: '#1A0A12', marginBottom: '4px' }}>
              milgo<span style={{ color: '#E8567A' }}>.</span>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', margin: 0 }}>Üye Ol</h1>
            <p style={{ fontSize: '13px', color: '#7A6070', margin: '4px 0 0' }}>İlk siparişinizde %10 indirim</p>
          </div>

          {hata && (
            <div style={{ background: '#FEE8EF', border: '1px solid #F4A7B9', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#E8567A', fontWeight: 600 }}>
              ⚠️ {hata}
            </div>
          )}

          <form onSubmit={kayitOl} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {inp('Ad', 'ad', 'text', 'Adınız')}
              {inp('Soyad', 'soyad', 'text', 'Soyadınız')}
            </div>
            {inp('E-posta', 'email', 'email', 'ornek@email.com')}
            {inp('Telefon (isteğe bağlı)', 'telefon', 'tel', '05XX XXX XX XX')}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px', letterSpacing: '.05em' }}>ŞİFRE</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={goster ? 'text' : 'password'} value={form.sifre} onChange={e => set('sifre', e.target.value)}
                  placeholder="En az 6 karakter" required
                  style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: '14px', padding: '13px 48px 13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box', transition: 'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor = '#E8567A'}
                  onBlur={e => e.target.style.borderColor = 'rgba(26,10,18,0.1)'}
                />
                <button type="button" onClick={() => setGoster(!goster)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'inherit', color: '#7A6070', display: 'flex', alignItems: 'center' }}>
                  {goster ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px', letterSpacing: '.05em' }}>ŞİFRE TEKRAR</label>
              <input
                type="password" value={form.sifreTekrar} onChange={e => set('sifreTekrar', e.target.value)}
                placeholder="Şifrenizi tekrar girin" required
                style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: `1.5px solid ${form.sifreTekrar && form.sifre !== form.sifreTekrar ? '#E8567A' : 'rgba(26,10,18,0.1)'}`, borderRadius: '14px', padding: '13px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#E8567A'}
                onBlur={e => e.target.style.borderColor = form.sifre !== form.sifreTekrar ? '#E8567A' : 'rgba(26,10,18,0.1)'}
              />
            </div>

            <button type="submit" disabled={yukleniyor} style={{ width: '100%', background: yukleniyor ? '#7A6070' : '#E8567A', color: '#fff', border: 'none', borderRadius: '50px', padding: '15px', fontSize: '14px', fontWeight: 700, cursor: 'inherit', fontFamily: 'Nunito, sans-serif', marginTop: '4px', transition: 'background .2s', boxShadow: '0 6px 20px rgba(232,86,122,0.35)' }}>
              {yukleniyor ? 'Kaydediliyor...' : 'Üye Ol →'}
            </button>

            <p style={{ fontSize: '11px', color: '#7A6070', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.6 }}>
              Üye olarak <Link href="/gizlilik" style={{ color: '#E8567A' }}>Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.
            </p>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(26,10,18,0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#7A6070', margin: 0 }}>
              Zaten üye misiniz?{' '}
              <Link href="/giris" style={{ color: '#E8567A', fontWeight: 700, textDecoration: 'none' }}>Giriş Yap</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
