import type { Metadata } from 'next'
import AbonelikClient from './AbonelikClient'

export const metadata: Metadata = {
  title: 'Abonelik | milgo.',
  description: 'Milgo abonelik sistemi ile her gün kapınıza taze çiğ süt ve doğal ürünler gelsin. Esnek teslimat seçenekleri, İstanbul içi aynı gün.',
  openGraph: {
    title: 'Abonelik | milgo.',
    description: 'Milgo aboneliğiyle her gün kapınıza taze ürünler gelsin.',
  },
}

export default function AbonelikPage() {
  return <AbonelikClient />
}
