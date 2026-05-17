'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import Link from 'next/link'
import { ShoppingBag, Check, ArrowLeft } from 'lucide-react'

export default function UrunDetay() {
  const { slug } = useParams()
  const [urun, setUrun] = useState<Urun | null>(null)
  const [adet, setAdet] = useState(1)
  const [eklendi, setEklendi] = useState(false)
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    supabase.from('site_urunler').select('*').eq('slug', slug).single().then(({ data }: { data: any }) => setUrun(data))
  }, [slug])

  if (!urun) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-[#e8a4b8] border-t-transparent animate-spin" />
    </div>
  )

  const sepeteEkle = () => {
    ekle(urun, adet)
    setEklendi(true)
    setTimeout(() => setEklendi(false), 2000)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <Link href="/urunler" className="flex items-center gap-2 text-[#8a92a8] hover:text-[#f5c8d8] transition-colors text-[12px] tracking-wide mb-10">
          <ArrowLeft size={14} />Ürünlere Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Görsel */}
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#0d1b3e] relative">
            {urun.fotograf_url ? (
              <img src={urun.fotograf_url} alt={urun.ad}
                className="w-full h-full object-cover"
                style={{filter:'brightness(0.7) contrast(1.1) saturate(0.6)'}} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl">🥛</div>
            )}
            {urun.yeni && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-[#c4768e] to-[#b8a4d8] text-white text-[9px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full">Yeni</div>
            )}
          </div>

          {/* Bilgi */}
          <div className="py-4">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#e8a4b8] mb-3">{urun.kategori}</div>
            <h1 className="font-display text-[clamp(32px,4vw,52px)] font-light mb-6">{urun.ad}</h1>
            <div className="font-display text-[40px] gradient-text mb-8">₺{urun.fiyat.toFixed(2)}</div>

            {urun.aciklama && (
              <p className="text-[14px] leading-[1.9] text-[#8a92a8] mb-8">{urun.aciklama}</p>
            )}

            {/* Sertifikalar */}
            <div className="flex gap-4 mb-10">
              {['🇪🇺 AB Onaylı', '🌿 %100 Doğal', '✓ Katkısız'].map(s => (
                <div key={s} className="glass rounded-xl px-4 py-2 text-[11px] text-[#f5c8d8]">{s}</div>
              ))}
            </div>

            {/* Adet */}
            <div className="flex items-center gap-4 mb-8">
              <div className="glass rounded-full flex items-center">
                <button onClick={() => setAdet(Math.max(1, adet - 1))} className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors">−</button>
                <span className="w-10 text-center font-medium">{adet}</span>
                <button onClick={() => setAdet(adet + 1)} className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors">+</button>
              </div>
              <button onClick={sepeteEkle}
                className="flex-1 gradient-bg text-white py-4 rounded-full text-[13px] font-medium tracking-wide flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_8px_32px_rgba(196,118,142,0.35)]">
                {eklendi ? <><Check size={16} />Sepete Eklendi!</> : <><ShoppingBag size={16} />Sepete Ekle</>}
              </button>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="text-[11px] tracking-[0.2em] uppercase text-[#e8a4b8] mb-3">Teslimat Bilgisi</div>
              <div className="space-y-2">
                {['🚚 İstanbul içi aynı gün teslimat', '📦 Hafta içi 14:00\'e kadar verilen siparişler', '❄️ Soğuk zincir ile taşıma'].map(b => (
                  <div key={b} className="text-[12px] text-[#8a92a8]">{b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
