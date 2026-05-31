import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import PaketDetayClient from './PaketDetayClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = createServerClient()
  const { data } = await db.from('site_paketler')
    .select('name, aciklama, gorsel_url')
    .eq('slug', slug)
    .single()
  if (!data) return { title: 'Paket Bulunamadı' }
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://market.milgo.com.tr'
  return {
    title: `${data.name} | milgo.`,
    description: data.aciklama || `${data.name} — Milgo özel paketi. Birden fazla ürünü bir arada, indirimli fiyatla alın.`,
    openGraph: {
      title: `${data.name} | milgo.`,
      description: data.aciklama || `${data.name} — Milgo özel paketi.`,
      images: data.gorsel_url ? [{ url: data.gorsel_url }] : [],
      url: `${base}/paketler/${slug}`,
    },
  }
}

export default function PaketDetayPage() {
  return <PaketDetayClient />
}
