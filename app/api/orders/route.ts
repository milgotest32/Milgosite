import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { siparisMail, adminSiparisMail } from '@/lib/mail-templates'
export const dynamic = 'force-dynamic'

function genNo() {
  return 'MG' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random()*99999).toString().padStart(5,'0')
}

async function mailGonder(to: string, subject: string, html: string, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/mail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html })
    })
  } catch { /* mail hatası siparişi durdurmasın */ }
}

export async function GET(req: NextRequest) {
  const db = createServerClient()
  const { searchParams } = new URL(req.url)
  const musteri_id = searchParams.get('musteri_id')

  if (musteri_id) {
    const { data: { user } } = await db.auth.getUser()
    if (!user || (user.id !== musteri_id)) {
      const { data: role } = await db.from('site_users').select('role').eq('id', user?.id || '').single()
      if (role?.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }
  }

  let q: any = db.from('site_siparisler').select('*, site_siparis_kalemleri(*)').order('created_at', { ascending: false }).limit(100)
  if (musteri_id) q = q.eq('musteri_id', musteri_id)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const db = createServerClient()
  const body = await req.json()
  const { items, adres, kupon_kod, notlar, odeme_yontemi, bolge_adi } = body
  const misafir_email: string | null = body.misafir_email || null

  let musteri_id: string | null = null
  try {
    const { data: { user } } = await db.auth.getUser()
    if (user?.id) musteri_id = user.id
  } catch {}

  // Fiyatları DB'den doğrula + stok kontrolü — her ürün için tek sorguda
  const dogrulanmisItems: Array<{ product_id: string; urun_ad: string; urun_gorsel: string | null; fiyat: number; adet: number }> = []
  let ara_toplam = 0

  for (const item of items) {
    if (!item.product_id) continue
    const { data: urun } = await db
      .from('site_products')
      .select('fiyat, name, stok, stok_takip')
      .eq('id', item.product_id)
      .eq('durum', 'active')
      .single()

    if (!urun) return NextResponse.json({ error: `Ürün bulunamadı: ${item.urun_ad}` }, { status: 400 })

    // Stok kontrolü
    if (urun.stok_takip && urun.stok < item.adet) {
      return NextResponse.json({
        error: `"${urun.name}" için yeterli stok yok. Mevcut: ${urun.stok} adet.`
      }, { status: 400 })
    }

    const fiyat = urun.fiyat // DB'den gelen doğrulanmış fiyat
    ara_toplam += fiyat * item.adet
    dogrulanmisItems.push({
      product_id: item.product_id,
      urun_ad: urun.name,
      urun_gorsel: item.urun_gorsel || null,
      fiyat,
      adet: Number(item.adet),
    })
  }

  if (dogrulanmisItems.length === 0) {
    return NextResponse.json({ error: 'Sepet boş' }, { status: 400 })
  }

  // Kargo ücretini DB'den oku
  let standart_kargo = 49.90
  let ucretsiz_limit = 500
  try {
    const { data: kargoAyar } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup','kargo')
    if (kargoAyar) {
      const m: Record<string, string> = {}
      kargoAyar.forEach((r: any) => { m[r.anahtar] = r.deger })
      if (m.standart_kargo_ucreti) standart_kargo = parseFloat(m.standart_kargo_ucreti) || 49.90
      if (m.ucretsiz_kargo_tutari) ucretsiz_limit = parseFloat(m.ucretsiz_kargo_tutari) || 500
    }
  } catch {}
  const kargo_ucreti = ara_toplam >= ucretsiz_limit ? 0 : standart_kargo

  // İndirimi sunucuda hesapla
  let indirim = 0
  if (kupon_kod) {
    const { data: kupon } = await db.from('site_kuponlar').select('*').eq('kod', kupon_kod.toUpperCase()).eq('aktif', true).single()
    if (kupon && (!kupon.bitis || new Date(kupon.bitis) >= new Date()) && (!kupon.kullanim_limiti || kupon.kullanim_sayisi < kupon.kullanim_limiti)) {
      indirim = kupon.tip === 'yuzde' ? ara_toplam * (kupon.deger / 100) : kupon.deger
      if (kupon.max_indirim) indirim = Math.min(indirim, kupon.max_indirim)
      indirim = Math.min(indirim, ara_toplam)
    }
  }

  const toplam = Math.max(0, ara_toplam + kargo_ucreti - indirim)
  const baslangic_durum = odeme_yontemi === 'kart' ? 'bekliyor' : 'onaylandi'
  const baslangic_odeme_durum = 'bekliyor'

  const siparisVeri = {
    siparis_no: genNo(), musteri_id, misafir_email,
    musteri_ad: `${adres.ad} ${adres.soyad || ''}`.trim(),
    musteri_email: misafir_email || adres.email || '',
    musteri_telefon: adres.telefon || '',
    teslimat_adres: adres.adres, teslimat_ilce: adres.ilce,
    teslimat_sehir: adres.sehir || 'İstanbul',
    bolge_adi: bolge_adi || null,
    odeme_yontemi: odeme_yontemi || 'kart',
    durum: baslangic_durum,
    odeme_durumu: baslangic_odeme_durum,
    ara_toplam, kargo_ucreti, indirim, toplam, kupon_kod, notlar,
  }

  let { data: siparis, error } = await db.from('site_siparisler').insert(siparisVeri).select().single()

  if (error?.message?.includes('foreign key constraint') || error?.message?.includes('fkey')) {
    const yedek = await db.from('site_siparisler').insert({
      ...siparisVeri,
      siparis_no: genNo(),
      musteri_id: null,
    }).select().single()
    siparis = yedek.data
    error = yedek.error
  }

  if (error || !siparis) return NextResponse.json({ error: error?.message || 'Sipariş oluşturulamadı' }, { status: 400 })
  if (!siparis?.id) return NextResponse.json({ error: 'Sipariş ID alınamadı' }, { status: 500 })

  // Kalemleri DB'den doğrulanmış fiyatlarla kaydet
  const kalemler = dogrulanmisItems.map(i => ({
    siparis_id: siparis.id,
    product_id: i.product_id,
    urun_ad: i.urun_ad,
    urun_gorsel: i.urun_gorsel,
    birim_fiyat: i.fiyat,       // DB'den gelen doğrulanmış fiyat
    adet: i.adet,
    toplam: i.fiyat * i.adet,
  }))

  const { error: kalemHata } = await db.from('site_siparis_kalemleri').insert(kalemler)
  if (kalemHata) console.error('KALEM HATA:', kalemHata.code, kalemHata.message)

  // Stok düş
  for (const item of dogrulanmisItems) {
    try { await db.rpc('stok_dus', { p_id: item.product_id, p_adet: item.adet }) } catch {}
  }

  // Kupon sayacı
  if (kupon_kod) {
    try { await db.rpc('kupon_kullan', { p_kod: kupon_kod }) } catch {}
  }

  // Mail gönder
  const baseUrl = req.headers.get('origin') || 'https://milgosite.vercel.app'
  if (odeme_yontemi !== 'kart') {
    if (siparis.musteri_email) {
      await mailGonder(siparis.musteri_email, `Siparişiniz Alındı - #${siparis.siparis_no}`, siparisMail(siparis, kalemler), baseUrl)
    }
    const { data: adminMail } = await db.from('site_ayarlar').select('deger').eq('grup', 'genel').eq('anahtar', 'iletisim_email').single()
    if (adminMail?.deger) {
      await mailGonder(adminMail.deger, `🛍 Yeni Sipariş #${siparis.siparis_no} - ₺${toplam.toFixed(2)}`, adminSiparisMail(siparis), baseUrl)
    }
  }

  return NextResponse.json({ data: siparis }, { status: 201 })
}
