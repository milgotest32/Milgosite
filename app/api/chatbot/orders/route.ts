import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const CHATBOT_SECRET = process.env.CHATBOT_SECRET || 'milgo-chatbot-2025'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

// Türkçe durum açıklamaları
const DURUM_TR: Record<string, string> = {
  bekliyor:   'Bekliyor',
  onaylandi:  'Onaylandı',
  hazirlaniyor: 'Hazırlanıyor',
  kargoda:    'Kargoda',
  teslim_edildi: 'Teslim Edildi',
  iptal:      'İptal Edildi',
}

const ODEME_TR: Record<string, string> = {
  bekliyor:  'Ödeme Bekleniyor',
  odendi:    'Ödendi',
  iade:      'İade Edildi',
  basarisiz: 'Ödeme Başarısız',
}

export async function GET(req: NextRequest) {
  // Token kontrolü
  const token = req.headers.get('x-chatbot-secret') || req.nextUrl.searchParams.get('secret')
  if (token !== CHATBOT_SECRET) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const siparis_no = (searchParams.get('siparis_no') || '').trim().replace(/^#/, '')
  const telefon = (searchParams.get('telefon') || '').replace(/\D/g, '')

  if (!siparis_no && !telefon) {
    return NextResponse.json(
      { ok: false, error: 'siparis_no veya telefon parametresi gerekli' },
      { status: 400 }
    )
  }

  const db = serviceClient()

  let query = db
    .from('site_siparisler')
    .select('*, site_siparis_kalemleri(urun_ad, adet, birim_fiyat, toplam)')
    .order('created_at', { ascending: false })
    .limit(1)

  // Sipariş no ile ara (öncelikli)
  if (siparis_no) {
    // MG prefix'i varsa direkt, yoksa MG ekleyerek veya sadece rakamla dene
    const aramaNo = siparis_no.startsWith('MG') ? siparis_no : siparis_no
    query = query.or(`siparis_no.eq.${aramaNo},siparis_no.ilike.%${siparis_no}%`)
  } else if (telefon) {
    // Telefona göre en son sipariş
    query = query.or(
      `musteri_telefon.eq.${telefon},musteri_telefon.eq.0${telefon},musteri_telefon.eq.+90${telefon}`
    )
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      ok: false,
      bulunamadi: true,
      mesaj: siparis_no
        ? `#${siparis_no} numaralı sipariş bulunamadı.`
        : 'Bu telefon numarasına ait sipariş bulunamadı.',
    })
  }

  const s = data[0]
  const durum_tr = DURUM_TR[s.durum] || s.durum
  const odeme_tr = ODEME_TR[s.odeme_durumu] || s.odeme_durumu
  const kalemler = (s.site_siparis_kalemleri || []) as Array<{
    urun_ad: string; adet: number; birim_fiyat: number; toplam: number
  }>

  // WhatsApp'a hazır mesaj
  const kalem_metni = kalemler
    .map(k => `• ${k.urun_ad} × ${k.adet} = ${parseFloat(k.toplam as any).toFixed(2)} TL`)
    .join('\n')

  const durum_emoji: Record<string, string> = {
    bekliyor: '⏳', onaylandi: '✅', hazirlaniyor: '🔄',
    kargoda: '🚚', teslim_edildi: '📦', iptal: '❌',
  }
  const emoji = durum_emoji[s.durum] || '📋'

  const whatsapp_metni =
    `${emoji} *Sipariş #${s.siparis_no}*\n` +
    `📅 Tarih: ${new Date(s.created_at).toLocaleDateString('tr-TR')}\n` +
    `📦 Durum: ${durum_tr}\n` +
    `💳 Ödeme: ${odeme_tr}\n` +
    `💰 Toplam: ${parseFloat(s.toplam).toFixed(2)} TL` +
    (kalem_metni ? `\n\n*Ürünler:*\n${kalem_metni}` : '') +
    (s.durum === 'teslim_edildi' ? '\n\n✅ Siparişiniz teslim edilmiştir. Afiyet olsun 🤍' : '') +
    (s.durum === 'kargoda' ? '\n\n🚚 Siparişiniz yolda!' : '') +
    (s.durum === 'bekliyor' || s.durum === 'hazirlaniyor' ? '\n\n⏳ Siparişiniz hazırlanıyor.' : '')

  return NextResponse.json({
    ok: true,
    siparis: {
      id: s.id,
      siparis_no: s.siparis_no,
      durum: s.durum,
      durum_tr,
      odeme_durumu: s.odeme_durumu,
      odeme_tr,
      toplam: parseFloat(s.toplam),
      musteri_ad: s.musteri_ad,
      musteri_telefon: s.musteri_telefon,
      created_at: s.created_at,
      kalemler,
    },
    whatsapp_metni,  // Build Reply (Order) node'u bunu kullanacak
  })
}
