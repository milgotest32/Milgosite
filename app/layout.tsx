import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'

export const metadata: Metadata = {
  title: 'milgo. — Mutluluğun Tadı',
  description: 'Çiftliğimizden sofranıza. %100 doğal, katkısız süt ve süt ürünleri. Günlük taze teslimat.',
  keywords: 'çiğ süt, doğal süt, taze peynir, tereyağı, milgo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Cursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
