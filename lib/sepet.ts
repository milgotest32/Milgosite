import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Urun, SepetItem } from './types'

type SepetStore = {
  items: SepetItem[]
  ekle: (urun: Urun, adet?: number) => void
  cikar: (urunId: string) => void
  guncelle: (urunId: string, adet: number) => void
  temizle: () => void
  toplam: () => number
  adetToplam: () => number
}

export const useSepet = create<SepetStore>()(
  persist(
    (set, get) => ({
      items: [],
      ekle: (urun, adet = 1) => {
        set(s => {
          const idx = s.items.findIndex(i => i.urun.id === urun.id)
          if (idx >= 0) {
            const items = [...s.items]
            items[idx] = { ...items[idx], adet: items[idx].adet + adet }
            return { items }
          }
          return { items: [...s.items, { urun, adet }] }
        })
      },
      cikar: (urunId) => set(s => ({ items: s.items.filter(i => i.urun.id !== urunId) })),
      guncelle: (urunId, adet) => {
        if (adet <= 0) { get().cikar(urunId); return }
        set(s => ({ items: s.items.map(i => i.urun.id === urunId ? { ...i, adet } : i) }))
      },
      temizle: () => set({ items: [] }),
      toplam: () => get().items.reduce((t, i) => t + i.urun.fiyat * i.adet, 0),
      adetToplam: () => get().items.reduce((t, i) => t + i.adet, 0),
    }),
    { name: 'milgo-sepet' }
  )
)
