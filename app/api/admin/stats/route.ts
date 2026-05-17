import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  const db = createServerClient()
  const [sip, urun, mus, gelir] = await Promise.all([
    db.from('site_siparisler').select('*', { count: 'exact', head: true }),
    db.from('site_products').select('*', { count: 'exact', head: true }).neq('durum', 'deleted'),
    db.from('site_users').select('*', { count: 'exact', head: true }),
    db.from('site_siparisler').select('toplam,created_at').eq('odeme_durumu', 'odendi'),
  ])
  const toplamGelir = (gelir.data || []).reduce((t: number, s: any) => t + (s.toplam || 0), 0)
  const bugun = new Date(); bugun.setHours(0,0,0,0)
  const bugunGelir = (gelir.data || []).filter((s: any) => new Date(s.created_at) >= bugun).reduce((t: number, s: any) => t + (s.toplam || 0), 0)
  const { data: dusukStok } = await db.from('site_products').select('id,name,stok,min_stok').eq('stok_takip', true).lt('stok', 5).neq('durum','deleted').limit(10)
  const { data: sonSiparisler } = await db.from('site_siparisler').select('*,site_siparis_kalemleri(*)').order('created_at', { ascending: false }).limit(5)
  return NextResponse.json({ siparis_sayisi: sip.count||0, urun_sayisi: urun.count||0, musteri_sayisi: mus.count||0, toplam_gelir: toplamGelir, bugun_ciro: bugunGelir, dusuk_stok: dusukStok||[], son_siparisler: sonSiparisler||[] })
}
