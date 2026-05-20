import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /api/admin/* route'ları için ekstra header kontrolü
  // (asıl auth requireAdmin ile yapılıyor, bu sadece ek katman)
  if (pathname.startsWith('/api/admin/')) {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host') || ''
    // Dış domain'lerden gelen direkt API çağrılarını engelle
    if (origin && !origin.includes('milgosite.vercel.app') && !origin.includes('milgo.com.tr') && !origin.includes('localhost')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
