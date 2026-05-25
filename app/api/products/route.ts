import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const db = serviceClient()
  let q: any = db.from('site_products').select('*, site_product_images(*), site_kategoriler(name,slug)').eq('durum', 'active')
  const arama = searchParams.get('arama')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '50')
  const sira = searchParams.get('sira') || 'newest'
  if (featured === '1') q = q.eq('featured', true)
  if (arama) q = q.or(`name.ilike.%${arama}%,aciklama.ilike.%${arama}%`)
  if (sira === 'fiyat-as') q = q.order('fiyat')
  else if (sira === 'fiyat-us') q = q.order('fiyat', { ascending: false })
  else q = q.order('created_at', { ascending: false })
  q = q.limit(limit)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const db = serviceClient()
  const body = await req.json()
  const { data, error } = await db.from('site_products').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data }, { status: 201 })
}
