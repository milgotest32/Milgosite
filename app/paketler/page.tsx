'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Package } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function PaketlerPage() {
  const [paketler, setPaketler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_paketler')
      .select('*, site_paket_urunleri(adet, site_products(id,name,fiyat,site_product_images(*)))')
      .eq('aktif', true)
      .order('one_cikan', { ascending: false })
      .then(({ data }) => { setPaketler(data || []); setLoading(false) })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', padding: '40px 16px', fontFamily: 'Nunito,sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase' as const, color: '#E8567A', display: 'block', marginBottom: '10px' }}>🎁 Özel Fırsatlar</span>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '42px', color: '#1A0A12', margin: 0 }}>Hazır Paketlerimiz</h1>
          <p style={{ fontSize: '15px', color: '#9CA3AF', marginTop: '12px' }}>En sevilen ürünlerimizi özel fiyatlarla bir araya getirdik</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8567A', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : paketler.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Package size={64} style={{ color: '#F0ECF5', margin: '0 auto 16px', display: 'block' }}/>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px' }}>Henüz paket bulunmuyor</p>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Yakında özel paketlerimiz yayında olacak!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
            {paketler.map(p => {
              const kalemler = p.site_paket_urunleri || []
              const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
              const tasarruf = ayriToplam - p.fiyat
              const yuzde = ayriToplam > 0 ? Math.round((tasarruf / ayriToplam) * 100) : 0
              return (
                <Link key={p.id} href={`/paketler/${p.slug}`}
                  style={{ textDecoration: 'none', background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F0ECF5', display: 'block', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {p.gorsel_url ? (
                    <img src={p.gorsel_url} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>
                  ) : (
                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '64px' }}>🎁</span>
                    </div>
                  )}
                  <div style={{ padding: '20px' }}>
                    {p.one_cikan && <span style={{ fontSize: '9px', background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '50px', fontWeight: 700, display: 'inline-block', marginBottom: '8px' }}>⭐ ÖNCÜ PAKET</span>}
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginBottom: '6px' }}>{p.name}</h3>
                    {p.aciklama && <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px', lineHeight: '1.5' }}>{p.aciklama}</p>}
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '14px' }}>
                      {kalemler.map((k: any) => `${k.site_products?.name} ×${k.adet}`).join(' · ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {tasarruf > 0 && <span style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through', display: 'block' }}>₺{ayriToplam.toFixed(2)}</span>}
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#1A0A12' }}>₺{p.fiyat.toFixed(2)}</span>
                      </div>
                      {yuzde > 0 && (
                        <span style={{ background: '#F0FDF4', color: '#22C55E', fontSize: '13px', fontWeight: 800, padding: '5px 12px', borderRadius: '50px' }}>%{yuzde} indirim</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
