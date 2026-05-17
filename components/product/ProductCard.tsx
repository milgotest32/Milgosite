'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import toast from 'react-hot-toast'

interface Props { urun: Urun }

export default function ProductCard({ urun }: Props) {
  const [favori, setFavori] = useState(false)
  const [eklendi, setEklendi] = useState(false)
  const ekle = useSepet(s => s.ekle)
  const gorsel = urun.site_product_images?.find(g => g.ana)?.url || urun.site_product_images?.[0]?.url
  const indirim = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0

  const sepeteEkle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun)
    setEklendi(true)
    toast.success(`${urun.name} sepete eklendi`)
    setTimeout(() => setEklendi(false), 1800)
  }

  return (
    <Link href={`/urun/${urun.slug}`}
      style={{ display: 'block', background: '#fff', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F0ECF5', textDecoration: 'none', transition: 'transform 0.25s, box-shadow 0.25s', boxShadow: '0 2px 12px rgba(224,112,144,0.06)' }}
      className="group card-hover">

      {/* Görsel */}
      <div style={{ position: 'relative', aspectRatio: '1', background: '#F0EEF8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        {gorsel
          ? <img src={gorsel} alt={urun.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s' }} loading="lazy" className="group-hover:scale-105" />
          : <span style={{ fontSize: '56px' }}>🥛</span>
        }

        {/* Rozetler */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {urun.yeni && <span style={{ background: '#3B9FCC', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px', letterSpacing: '0.05em' }}>YENİ</span>}
          {indirim > 0 && <span style={{ background: '#E07090', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>-%{indirim}</span>}
          {urun.stok_takip && urun.stok <= 0 && <span style={{ background: '#6B7280', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>TÜKENDI</span>}
        </div>

        {/* Favori */}
        <button onClick={e => { e.preventDefault(); setFavori(!favori) }}
          style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', opacity: favori ? 1 : 0, transition: 'opacity 0.2s' }}
          className="group-hover:opacity-100">
          <Heart size={13} style={{ color: favori ? '#E07090' : '#9CA3AF' }} fill={favori ? '#E07090' : 'none'} />
        </button>
      </div>

      {/* İçerik */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          {urun.site_kategoriler?.name}
        </p>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', marginBottom: '8px', lineHeight: '1.35', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {urun.name}
        </h3>

        {/* Yıldızlar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '10px' }}>
          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} style={{ color: '#FBBF24' }} fill="#FBBF24" />)}
          <span style={{ fontSize: '10px', color: '#9CA3AF', marginLeft: '4px' }}>(48)</span>
        </div>

        {/* Fiyat + Sepet */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '17px', fontWeight: 700, color: '#1C1B2E', fontFamily: '"Playfair Display", serif' }}>₺{urun.fiyat.toFixed(2)}</span>
            {urun.eski_fiyat && <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '5px' }}>₺{urun.eski_fiyat.toFixed(2)}</span>}
          </div>
          <button onClick={sepeteEkle} disabled={urun.stok_takip && urun.stok <= 0}
            style={{
              width: '34px', height: '34px', borderRadius: '50%', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, cursor: 'none',
              transition: 'all 0.25s', flexShrink: 0,
              background: eklendi ? '#22c55e' : 'linear-gradient(135deg,#E07090,#3B9FCC)',
              boxShadow: '0 4px 12px rgba(224,112,144,0.35)',
              fontSize: '18px', lineHeight: 1
            }}>
            {eklendi ? '✓' : '+'}
          </button>
        </div>
      </div>
    </Link>
  )
}
