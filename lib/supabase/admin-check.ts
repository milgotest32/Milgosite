import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export async function requireAdmin(req?: NextRequest): Promise<{ ok: boolean; error?: string }> {
  try {
    // Cookie'den token al
    let token = ''
    if (req) {
      // Next.js request'ten cookie oku
      const cookieHeader = req.headers.get('cookie') || ''
      const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1])
          const parsed = JSON.parse(decoded)
          token = parsed[0] || parsed.access_token || ''
        } catch {}
      }
      // Authorization header
      if (!token) {
        const auth = req.headers.get('authorization') || ''
        token = auth.replace('Bearer ', '')
      }
    }

    if (!token) return { ok: false, error: 'Oturum bulunamadı' }

    // Token ile kullanıcıyı doğrula
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error } = await db.auth.getUser(token)
    if (error || !user) return { ok: false, error: 'Geçersiz oturum' }

    // Admin rolünü kontrol et (service role ile)
    const adminDb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )
    const { data: profile } = await adminDb
      .from('site_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') return { ok: false, error: 'Admin yetkisi gerekli' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Yetkilendirme hatası' }
  }
}
