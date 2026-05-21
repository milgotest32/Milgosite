import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

// Service role client - RLS bypass eder
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET() {
  const db = serviceClient()
  const { data, error } = await db
    .from('site_users')
    .select('id, email, role, ad, soyad, created_at, aktif')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data || [] })
}

export async function PATCH(req: Request) {
  const db = serviceClient()
  const { id, role } = await req.json()
  if (!id || !role) return NextResponse.json({ error: 'id ve role zorunlu' }, { status: 400 })

  const { error } = await db.from('site_users').update({ role }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
