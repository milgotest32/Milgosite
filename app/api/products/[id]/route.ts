import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerClient()
  const { data, error } = await db.from('site_products').select('*, site_product_images(*), site_kategoriler(*), site_markalar(*), site_variants(*)').or(`id.eq.${params.id},slug.eq.${params.id}`).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerClient()
  const body = await req.json()
  const { data, error } = await db.from('site_products').update({ ...body, updated_at: new Date().toISOString() }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerClient()
  const { error } = await db.from('site_products').update({ durum: 'deleted' }).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
