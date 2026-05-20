import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN || 'market.milgo.com.tr'
const SHOPIFY_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || ''

async function shopifyQuery(query: string, variables: any = {}) {
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })
  return res.json()
}

const DURUM_MAP: any = {
  PAID: 'teslim', REFUNDED: 'iptal', PARTIALLY_REFUNDED: 'iptal',
  PENDING: 'bekliyor', AUTHORIZED: 'onaylandi', VOIDED: 'iptal',
}

export async function POST(req: Request) {
  const db = createServerClient()
  const { tip = 'hepsi' } = await req.json().catch(() => ({}))

  let musteriSynced = 0, siparisSynced = 0, kalemSynced = 0

  // ── MÜŞTERİLER ──────────────────────────────────────────
  if (tip === 'hepsi' || tip === 'musteri') {
    let cursor: string | null = null
    let hasNext = true
    while (hasNext) {
      const result = await shopifyQuery(`
        query($cursor: String) {
          customers(first: 50, after: $cursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id firstName lastName email phone numberOfOrders
              amountSpent { amount }
              defaultAddress { address1 address2 city zip }
              createdAt
            }
          }
        }
      `, { cursor })
      const customers = result.data?.customers?.nodes || []
      hasNext = result.data?.customers?.pageInfo?.hasNextPage || false
      cursor = result.data?.customers?.pageInfo?.endCursor || null
      if (!customers.length) break
      const rows = customers.map((c: any) => ({
        shopify_id: c.id,
        ad: c.firstName || null,
        soyad: c.lastName || null,
        email: c.email,
        telefon: c.phone || null,
        adres: [c.defaultAddress?.address1, c.defaultAddress?.address2].filter(Boolean).join(', ') || null,
        ilce: c.defaultAddress?.city || null,
        sehir: 'İstanbul',
        posta_kodu: c.defaultAddress?.zip || null,
        toplam_siparis: parseInt(c.numberOfOrders) || 0,
        toplam_harcama: parseFloat(c.amountSpent?.amount) || 0,
        aktif: true,
        created_at: c.createdAt,
      }))
      const { error } = await db.from('site_musteriler').upsert(rows, { onConflict: 'email' })
      if (!error) musteriSynced += rows.length
    }
  }

  // ── SİPARİŞLER ──────────────────────────────────────────
  if (tip === 'hepsi' || tip === 'siparis') {
    let cursor: string | null = null
    let hasNext = true
    while (hasNext) {
      const result = await shopifyQuery(`
        query($cursor: String) {
          orders(first: 50, after: $cursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id name createdAt note
              displayFinancialStatus displayFulfillmentStatus
              totalPriceSet { shopMoney { amount } }
              subtotalPriceSet { shopMoney { amount } }
              totalShippingPriceSet { shopMoney { amount } }
              totalDiscountsSet { shopMoney { amount } }
              customer { email firstName lastName phone }
              shippingAddress { firstName lastName address1 address2 city zip phone }
              lineItems(first: 20) {
                nodes {
                  title quantity
                  originalUnitPriceSet { shopMoney { amount } }
                  image { url }
                }
              }
            }
          }
        }
      `, { cursor })

      const orders = result.data?.orders?.nodes || []
      hasNext = result.data?.orders?.pageInfo?.hasNextPage || false
      cursor = result.data?.orders?.pageInfo?.endCursor || null
      if (!orders.length) break

      for (const order of orders) {
        const c = order.customer
        const sa = order.shippingAddress
        const sipNo = order.name.replace('#', '')
        const musteriAd = c ? `${c.firstName || ''} ${c.lastName || ''}`.trim()
          : sa ? `${sa.firstName || ''} ${sa.lastName || ''}`.trim() : ''
        const teslimatAdres = sa ? [sa.address1, sa.address2].filter(Boolean).join(', ') : ''

        const { data: siparis, error } = await db.from('site_siparisler').upsert({
          siparis_no: sipNo,
          shopify_id: order.id,
          musteri_ad: musteriAd,
          musteri_email: c?.email || '',
          musteri_telefon: c?.phone || sa?.phone || '',
          teslimat_adres: teslimatAdres,
          teslimat_ilce: sa?.city || '',
          teslimat_sehir: 'İstanbul',
          teslimat_posta: sa?.zip || null,
          ara_toplam: parseFloat(order.subtotalPriceSet.shopMoney.amount),
          kargo_ucreti: parseFloat(order.totalShippingPriceSet.shopMoney.amount),
          indirim: parseFloat(order.totalDiscountsSet.shopMoney.amount),
          toplam: parseFloat(order.totalPriceSet.shopMoney.amount),
          durum: DURUM_MAP[order.displayFinancialStatus] || 'teslim',
          odeme_durumu: order.displayFinancialStatus === 'PAID' ? 'odendi' : 'bekliyor',
          odeme_yontemi: 'kart',
          notlar: order.note || null,
          created_at: order.createdAt,
        }, { onConflict: 'siparis_no' }).select().single()

        if (!error && siparis) {
          siparisSynced++
          // Kalemler
          const kalemler = order.lineItems.nodes.map((li: any) => ({
            siparis_id: siparis.id,
            urun_ad: li.title,
            urun_gorsel: li.image?.url || null,
            urun_fiyat: parseFloat(li.originalUnitPriceSet.shopMoney.amount),
            birim_fiyat: parseFloat(li.originalUnitPriceSet.shopMoney.amount),
            adet: li.quantity,
            toplam: parseFloat(li.originalUnitPriceSet.shopMoney.amount) * li.quantity,
          }))
          // Önce mevcut kalemleri sil, sonra yeniden ekle
          await db.from('site_siparis_kalemleri').delete().eq('siparis_id', siparis.id)
          await db.from('site_siparis_kalemleri').insert(kalemler)
          kalemSynced += kalemler.length
        }
      }
    }
  }

  return NextResponse.json({ success: true, musteriSynced, siparisSynced, kalemSynced })
}
