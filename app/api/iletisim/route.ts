import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  const { ad, email, konu, mesaj } = await req.json()
  if (!ad || !email || !mesaj) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  const db = createServerClient()
  // Mesajı veritabanına kaydet
  const { error } = await db.from('site_iletisim_mesajlari').insert({ ad, email, konu, mesaj })
  if (error) {
    // Tablo yoksa hata verme, sadece logla
    console.error('İletişim mesajı kaydedilemedi:', error.message)
  }
  return NextResponse.json({ ok: true })
}
