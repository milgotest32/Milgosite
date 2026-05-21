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

    // Token varlığı kontrolü (içerik doğrulama API'de yapılıyor)
    const cookieHeader = req.headers.get('cookie') || ''
    const hasAuthCookie = cookieHeader.includes('sb-') && cookieHeader.includes('auth-token')
    const hasAuthHeader = req.headers.get('authorization')?.startsWith('Bearer ')

    if (!hasAuthCookie && !hasAuthHeader) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }
  }

  // Admin sayfalarına giriş zorunluluğu
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/giris')) {
    const cookieHeader = req.headers.get('cookie') || ''
    const hasAuth = cookieHeader.includes('sb-') && cookieHeader.includes('auth-token')
    if (!hasAuth) {
      return NextResponse.redirect(new URL('/giris', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
}
