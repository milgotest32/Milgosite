'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Star } from 'lucide-react'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import toast from 'react-hot-toast'

const DEPO_KEY = 'milgo_favoriler'

function favoriOku(): string[] {
  try { return JSON.parse(localStorage.getItem(DEPO_KEY) || '[]') } catch { return [] }
}
function favoriYaz(ids: string[]) {
  localStorage.setItem(DEPO_KEY, JSON.stringify(ids))
}

export default function ProductCard({ urun }: { urun: Urun }) {
  const [favori, setFavori] = useState(false)
  const [eklendi, setEklendi] = useState(false)
  const ekle = useSepet(s => s.ekle)
  const gorsel = urun.site_product_images?.find(g => g.ana)?.url || urun.site_product_images?.[0]?.url
  const indirim = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0

  // Sayfa açılınca localStorage'dan favori durumunu oku
  useEffect(() => {
    setFavori(favoriOku().includes(urun.id))
  }, [urun.id])

  const favoriToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    const ids = favoriOku()
    let yeni: string[]
    if (ids.includes(urun.id)) {
      yeni = ids.filter(id => id !== urun.id)
      toast('Favorilerden çıkarıldı', { icon: '🤍' })
    } else {
      yeni = [...ids, urun.id]
      toast('Favorilere eklendi!', { icon: '❤️' })
    }
    favoriYaz(yeni)
    setFavori(!favori)
    // Favoriler sayfası açıksa haberdar et
    window.dispatchEvent(new Event('milgo_favori_degisti'))
  }

  const sepeteEkle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun); setEklendi(true); toast.success(`${urun.name} sepete eklendi`)
    setTimeout(() => setEklendi(false), 1800)
  }

  return (
    <Link href={`/urun/${urun.slug}`} className="card-2026" style={{ display: 'block', textDecoration: 'none', borderRadius: '32px', overflow: 'hidden' }}>
      {/* Görsel */}
      <div className="prod-img-wrap">
        {gorsel
          ? <img src={gorsel} alt={urun.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
          : <span style={{ fontSize: '64px' }}>🥛</span>}

        {/* Rozetler */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {urun.yeni && <span style={{ background: '#5BA4CF', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '50px', letterSpacing: '.08em' }}>YENİ</span>}
          {indirim > 0 && <span style={{ background: '#E8567A', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '50px' }}>-%{indirim}</span>}
          {urun.stok_takip && urun.stok <= 0 && <span style={{ background: '#7A6070', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '50px' }}>TÜKENDI</span>}
        </div>

        {/* Favori butonu */}
        <button onClick={favoriToggle}
          style={{ position: 'absolute', top: '12px', right: '12px', width: '30px', height: '30px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'inherit', boxShadow: '0 2px 8px rgba(26,10,18,.1)', opacity: favori ? 1 : 0, transition: 'opacity .2s', zIndex: 2 }}
          className="fav-btn">
          <Heart size={13} style={{ color: favori ? '#E8567A' : '#7A6070' }} fill={favori ? '#E8567A' : 'none'} />
        </button>
        <style>{`.card-2026:hover .fav-btn { opacity: 1 !important; }`}</style>
      </div>

      {/* İçerik */}
      <div style={{ padding: '16px 18px 18px' }}>
        <p style={{ fontSize: '10px', color: '#7A6070', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 }}>
          {urun.site_kategoriler?.name}
        </p>
        <h3 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '16px', color: '#1A0A12', marginBottom: '8px', lineHeight: '1.25', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {urun.name}
        </h3>

        {(urun.ortalama_puan || urun.yorum_sayisi) ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '12px' }}>
            {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
            <span style={{ fontSize: '10px', color: '#7A6070', marginLeft: '4px' }}>({urun.yorum_sayisi || 0})</span>
          </div>
        ) : null}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '20px', color: '#1A0A12' }}>₺{urun.fiyat.toFixed(2)}</span>
            {urun.eski_fiyat && <span style={{ fontSize: '12px', color: '#7A6070', textDecoration: 'line-through', marginLeft: '6px' }}>₺{urun.eski_fiyat.toFixed(2)}</span>}
          </div>
          <button onClick={sepeteEkle} disabled={urun.stok_takip && urun.stok <= 0} className="prod-add" style={{ background: eklendi ? '#22c55e' : '#1A0A12' }}>
            {eklendi ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  )
}
