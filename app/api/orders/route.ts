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
  
  // Kullanıcı kendi siparişlerini görebilir, admin hepsini
  if (musteri_id) {
    const { data: { user } } = await db.auth.getUser()
    if (!user || (user.id !== musteri_id)) {
      // Admin kontrolü
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
  // musteri_id must be null (not undefined/empty string) for guest orders to avoid FK constraint violation
  const musteri_id: string | null = body.musteri_id || null
  const misafir_email: string | null = body.misafir_email || null

  // Fiyatları DB'den doğrula - client'tan gelen fiyata güvenme
  let ara_toplam = 0
  for (const item of items) {
    if (item.product_id) {
      const { data: urun } = await db.from('site_products').select('fiyat').eq('id', item.product_id).single()
      if (urun) {
        item.fiyat = urun.fiyat // DB fiyatını kullan
      }
    }
    ara_toplam += (item.fiyat || 0) * item.adet
  }
  // Kurye ücretini sistem ayarlarından oku
  let standart_kargo = 49.90
  let ucretsiz_limit = 500
  try {
    const { data: kargoAyar } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup','kargo')
    if (kargoAyar) {
      const kargoMap: Record<string, string> = {}
      kargoAyar.forEach((r: any) => { kargoMap[r.anahtar] = r.deger })
      if (kargoMap.standart_kargo_ucreti) standart_kargo = parseFloat(kargoMap.standart_kargo_ucreti) || 49.90
      if (kargoMap.ucretsiz_kargo_tutari) ucretsiz_limit = parseFloat(kargoMap.ucretsiz_kargo_tutari) || 500
    }
  } catch {}
  const kargo_ucreti = ara_toplam >= ucretsiz_limit ? 0 : standart_kargo

  // İndirimi sunucuda hesapla - client'tan gelen değere güvenme
  let indirim = 0
  if (kupon_kod) {
    const { data: kupon } = await db.from('site_kuponlar').select('*').eq('kod', kupon_kod.toUpperCase()).eq('aktif', true).single()
    if (kupon && (!kupon.bitis || new Date(kupon.bitis) >= new Date()) && (!kupon.kullanim_limiti || kupon.kullanim_sayisi < kupon.kullanim_limiti)) {
      indirim = kupon.tip === 'yuzde' ? ara_toplam * (kupon.deger / 100) : kupon.deger
      if (kupon.max_indirim) indirim = Math.min(indirim, kupon.max_indirim)
      indirim = Math.min(indirim, ara_toplam) // indirim sepeti aşamaz
    }
  }

  const toplam = Math.max(0, ara_toplam + kargo_ucreti - indirim)

  const { data: siparis, error } = await db.from('site_siparisler').insert({
    siparis_no: genNo(), musteri_id, misafir_email,
    musteri_ad: `${adres.ad} ${adres.soyad || ''}`.trim(),
    musteri_email: misafir_email || adres.email || '',
    musteri_telefon: adres.telefon || '',
    teslimat_adres: adres.adres, teslimat_ilce: adres.ilce,
    teslimat_sehir: adres.sehir || 'İstanbul',
    bolge_adi: bolge_adi || null,
    odeme_yontemi: odeme_yontemi || 'kart',
    ara_toplam, kargo_ucreti, indirim, toplam, kupon_kod, notlar,
  }).select().single()

  if (error || !siparis) return NextResponse.json({ error: error?.message || 'Sipariş oluşturulamadı' }, { status: 400 })

  const kalemler = items.map((i: any) => ({
    siparis_id: siparis.id, product_id: i.product_id,
    urun_ad: i.urun_ad, urun_gorsel: i.urun_gorsel,
    birim_fiyat: i.fiyat, adet: i.adet, toplam: i.fiyat * i.adet,
  }))

  await db.from('site_siparis_kalemleri').insert(kalemler)

  // Stok düş
  for (const item of items) {
    if (item.product_id) {
      try { await db.rpc('stok_dus', { p_id: item.product_id, p_adet: item.adet }) } catch {}
    }
  }

  // Kupon sayacı
  if (kupon_kod) {
    try { await db.rpc('kupon_kullan', { p_kod: kupon_kod }) } catch {}
  }

  // Mail gönder
  const baseUrl = req.headers.get('origin') || 'https://milgosite.vercel.app'
  const musteriEmail = siparis.musteri_email
  
  if (musteriEmail) {
    await mailGonder(
      musteriEmail,
      `Siparişiniz Alındı - #${siparis.siparis_no}`,
      siparisMail(siparis, kalemler),
      baseUrl
    )
  }

  // Admin bildirimi
  const { data: adminMail } = await db.from('site_ayarlar').select('deger').eq('grup', 'genel').eq('anahtar', 'iletisim_email').single()
  if (adminMail?.deger) {
    await mailGonder(
      adminMail.deger,
      `🛍 Yeni Sipariş #${siparis.siparis_no} - ₺${toplam.toFixed(2)}`,
      adminSiparisMail(siparis),
      baseUrl
    )
  }

  return NextResponse.json({ data: siparis }, { status: 201 })
}
