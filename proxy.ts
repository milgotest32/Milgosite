import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/admin/')) {
    // Origin kontrolü - dış domainlerden gelen istekleri engelle
    const origin = req.headers.get('origin')
    if (origin &&
      !origin.includes('milgosite.vercel.app') &&
      !origin.includes('milgo.com.tr') &&
      !origin.includes('localhost')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
