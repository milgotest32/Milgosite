import type { Metadata } from 'next'
import IletisimClient from './IletisimClient'

export const metadata: Metadata = {
  title: 'İletişim | milgo.',
  description: 'Milgo ile iletişime geçin. Sipariş, teslimat ve ürünler hakkında sorularınız için bize ulaşın. WhatsApp, e-posta veya form ile destek alın.',
  openGraph: {
    title: 'İletişim | milgo.',
    description: 'Milgo ile iletişime geçin. Sipariş ve ürün sorularınız için bize ulaşın.',
  },
}

export default function IletisimPage() {
  return <IletisimClient />
}
