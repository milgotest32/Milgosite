import { supabase } from '../supabase/client'
import { generateSiparisNo } from '../utils/format'
import type { SepetItem, Adres } from '../types'

export const OrderService = {
  async create(params: {
    musteri_id?: string; misafir_email?: string; items: SepetItem[]
    adres: Partial<Adres>; kupon_kod?: string; indirim?: number
    kargo_ucreti?: number; notlar?: string
  }) {
    const ara_toplam = params.items.reduce((s, i) => s + i.urun.fiyat * i.adet, 0)
    const kargo_ucreti = params.kargo_ucreti || 0
    const indirim = params.indirim || 0
    const toplam = ara_toplam + kargo_ucreti - indirim

    const siparis_no = generateSiparisNo()
    const { data: siparis, error } = await supabase.from('site_siparisler').insert({
      siparis_no, musteri_id: params.musteri_id, misafir_email: params.misafir_email,
      musteri_ad: `${params.adres.ad} ${params.adres.soyad || ''}`.trim(),
      musteri_email: params.misafir_email || '',
      musteri_telefon: params.adres.telefon || '',
      teslimat_adres: params.adres.adres,
      teslimat_ilce: params.adres.ilce,
      teslimat_sehir: params.adres.sehir || 'İstanbul',
      ara_toplam, kargo_ucreti, indirim, toplam,
      kupon_kod: params.kupon_kod,
      notlar: params.notlar,
    }).select().single()

    if (error || !siparis) return { data: null, error }

    await supabase.from('site_siparis_kalemleri').insert(
      params.items.map(i => ({
        siparis_id: siparis.id,
        product_id: i.product_id,
        variant_id: i.variant_id,
        urun_ad: i.urun.name,
        urun_gorsel: i.urun.site_product_images?.[0]?.url,
        birim_fiyat: i.urun.fiyat,
        adet: i.adet,
        toplam: i.urun.fiyat * i.adet,
      }))
    )

    // Stok düş
    for (const item of params.items) {
      await supabase.from('site_products').update({ stok: supabase.rpc('decrement', { x: item.adet }) }).eq('id', item.product_id)
    }

    return { data: siparis, error: null }
  },

  async getById(id: string) {
    return supabase.from('site_siparisler').select('*, site_siparis_kalemleri(*)').eq('id', id).single()
  },

  async getBySiparisNo(no: string) {
    return supabase.from('site_siparisler').select('*, site_siparis_kalemleri(*)').eq('siparis_no', no).single()
  },

  async getByUser(userId: string) {
    return supabase.from('site_siparisler').select('*, site_siparis_kalemleri(*)').eq('musteri_id', userId).order('created_at', { ascending: false })
  },

  async updateDurum(id: string, durum: string) {
    return supabase.from('site_siparisler').update({ durum, updated_at: new Date().toISOString() }).eq('id', id)
  },

  async updateOdemeDurum(id: string, odeme_durumu: string) {
    return supabase.from('site_siparisler').update({ odeme_durumu, updated_at: new Date().toISOString() }).eq('id', id)
  }
}
