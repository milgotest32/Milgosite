import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import UrunDetayClient from './UrunDetayClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = createServerClient()
  const { data } = await db.from('site_products')
    .select('name, aciklama, seo_title, seo_description, site_product_images(url)')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()
  if (!data) return { title: 'Ürün Bulunamadı' }
  const gorsel = (data.site_product_images as any[])?.[0]?.url
  return {
    title: data.seo_title || data.name,
    description: data.seo_description || data.aciklama,
    openGraph: {
      title: data.seo_title || data.name,
      description: data.seo_description || data.aciklama || '',
      images: gorsel ? [{ url: gorsel }] : [],
    },
  }
}

export default async function UrunDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = createServerClient()

  // .single() yerine .limit(1) + maybeSingle() — daha güvenli
  const { data: urun, error } = await db
    .from('site_products')
    .select(`
      *,
      site_product_images (*),
      site_kategoriler (*),
      site_markalar (*),
      site_variants (*)
    `)
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Ürün sorgu hatası:', error.message)
    notFound()
  }
  if (!urun) notFound()

  // Benzer ürünler
  const { data: benzerler } = await db
    .from('site_products')
    .select('*, site_product_images(*), site_kategoriler(name, slug)')
    .eq('durum', 'active')
    .eq('kategori_id', urun.kategori_id || '')
    .neq('id', urun.id)
    .limit(4)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: urun.name,
    description: urun.aciklama,
    image: (urun.site_product_images as any[])?.map((g: any) => g.url),
    sku: urun.sku,
    brand: { '@type': 'Brand', name: 'milgo.' },
    offers: {
      '@type': 'Offer',
      price: urun.fiyat,
      priceCurrency: 'TRY',
      availability: (urun.stok ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'milgo.' }
    },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '48' }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <UrunDetayClient urun={urun as any} benzerler={benzerler as any[] || []} />
    </>
  )
}
