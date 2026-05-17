'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, SlidersHorizontal, Star, Heart } from 'lucide-react'
export const dynamic = 'force-dynamic'
const KATEGORILER = [{ slug: '', ad: 'Tümü', emoji: '🛍️' }, { slug: 'sut', ad: 'Çiğ Süt', emoji: '🥛' }, { slug: 'peynir', ad: 'Peynir', emoji: '🧀' }, { slug: 'tereyag', ad: 'Tereyağı', emoji: '🧈' }]
const SIRALA = [{ slug: 'sira', ad: 'Önerilen' }, { slug: 'fiyat-as', ad: 'Fiyat: Düşük → Yüksek' }, { slug: 'fiyat-us', ad: 'Fiyat: Yüksek → Düşük' }, { slug: 'yeni', ad: 'Yeni Gelenler' }]

function UrunlerIcerik() {
  const searchParams = useSearchParams()
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [loading, setLoading] = useState(true)
  const [eklendi, setEklendi] = useState<string | null>(null)
  const [favoriler, setFavoriler] = useState<string[]>([])
  const [sirala, setSirala] = useState('sira')
  const aktifKat = searchParams.get('kategori') || ''
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    setLoading(true)
    let q = supabase.from('site_urunler').select('*').eq('aktif', true)
    if (aktifKat) q = (q as any).eq('kategori', aktifKat)
    if (sirala === 'fiyat-as') q = q.order('fiyat')
    else if (sirala === 'fiyat-us') q = q.order('fiyat', { ascending: false })
    else if (sirala === 'yeni') q = q.order('created_at', { ascending: false })
    else q = q.order('sira')
    q.then(({ data }: any) => { setUrunler(data || []); setLoading(false) })
  }, [aktifKat, sirala])

  const sepeteEkle = (e: React.MouseEvent, urun: Urun) => {
    e.preventDefault(); ekle(urun); setEklendi(urun.id); setTimeout(() => setEklendi(null), 1500)
  }

  return (
    <div className="min-h-screen bg-lav">
      {/* Header */}
      <div className="bg-white border-b border-sinir">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <h1 className="font-display text-[clamp(28px,4vw,44px)] text-metin mb-4">
            {aktifKat ? KATEGORILER.find(k=>k.slug===aktifKat)?.emoji + ' ' + KATEGORILER.find(k=>k.slug===aktifKat)?.ad : 'Tüm Ürünler'}
          </h1>
          {/* Filtreler */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2">
              {KATEGORILER.map(kat => (
                <Link key={kat.slug} href={kat.slug ? `/urunler?kategori=${kat.slug}` : '/urunler'}
                  className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${aktifKat === kat.slug ? 'gradient-bg text-white shadow-md' : 'bg-lav text-metin hover:bg-sinir'}`}>
                  {kat.emoji} {kat.ad}
                </Link>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-metin-2" />
              <select value={sirala} onChange={e => setSirala(e.target.value)} className="text-[13px] text-metin bg-lav border-none outline-none rounded-xl px-3 py-2 font-medium">
                {SIRALA.map(s => <option key={s.slug} value={s.slug}>{s.ad}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Ürün sayısı */}
        <p className="text-[13px] text-metin-2 mb-6">{urunler.length} ürün listeleniyor</p>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="card aspect-[3/4] animate-pulse bg-sinir" />)}
          </div>
        ) : urunler.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[16px] font-semibold text-metin mb-2">Bu kategoride ürün yok</p>
            <Link href="/urunler" className="text-pembe-koy text-[14px] hover:underline">Tüm ürünleri gör</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {urunler.map(urun => (
              <Link href={`/urun/${urun.slug}`} key={urun.id} className="card card-hover group block">
                <div className="relative aspect-square bg-lav rounded-t-[19px] overflow-hidden p-4">
                  {urun.fotograf_url ? (
                    <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center text-5xl">🥛</div>}
                  {urun.yeni && <div className="absolute top-2.5 left-2.5 badge-mavi">Yeni</div>}
                  <button onClick={e => { e.preventDefault(); setFavoriler(prev => prev.includes(urun.id) ? prev.filter(f=>f!==urun.id) : [...prev, urun.id]) }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-all ${favoriler.includes(urun.id) ? 'text-pembe-koy' : 'text-metin-2 opacity-0 group-hover:opacity-100'}`}>
                    <Heart size={14} fill={favoriler.includes(urun.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-metin-2 mb-1 capitalize">{urun.kategori}</div>
                  <h3 className="text-[14px] font-semibold text-metin mb-2 line-clamp-2">{urun.ad}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400" fill="currentColor" />)}
                    <span className="text-[10px] text-metin-2 ml-1">(48)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[17px] font-bold text-metin">₺{urun.fiyat.toFixed(2)}</div>
                      {urun.eski_fiyat && <div className="text-[11px] text-metin-2 line-through">₺{urun.eski_fiyat.toFixed(2)}</div>}
                    </div>
                    <button onClick={e => sepeteEkle(e, urun)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-md hover:scale-110 ${eklendi===urun.id ? 'bg-green-500' : 'gradient-bg'}`}>
                      {eklendi===urun.id ? <Check size={15}/> : <span className="text-lg leading-none">+</span>}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UrunlerPage() {
  return <Suspense fallback={<div className="min-h-screen bg-lav flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-pembe-koy border-t-transparent animate-spin" /></div>}><UrunlerIcerik /></Suspense>
}
