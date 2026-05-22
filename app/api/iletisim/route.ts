import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

// Basit in-memory rate limiter (IP başına 5 mesaj/saat)
const gonderilenler = new Map<string, { sayi: number; ilk: number }>()
const LIMIT = 5
const PENCERE_MS = 60 * 60 * 1000 // 1 saat

function rateLimitKontrol(ip: string): boolean {
  const simdi = Date.now()
  const kayit = gonderilenler.get(ip)
  if (!kayit || simdi - kayit.ilk > PENCERE_MS) {
    gonderilenler.set(ip, { sayi: 1, ilk: simdi })
    return true
  }
  if (kayit.sayi >= LIMIT) return false
  kayit.sayi++
  return true
}

export async function POST(req: NextRequest) {
  // IP al
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'bilinmiyor'

  // Rate limit kontrolü
  if (!rateLimitKontrol(ip)) {
    return NextResponse.json(
      { error: 'Çok fazla mesaj gönderdiniz. Lütfen bir süre bekleyin.' },
      { status: 429 }
    )
  }

  const { ad, email, konu, mesaj } = await req.json()
  if (!ad || !email || !mesaj) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })

  // Basit içerik kontrolü - çok kısa veya sadece link içeriyorsa reddet
  if (mesaj.trim().length < 10) {
    return NextResponse.json({ error: 'Mesajınız çok kısa.' }, { status: 400 })
  }
  if ((mesaj.match(/https?:\/\//g) || []).length > 3) {
    return NextResponse.json({ error: 'Mesajınız çok fazla link içeriyor.' }, { status: 400 })
  }

  const db = createServerClient()
  const { error } = await db.from('site_iletisim_mesajlari').insert({ ad, email, konu, mesaj })
  if (error) {
    console.error('İletişim mesajı kaydedilemedi:', error.message)
  }

  return NextResponse.json({ ok: true })
}
