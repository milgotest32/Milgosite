import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  const { kod, tutar } = await req.json()
  const db = createServerClient()
  const { data: kupon } = await db.from('site_kuponlar').select('*').eq('kod', kod.toUpperCase()).eq('aktif', true).single()
  if (!kupon) return NextResponse.json({ gecerli: false, hata: 'Geçersiz kupon kodu' })
  const now = new Date()
  if (kupon.bitis && new Date(kupon.bitis) < now) return NextResponse.json({ gecerli: false, hata: 'Kupon süresi dolmuş' })
  if (kupon.kullanim_limiti && kupon.kullanim_sayisi >= kupon.kullanim_limiti) return NextResponse.json({ gecerli: false, hata: 'Kullanım limiti dolmuş' })
  if (tutar < kupon.min_tutar) return NextResponse.json({ gecerli: false, hata: `Min sepet: ₺${kupon.min_tutar}` })
  let indirim = kupon.tip === 'yuzde' ? tutar * (kupon.deger / 100) : kupon.deger
  if (kupon.max_indirim) indirim = Math.min(indirim, kupon.max_indirim)
  return NextResponse.json({ gecerli: true, kupon, indirim })
}
