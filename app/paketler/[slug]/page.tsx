'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import { Package, ArrowLeft, ShoppingBag, Check } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function PaketDetayPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [paket, setPaket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [eklendi, setEklendi] = useState(false)
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    supabase.from('site_paketler')
      .select('*, site_paket_urunleri(adet, site_products(id,name,slug,fiyat,eski_fiyat,site_product_images(*)))')
      .eq('slug', slug as string)
      .single()
      .then(({ data }) => {
        if (!data) { router.push('/404'); return }
        setPaket(data)
        setLoading(false)
      })
  }, [slug, router])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8567A', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!paket) return null

  const kalemler = paket.site_paket_urunleri || []
  const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
  const tasarruf = ayriToplam - paket.fiyat
  const yuzde = ayriToplam > 0 ? Math.round((tasarruf / ayriToplam) * 100) : 0

  const paketeEkle = () => {
    const oran = ayriToplam > 0 ? paket.fiyat / ayriToplam : 1
    kalemler.forEach((k: any) => {
      if (k.site_products) {
        ekle({
          tip: 'fiziksel', durum: 'active', featured: false, yeni: false, indirimli: true,
          stok: 999, min_stok: 0, stok_takip: false, etiketler: [], ozellikler: {}, meta: {},
          ...k.site_products,
          fiyat: Math.round(k.site_products.fiyat * oran * 100) / 100,
          eski_fiyat: k.site_products.fiyat,
        }, k.adet)
      }
    })
    setEklendi(true)
    toast.success(`🎁 ${paket.name} sepete eklendi!`)
    setTimeout(() => setEklendi(false), 2500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', fontFamily: 'Nunito,sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={14} />Ana Sayfaya Dön
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          {/* Sol */}
          <div>
            {/* Görsel */}
            <div style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {paket.gorsel_url ? (
                <img src={paket.gorsel_url} alt={paket.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              ) : (
                <span style={{ fontSize: '80px' }}>🎁</span>
              )}
            </div>

            {/* Başlık */}
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '32px', color: '#1A0A12', marginBottom: '8px' }}>{paket.name}</h1>
            {paket.aciklama && <p style={{ fontSize: '15px', color: '#7A6070', lineHeight: '1.7', marginBottom: '24px' }}>{paket.aciklama}</p>}

            {/* Paketteki ürünler */}
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1A0A12', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="#E8567A" />Pakete Dahil Ürünler
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kalemler.map((k: any) => {
                const u = k.site_products
                const gorsel = u?.site_product_images?.find((g: any) => g.ana)?.url || u?.site_product_images?.[0]?.url
                return (
                  <Link key={u?.id} href={`/urun/${u?.slug}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '16px', padding: '14px', textDecoration: 'none', border: '1px solid #F0ECF5', transition: 'box-shadow 0.2s' }}>
                    {gorsel ? (
                      <img src={gorsel} alt={u?.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}/>
                    ) : (
                      <div style={{ width: 64, height: 64, background: '#F8F7FC', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🥛</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A0A12', marginBottom: '4px' }}>{u?.name}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{k.adet} adet</div>
                    </div>
                    <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A0A12' }}>₺{((u?.fiyat || 0) * k.adet).toFixed(2)}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>₺{u?.fiyat} × {k.adet}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Sağ — Fiyat kartı */}
          <div style={{ position: 'sticky' as const, top: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #F0ECF5' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A0A12', marginBottom: '16px' }}>Paket Özeti</h3>

              {/* Ürün listesi */}
              <div style={{ background: '#F8F7FC', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                {kalemler.map((k: any) => (
                  <div key={k.site_products?.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', padding: '4px 0' }}>
                    <span>{k.site_products?.name} ×{k.adet}</span>
                    <span>₺{((k.site_products?.fiyat || 0) * k.adet).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #F0ECF5', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF' }}>
                  <span>Ayrı ayrı toplam</span>
                  <span style={{ textDecoration: 'line-through' }}>₺{ayriToplam.toFixed(2)}</span>
                </div>
              </div>

              {tasarruf > 0 && (
                <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600 }}>Tasarrufunuz</span>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#22C55E' }}>₺{tasarruf.toFixed(2)} (%{yuzde})</span>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '4px' }}>Paket Fiyatı</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#1A0A12', lineHeight: 1 }}>₺{paket.fiyat.toFixed(2)}</div>
              </div>

              <button onClick={paketeEkle}
                style={{ width: '100%', padding: '14px', background: eklendi ? '#22C55E' : 'linear-gradient(135deg,#E07090,#3B9FCC)', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s', boxShadow: '0 6px 20px rgba(224,112,144,0.35)' }}>
                {eklendi ? <><Check size={18}/>Sepete Eklendi!</> : <><ShoppingBag size={18}/>Paketi Sepete Ekle</>}
              </button>

              <Link href="/sepet" style={{ display: 'block', textAlign: 'center' as const, marginTop: '12px', fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', fontWeight: 600 }}>
                Sepete Git →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
