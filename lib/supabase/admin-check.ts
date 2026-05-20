import { createServerClient } from './server'

export async function requireAdmin(): Promise<{ ok: boolean; error?: string }> {
  const db = createServerClient()
  const { data: { user }, error } = await db.auth.getUser()
  if (error || !user) return { ok: false, error: 'Yetkisiz erişim' }
  const { data: profile } = await db.from('site_users').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) return { ok: false, error: 'Admin yetkisi gerekli' }
  return { ok: true }
}
