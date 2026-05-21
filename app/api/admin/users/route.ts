import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin-check'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  // Service role key varsa tüm kullanıcıları getir (RLS bypass)
  const db = createServerClient()
  const { data, error } = await db
    .from('site_users')
    .select('id, email, role, ad, soyad, created_at, aktif')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data || [] })
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const { id, role } = await req.json()
  if (!id || !role) return NextResponse.json({ error: 'id ve role zorunlu' }, { status: 400 })

  const db = createServerClient()
  const { error } = await db.from('site_users').update({ role }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
