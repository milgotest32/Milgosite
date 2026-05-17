'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { ArrowLeft, Heart, ShoppingBag, Check, Star, Truck, ShieldCheck, RefreshCw, Plus, Minus } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function UrunDetay() {
  const { slug } = useParams()
  const [urun, setUrun] = useState<Urun | null>(null)
  const [benzerler, setBenzerler] = useState<Urun[]>([])
  const [adet, setAdet] = useState(1)
  const [eklendi, setEklendi] = useState(false)
  const [favori, setFavori] = useState(false)
  const ekle = useSepet(s => s.ekle)
  useEffect(() => {
    supabase.from('site_urunler').select('*').eq('slug', slug).single()
      .then(({ data }: any) => {
        setUrun(data)
        if (data?.kategori) {
          supabase.from('site_urunler').select('*').eq('kategori', data.kategori).neq('slug', slug).limit(4)
            .then(({ data: b }: any) => setBenzerler(b || []))
        }
      })
  }, [slug])
  const sepeteEkle = () => { if (!urun) return; ekle(urun, adet); setEklendi(true); setTimeout(() => setEklendi(false), 2000) }
  if (!urun) return <div className="min-h-screen bg-lav flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-pembe-koy border-t-transparent animate-spin" /></div>
  return (
    <div className="min-h-screen bg-lav">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-metin-2 mb-8">
          <Link href="/" className="hover:text-pembe-koy">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/urunler" className="hover:text-pembe-koy">Ürünler</Link>
          <span>/</span>
          <span className="text-metin">{urun.ad}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sol - Görsel */}
          <div>
            <div className="card aspect-square rounded-3xl overflow-hidden p-8 flex items-center justify-center">
              {urun.fotograf_url ? (
                <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-contain" />
              ) : <div className="text-8xl">🥛</div>}
            </div>
          </div>
          {/* Sağ - Bilgi */}
          <div className="py-4">
            {urun.yeni && <div className="badge-mavi inline-block mb-3">Yeni Ürün</div>}
            <div className="text-[12px] text-metin-2 capitalize mb-1">{urun.kategori}</div>
            <h1 className="font-display text-[clamp(24px,3.5vw,40px)] text-metin mb-3">{urun.ad}</h1>
            {/* Yıldızlar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-yellow-400" fill="currentColor" />)}</div>
              <span className="text-[13px] text-metin-2 font-medium">4.9 (48 yorum)</span>
            </div>
            {/* Fiyat */}
            <div className="flex items-end gap-3 mb-6">
              <div className="font-display text-[36px] text-metin font-normal">₺{urun.fiyat.toFixed(2)}</div>
              {urun.eski_fiyat && <div className="text-[18px] text-metin-2 line-through mb-1">₺{urun.eski_fiyat.toFixed(2)}</div>}
            </div>
            {urun.aciklama && <p className="text-[14px] leading-relaxed text-metin-2 mb-6">{urun.aciklama}</p>}
            {/* Sertifikalar */}
            <div className="flex gap-3 flex-wrap mb-6">
              {['🇪🇺 AB Onaylı', '🌿 %100 Doğal', '✓ Katkısız'].map(s => (
                <span key={s} className="badge-mavi">{s}</span>
              ))}
            </div>
            {/* Adet + Sepet */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center bg-white border border-sinir rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setAdet(Math.max(1,adet-1))} className="w-11 h-11 flex items-center justify-center hover:bg-lav transition-colors text-metin"><Minus size={15} /></button>
                <span className="w-12 text-center text-[16px] font-semibold text-metin">{adet}</span>
                <button onClick={() => setAdet(adet+1)} className="w-11 h-11 flex items-center justify-center hover:bg-lav transition-colors text-metin"><Plus size={15} /></button>
              </div>
              <button onClick={sepeteEkle} className={`flex-1 py-3.5 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-all ${eklendi ? 'bg-green-500 text-white' : 'btn-primary'}`}>
                {eklendi ? <><Check size={17} />Sepete Eklendi!</> : <><ShoppingBag size={17} />Sepete Ekle</>}
              </button>
              <button onClick={() => setFavori(!favori)} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${favori ? 'border-pembe bg-pembe-acik text-pembe-koy' : 'border-sinir bg-white text-metin-2 hover:border-pembe hover:text-pembe-koy'}`}>
                <Heart size={18} fill={favori ? 'currentColor' : 'none'} />
              </button>
            </div>
            {/* Teslimat bilgisi */}
            <div className="card p-4 space-y-3">
              <div className="text-[12px] font-semibold text-metin mb-2">Teslimat & İade</div>
              {[{icon:<Truck size={15}/>, text:'İstanbul içi aynı gün teslimat'},{icon:<RefreshCw size={15}/>, text:'30 gün içinde ücretsiz iade'},{icon:<ShieldCheck size={15}/>, text:'Soğuk zincir ile güvenli taşıma'}].map(item => (
                <div key={item.text} className="flex items-center gap-2.5 text-[12px] text-metin-2">
                  <span className="text-pembe-koy">{item.icon}</span>{item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Benzer ürünler */}
        {benzerler.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-[24px] text-metin mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {benzerler.map(b => (
                <Link href={`/urun/${b.slug}`} key={b.id} className="card card-hover block">
                  <div className="aspect-square bg-lav rounded-t-[19px] p-4">
                    {b.fotograf_url ? <img src={b.fotograf_url} alt={b.ad} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🥛</div>}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[13px] font-semibold text-metin mb-2 line-clamp-2">{b.ad}</h3>
                    <div className="text-[16px] font-bold text-metin">₺{b.fiyat.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
