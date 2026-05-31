import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createServerClient()

  // Sistem açık mı?
  const { data: ayar } = await db
    .from('site_ayarlar')
    .select('deger')
    .eq('grup', 'kapasite')
    .eq('anahtar', 'sistem_aktif')
    .single()

  if (!ayar || ayar.deger !== '1') {
    return NextResponse.json({ aktif: false })
  }

  // Bu ayki kapasite dilimleri
  const ay = new Date().toISOString().slice(0, 7) // '2026-07'
  const { data: dilimler } = await db
    .from('site_kapasite_dilimleri')
    .select('*')
    .eq('ay', ay)
    .eq('aktif', true)

  if (!dilimler || dilimler.length === 0) {
    return NextResponse.json({ aktif: false })
  }

  // Her plan için o ay kaç abonelik var?
  const { data: abonelikler } = await db
    .from('site_abonelikler')
    .select('plan')
    .eq('rezervasyon_ayi', ay)
    .eq('aktif', true)

  const satilanlar: Record<string, number> = {}
  ;(abonelikler || []).forEach((a: any) => {
    satilanlar[a.plan] = (satilanlar[a.plan] || 0) + 1
  })

  // Her plan için güncel dilim fiyatını hesapla
  const planBilgileri = dilimler.map((d: any) => {
    const satilan = satilanlar[d.plan] || 0
    const kalan = d.toplam_kapasite - satilan

    let guncelFiyat = d.dilim_1_fiyat
    let sonrakiFiyat = null
    let sonrakiKalan = null

    if (satilan >= d.dilim_1_adet + d.dilim_2_adet) {
      guncelFiyat = d.dilim_3_fiyat
    } else if (satilan >= d.dilim_1_adet) {
      guncelFiyat = d.dilim_2_fiyat
      sonrakiFiyat = d.dilim_3_fiyat
      sonrakiKalan = d.dilim_1_adet + d.dilim_2_adet - satilan
    } else {
      guncelFiyat = d.dilim_1_fiyat
      sonrakiFiyat = d.dilim_2_fiyat
      sonrakiKalan = d.dilim_1_adet - satilan
    }

    return {
      plan: d.plan,
      toplam: d.toplam_kapasite,
      satilan,
      kalan,
      dolulukYuzde: Math.round((satilan / d.toplam_kapasite) * 100),
      guncelFiyat,
      sonrakiFiyat,
      sonrakiKalan,
      dolu: kalan <= 0,
    }
  })

  return NextResponse.json({ aktif: true, ay, planlar: planBilgileri })
}
