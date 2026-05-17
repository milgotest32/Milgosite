import { supabase } from '../supabase/client'
import type { Urun } from '../types'

export const ProductService = {
  async getAll(params?: { kategori?: string; limit?: number; featured?: boolean; yeni?: boolean; arama?: string; sira?: string }) {
    let q = supabase.from('site_products').select('*, site_product_images(*), site_kategoriler(name,slug), site_markalar(name,slug)').eq('durum', 'active')
    if (params?.kategori) q = q.eq('site_kategoriler.slug', params.kategori)
    if (params?.featured) q = q.eq('featured', true)
    if (params?.yeni) q = q.eq('yeni', true)
    if (params?.arama) q = q.ilike('name', `%${params.arama}%`)
    if (params?.sira === 'fiyat-as') q = q.order('fiyat')
    else if (params?.sira === 'fiyat-us') q = q.order('fiyat', { ascending: false })
    else q = q.order('created_at', { ascending: false })
    if (params?.limit) q = q.limit(params.limit)
    const { data, error } = await q
    return { data: data as Urun[] || [], error }
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('site_products').select('*, site_product_images(*), site_kategoriler(*), site_markalar(*), site_variants(*)')
      .eq('slug', slug).single()
    return { data: data as Urun, error }
  },

  async getBenzerler(produktId: string, kategoriId?: string) {
    let q = supabase.from('site_products').select('*, site_product_images(*)').eq('durum', 'active').neq('id', produktId).limit(4)
    if (kategoriId) q = q.eq('kategori_id', kategoriId)
    const { data } = await q
    return data as Urun[] || []
  },

  async create(urun: Partial<Urun>) {
    return supabase.from('site_products').insert(urun).select().single()
  },

  async update(id: string, urun: Partial<Urun>) {
    return supabase.from('site_products').update({ ...urun, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  },

  async delete(id: string) {
    return supabase.from('site_products').update({ durum: 'deleted' }).eq('id', id)
  },

  async updateStok(id: string, miktar: number, tip: string = 'manuel', aciklama?: string) {
    const { data: p } = await supabase.from('site_products').select('stok').eq('id', id).single()
    const yeni = (p?.stok || 0) + miktar
    await supabase.from('site_products').update({ stok: yeni }).eq('id', id)
    await supabase.from('site_stok_loglari').insert({
      product_id: id, tip, miktar, onceki_stok: p?.stok, yeni_stok: yeni, aciklama
    })
    return yeni
  }
}
