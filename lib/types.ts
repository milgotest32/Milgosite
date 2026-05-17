export type Role = 'superadmin' | 'admin' | 'editor' | 'customer'

export interface User {
  id: string; email: string; ad?: string; soyad?: string
  telefon?: string; role: Role; aktif: boolean; avatar_url?: string
}

export interface Kategori {
  id: string; name: string; slug: string; parent_id?: string
  aciklama?: string; gorsel_url?: string; sira: number; aktif: boolean
  seo_title?: string; seo_description?: string
}

export interface Marka {
  id: string; name: string; slug: string; logo_url?: string; aktif: boolean
}

export interface Urun {
  id: string; name: string; slug: string; aciklama?: string; icerik?: string
  kategori_id?: string; marka_id?: string; tip: string; durum: string
  featured: boolean; yeni: boolean; indirimli: boolean
  fiyat: number; eski_fiyat?: number; sku?: string; barkod?: string
  stok: number; min_stok: number; stok_takip: boolean
  etiketler: string[]; seo_title?: string; seo_description?: string
  ozellikler: Record<string, any>; meta: Record<string, any>
  site_product_images?: UrunGorsel[]
  site_kategoriler?: Kategori
  site_markalar?: Marka
  ortalama_puan?: number
  yorum_sayisi?: number
}

export interface UrunGorsel {
  id: string; url: string; alt?: string; sira: number; ana: boolean
}

export interface Variant {
  id: string; product_id: string; name: string; sku?: string
  fiyat?: number; eski_fiyat?: number; stok: number; aktif: boolean
  gorsel_url?: string; ozellikler: Record<string, any>
}

export interface SepetItem {
  id?: string; product_id: string; variant_id?: string
  urun: Urun; variant?: Variant; adet: number
}

export interface Adres {
  id: string; user_id: string; baslik: string; ad: string; soyad?: string
  telefon?: string; adres: string; ilce?: string; sehir: string
  posta_kodu?: string; varsayilan: boolean; lat?: number; lng?: number
}

export interface Siparis {
  id: string; siparis_no: string; musteri_id?: string; misafir_email?: string
  durum: string; odeme_durumu: string; kargo_durumu: string
  musteri_ad?: string; musteri_email?: string; musteri_telefon?: string
  teslimat_adres?: string; teslimat_ilce?: string; teslimat_sehir?: string
  ara_toplam: number; kargo_ucreti: number; indirim: number; toplam: number
  kupon_kod?: string; notlar?: string; kargo_takip?: string
  created_at: string; site_siparis_kalemleri?: SiparisKalem[]
}

export interface SiparisKalem {
  id: string; siparis_id: string; product_id?: string; variant_id?: string
  urun_ad: string; urun_gorsel?: string; birim_fiyat: number
  adet: number; toplam: number
}

export interface Kupon {
  id: string; kod: string; ad?: string; tip: 'yuzde' | 'sabit'
  deger: number; min_tutar: number; max_indirim?: number
  kullanim_limiti?: number; kullanim_sayisi: number; aktif: boolean
}

export interface HizmetBolgesi {
  id: string; name: string; polygon_data?: any; aktif: boolean
  renk: string; kargo_ucreti: number; min_siparis: number
}

export interface Ayar {
  grup: string; anahtar: string; deger?: string; tip: string
}
