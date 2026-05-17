import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
function genNo() { return 'MG' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random()*99999).toString().padStart(5,'0') }
export async function GET(req: NextRequest) {
  const db = createServerClient()
  const { searchParams } = new URL(req.url)
  const musteri_id = searchParams.get('musteri_id')
  let q: any = db.from('site_siparisler').select('*, site_siparis_kalemleri(*)').order('created_at', { ascending: false }).limit(100)
  if (musteri_id) q = q.eq('musteri_id', musteri_id)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
export async function POST(req: NextRequest) {
  const db = createServerClient()
  const { items, adres, kupon_kod, indirim = 0, musteri_id, misafir_email, notlar } = await req.json()
  const ara_toplam = items.reduce((s: number, i: any) => s + i.fiyat * i.adet, 0)
  const kargo_ucreti = ara_toplam >= 500 ? 0 : 49.90
  const toplam = ara_toplam + kargo_ucreti - indirim
  const siparis_no = genNo()
  const { data: siparis, error } = await db.from('site_siparisler').insert({
    siparis_no, musteri_id, misafir_email,
    musteri_ad: `${adres.ad} ${adres.soyad || ''}`.trim(),
    musteri_email: misafir_email || adres.email || '',
    musteri_telefon: adres.telefon || '',
    teslimat_adres: adres.adres, teslimat_ilce: adres.ilce,
    teslimat_sehir: adres.sehir || 'İstanbul',
    ara_toplam, kargo_ucreti, indirim, toplam, kupon_kod, notlar,
  }).select().single()
  if (error || !siparis) return NextResponse.json({ error: error?.message }, { status: 400 })
  await db.from('site_siparis_kalemleri').insert(items.map((i: any) => ({
    siparis_id: siparis.id, product_id: i.product_id,
    urun_ad: i.urun_ad, urun_gorsel: i.urun_gorsel,
    birim_fiyat: i.fiyat, adet: i.adet, toplam: i.fiyat * i.adet,
  })))
  return NextResponse.json({ data: siparis }, { status: 201 })
}
