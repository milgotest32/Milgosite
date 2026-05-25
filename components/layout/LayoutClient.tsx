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
import React from 'react'
import ServiceWorker from '@/components/ui/ServiceWorker'

const HATIRLAMA_DISINDA = ['/sepet', '/odeme', '/siparis-onay', '/giris', '/kayit']

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Ana Sayfa',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#E8567A' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: '/urunler',
    label: 'Ürünler',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#E8567A' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/abonelik',
    label: 'Abonelik',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#E8567A' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/sepet',
    label: 'Sepet',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#E8567A' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/hesabim',
    label: 'Hesabım',
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#E8567A' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname?.startsWith('/admin')
  const adetToplam = useSepet(s => s.adetToplam)
  const sepetAdet = adetToplam()

  // Şifre sıfırlama linkinden gelen token'ı yakala → /sifre-belirle'ye yönlendir
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      router.push('/sifre-belirle' + hash)
    }
  }, [])

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
      <ServiceWorker />
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
      <main>{children}</main>
      {!isAdmin && <Footer />}

      {/* Mobil Alt Navigasyon */}
      {!isAdmin && (
        <nav className="mobil-nav" style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#fff',
          borderTop: '1px solid #F0ECF5',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          padding: '8px 0 env(safe-area-inset-bottom)',
        }}>
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const aktif = href === '/' ? pathname === '/' : pathname?.startsWith(href)
            const isSepet = href === '/sepet'
            return (
              <Link key={href} href={href} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                padding: '6px 4px',
                position: 'relative',
              }}>
                <span style={{ position: 'relative', lineHeight: 1 }}>
                  {icon(!!aktif)}
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
