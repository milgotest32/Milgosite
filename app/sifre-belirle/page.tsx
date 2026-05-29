'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Check, Eye, EyeOff, AlertCircle } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function SifreBelirle() {
  const [sifre, setSifre] = useState('')
  const [sifreTekrar, setSifreTekrar] = useState('')
  const [goster, setGoster] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mesaj, setMesaj] = useState<{ tip: 'basari' | 'hata'; metin: string } | null>(null)
  const [hazir, setHazir] = useState(false)
  const [tamamlandi, setTamamlandi] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase şifre sıfırlama linkinden gelen token'ı yakala
    // URL: /sifre-belirle#access_token=...&type=recovery
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      // Supabase client token'ı otomatik işler, session'a geçirir
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setHazir(true)
        }
      })
      return () => subscription.unsubscribe()
    } else {
      // Token yoksa, mevcut oturuma bak
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setHazir(true)
        } else {
          router.push('/sifre-sifirla')
        }
      })
    }
  }, [router])

  const sifreKaydet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sifre.length < 6) {
      setMesaj({ tip: 'hata', metin: 'Şifre en az 6 karakter olmalı.' })
      return
    }
    if (sifre !== sifreTekrar) {
      setMesaj({ tip: 'hata', metin: 'Şifreler eşleşmiyor.' })
      return
    }
    setLoading(true)
    setMesaj(null)
    const { error } = await supabase.auth.updateUser({ password: sifre })
    if (error) {
      setMesaj({ tip: 'hata', metin: 'Şifre belirlenemedi: ' + error.message })
      setLoading(false)
      return
    }
    setTamamlandi(true)
    setLoading(false)
    // 2 saniye sonra hesabıma yönlendir
    setTimeout(() => router.push('/hesabim'), 2000)
  }

  if (tamamlandi) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '28px', padding: '48px 40px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={32} color="#fff" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A0A12', marginBottom: 8 }}>Şifreniz Belirlendi!</h2>
        <p style={{ fontSize: 14, color: '#7A6070', marginBottom: 0 }}>Hesabınıza yönlendiriliyorsunuz...</p>
      </div>
    </div>
  )

  if (!hazir) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8567A', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderRadius: '32px', padding: '40px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 60px rgba(26,10,18,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img
              src="https://jxfegluntgssrgpnvscs.supabase.co/storage/v1/object/public/site-medya/medya/1779186053874-lpldyhy0u38.png"
              alt="Milgo"
              style={{ height: 56, width: 'auto', objectFit: 'contain', marginBottom: 16 }}
            />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A0A12', margin: '0 0 4px' }}>Şifrenizi Belirleyin</h1>
            <p style={{ fontSize: 13, color: '#7A6070', margin: 0 }}>Hesabınız için yeni bir şifre oluşturun</p>
          </div>

          {mesaj && (
            <div style={{
              background: mesaj.tip === 'hata' ? '#FEE8EF' : '#F0FDF4',
              border: `1px solid ${mesaj.tip === 'hata' ? '#F4A7B9' : '#BBF7D0'}`,
              borderRadius: 12, padding: '12px 16px', marginBottom: 20,
              fontSize: 13, fontWeight: 600,
              color: mesaj.tip === 'hata' ? '#E8567A' : '#16A34A',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <AlertCircle size={16} />
              {mesaj.metin}
            </div>
          )}

          <form onSubmit={sifreKaydet} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A0A12', marginBottom: 8 }}>YENİ ŞİFRE</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={goster ? 'text' : 'password'}
                  value={sifre}
                  onChange={e => setSifre(e.target.value)}
                  required
                  placeholder="En az 6 karakter"
                  style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: 14, padding: '13px 48px 13px 16px', fontSize: 14, color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setGoster(!goster)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7A6070' }}>
                  {goster ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1A0A12', marginBottom: 8 }}>ŞİFRE TEKRAR</label>
              <input
                type={goster ? 'text' : 'password'}
                value={sifreTekrar}
                onChange={e => setSifreTekrar(e.target.value)}
                required
                placeholder="Şifreyi tekrar girin"
                style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)', borderRadius: 14, padding: '13px 16px', fontSize: 14, color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: loading ? '#F0ECF5' : 'linear-gradient(135deg, #E8567A, #3B9FCC)', color: loading ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 50, padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}
            >
              {loading ? 'Kaydediliyor...' : 'Şifremi Belirle'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#9CA3AF', marginTop: 20 }}>
            <Link href="/giris" style={{ color: '#E8567A', fontWeight: 600, textDecoration: 'none' }}>Giriş Sayfasına Dön</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
