import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import { Toaster } from 'react-hot-toast'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'milgo. — Mutluluğun Tadı', template: '%s | milgo.' },
  description: 'Çiftliğimizden sofranıza. %100 doğal, katkısız süt ve süt ürünleri. Günlük taze teslimat.',
  keywords: ['çiğ süt', 'doğal süt', 'taze peynir', 'tereyağı', 'milgo', 'ab onaylı'],
  openGraph: {
    type: 'website', locale: 'tr_TR', url: 'https://milgo.com.tr',
    siteName: 'milgo.', title: 'milgo. — Mutluluğun Tadı',
    description: 'Çiftliğimizden sofranıza. %100 doğal süt ürünleri.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={syne.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Cursor />
        <KonumModal />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-syne), Syne, sans-serif', fontSize: '14px', borderRadius: '14px' } }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
