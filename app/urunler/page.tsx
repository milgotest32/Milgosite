'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import Link from 'next/link'
import { Check } from 'lucide-react'

export const dynamic = 'force-dynamic'

const KATEGORILER = [
  { slug: '', ad: 'Tümü' },
  { slug: 'sut', ad: '🥛 Çiğ Süt' },
  { slug: 'peynir', ad: '🧀 Peynir' },
  { slug: 'tereyag', ad: '🧈 Tereyağı' },
]

function UrunlerIcerik() {
  const searchParams = useSearchParams()
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  const [eklendi, setEklendi] = useState<string | null>(null)
  const aktifKat = searchParams.get('kategori') || ''
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('site_urunler').select('*').eq('aktif', true)
    if (aktifKat) q = (q as any).eq('kategori', aktifKat)
    q.order('sira').then(({ data }: { data: any }) => { setUrunler(data || []); setLoading(false) })
  }, [aktifKat])

  const sepeteEkle = (urun: Urun) => {
    ekle(urun)
    setEklendi(urun.id)
    setTimeout(() => setEklendi(null), 1500)
  }

  return (
    <div className="min-h-screen">
      <div className="py-20 px-8 lg:px-16 text-center relative overflow-hidden" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(196,118,142,0.12) 0%, transparent 60%)'}} />
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3 flex items-center justify-center gap-2">
          <span className="w-5 h-px bg-[#e8a4b8]" />Ürünlerimiz<span className="w-5 h-px bg-[#e8a4b8]" />
        </div>
        <h1 className="font-display text-[clamp(40px,5vw,70px)] font-light relative">
          Doğallığı <span className="gradient-text italic">Keşfedin</span>
        </h1>
      </div>
      <div className="px-8 lg:px-16 py-8 flex gap-3 flex-wrap max-w-7xl mx-auto">
        {KATEGORILER.map(kat => (
          <Link key={kat.slug} href={kat.slug ? `/urunler?kategori=${kat.slug}` : '/urunler'}
            className={`px-6 py-2.5 rounded-full text-[12px] tracking-wide transition-all ${aktifKat === kat.slug ? 'gradient-bg text-white shadow-[0_4px_20px_rgba(196,118,142,0.3)]' : 'glass text-[#8a92a8] hover:text-white'}`}>
            {kat.ad}
          </Link>
        ))}
      </div>
      <div className="px-8 lg:px-16 pb-24 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] rounded-3xl bg-[#0d1b3e] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {urunler.map(urun => (
              <div key={urun.id} className="group relative rounded-3xl overflow-hidden bg-[#0d1b3e] aspect-[3/4]">
                {urun.fotograf_url ? (
                  <img src={urun.fotograf_url} alt={urun.ad}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{filter:'brightness(0.4) contrast(1.1) saturate(0.5)'}} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1e3a6e] to-[#0d1b3e] flex items-center justify-center text-6xl">🥛</div>
                )}
                <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(8,15,34,0.98) 0%, rgba(8,15,34,0.2) 50%, transparent 80%)'}}>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {urun.yeni && <span className="text-[8px] tracking-[0.25em] uppercase bg-gradient-to-r from-[#c4768e] to-[#b8a4d8] text-white px-3 py-1 rounded-full mb-2 inline-block">Yeni</span>}
                    <Link href={`/urun/${urun.slug}`}>
                      <h3 className="font-display text-[17px] font-light text-white hover:text-[#f5c8d8] transition-colors mb-1">{urun.ad}</h3>
                    </Link>
                    {urun.aciklama && <p className="text-[11px] text-[#8a92a8] line-clamp-2 mb-3">{urun.aciklama}</p>}
                    <div className="flex items-center justify-between">
                      <div className="font-display text-[19px] gradient-text">₺{urun.fiyat.toFixed(2)}</div>
                      <button onClick={() => sepeteEkle(urun)}
                        className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center text-white hover:scale-110 hover:shadow-[0_8px_24px_rgba(196,118,142,0.4)] transition-all">
                        {eklendi === urun.id ? <Check size={14} /> : <span>+</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UrunlerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-[#e8a4b8] border-t-transparent animate-spin" /></div>}>
      <UrunlerIcerik />
    </Suspense>
  )
}
