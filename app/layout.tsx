import type { Metadata } from 'next'
import { Nunito, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import LayoutClient from '@/components/layout/LayoutClient'

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

export const metadata: Metadata = {
  title: 'Milgo | Çiftlikten Sofranıza',
  description: 'ATASANCAK Çiftliği\'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. Doğal, katkısız, İstanbul\'a aynı gün teslimat.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Milgo | Çiftlikten Sofranıza',
    description: 'Günlük toplanan çiğ süt, peynir ve tereyağı. Doğal, katkısız, İstanbul\'a aynı gün teslimat.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr',
    siteName: 'milgo.',
    images: [
      {
        url: 'https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg',
        width: 1260,
        height: 1600,
        alt: 'Milgo Çiğ Süt',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milgo | Çiftlikten Sofranıza',
    description: 'Günlük toplanan çiğ süt, peynir ve tereyağı. Doğal, katkısız.',
    images: ['https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${nunito.variable} ${cormorant.variable}`}>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
