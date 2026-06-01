import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function requireAdmin(): Promise<{ ok: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()

    // Supabase parçalı cookie'leri birleştir (sb-xxx-auth-token.0, .1, ...)
    const tokenParts: Record<string, string> = {}
    let simpleToken = ''

    for (const cookie of allCookies) {
      if (!cookie.name.startsWith('sb-') || !cookie.name.includes('auth-token')) continue

      // Parçalı format: sb-xxx-auth-token.0, .1
      const partMatch = cookie.name.match(/\.(\d+)$/)
      if (partMatch) {
        tokenParts[partMatch[1]] = cookie.value
      } else {
        simpleToken = cookie.value
      }
    }

    let accessToken = ''

    // Parçalı token varsa birleştir
    if (Object.keys(tokenParts).length > 0) {
      const combined = Object.keys(tokenParts)
        .sort((a, b) => Number(a) - Number(b))
        .map(k => tokenParts[k])
        .join('')
      try {
        const decoded = decodeURIComponent(combined)
        const arr = JSON.parse(decoded)
        accessToken = Array.isArray(arr) ? arr[0] : arr.access_token || ''
      } catch {
        accessToken = combined
      }
    } else if (simpleToken) {
      try {
        const decoded = decodeURIComponent(simpleToken)
        if (decoded.startsWith('[')) {
          const arr = JSON.parse(decoded)
          accessToken = arr[0] || ''
        } else if (decoded.startsWith('{')) {
          const obj = JSON.parse(decoded)
          accessToken = obj.access_token || ''
        } else {
          accessToken = decoded
        }
      } catch {
        accessToken = simpleToken
      }
    }

    if (!accessToken) return { ok: false, error: 'Oturum bulunamadı' }

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error: authError } = await serviceClient.auth.getUser(accessToken)
    if (authError || !user) return { ok: false, error: 'Geçersiz oturum' }

    const { data: profile } = await serviceClient
      .from('site_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
      return { ok: false, error: 'Admin yetkisi gerekli' }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: 'Yetkilendirme hatası' }
  }
}
