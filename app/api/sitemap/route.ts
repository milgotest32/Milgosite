import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createServerClient()
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr'
  const now = new Date().toISOString()

  const { data: products } = await db.from('site_products').select('slug,updated_at').eq('durum', 'active')
  const { data: kategoriler } = await db.from('site_kategoriler').select('slug').eq('aktif', true)
  const { data: bloglar } = await db.from('site_blog_yazilar').select('slug,updated_at').eq('durum', 'yayinda')

  const staticPages = ['', '/urunler', '/abonelik', '/ciftligimiz', '/tarifler', '/hakkimizda', '/iletisim', '/sss', '/blog']

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `<url><loc>${base}${p}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
${(products || []).map(p => `<url><loc>${base}/urun/${p.slug}</loc><lastmod>${p.updated_at || now}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`).join('\n')}
${(kategoriler || []).map(k => `<url><loc>${base}/kategoriler/${k.slug}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('\n')}
${(bloglar || []).map(b => `<url><loc>${base}/blog/${b.slug}</loc><lastmod>${b.updated_at || now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
