import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createServerClient()
  const { data } = await db
    .from('site_ayarlar')
    .select('anahtar, deger')
    .eq('grup', 'sezon')

  const ayarlar: Record<string, string> = {}
  ;(data || []).forEach((r: any) => { ayarlar[r.anahtar] = r.deger })

  const aktif = ayarlar['aktif'] === '1'
  const kapasisteGizle = !aktif && ayarlar['abonelik_gizle'] === '1'

  return NextResponse.json({
    sezon_aktif: aktif,
    kapali_mesaj: ayarlar['kapali_mesaj'] || 'Çiğ süt sezonu şu an kapalı.',
    bitis_tarihi: ayarlar['bitis_tarihi'] || null,
    onkayit_aktif: ayarlar['onkayit_aktif'] === '1',
    abonelik_gizle: kapasisteGizle,
  })
}
