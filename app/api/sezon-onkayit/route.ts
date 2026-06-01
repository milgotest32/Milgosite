import { NextResponse, NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Geçerli bir email girin' }, { status: 400 })
  }
  const db = createServerClient()
  const { error } = await db.from('site_sezon_onkayit').insert({ email })
  if (error && error.code === '23505') {
    return NextResponse.json({ ok: true, mesaj: 'Zaten kayıtlısınız!' })
  }
  if (error) return NextResponse.json({ error: 'Kayıt başarısız' }, { status: 500 })
  return NextResponse.json({ ok: true, mesaj: 'Kaydınız alındı! Sezon açılınca haber vereceğiz.' })
}
