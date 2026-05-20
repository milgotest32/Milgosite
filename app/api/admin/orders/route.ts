import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin-check'
export const dynamic = 'force-dynamic'
export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
  const db = createServerClient()
  const { data, error } = await db.rpc('get_all_orders_admin')
  if (error) return NextResponse.json({ error: error.message }, { status: 403 })
  return NextResponse.json({ data })
}
