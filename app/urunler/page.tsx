import type { Metadata } from 'next'
import UrunlerClient from './UrunlerClient'

export const metadata: Metadata = {
  title: 'Tüm Ürünler | milgo.',
  description: 'Milgo\'nun tüm doğal ürünleri: çiğ süt, sürülebilir peynir çeşitleri ve tereyağları. ATASANCAK Çiftliği\'nden katkısız, taze. İstanbul\'a aynı gün teslimat.',
  openGraph: {
    title: 'Tüm Ürünler | milgo.',
    description: 'Milgo çiğ süt, peynir ve tereyağı çeşitleri. Katkısız, taze, doğal.',
  },
}

export default function UrunlerPage() {
  return <UrunlerClient />
}
