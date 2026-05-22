import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = createServerClient()
  const { id } = await params

  // Auth kontrolü
  const { data: { user } } = await db.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  // Siparişin bu kullanıcıya ait olduğunu doğrula
  const { data: siparis } = await db
    .from('site_siparisler')
    .select('id, musteri_id, musteri_email, durum')
    .eq('id', id)
    .single()

  if (!siparis) return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })

  if (siparis.musteri_id !== user.id && siparis.musteri_email !== user.email) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
  }

  if (siparis.durum !== 'bekliyor') {
    return NextResponse.json({ error: 'Sadece bekleyen siparişler iptal edilebilir' }, { status: 400 })
  }

  const { error } = await db
    .from('site_siparisler')
    .update({ durum: 'iptal', odeme_durumu: 'basarisiz' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
