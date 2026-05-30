import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Secret mutlaka Vercel env'den gelecek — fallback yok
const CHATBOT_SECRET = process.env.CHATBOT_SECRET

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

function kategoriTespit(name: string, slug: string): string {
  const n = name.toLowerCase()
  const s = slug.toLowerCase()
  if (n.includes('süt') || n.includes('sut') || s.includes('sut')) return 'Süt'
  if (n.includes('tereyağ') || n.includes('tereyag') || s.includes('tereyag')) return 'Tereyağları'
  return 'Peynirler'
}

export async function GET(req: NextRequest) {
  // Token kontrolü — sadece header üzerinden (URL param güvensiz: loglara düşer)
  const token = req.headers.get('x-chatbot-secret')
  if (!token || token !== CHATBOT_SECRET) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const db = serviceClient()

  const { data: urunler, error } = await db
    .from('site_products')
    .select('id, name, slug, fiyat, stok, stok_takip')
    .eq('durum', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // WhatsApp mesajı formatında grupla
  const gruplar: Record<string, { emoji: string; items: string[] }> = {
    'Süt':        { emoji: '🥛', items: [] },
    'Peynirler':  { emoji: '🧀', items: [] },
    'Tereyağları':{ emoji: '🧈', items: [] },
  }

  // n8n'nin detaylı kullanımı için ham liste
  const ham: Array<{
    id: string
    name: string
    slug: string
    fiyat: number
    stok: number
    stok_var: boolean
    kategori: string
    link: string
    anahtar_kelimeler: string[]
  }> = []

  for (const u of urunler || []) {
    const kategori = kategoriTespit(u.name, u.slug)
    const stok_var = !u.stok_takip || u.stok > 0
    const fiyat = parseFloat(u.fiyat)
    const link = `https://milgosite.vercel.app/urun/${u.slug}`

    // WhatsApp satırı
    const stok_icon = stok_var ? '' : ' _(stokta yok)_'
    const satir = `• ${u.name} — ${fiyat.toFixed(2)} TL${stok_icon}`
    if (gruplar[kategori]) gruplar[kategori].items.push(satir)

    // Anahtar kelimeler (chatbot eşleştirme için)
    const kw = [u.slug.replace(/-/g, ' '), u.name.toLowerCase()]
    ham.push({
      id: u.id,
      name: u.name,
      slug: u.slug,
      fiyat,
      stok: u.stok,
      stok_var,
      kategori,
      link,
      anahtar_kelimeler: kw,
    })
  }

  // WhatsApp'a gönderilecek hazır metin
  const sirali = ['Süt', 'Peynirler', 'Tereyağları']
  let whatsapp_metni = ''
  for (const kat of sirali) {
    const g = gruplar[kat]
    if (!g || g.items.length === 0) continue
    whatsapp_metni += `${g.emoji} *${kat}*\n`
    whatsapp_metni += g.items.join('\n')
    whatsapp_metni += '\n\n'
  }
  whatsapp_metni = whatsapp_metni.trim()

  return NextResponse.json({
    ok: true,
    toplam: ham.length,
    whatsapp_metni,   // Format Products node'u bunu kullanacak
    urunler: ham,     // Order Manager node'u bunu kullanacak
  })
}
