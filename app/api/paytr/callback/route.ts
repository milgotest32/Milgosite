import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import crypto from 'crypto'
export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  const db = createServerClient()
  const body = await req.formData()
  const merchant_oid = body.get('merchant_oid') as string
  const status = body.get('status') as string
  const total_amount = body.get('total_amount') as string
  const hash = body.get('hash') as string
  const { data: ayarlar } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup', 'odeme')
  const ayar: Record<string,string> = {}
  ayarlar?.forEach((a: any) => { ayar[a.anahtar] = a.deger || '' })
  const check = crypto.createHmac('sha256', ayar.paytr_merchant_key).update(`${merchant_oid}${ayar.paytr_merchant_salt}${status}${total_amount}`).digest('base64')
  if (check !== hash) return new NextResponse('FAIL', { status: 400 })
  if (status === 'success') {
    await db.from('site_siparisler').update({ odeme_durumu: 'odendi', durum: 'onaylandi' }).eq('id', merchant_oid)
  } else {
    await db.from('site_siparisler').update({ odeme_durumu: 'basarisiz' }).eq('id', merchant_oid)
  }
  return new NextResponse('OK')
}
