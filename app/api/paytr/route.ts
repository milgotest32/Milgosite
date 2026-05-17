import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import crypto from 'crypto'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const db = createServerClient()
  const body = await req.json()
  const { siparis_id, tutar, email, sepet, adres, taksit = 1 } = body

  // PayTR ayarlarını al
  const { data: ayarlar } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup', 'odeme')
  const ayar: Record<string,string> = {}
  ayarlar?.forEach((a: any) => { ayar[a.anahtar] = a.deger || '' })

  const merchant_id = ayar.paytr_merchant_id
  const merchant_key = ayar.paytr_merchant_key
  const merchant_salt = ayar.paytr_merchant_salt
  const test_mode = ayar.paytr_test_mode === '1' ? '1' : '0'

  if (!merchant_id || !merchant_key || !merchant_salt) {
    return NextResponse.json({ error: 'PayTR ayarları eksik' }, { status: 400 })
  }

  const merchant_oid = siparis_id
  const payment_amount = Math.round(tutar * 100).toString()
  const user_basket = Buffer.from(JSON.stringify(sepet)).toString('base64')
  const user_ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
  const currency = 'TL'
  const installment_count = taksit.toString()
  const merchant_ok_url = `${process.env.NEXT_PUBLIC_SITE_URL}/siparis-onay`
  const merchant_fail_url = `${process.env.NEXT_PUBLIC_SITE_URL}/siparis-basarisiz`
  const debug_on = test_mode
  const no_installment = taksit === 1 ? '0' : '0'
  const max_installment = '12'
  const lang = 'tr'

  const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`
  const paytr_token = crypto.createHmac('sha256', merchant_key).update(hash_str + merchant_salt).digest('base64')

  const params = new URLSearchParams({
    merchant_id, user_ip, merchant_oid, email, payment_amount,
    user_basket, debug_on, no_installment, max_installment,
    user_name: adres?.ad || 'Müşteri',
    user_address: adres?.adres || '',
    user_phone: adres?.telefon || '',
    merchant_ok_url, merchant_fail_url,
    paytr_token, lang, currency, test_mode,
    installment_count
  })

  const r = await fetch('https://www.paytr.com/odeme/api/get-token', { method: 'POST', body: params })
  const result = await r.json()

  if (result.status === 'success') {
    await db.from('site_odemeler').insert({ siparis_id, yontem: 'paytr', tutar, durum: 'bekliyor', token: result.token, taksit })
    return NextResponse.json({ token: result.token })
  }

  return NextResponse.json({ error: result.reason || 'PayTR hatası' }, { status: 400 })
}
