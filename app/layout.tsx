'use client'
import type { Metadata } from 'next'
import { Nunito, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <body>
      <Cursor />
      {!isAdmin && <KonumModal />}
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-nunito), sans-serif', fontSize: '14px', borderRadius: '14px' } }} />
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </body>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${nunito.variable} ${cormorant.variable}`}>
      <LayoutContent>{children}</LayoutContent>
    </html>
  )
}
