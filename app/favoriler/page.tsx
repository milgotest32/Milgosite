'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useFavori } from '@/lib/favori'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import toast from 'react-hot-toast'

export default function FavorilerPage() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const { ids, toggle } = useFavori()
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    if (!ids.length) { setUrunler([]); setYukleniyor(false); return }
    supabase.from('site_products')
      .select('*, site_product_images(url, ana), site_kategoriler(name)')
      .in('id', ids)
      .then(({ data }) => { setUrunler(data || []); setYukleniyor(false) })
  }, [ids])

  if (yukleniyor) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #F0ECF5', borderTopColor: '#E8567A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <Link href="/urunler" style={{ width: '36px', height: '36px', background: '#fff', border: '1px solid #F0ECF5', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#6B7280' }}><ArrowLeft size={16} /></Link>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1A0A12' }}>Favorilerim</h1>
            <p style={{ fontSize: '13px', color: '#9CA3AF' }}>{urunler.length} ürün</p>
          </div>
        </div>

        {urunler.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Heart size={48} style={{ color: '#F0ECF5', margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px' }}>Henüz favori ürün yok</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Ürünlerdeki ❤️ ikonuna tıklayarak favorilerinize ekleyin</p>
            <Link href="/urunler" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Ürünlere Gözat</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {urunler.map(urun => {
              const gorsel = urun.site_product_images?.find((g: any) => g.ana)?.url || urun.site_product_images?.[0]?.url
              return (
                <div key={urun.id} style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', aspectRatio: '1', background: '#F8F7FC' }}>
                    {gorsel
                      ? <img src={gorsel} alt={urun.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                      : <span style={{ fontSize: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🥛</span>}
                    <button onClick={() => { toggle(urun.id); toast('Favorilerden çıkarıldı', { icon: '🤍' }) }}
                      style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                      <Heart size={13} fill="#E8567A" style={{ color: '#E8567A' }} />
                    </button>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '4px' }}>{(urun as any).site_kategoriler?.name}</p>
                    <Link href={`/urun/${urun.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A0A12', marginBottom: '12px', lineHeight: '1.3' }}>{urun.name}</h3>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#1A0A12' }}>₺{urun.fiyat?.toFixed(2)}</span>
                      <button onClick={() => { ekle(urun); toast.success('Sepete eklendi!') }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <ShoppingBag size={13} /> Sepete Ekle
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
