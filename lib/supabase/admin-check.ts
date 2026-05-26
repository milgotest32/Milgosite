import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function requireAdmin(): Promise<{ ok: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    
    // Supabase tüm cookie'leri al, token içereni bul
    const allCookies = cookieStore.getAll()
    let accessToken = ''
    
    for (const cookie of allCookies) {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
        const val = cookie.value
        try {
          const decoded = decodeURIComponent(val)
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
          accessToken = val
        }
        if (accessToken) break
      }
    }

    if (!accessToken) return { ok: false, error: 'Oturum bulunamadı' }

    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error: authError } = await anonClient.auth.getUser(accessToken)
    if (authError || !user) return { ok: false, error: 'Geçersiz oturum' }

    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

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
