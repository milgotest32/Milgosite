'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, User, Lock, CheckCircle, AlertCircle } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function AyarlarPage() {
  const [user, setUser] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [ad, setAd] = useState('')
  const [soyad, setSoyad] = useState('')
  const [telefon, setTelefon] = useState('')
  const [mevcutSifre, setMevcutSifre] = useState('')
  const [yeniSifre, setYeniSifre] = useState('')
  const [yeniSifreTekrar, setYeniSifreTekrar] = useState('')
  const [profilMesaj, setProfilMesaj] = useState<{ tip: 'basari' | 'hata'; metin: string } | null>(null)
  const [sifreMesaj, setSifreMesaj] = useState<{ tip: 'basari' | 'hata'; metin: string } | null>(null)
  const [profilYukleniyor, setProfilYukleniyor] = useState(false)
  const [sifreYukleniyor, setSifreYukleniyor] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const u = data.session.user
      setUser(u)
      const meta = u.user_metadata || {}
      setAd(meta.ad || meta.first_name || '')
      setSoyad(meta.soyad || meta.last_name || '')
      setTelefon(meta.telefon || meta.phone || '')
      setYukleniyor(false)
    })
  }, [router])

  const profilKaydet = async () => {
    setProfilYukleniyor(true)
    setProfilMesaj(null)
    const { data: { user: currentUser }, error } = await supabase.auth.updateUser({
      data: { ad, soyad, telefon }
    })
    if (error) {
      setProfilMesaj({ tip: 'hata', metin: 'Güncelleme başarısız: ' + error.message })
    } else {
      // site_users tablosunu da güncelle
      if (currentUser) {
        await supabase.from('site_users').update({ ad, soyad, telefon }).eq('id', currentUser.id)
      }
      setProfilMesaj({ tip: 'basari', metin: 'Profil bilgileriniz güncellendi.' })
    }
    setProfilYukleniyor(false)
  }

  const sifreGuncelle = async () => {
    if (yeniSifre !== yeniSifreTekrar) {
      setSifreMesaj({ tip: 'hata', metin: 'Yeni şifreler eşleşmiyor.' })
      return
    }
    if (yeniSifre.length < 6) {
      setSifreMesaj({ tip: 'hata', metin: 'Şifre en az 6 karakter olmalı.' })
      return
    }
    setSifreYukleniyor(true)
    setSifreMesaj(null)
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    if (error) {
      setSifreMesaj({ tip: 'hata', metin: 'Şifre güncellenemedi: ' + error.message })
    } else {
      setSifreMesaj({ tip: 'basari', metin: 'Şifreniz başarıyla güncellendi.' })
      setMevcutSifre('')
      setYeniSifre('')
      setYeniSifreTekrar('')
    }
    setSifreYukleniyor(false)
  }

  if (yukleniyor) return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8567A', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const inputStil: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1px solid #E5E7EB', fontSize: 14, color: '#1A0A12',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
    background: '#FAFAFA',
  }
  const labelStil: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#7A6070', marginBottom: 6, display: 'block'
  }
  const kartStil: React.CSSProperties = {
    background: '#fff', borderRadius: 20, padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)',
    marginBottom: 16,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', padding: '40px 16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <Link href="/hesabim" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Hesabıma Dön
        </Link>

        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 32, fontWeight: 600, color: '#1A0A12', marginBottom: 24 }}>
          Hesap Ayarları
        </h1>

        {/* E-posta bilgisi */}
        <div style={{ ...kartStil, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 2 }}>E-posta adresi</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A0A12' }}>{user?.email}</div>
          </div>
        </div>

        {/* Profil bilgileri */}
        <div style={kartStil}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEE8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8567A' }}>
              <User size={18} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1A0A12' }}>Profil Bilgileri</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStil}>Ad</label>
              <input style={inputStil} value={ad} onChange={e => setAd(e.target.value)} placeholder="Adınız" />
            </div>
            <div>
              <label style={labelStil}>Soyad</label>
              <input style={inputStil} value={soyad} onChange={e => setSoyad(e.target.value)} placeholder="Soyadınız" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStil}>Telefon</label>
            <input style={inputStil} value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="05xx xxx xx xx" type="tel" />
          </div>

          {profilMesaj && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, marginBottom: 14, background: profilMesaj.tip === 'basari' ? '#F0FDF4' : '#FEF2F2', color: profilMesaj.tip === 'basari' ? '#16A34A' : '#EF4444', fontSize: 13 }}>
              {profilMesaj.tip === 'basari' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              {profilMesaj.metin}
            </div>
          )}

          <button onClick={profilKaydet} disabled={profilYukleniyor}
            style={{ background: '#E8567A', color: '#fff', border: 'none', borderRadius: 50, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: profilYukleniyor ? 'not-allowed' : 'pointer', opacity: profilYukleniyor ? 0.7 : 1, fontFamily: 'inherit' }}>
            {profilYukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {/* Şifre değiştir */}
        <div style={kartStil}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A6070' }}>
              <Lock size={18} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1A0A12' }}>Şifre Değiştir</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStil}>Yeni Şifre</label>
              <input style={inputStil} type="password" value={yeniSifre} onChange={e => setYeniSifre(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label style={labelStil}>Yeni Şifre Tekrar</label>
              <input style={inputStil} type="password" value={yeniSifreTekrar} onChange={e => setYeniSifreTekrar(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          {sifreMesaj && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, marginBottom: 14, background: sifreMesaj.tip === 'basari' ? '#F0FDF4' : '#FEF2F2', color: sifreMesaj.tip === 'basari' ? '#16A34A' : '#EF4444', fontSize: 13 }}>
              {sifreMesaj.tip === 'basari' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              {sifreMesaj.metin}
            </div>
          )}

          <button onClick={sifreGuncelle} disabled={sifreYukleniyor}
            style={{ background: '#1A0A12', color: '#fff', border: 'none', borderRadius: 50, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: sifreYukleniyor ? 'not-allowed' : 'pointer', opacity: sifreYukleniyor ? 0.7 : 1, fontFamily: 'inherit' }}>
            {sifreYukleniyor ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </div>

      </div>
    </div>
  )
}
