'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Popup from '@/components/Popup'
import BolgeYokPopup from '@/components/BolgeYokPopup'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import WhatsAppButon from '@/components/ui/WhatsAppButon'
import { Toaster, toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'

const HATIRLAMA_DISINDA = ['/sepet', '/odeme', '/siparis-onay', '/giris', '/kayit']

const MOBİL_MENU = [
  { href: '/',         icon: '🏠', label: 'Ana Sayfa' },
  { href: '/urunler',  icon: '🛍', label: 'Ürünler'   },
  { href: '/abonelik', icon: '🔄', label: 'Abonelik'  },
  { href: '/sepet',    icon: '🛒', label: 'Sepet'     },
  { href: '/hesabim',  icon: '👤', label: 'Hesabım'   },
]

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname?.startsWith('/admin')
  const adetToplam = useSepet(s => s.adetToplam)
  const sepetAdet = adetToplam()

  // Kargo ayarlarını DB'den yükle
  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup', 'kargo').then(({ data }) => {
      if (data) {
        const m: Record<string, string> = {}
        data.forEach((r: any) => { m[r.anahtar] = r.deger })
        if (m.standart_kargo_ucreti) localStorage.setItem('milgo_kargo_standart', m.standart_kargo_ucreti)
        if (m.ucretsiz_kargo_tutari) localStorage.setItem('milgo_kargo_limit', m.ucretsiz_kargo_tutari)
      }
    })
  }, [])

  // Sepet hatırlatması — oturum boyunca sadece 1 kez
  useEffect(() => {
    if (isAdmin) return
    if (HATIRLAMA_DISINDA.some(p => pathname?.startsWith(p))) return
    if (sessionStorage.getItem('milgo_sepet_hatirlatildi')) return
    if (sepetAdet === 0) return

    const t = setTimeout(() => {
      sessionStorage.setItem('milgo_sepet_hatirlatildi', '1')
      toast(
        (toastObj) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#1A0A12' }}>
                Sepetinizde {sepetAdet} ürün var
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#7A6070' }}>
                Kaldığınız yerden devam edin
              </p>
            </div>
            <button
              onClick={() => { toast.dismiss(toastObj.id); router.push('/sepet') }}
              style={{ background: '#1A0A12', color: '#fff', border: 'none', borderRadius: '10px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
              Sepete Git
            </button>
          </div>
        ),
        { duration: 6000, style: { maxWidth: '380px', padding: '12px 16px' } }
      )
    }, 2000)

    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Cursor />
      {!isAdmin && <KonumModal />}
      {!isAdmin && <WhatsAppButon />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-nunito), sans-serif',
            fontSize: '14px',
            borderRadius: '14px',
          },
        }}
      />
      {!isAdmin && <Navbar />}
      {!isAdmin && <Popup />}
      {!isAdmin && <BolgeYokPopup />}
      <main style={{ paddingBottom: isAdmin ? 0 : undefined }}>{children}</main>
      {!isAdmin && <Footer />}

      {/* Mobil Alt Navigasyon */}
      {!isAdmin && (
        <nav style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#fff',
          borderTop: '1px solid #F0ECF5',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          padding: '8px 0 env(safe-area-inset-bottom)',
        }}
          className="mobil-nav"
        >
          {MOBİL_MENU.map(({ href, icon, label }) => {
            const aktif = href === '/' ? pathname === '/' : pathname?.startsWith(href)
            const isSepet = href === '/sepet'
            return (
              <Link key={href} href={href} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                textDecoration: 'none',
                padding: '6px 4px',
                position: 'relative',
              }}>
                <span style={{ fontSize: '22px', lineHeight: 1, position: 'relative' }}>
                  {icon}
                  {isSepet && sepetAdet > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-6px',
                      background: '#E8567A',
                      color: '#fff',
                      borderRadius: '999px',
                      fontSize: '9px',
                      fontWeight: 700,
                      minWidth: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                    }}>{sepetAdet}</span>
                  )}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: aktif ? 700 : 500,
                  color: aktif ? '#E8567A' : '#9CA3AF',
                  fontFamily: 'var(--font-nunito), sans-serif',
                }}>{label}</span>
                {aktif && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '32px',
                    height: '3px',
                    background: '#E8567A',
                    borderRadius: '0 0 4px 4px',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>
      )}
    </>
  )
}
