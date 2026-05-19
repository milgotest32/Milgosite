'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import WhatsAppButon from '@/components/ui/WhatsAppButon'
import { Toaster } from 'react-hot-toast'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

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
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
