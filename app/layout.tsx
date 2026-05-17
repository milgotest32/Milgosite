import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: { default: 'milgo. — Mutluluğun Tadı', template: '%s | milgo.' },
  description: 'Çiftliğimizden sofranıza. %100 doğal, katkısız süt ve süt ürünleri. Günlük taze teslimat.',
  keywords: ['çiğ süt', 'doğal süt', 'taze peynir', 'tereyağı', 'milgo', 'ab onaylı'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://milgo.com.tr',
    siteName: 'milgo.',
    title: 'milgo. — Mutluluğun Tadı',
    description: 'Çiftliğimizden sofranıza. %100 doğal süt ürünleri.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'milgo.', description: 'Mutluluğun Tadı' },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://milgo.com.tr' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Organization',
          name: 'milgo.', url: 'https://milgo.com.tr',
          logo: 'https://milgo.com.tr/logo.png',
          contactPoint: { '@type': 'ContactPoint', telephone: '+90-212-352-10-76', contactType: 'customer service', availableLanguage: 'Turkish' },
          sameAs: ['https://www.instagram.com/milgosut', 'https://www.facebook.com/milgosut']
        })}} />
      </head>
      <body>
        <Cursor />
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px' } }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
