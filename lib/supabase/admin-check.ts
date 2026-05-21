import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const PROJECT_ID = 'jxfegluntgssrgpnvscs'

export async function requireAdmin(req: NextRequest): Promise<{ ok: boolean; error?: string }> {
  try {
    // Supabase'in cookie ismi: sb-{project_id}-auth-token
    const cookieName = `sb-${PROJECT_ID}-auth-token`
    const cookieValue = req.cookies.get(cookieName)?.value

    let accessToken = ''

    if (cookieValue) {
      // Cookie base64 veya JSON formatında olabilir
      try {
        const decoded = decodeURIComponent(cookieValue)
        // Format: ["access_token","refresh_token"] veya JSON objesi
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
        accessToken = cookieValue
      }
    }

    // Authorization header'dan al (fallback)
    if (!accessToken) {
      const authHeader = req.headers.get('authorization') || ''
      accessToken = authHeader.replace('Bearer ', '').trim()
    }

    if (!accessToken) return { ok: false, error: 'Oturum bulunamadı' }

    // Token'ı doğrula
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error: authError } = await anonClient.auth.getUser(accessToken)
    if (authError || !user) return { ok: false, error: 'Geçersiz oturum' }

    // Admin rolünü service role ile kontrol et (RLS bypass)
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

    if (!profile || profile.role !== 'admin') {
      return { ok: false, error: 'Admin yetkisi gerekli' }
    }

    return { ok: true }
  } catch (e) {
    return { ok: false, error: 'Yetkilendirme hatası' }
  }
}
