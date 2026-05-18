import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import KonumModal from '@/components/ui/KonumModal'
import { Toaster } from 'react-hot-toast'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-nunito',
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
    <html lang="tr" className={nunito.variable}>
      <body>
        <Cursor />
        <KonumModal />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '14px', borderRadius: '14px' } }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
