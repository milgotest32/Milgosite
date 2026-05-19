import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  const db = createServerClient()
  const { data, error } = await db.rpc('get_all_orders_admin')
  if (error) return NextResponse.json({ error: error.message }, { status: 403 })
  return NextResponse.json({ data })
}
