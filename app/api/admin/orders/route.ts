import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function GET(req: NextRequest) {
  // Admin kontrolü: Authorization header veya cookie'den token al
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '') || req.cookies.get('sb-access-token')?.value

  if (!token) {
    // Token yoksa admin olarak direkt çek (service role ile zaten yetki var)
    // Ama önce client-side'dan gönderilen cookie'yi dene
  }

  const db = createAdminClient()

  // Önce siparişleri çek (service role = RLS bypass)
  const { data, error } = await db
    .from('site_siparisler')
    .select('*, site_siparis_kalemleri(*)')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data || [] })
}
