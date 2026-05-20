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

export async function POST() {
  const db = createServerClient()
  let totalSynced = 0
  let cursor: string | null = null
  let hasNextPage = true

  while (hasNextPage) {
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
    hasNextPage = result.data?.customers?.pageInfo?.hasNextPage || false
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
    if (!error) totalSynced += rows.length
  }

  return NextResponse.json({ success: true, synced: totalSynced })
}
