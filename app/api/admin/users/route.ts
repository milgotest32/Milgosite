import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/supabase/admin-check'
export const dynamic = 'force-dynamic'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(req: NextRequest) {
  const db = serviceClient()

  // site_musteriler'den müşterileri çek
  const { data: musteriler, error: mErr } = await db
    .from('site_musteriler')
    .select('id, email, ad, soyad, telefon, ilce, posta_kodu, toplam_siparis, toplam_harcama, shopify_id, aktif, created_at')
    .order('toplam_harcama', { ascending: false })

  // site_users'dan admin/site kullanıcılarını çek
  const { data: siteUsers } = await db
    .from('site_users')
    .select('id, email, role, ad, soyad, created_at, aktif')
    .order('created_at', { ascending: false })

  if (mErr) return NextResponse.json({ error: mErr.message }, { status: 500 })

  // Müşterileri birleştir
  const musteriListesi = (musteriler || []).map(m => ({
    ...m,
    kaynak: m.shopify_id ? 'shopify' : 'site',
    role: 'customer',
  }))

  // site_users'dan sadece site_musteriler'de olmayanları ekle
  const musteriEmails = new Set(musteriListesi.map(m => m.email?.toLowerCase()))
  const ekstraUsers = (siteUsers || [])
    .filter(u => !musteriEmails.has(u.email?.toLowerCase()))
    .map(u => ({ ...u, kaynak: 'site' }))

  const data = [...musteriListesi, ...ekstraUsers]

  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = serviceClient()
  const { id, role } = await req.json()
  if (!id || !role) return NextResponse.json({ error: 'id ve role zorunlu' }, { status: 400 })

  const { error } = await db.from('site_users').update({ role }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
