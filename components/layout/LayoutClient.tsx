'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
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

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAdmin = pathname?.startsWith('/admin')
  const adetToplam = useSepet(s => s.adetToplam)
  const gosterildi = useRef(false)

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

  // Sepet hatırlatması
  useEffect(() => {
    if (isAdmin) return
    if (gosterildi.current) return
    if (HATIRLAMA_DISINDA.some(p => pathname?.startsWith(p))) return
    const adet = adetToplam()
    if (adet === 0) return

    const t = setTimeout(() => {
      gosterildi.current = true
      toast(
        (toastObj) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: '#1A0A12' }}>
                Sepetinizde {adet} ürün var
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
  }, [pathname, isAdmin])

  return (
    <>
      <Cursor />
      {!isAdmin && <KonumModal />}
      {!isAdmin && <WhatsAppButon />}
      <Toaster
        position="top-right"
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
    </>
  )
}
