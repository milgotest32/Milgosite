import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Urun, Variant, SepetItem, Kupon } from './types'

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
}

export const useSepet = create<SepetStore>()(
  persist(
    (set, get) => ({
      items: [],
      kupon: null,
      indirim: 0,
      notlar: '',

      ekle: (urun, adet = 1, variant) => set(s => {
        const idx = s.items.findIndex(i => i.product_id === urun.id && i.variant_id === variant?.id)
        if (idx >= 0) {
          const items = [...s.items]
          items[idx] = { ...items[idx], adet: items[idx].adet + adet }
          return { items }
        }
        return { items: [...s.items, { product_id: urun.id, variant_id: variant?.id, urun, variant, adet }] }
      }),

      cikar: (productId, variantId) => set(s => ({
        items: s.items.filter(i => !(i.product_id === productId && i.variant_id === variantId))
      })),

      guncelle: (productId, adet, variantId) => {
        if (adet <= 0) { get().cikar(productId, variantId); return }
        set(s => ({ items: s.items.map(i => i.product_id === productId && i.variant_id === variantId ? { ...i, adet } : i) }))
      },

      temizle: () => set({ items: [], kupon: null, indirim: 0, notlar: '' }),
      setKupon: (kupon, indirim) => set({ kupon, indirim }),
      setNotlar: (notlar) => set({ notlar }),

      araToplam: () => get().items.reduce((t, i) => {
        const fiyat = i.variant?.fiyat ?? i.urun.fiyat
        return t + fiyat * i.adet
      }, 0),

      kargoUcreti: () => {
        // Kargo ayarlarını localStorage'dan oku (ayarlar sayfasında güncellenir)
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
