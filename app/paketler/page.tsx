import type { Metadata } from 'next'
import PaketlerClient from './PaketlerClient'

export const metadata: Metadata = {
  title: 'Paketler | milgo.',
  description: 'Milgo ozel urun paketleri. Sevdiklerinize ya da kendinize ozel dogal sut urunleri kombinasyonlari. Istanbul ve cevresine ayni gun teslimat.',
  openGraph: {
    title: 'Paketler | milgo.',
    description: 'Milgo ozel urun paketleri. Dogal sut urunleri kombinasyonlari.',
  },
}

export default function PaketlerPage() {
  return <PaketlerClient />
}
