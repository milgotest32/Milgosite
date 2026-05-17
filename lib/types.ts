export type Urun = {
  id: string
  ad: string
  slug: string
  aciklama?: string
  icerik?: string
  fiyat: number
  eski_fiyat?: number
  fotograf_url?: string
  fotograflar?: string[]
  kategori?: string
  etiketler?: string[]
  stok?: number
  aktif: boolean
  populer: boolean
  yeni: boolean
  sira: number
}

export type Musteri = {
  id: string
  ad?: string
  soyad?: string
  email: string
  telefon?: string
  adres?: string
  ilce?: string
  sehir?: string
}

export type SepetItem = {
  urun: Urun
  adet: number
}

export type Siparis = {
  id: string
  created_at: string
  musteri_ad: string
  musteri_email: string
  musteri_telefon: string
  teslimat_adres: string
  teslimat_ilce: string
  teslimat_sehir: string
  durum: string
  odeme_durumu: string
  toplam: number
  kargo_ucreti: number
  indirim: number
}
