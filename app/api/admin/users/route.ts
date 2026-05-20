import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin-check'
export const dynamic = 'force-dynamic'
export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
  const db = createServerClient()
  
  // Auth kullanıcıları
  const { data: authData, error } = await db.rpc('get_all_users_admin')
  
  // site_musteriler (Shopify'dan aktarılan + yeni kayıtlar)
  const { data: dbMusteriler } = await db
    .from('site_musteriler')
    .select('*')
    .order('created_at', { ascending: false })

  if (error && !dbMusteriler) return NextResponse.json({ error: error.message }, { status: 403 })

  // Auth users map
  const authMap: any = {}
  authData?.forEach((u: any) => { authMap[u.email] = u })

  // Merge: önce DB müşterileri, auth bilgileriyle zenginleştir
  const musteriler = (dbMusteriler || []).map((m: any) => ({
    ...m,
    role: authMap[m.email]?.role || 'musteri',
    auth_id: authMap[m.email]?.id,
    kaynak: m.shopify_id ? 'shopify' : 'site',
  }))

  // Auth'da olup DB'de olmayan kullanıcılar
  const dbEmails = new Set((dbMusteriler || []).map((m: any) => m.email))
  authData?.forEach((u: any) => {
    if (!dbEmails.has(u.email)) {
      musteriler.push({ ...u, kaynak: 'auth', role: u.role })
    }
  })

  return NextResponse.json({ data: musteriler })
}
