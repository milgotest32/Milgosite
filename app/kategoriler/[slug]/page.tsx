import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import KategoriClient from './KategoriClient'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = createServerClient()
  const { data } = await db.from('site_kategoriler').select('name,seo_title,seo_description').eq('slug', slug).single()
  if (!data) return { title: 'Kategori Bulunamadı' }
  return { title: data.seo_title || data.name, description: data.seo_description }
}

export default async function KategoriPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = createServerClient()
  const { data: kategori } = await db.from('site_kategoriler').select('*').eq('slug', slug).eq('aktif', true).single()
  if (!kategori) notFound()
  return <KategoriClient kategori={kategori} />
}
