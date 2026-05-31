import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { siparisMail, adminSiparisMail } from '@/lib/mail-templates'
import crypto from 'crypto'
export const dynamic = 'force-dynamic'

async function mailGonder(to: string, subject: string, html: string, baseUrl: string) {
  try {
    await fetch(`${baseUrl}/api/mail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': process.env.INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({ to, subject, html })
    })
  } catch { /* mail hatası akışı durdurmasın */ }
}

export async function POST(req: NextRequest) {
  const db = createServerClient()
  const body = await req.formData()
  const merchant_oid = body.get('merchant_oid') as string
  const status = body.get('status') as string
  const total_amount = body.get('total_amount') as string
  const hash = body.get('hash') as string

  // PayTR ayarlarını al
  const { data: ayarlar } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup', 'odeme')
  const ayar: Record<string, string> = {}
  ayarlar?.forEach((a: any) => { ayar[a.anahtar] = a.deger || '' })

  // Hash doğrula
  const check = crypto
    .createHmac('sha256', ayar.paytr_merchant_key)
    .update(`${merchant_oid}${ayar.paytr_merchant_salt}${status}${total_amount}`)
    .digest('base64')

  if (check !== hash) return new NextResponse('FAIL', { status: 400 })

  const baseUrl = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://market.milgo.com.tr'

  if (status === 'success') {
    // Siparişi onayla
    const { data: siparis } = await db
      .from('site_siparisler')
      .update({ odeme_durumu: 'odendi', durum: 'onaylandi' })
      .eq('id', merchant_oid)
      .select('*, site_siparis_kalemleri(*)')
      .single()

    // Ödeme başarılı → müşteri ve admin mailine gönder
    if (siparis) {
      const kalemler = siparis.site_siparis_kalemleri || []
      if (siparis.musteri_email) {
        await mailGonder(
          siparis.musteri_email,
          `Siparişiniz Onaylandı - #${siparis.siparis_no}`,
          siparisMail(siparis, kalemler),
          baseUrl
        )
      }
      const { data: adminMail } = await db.from('site_ayarlar').select('deger').eq('grup', 'genel').eq('anahtar', 'iletisim_email').single()
      if (adminMail?.deger) {
        await mailGonder(
          adminMail.deger,
          `🛍 Yeni Sipariş #${siparis.siparis_no} - ₺${siparis.toplam?.toFixed(2)}`,
          adminSiparisMail(siparis),
          baseUrl
        )
      }
    }
  } else {
    // Ödeme başarısız → siparişi iptal et
    await db
      .from('site_siparisler')
      .update({ odeme_durumu: 'basarisiz', durum: 'iptal' })
      .eq('id', merchant_oid)
  }

  return new NextResponse('OK')
}
