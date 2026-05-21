import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerClient()
  const { id } = params

  // Sadece "bekliyor" durumundaki siparişleri iptal et
  const { error } = await db
    .from('site_siparisler')
    .update({ durum: 'iptal', odeme_durumu: 'basarisiz' })
    .eq('id', id)
    .eq('durum', 'bekliyor') // güvenlik: sadece bekleyen siparişi iptal et

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
