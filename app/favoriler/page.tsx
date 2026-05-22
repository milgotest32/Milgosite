'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import ProductCard from '@/components/product/ProductCard'

const DEPO_KEY = 'milgo_favoriler'

export default function FavorilerPage() {
  const [favoriIdler, setFavoriIdler] = useState<string[]>([])
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  // localStorage'dan favori id'lerini oku
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DEPO_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setFavoriIdler(ids)
    } catch {
      setFavoriIdler([])
    }
  }, [])

  // Favori ürünleri Supabase'den çek
  useEffect(() => {
    if (favoriIdler.length === 0) { setUrunler([]); setYukleniyor(false); return }
    setYukleniyor(true)
    supabase
      .from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .in('id', favoriIdler)
      .eq('durum', 'active')
      .then(({ data }) => {
        setUrunler(data || [])
        setYukleniyor(false)
      })
  }, [favoriIdler])

  const favoriKaldir = (id: string) => {
    const yeni = favoriIdler.filter(f => f !== id)
    setFavoriIdler(yeni)
    setUrunler(prev => prev.filter(u => u.id !== id))
    localStorage.setItem(DEPO_KEY, JSON.stringify(yeni))
  }

  const tumunuTemizle = () => {
    setFavoriIdler([])
    setUrunler([])
    localStorage.removeItem(DEPO_KEY)
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
          {favoriIdler.length > 0 && (
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
            <p style={{ color: '#7A6070', fontSize: '14px', marginBottom: '28px' }}>Beğendiğiniz ürünleri kaydetmek için kalp ikonuna tıklayın.</p>
            <Link href="/urunler"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A0A12', color: '#fff', padding: '12px 24px', borderRadius: '14px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              <ShoppingBag size={16} /> Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#7A6070', marginBottom: '24px' }}>{urunler.length} ürün kaydedildi</p>
            <div className="prod-grid">
              {urunler.map(u => (
                <div key={u.id} style={{ position: 'relative' }}>
                  <ProductCard urun={u} />
                  <button
                    onClick={() => favoriKaldir(u.id)}
                    title="Favoriden çıkar"
                    style={{
                      position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: '#fff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(26,10,18,.15)'
                    }}>
                    <Heart size={13} fill="#E8567A" style={{ color: '#E8567A' }} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
