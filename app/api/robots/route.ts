import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr'
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nDisallow: /hesabim\nDisallow: /sepet\nDisallow: /odeme\n\nSitemap: ${base}/api/sitemap`
  return new NextResponse(txt, { headers: { 'Content-Type': 'text/plain' } })
}
