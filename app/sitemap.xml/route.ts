import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1 saatte bir yenile

export async function GET() {
  const db = createServerClient()
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://market.milgo.com.tr'
  const now = new Date().toISOString()

  const [{ data: products }, { data: kategoriler }, { data: bloglar }, { data: paketler }] = await Promise.all([
    db.from('site_products').select('slug,updated_at').eq('durum', 'active'),
    db.from('site_kategoriler').select('slug,updated_at').eq('aktif', true),
    db.from('site_blog_yazilar').select('slug,updated_at').eq('durum', 'yayinda'),
    db.from('site_paketler').select('slug,updated_at').eq('aktif', true),
  ])

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/urunler', priority: '0.9', changefreq: 'daily' },
    { url: '/abonelik', priority: '0.8', changefreq: 'weekly' },
    { url: '/ciftligimiz', priority: '0.7', changefreq: 'monthly' },
    { url: '/hakkimizda', priority: '0.7', changefreq: 'monthly' },
    { url: '/iletisim', priority: '0.6', changefreq: 'monthly' },
    { url: '/sss', priority: '0.6', changefreq: 'monthly' },
    { url: '/paketler', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.7', changefreq: 'weekly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${(products || []).map(p => `  <url>
    <loc>${base}/urun/${p.slug}</loc>
    <lastmod>${p.updated_at || now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
${(kategoriler || []).map(k => `  <url>
    <loc>${base}/kategoriler/${k.slug}</loc>
    <lastmod>${k.updated_at || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${(paketler || []).map((p: any) => `  <url>
    <loc>${base}/paketler/${p.slug}</loc>
    <lastmod>${p.updated_at || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${(bloglar || []).map(b => `  <url>
    <loc>${base}/blog/${b.slug}</loc>
    <lastmod>${b.updated_at || now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    }
  })
}
