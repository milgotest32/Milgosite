'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, RefreshCw, Plus, Minus, Check, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

interface Props { urun: Urun; benzerler: Urun[] }

export default function UrunDetayClient({ urun, benzerler }: Props) {
  const [aktifGorsel, setAktifGorsel] = useState(0)
  const [adet, setAdet] = useState(1)
  const [eklendi, setEklendi] = useState(false)
  const [favori, setFavori] = useState(false)
  const ekle = useSepet(s => s.ekle)

  const gorseller = urun.site_product_images || []
  const aktifUrl = gorseller[aktifGorsel]?.url || gorseller[0]?.url || ''
  const indirim = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0

  const sepeteEkle = () => {
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun, adet)
    setEklendi(true)
    toast.success(`${urun.name} sepete eklendi!`)
    setTimeout(() => setEklendi(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF9', fontFamily: 'Syne, sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,4vw,48px)' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '32px', fontSize: '12px', color: '#7A6070', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#7A6070', textDecoration: 'none' }}>Ana Sayfa</Link>
          <ChevronRight size={12} />
          <Link href="/urunler" style={{ color: '#7A6070', textDecoration: 'none' }}>Ürünler</Link>
          {urun.site_kategoriler && (
            <>
              <ChevronRight size={12} />
              <Link href={`/kategoriler/${urun.site_kategoriler.slug}`} style={{ color: '#7A6070', textDecoration: 'none' }}>{urun.site_kategoriler.name}</Link>
            </>
          )}
          <ChevronRight size={12} />
          <span style={{ color: '#1A0A12', fontWeight: 600 }}>{urun.name}</span>
        </nav>

        {/* Ana grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(24px,5vw,64px)', alignItems: 'start', marginBottom: '80px' }}>

          {/* Sol — Görseller */}
          <div>
            {/* Ana görsel */}
            <div style={{ background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', borderRadius: '32px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', marginBottom: '12px' }}>
              {aktifUrl ? (
                <img
                  src={aktifUrl}
                  alt={urun.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply', transition: 'transform 0.4s', animation: 'float 6s ease-in-out infinite' }}
                />
              ) : (
                <span style={{ fontSize: '96px' }}>🥛</span>
              )}
            </div>

            {/* Küçük görseller */}
            {gorseller.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {gorseller.map((g, i) => (
                  <button key={g.id} onClick={() => setAktifGorsel(i)} style={{ width: '72px', height: '72px', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${aktifGorsel === i ? '#E8567A' : 'rgba(26,10,18,.1)'}`, background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', cursor: 'none', padding: '6px', transition: 'border-color .2s', flexShrink: 0 }}>
                    <img src={g.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ — Bilgi */}
          <div style={{ paddingTop: '8px' }}>
            {/* Rozetler */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {urun.yeni && <span style={{ background: '#EBF5FC', color: '#5BA4CF', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '50px', letterSpacing: '.1em' }}>YENİ</span>}
              {indirim > 0 && <span style={{ background: '#FEE8EF', color: '#E8567A', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>-%{indirim} İNDİRİM</span>}
              {urun.site_kategoriler && <span style={{ background: 'rgba(26,10,18,.06)', color: '#7A6070', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', letterSpacing: '.1em', textTransform: 'uppercase' as const }}>{urun.site_kategoriler.name}</span>}
            </div>

            {/* İsim */}
            <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.1, marginBottom: '16px' }}>
              {urun.name}
            </h1>

            {/* Yıldızlar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
              </div>
              <span style={{ fontSize: '13px', color: '#7A6070', fontWeight: 500 }}>4.9 (48 yorum)</span>
            </div>

            {/* Fiyat */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,5vw,52px)', fontWeight: 400, color: '#1A0A12' }}>₺{urun.fiyat.toFixed(2)}</span>
              {urun.eski_fiyat && <span style={{ fontSize: '20px', color: '#7A6070', textDecoration: 'line-through', marginBottom: '6px' }}>₺{urun.eski_fiyat.toFixed(2)}</span>}
            </div>

            {/* Açıklama */}
            {urun.aciklama && (
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#7A6070', marginBottom: '24px', fontWeight: 400 }}>
                {urun.aciklama}
              </p>
            )}

            {/* Sertifikalar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {['🇪🇺 AB Onaylı', '🌿 %100 Doğal', '✓ Katkısız'].map(s => (
                <span key={s} style={{ background: 'rgba(26,10,18,.05)', color: '#1A0A12', fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '50px', border: '1px solid rgba(26,10,18,.1)' }}>{s}</span>
              ))}
            </div>

            {/* Adet + Sepet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {/* Adet */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(26,10,18,.05)', border: '1.5px solid rgba(26,10,18,.1)', borderRadius: '14px', overflow: 'hidden' }}>
                <button onClick={() => setAdet(Math.max(1, adet - 1))} style={{ width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'none', color: '#1A0A12' }}><Minus size={16} /></button>
                <span style={{ width: '44px', textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#1A0A12' }}>{adet}</span>
                <button onClick={() => setAdet(adet + 1)} style={{ width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'none', color: '#1A0A12' }}><Plus size={16} /></button>
              </div>

              {/* Sepete Ekle */}
              <button onClick={sepeteEkle} disabled={urun.stok_takip && urun.stok <= 0}
                style={{ flex: 1, minWidth: '200px', height: '46px', borderRadius: '50px', border: 'none', fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'none', transition: 'all .25s', background: eklendi ? '#22c55e' : '#1A0A12', letterSpacing: '.02em' }}>
                {eklendi ? <><Check size={16} />Sepete Eklendi!</> : <><ShoppingBag size={16} />Sepete Ekle · ₺{(urun.fiyat * adet).toFixed(2)}</>}
              </button>

              {/* Favori */}
              <button onClick={() => setFavori(!favori)} style={{ width: '46px', height: '46px', borderRadius: '14px', border: `1.5px solid ${favori ? '#E8567A' : 'rgba(26,10,18,.1)'}`, background: favori ? '#FEE8EF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', transition: 'all .2s', flexShrink: 0 }}>
                <Heart size={18} style={{ color: favori ? '#E8567A' : '#7A6070' }} fill={favori ? '#E8567A' : 'none'} />
              </button>
            </div>

            {/* Stok durumu */}
            {urun.stok_takip && (
              <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '24px', color: urun.stok > 10 ? '#22c55e' : urun.stok > 0 ? '#f59e0b' : '#ef4444' }}>
                {urun.stok > 10 ? `✓ Stokta ${urun.stok} adet` : urun.stok > 0 ? `⚠️ Son ${urun.stok} adet!` : '✕ Stok tükendi'}
              </p>
            )}

            {/* Teslimat bilgisi */}
            <div style={{ background: 'rgba(26,10,18,.04)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(26,10,18,.08)' }}>
              <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '14px' }}>Teslimat & İade</p>
              {[
                { icon: <Truck size={14} />, t: 'İstanbul içi aynı gün teslimat' },
                { icon: <RefreshCw size={14} />, t: '30 gün içinde ücretsiz iade' },
                { icon: <ShieldCheck size={14} />, t: 'Soğuk zincir ile güvenli taşıma' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#7A6070', marginBottom: '8px' }}>
                  <span style={{ color: '#E8567A' }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benzer Ürünler */}
        {benzerler.length > 0 && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <span style={{ display: 'inline-block', background: '#FEE8EF', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.25em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', marginBottom: '12px' }}>Benzer Ürünler</span>
              <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(24px,3vw,36px)', color: '#1A0A12', margin: 0 }}>
                Bunları da <em style={{ fontStyle: 'italic', color: '#E8567A' }}>Sevebilirsiniz</em>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {benzerler.map(u => <ProductCard key={u.id} urun={u} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
