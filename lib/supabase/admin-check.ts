import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'

export async function requireAdmin(): Promise<{ ok: boolean; error?: string }> {
  try {
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    // Yöntem 1: Authorization header (fetch ile gönderilirse)
    const headerStore = await headers()
    const authHeader = headerStore.get('authorization') || headerStore.get('Authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: { user }, error } = await serviceClient.auth.getUser(token)
      if (!error && user) {
        const { data: profile } = await serviceClient
          .from('site_users').select('role').eq('id', user.id).single()
        if (profile && ['admin', 'superadmin'].includes(profile.role)) {
          return { ok: true }
        }
      }
    }

    // Yöntem 2: Cookie'den oku
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Tüm sb- cookie'lerini logla (debug)
    const sbCookies = allCookies.filter(c => c.name.startsWith('sb-'))
    
    const tokenParts: Record<string, string> = {}
    let simpleToken = ''

    for (const cookie of sbCookies) {
      const partMatch = cookie.name.match(/\.(\d+)$/)
      if (partMatch) {
        tokenParts[partMatch[1]] = cookie.value
      } else if (cookie.name.includes('auth-token')) {
        simpleToken = cookie.value
      }
    }

    let accessToken = ''

    if (Object.keys(tokenParts).length > 0) {
      const combined = Object.keys(tokenParts)
        .sort((a, b) => Number(a) - Number(b))
        .map(k => tokenParts[k])
        .join('')
      try {
        const decoded = decodeURIComponent(combined)
        const parsed = JSON.parse(decoded)
        accessToken = Array.isArray(parsed) ? parsed[0] : parsed.access_token || ''
      } catch { accessToken = combined }
    } else if (simpleToken) {
      try {
        const decoded = decodeURIComponent(simpleToken)
        if (decoded.startsWith('[')) accessToken = JSON.parse(decoded)[0] || ''
        else if (decoded.startsWith('{')) accessToken = JSON.parse(decoded).access_token || ''
        else accessToken = decoded
      } catch { accessToken = simpleToken }
    }

    if (!accessToken) return { ok: false, error: `Oturum bulunamadı (${sbCookies.map(c=>c.name).join(',') || 'cookie yok'})` }

    const { data: { user }, error: authError } = await serviceClient.auth.getUser(accessToken)
    if (authError || !user) return { ok: false, error: 'Geçersiz oturum' }

    const { data: profile } = await serviceClient
      .from('site_users').select('role').eq('id', user.id).single()

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return { ok: false, error: 'Admin yetkisi gerekli' }
    }

    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: `Hata: ${e?.message}` }
  }
}
