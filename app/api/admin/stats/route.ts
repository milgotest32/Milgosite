import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET() {
  const db = serviceClient()

  // Tüm stats'ı paralel çek
  const [
    { count: siparisSayisi },
    { count: urunSayisi },
    { count: musteriSayisi },
    { data: siparisler },
    { data: abonelikler },
    { data: urunler },
  ] = await Promise.all([
    db.from('site_siparisler').select('*', { count: 'exact', head: true }),
    db.from('site_products').select('*', { count: 'exact', head: true }).eq('durum', 'active'),
    db.from('site_musteriler').select('*', { count: 'exact', head: true }),
    db.from('site_siparisler').select('toplam, durum, created_at, siparis_no, musteri_ad, musteri_email').order('created_at', { ascending: false }).limit(200),
    db.from('site_abonelikler').select('*', { count: 'exact', head: true }).eq('aktif', true),
    db.from('site_products').select('id, name, stok').eq('durum', 'active').lt('stok', 10).order('stok', { ascending: true }).limit(5),
  ])

  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  const haftaOnce = new Date(bugun)
  haftaOnce.setDate(haftaOnce.getDate() - 7)

  const tumSiparisler = siparisler || []
  const odenenler = tumSiparisler.filter(s => s.durum !== 'iptal')

  const toplamGelir = odenenler.reduce((t, s) => t + Number(s.toplam || 0), 0)
  const bugunCiro = odenenler
    .filter(s => new Date(s.created_at) >= bugun)
    .reduce((t, s) => t + Number(s.toplam || 0), 0)
  const haftaGelir = odenenler
    .filter(s => new Date(s.created_at) >= haftaOnce)
    .reduce((t, s) => t + Number(s.toplam || 0), 0)

  const bekleyenSiparis = tumSiparisler.filter(s => s.durum === 'bekliyor').length
  const bugunSiparis = tumSiparisler.filter(s => new Date(s.created_at) >= bugun).length

  const sonSiparisler = tumSiparisler.slice(0, 8)

  return NextResponse.json({
    siparis_sayisi: siparisSayisi || 0,
    urun_sayisi: urunSayisi || 0,
    musteri_sayisi: musteriSayisi || 0,
    toplam_gelir: toplamGelir,
    bugun_ciro: bugunCiro,
    hafta_gelir: haftaGelir,
    bekleyen_siparis: bekleyenSiparis,
    bugun_siparis: bugunSiparis,
    aktif_abonelik: 0,
    son_siparisler: sonSiparisler,
    dusuk_stok: urunler || [],
    en_cok_satanlar: [],
  })
}
