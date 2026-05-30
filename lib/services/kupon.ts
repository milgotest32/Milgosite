import { supabase } from '../supabase/client'
import type { Kupon } from '../types'

export const KuponService = {
  async validate(kod: string, tutar: number): Promise<{ gecerli: boolean; kupon?: Kupon; indirim: number; hata?: string }> {
    const { data: kupon } = await supabase.from('site_kuponlar').select('*').eq('kod', kod.toUpperCase()).eq('aktif', true).single()
    if (!kupon) return { gecerli: false, indirim: 0, hata: 'Geçersiz kupon kodu' }

    const now = new Date()
    if (kupon.baslangic && new Date(kupon.baslangic) > now) return { gecerli: false, indirim: 0, hata: 'Kupon henüz aktif değil' }
    if (kupon.bitis && new Date(kupon.bitis) < now) return { gecerli: false, indirim: 0, hata: 'Kuponun süresi dolmuş' }
    if (kupon.kullanim_limiti && kupon.kullanim_sayisi >= kupon.kullanim_limiti) return { gecerli: false, indirim: 0, hata: 'Kupon kullanım limiti dolmuş' }
    if (tutar < kupon.min_tutar) return { gecerli: false, indirim: 0, hata: `Minimum sepet tutarı ₺${kupon.min_tutar}` }

    let indirim = kupon.tip === 'yuzde' ? tutar * (kupon.deger / 100) : kupon.deger
    if (kupon.max_indirim) indirim = Math.min(indirim, kupon.max_indirim)

    return { gecerli: true, kupon, indirim }
  },

  async kullan(id: string) {
    await supabase.rpc('kupon_kullan', { p_id: id })
  }
}
