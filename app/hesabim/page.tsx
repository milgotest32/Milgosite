'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Package, Heart, MapPin, Settings, ChevronRight, RefreshCw, LogOut } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function HesabimPage() {
  const [user, setUser] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      setUser(data.session.user)
      setYukleniyor(false)
    })
  }, [router])

  const cikis = async () => { await supabase.auth.signOut(); router.push('/') }

  if (yukleniyor) return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #F4A7B9', borderTopColor: '#E8567A', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const MENULER = [
    { icon: <Package size={20} />, baslik: 'Siparişlerim', ac: 'Geçmiş siparişleriniz', href: '/hesabim/siparisler', bg: '#FEE8EF', renk: '#E8567A' },
    { icon: <Heart size={20} />, baslik: 'Favorilerim', ac: 'Beğendiğiniz ürünler', href: '/hesabim/favoriler', bg: '#FEF2F2', renk: '#EF4444' },
    { icon: <RefreshCw size={20} />, baslik: 'Aboneliğim', ac: 'Abonelik planınız', href: '/hesabim/abonelik', bg: '#EBF5FC', renk: '#3B9FCC' },
    { icon: <MapPin size={20} />, baslik: 'Adreslerim', ac: 'Teslimat adresleriniz', href: '/hesabim/adresler', bg: '#F0FDF4', renk: '#22C55E' },
    { icon: <Settings size={20} />, baslik: 'Hesap Ayarları', ac: 'Profil ve şifre', href: '/hesabim/ayarlar', bg: '#F0EEF8', renk: '#7A6070' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8', padding: 'clamp(24px,4vw,48px) 16px', fontFamily: 'Nunito, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', margin: '0 0 4px' }}>Hesabım</h1>
              <p style={{ fontSize: '13px', color: '#7A6070', margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
          {MENULER.map((item, i) => (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', textDecoration: 'none', borderBottom: i < MENULER.length - 1 ? '1px solid #F0ECF5' : 'none' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.renk, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A0A12', marginBottom: '2px' }}>{item.baslik}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.ac}</div>
              </div>
              <ChevronRight size={16} style={{ color: '#D1D5DB', flexShrink: 0 }} />
            </Link>
          ))}
        </div>

        <button onClick={cikis}
          style={{ width: '100%', background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#EF4444', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
          <LogOut size={18} /> Çıkış Yap
        </button>
      </div>
    </div>
  )
}
