import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/supabase/admin-check'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
  const db = createServerClient()
  const { data, error } = await db.rpc('get_admin_stats')
  if (error) return NextResponse.json({ error: error.message }, { status: 403 })
  return NextResponse.json(data)
}
