import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from './supabase/client'

interface FavoriStore {
  ids: string[]
  toggle: (urunId: string) => void
  varMi: (urunId: string) => boolean
  dbdenYukle: () => Promise<void>
  temizle: () => void
}

export const useFavori = create<FavoriStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: async (urunId) => {
        const mevcutIds = get().ids
        const varMi = mevcutIds.includes(urunId)
        const yeniIds = varMi ? mevcutIds.filter(id => id !== urunId) : [...mevcutIds, urunId]
        set({ ids: yeniIds })

        // Giriş yapmışsa DB'ye de kaydet
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (varMi) {
          await supabase.from('site_favoriler').delete()
            .eq('user_id', user.id).eq('urun_id', urunId)
        } else {
          await supabase.from('site_favoriler').upsert(
            { user_id: user.id, urun_id: urunId },
            { onConflict: 'user_id,urun_id' }
          )
        }
      },

      varMi: (urunId) => get().ids.includes(urunId),

      // Giriş yapınca DB'den yükle, local ile birleştir
      dbdenYukle: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('site_favoriler')
          .select('urun_id')
          .eq('user_id', user.id)

        if (!data?.length) return

        const dbIds = data.map(r => r.urun_id)
        set(s => ({ ids: [...new Set([...s.ids, ...dbIds])] }))

        // Local'dekiler DB'de yoksa ekle
        const localOnly = get().ids.filter(id => !dbIds.includes(id))
        if (localOnly.length > 0) {
          await supabase.from('site_favoriler').upsert(
            localOnly.map(urun_id => ({ user_id: user.id, urun_id })),
            { onConflict: 'user_id,urun_id' }
          )
        }
      },

      temizle: () => set({ ids: [] }),
    }),
    { name: 'milgo-favoriler-v2' }
  )
)
