import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://market.milgo.com.tr'
  
  try {
    const db = createServerClient()
    const { data } = await db
      .from('site_ayarlar')
      .select('deger')
      .eq('grup', 'seo')
      .eq('anahtar', 'robots_txt')
      .single()
    
    if (data?.deger) {
      return new NextResponse(data.deger, { headers: { 'Content-Type': 'text/plain' } })
    }
  } catch {}

  // Varsayılan robots.txt
  const varsayilan = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /hesabim
Disallow: /sepet
Disallow: /odeme
Disallow: /siparis-onay
Disallow: /siparis-basarisiz

Sitemap: ${base}/sitemap.xml`

  return new NextResponse(varsayilan, { headers: { 'Content-Type': 'text/plain' } })
}
