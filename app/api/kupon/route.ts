import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { kod, tutar } = await req.json()
  const db = createServerClient()

  // Önce normal kupon olarak ara
  const { data: kupon } = await db.from('site_kuponlar')
    .select('*').eq('kod', kod.toUpperCase()).eq('aktif', true).single()

  if (kupon) {
    const now = new Date()
    if (kupon.bitis && new Date(kupon.bitis) < now)
      return NextResponse.json({ gecerli: false, hata: 'Kupon süresi dolmuş' })
    if (kupon.kullanim_limiti && kupon.kullanim_sayisi >= kupon.kullanim_limiti)
      return NextResponse.json({ gecerli: false, hata: 'Kullanım limiti dolmuş' })
    if (tutar < kupon.min_tutar)
      return NextResponse.json({ gecerli: false, hata: `Min sepet: ₺${kupon.min_tutar}` })
    let indirim = kupon.tip === 'yuzde' ? tutar * (kupon.deger / 100) : kupon.deger
    if (kupon.max_indirim) indirim = Math.min(indirim, kupon.max_indirim)
    return NextResponse.json({ gecerli: true, kupon, indirim })
  }

  // Kupon bulunamadıysa referans kodu olarak dene
  const { data: ayarlar } = await db.from('site_ayarlar')
    .select('anahtar, deger').eq('grup', 'referans')

  const ayObj: any = {}
  ayarlar?.forEach((a: any) => { ayObj[a.anahtar] = a.deger })

  if (ayObj.referans_aktif !== '1')
    return NextResponse.json({ gecerli: false, hata: 'Geçersiz kod' })

  const { data: ref } = await db.from('site_referanslar')
    .select('id, user_id').eq('kod', kod.toUpperCase()).eq('aktif', true).single()

  if (!ref)
    return NextResponse.json({ gecerli: false, hata: 'Geçersiz kod' })

  const minSiparis = parseFloat(ayObj.referans_min_siparis || '200')
  if (tutar < minSiparis)
    return NextResponse.json({ gecerli: false, hata: `Referans kodu için min sepet: ₺${minSiparis}` })

  const indirimTutari = parseFloat(ayObj.referans_gelen_indirim || '50')

  return NextResponse.json({
    gecerli: true,
    referans: true,
    referans_id: ref.id,
    indirim: indirimTutari,
    kupon: {
      kod: kod.toUpperCase(),
      tip: 'sabit',
      deger: indirimTutari,
      aciklama: `Referans indirimi: ₺${indirimTutari}`
    }
  })
}
