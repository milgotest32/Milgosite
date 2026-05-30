import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Urun, Variant, SepetItem, Kupon } from './types'
import { supabase } from './supabase/client'

interface SepetStore {
  items: SepetItem[]
  kupon: Kupon | null
  indirim: number
  notlar: string
  ekle: (urun: Urun, adet?: number, variant?: Variant) => void
  cikar: (productId: string, variantId?: string) => void
  guncelle: (productId: string, adet: number, variantId?: string) => void
  temizle: () => void
  setKupon: (kupon: Kupon | null, indirim: number) => void
  setNotlar: (notlar: string) => void
  araToplam: () => number
  kargoUcreti: () => number
  genelToplam: () => number
  adetToplam: () => number
  dbdenYukle: () => Promise<void>
  dbeyeKaydet: () => Promise<void>
}

// Supabase'den kullanıcının sepetini yükle
async function getSepetId(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('site_sepetler')
    .select('id')
    .eq('user_id', userId)
    
    .single()
  return data?.id || null
}

async function getOrCreateSepetId(userId: string): Promise<string | null> {
  let id = await getSepetId(userId)
  if (!id) {
    const { data } = await supabase
      .from('site_sepetler')
      .insert({ user_id: userId })
      .select('id')
      .single()
    id = data?.id || null
  }
  return id
}

export const useSepet = create<SepetStore>()(
  persist(
    (set, get) => ({
      items: [],
      kupon: null,
      indirim: 0,
      notlar: '',

      ekle: (urun, adet = 1, variant) => {
        set(s => {
          const idx = s.items.findIndex(i => i.product_id === urun.id && i.variant_id === variant?.id)
          if (idx >= 0) {
            const items = [...s.items]
            items[idx] = { ...items[idx], adet: items[idx].adet + adet }
            return { items }
          }
          return { items: [...s.items, { product_id: urun.id, variant_id: variant?.id, urun, variant, adet }] }
        })
        // DB'ye kaydet (async, sessizce)
        get().dbeyeKaydet()
      },

      cikar: (productId, variantId) => {
        set(s => ({ items: s.items.filter(i => !(i.product_id === productId && (i.variant_id ?? undefined) === (variantId ?? undefined))) }))
        get().dbeyeKaydet()
      },

      guncelle: (productId, adet, variantId) => {
        if (adet <= 0) { get().cikar(productId, variantId); return }
        set(s => ({ items: s.items.map(i => i.product_id === productId && (i.variant_id ?? undefined) === (variantId ?? undefined) ? { ...i, adet } : i) }))
        get().dbeyeKaydet()
      },

      temizle: () => set({ items: [], kupon: null, indirim: 0, notlar: '' }),
      setKupon: (kupon, indirim) => set({ kupon, indirim }),
      setNotlar: (notlar) => set({ notlar }),

      // Giriş yapınca DB'den yükle, local ile merge et
      dbdenYukle: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const sepetId = await getSepetId(user.id)
        if (!sepetId) return

        const { data: kalemleri } = await supabase
          .from('site_sepet_kalemleri')
          .select('product_id, variant_id, adet, urun_ad, urun_gorsel, fiyat')
          .eq('sepet_id', sepetId)

        if (!kalemleri?.length) return

        // Ürün detaylarını çek
        const productIds = [...new Set(kalemleri.map((k: any) => k.product_id))]
        const { data: products } = await supabase
          .from('site_products')
          .select('*, site_product_images(url, ana)')
          .in('id', productIds)

        const productMap = Object.fromEntries((products || []).map((p: any) => [p.id, p]))

        // Variant detaylarını çek
        const variantIds = kalemleri.filter((k: any) => k.variant_id).map((k: any) => k.variant_id)
        let variantMap: Record<string, any> = {}
        if (variantIds.length > 0) {
          const { data: variants } = await supabase
            .from('site_variants')
            .select('*')
            .in('id', variantIds)
          variantMap = Object.fromEntries((variants || []).map((v: any) => [v.id, v]))
        }

        const dbItems: SepetItem[] = kalemleri.map((k: any) => ({
          product_id: k.product_id,
          variant_id: k.variant_id,
          adet: k.adet,
          urun: productMap[k.product_id] || { id: k.product_id, name: k.urun_ad, fiyat: k.fiyat },
          variant: k.variant_id ? variantMap[k.variant_id] : undefined,
        }))

        // DB her zaman yetkili kaynak — sadece DB'de olmayan local ürünleri ekle
        set(s => {
          const merged = [...dbItems]
          s.items.forEach(localItem => {
            const idx = merged.findIndex(i => i.product_id === localItem.product_id && i.variant_id === localItem.variant_id)
            if (idx < 0) {
              // DB'de yok ama local'de var (giriş öncesi eklendi) → ekle
              merged.push(localItem)
            }
            // DB'de varsa DB'nin adedini kullan, local'i yoksay
          })
          return { items: merged }
        })

        // Sadece local'den yeni ürün eklendiyse DB'ye yaz
        const localOnlyItems = get().items.filter(
          localItem => !dbItems.find(d => d.product_id === localItem.product_id && d.variant_id === localItem.variant_id)
        )
        if (localOnlyItems.length > 0) {
          get().dbeyeKaydet()
        }
      },

      // Sepeti DB'ye kaydet
      dbeyeKaydet: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const sepetId = await getOrCreateSepetId(user.id)
        if (!sepetId) return

        const items = get().items
        // Mevcut kalemleri sil, yeniden yaz
        await supabase.from('site_sepet_kalemleri').delete().eq('sepet_id', sepetId)
        if (items.length > 0) {
          await supabase.from('site_sepet_kalemleri').insert(
            items.map(i => ({
              sepet_id: sepetId,
              product_id: i.product_id,
              variant_id: i.variant_id || null,
              urun_ad: i.urun?.name || '',
              urun_gorsel: i.urun?.site_product_images?.[0]?.url || '',
              fiyat: i.variant?.fiyat ?? i.urun?.fiyat ?? 0,
              adet: i.adet,
            }))
          )
        }
      },

      araToplam: () => get().items.reduce((t, i) => {
        const fiyat = i.variant?.fiyat ?? i.urun?.fiyat ?? 0
        return t + fiyat * i.adet
      }, 0),

      kargoUcreti: () => {
        if (typeof window === 'undefined') return 49.90
        const standart = parseFloat(localStorage.getItem('milgo_kargo_standart') || '49.90') || 49.90
        const limit = parseFloat(localStorage.getItem('milgo_kargo_limit') || '500') || 500
        return get().araToplam() >= limit ? 0 : standart
      },

      genelToplam: () => get().araToplam() + get().kargoUcreti() - get().indirim,
      adetToplam: () => get().items.reduce((t, i) => t + i.adet, 0),
    }),
    { name: 'milgo-sepet-v2' }
  )
)
