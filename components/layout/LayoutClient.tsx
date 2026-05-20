'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Popup from '@/components/Popup'
import BolgeYokPopup from '@/components/BolgeYokPopup'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import WhatsAppButon from '@/components/ui/WhatsAppButon'
import { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

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
