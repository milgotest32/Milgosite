'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Urun } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

const DEPO_KEY = 'milgo_favoriler'

function favoriOku(): string[] {
  try { return JSON.parse(localStorage.getItem(DEPO_KEY) || '[]') } catch { return [] }
}

export default function FavorilerPage() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  const yukle = useCallback(async () => {
    const ids = favoriOku()
    if (ids.length === 0) { setUrunler([]); setYukleniyor(false); return }
    const { data } = await supabase
      .from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .in('id', ids)
      .eq('durum', 'active')
    // localStorage sırasını koru
    const sirali = ids.map(id => (data || []).find((u: any) => u.id === id)).filter(Boolean) as Urun[]
    setUrunler(sirali)
    setYukleniyor(false)
  }, [])

  useEffect(() => {
    yukle()
    // ProductCard'dan gelen favori değişiklik eventi
    window.addEventListener('milgo_favori_degisti', yukle)
    return () => window.removeEventListener('milgo_favori_degisti', yukle)
  }, [yukle])

  const tumunuTemizle = () => {
    localStorage.removeItem(DEPO_KEY)
    setUrunler([])
    window.dispatchEvent(new Event('milgo_favori_degisti'))
  }

  return (
    <div style={{ background: '#FDFBF9', minHeight: '70vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,48px)' }}>

        {/* Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', color: '#E8567A', display: 'block', marginBottom: '6px' }}>Listem</span>
            <h1 style={{ fontFamily: 'var(--font-nunito),sans-serif', fontSize: 'clamp(28px,4vw,44px)', color: '#1A0A12', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={32} fill="#E8567A" style={{ color: '#E8567A' }} />
              Favorilerim
            </h1>
          </div>
          {urunler.length > 0 && (
            <button onClick={tumunuTemizle}
              style={{ fontSize: '13px', color: '#7A6070', background: 'none', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer' }}>
              Tümünü Temizle
            </button>
          )}
        </div>

        {/* İçerik */}
        {yukleniyor ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7A6070', fontSize: '14px' }}>Yükleniyor…</div>
        ) : urunler.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤍</div>
            <h2 style={{ fontFamily: 'var(--font-nunito),sans-serif', fontSize: '22px', color: '#1A0A12', marginBottom: '8px' }}>Henüz favori eklemediniz</h2>
            <p style={{ color: '#7A6070', fontSize: '14px', marginBottom: '28px' }}>Ürün kartlarındaki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.</p>
            <Link href="/urunler"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A0A12', color: '#fff', padding: '12px 24px', borderRadius: '14px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              <ShoppingBag size={16} /> Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#7A6070', marginBottom: '24px' }}>{urunler.length} ürün kaydedildi</p>
            <div className="prod-grid">
              {urunler.map(u => <ProductCard key={u.id} urun={u} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
