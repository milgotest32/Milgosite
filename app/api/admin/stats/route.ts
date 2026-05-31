import { NextResponse } from 'next/server'
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

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = serviceClient()

  const [
    { count: siparisSayisi },
    { count: urunSayisi },
    { count: musteriSayisi },
    { data: siparisler },
    { data: urunler },
    { data: kalemler },
  ] = await Promise.all([
    db.from('site_siparisler').select('*', { count: 'exact', head: true }),
    db.from('site_products').select('*', { count: 'exact', head: true }).eq('durum', 'active'),
    db.from('site_musteriler').select('*', { count: 'exact', head: true }),
    db.from('site_siparisler').select('toplam, durum, created_at, siparis_no, musteri_ad, musteri_email').order('created_at', { ascending: false }).limit(200),
    db.from('site_products').select('id, name, stok').eq('durum', 'active').lt('stok', 10).order('stok', { ascending: true }).limit(5),
    db.from('site_siparis_kalemleri').select('urun_ad, adet, toplam').limit(1000),
  ])

  const bugun = new Date()
  bugun.setHours(0, 0, 0, 0)
  const haftaOnce = new Date(bugun)
  haftaOnce.setDate(haftaOnce.getDate() - 7)

  const tumSiparisler = siparisler || []
  const odenenler = tumSiparisler.filter(s => s.durum !== 'iptal')

  const toplamGelir = odenenler.reduce((t, s) => t + Number(s.toplam || 0), 0)
  const bugunCiro = odenenler.filter(s => new Date(s.created_at) >= bugun).reduce((t, s) => t + Number(s.toplam || 0), 0)
  const haftaGelir = odenenler.filter(s => new Date(s.created_at) >= haftaOnce).reduce((t, s) => t + Number(s.toplam || 0), 0)

  return NextResponse.json({
    siparis_sayisi: siparisSayisi || 0,
    urun_sayisi: urunSayisi || 0,
    musteri_sayisi: musteriSayisi || 0,
    toplam_gelir: toplamGelir,
    bugun_ciro: bugunCiro,
    hafta_gelir: haftaGelir,
    bekleyen_siparis: tumSiparisler.filter(s => s.durum === 'bekliyor').length,
    bugun_siparis: tumSiparisler.filter(s => new Date(s.created_at) >= bugun).length,
    aktif_abonelik: 0,
    son_siparisler: tumSiparisler.slice(0, 8),
    dusuk_stok: urunler || [],
    en_cok_satanlar: (() => {
      const grouped: Record<string, { adet: number; gelir: number }> = {}
      ;(kalemler || []).forEach((k: any) => {
        if (!grouped[k.urun_ad]) grouped[k.urun_ad] = { adet: 0, gelir: 0 }
        grouped[k.urun_ad].adet += k.adet
        grouped[k.urun_ad].gelir += k.toplam
      })
      return Object.entries(grouped)
        .sort((a, b) => b[1].adet - a[1].adet)
        .slice(0, 5)
        .map(([ad, d]) => ({ ad, ...d }))
    })(),
  })
}
