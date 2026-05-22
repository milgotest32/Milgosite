'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
export const dynamic = 'force-dynamic'

const DEPO_KEY = 'milgo_favoriler'

function favoriOku(): string[] {
  try { return JSON.parse(localStorage.getItem(DEPO_KEY) || '[]') } catch { return [] }
}

export default function HesabimFavorilerPage() {
  const [urunler, setUrunler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const yukle = useCallback(async () => {
    const ids = favoriOku()
    if (ids.length === 0) { setUrunler([]); setLoading(false); return }
    const { data } = await supabase
      .from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .in('id', ids)
      .eq('durum', 'active')
    // localStorage sırasını koru
    const sirali = ids.map(id => (data || []).find((u: any) => u.id === id)).filter(Boolean)
    setUrunler(sirali)
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      yukle()
    })
    window.addEventListener('milgo_favori_degisti', yukle)
    return () => window.removeEventListener('milgo_favori_degisti', yukle)
  }, [router, yukle])

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Link href="/hesabim" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={14} /> Hesabıma Dön
        </Link>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '28px', color: '#1C1B2E', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Heart size={24} fill="#E8567A" style={{ color: '#E8567A' }} />
          Favorilerim <span style={{ fontSize: '18px', color: '#9CA3AF', fontFamily: 'Nunito,sans-serif' }}>({urunler.length})</span>
        </h1>

        {loading ? (
          <p style={{ color: '#9CA3AF' }}>Yükleniyor...</p>
        ) : urunler.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '64px', textAlign: 'center', border: '1px solid #F0ECF5' }}>
            <Heart size={48} style={{ color: '#F4A7B9', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#1C1B2E', marginBottom: '8px' }}>Henüz favori yok</p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>Ürün kartlarındaki kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.</p>
            <Link href="/urunler" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              <ShoppingBag size={15} /> Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <div className="prod-grid">
            {urunler.map((u: any) => <ProductCard key={u.id} urun={u} />)}
          </div>
        )}
      </div>
    </div>
  )
}
