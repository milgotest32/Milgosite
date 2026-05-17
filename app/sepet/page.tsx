'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'

export default function SepetPage() {
  const { items, guncelle, cikar, toplam } = useSepet()
  const [kod, setKod] = useState('')
  const [kodHata, setKodHata] = useState('')
  const [indirim, setIndirim] = useState(0)

  const kargoUcreti = toplam() > 500 ? 0 : 49.90
  const genelToplam = toplam() + kargoUcreti - indirim

  const kodUygula = () => {
    if (kod.toUpperCase() === 'MILGO10') {
      setIndirim(toplam() * 0.1)
      setKodHata('')
    } else {
      setKodHata('Geçersiz indirim kodu')
      setIndirim(0)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8">
      <div className="text-8xl">🛒</div>
      <h2 className="font-display text-4xl font-light">Sepetiniz Boş</h2>
      <p className="text-[#8a92a8] text-center">Henüz ürün eklemediniz.</p>
      <Link href="/urunler" className="gradient-bg text-white px-10 py-4 rounded-full text-[12px] tracking-wide uppercase">
        Ürünlere Git
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-8 lg:px-16 py-16">
      <Link href="/urunler" className="flex items-center gap-2 text-[#8a92a8] hover:text-[#f5c8d8] transition-colors text-[12px] mb-10">
        <ArrowLeft size={14} />Alışverişe Devam Et
      </Link>

      <h1 className="font-display text-[clamp(32px,4vw,52px)] font-light mb-12">
        Sepetim <span className="gradient-text italic">({items.length} ürün)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ürünler */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ urun, adet }) => (
            <div key={urun.id} className="glass rounded-2xl p-5 flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#0d1b3e] flex-shrink-0">
                {urun.fotograf_url ? (
                  <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-cover" style={{filter:'brightness(0.7)'}} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🥛</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[17px] font-light text-white truncate">{urun.ad}</h3>
                <div className="font-display text-[16px] gradient-text mt-1">₺{urun.fiyat.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="glass rounded-full flex items-center">
                  <button onClick={() => guncelle(urun.id, adet - 1)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-[13px]">{adet}</span>
                  <button onClick={() => guncelle(urun.id, adet + 1)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => cikar(urun.id)} className="text-[#8a92a8] hover:text-[#e8a4b8] transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="font-display text-[20px] font-light mb-6">Sipariş Özeti</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#8a92a8]">Ara Toplam</span>
                <span>₺{toplam().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#8a92a8]">Kargo</span>
                <span className={kargoUcreti === 0 ? 'text-[#a8b885]' : ''}>{kargoUcreti === 0 ? 'Ücretsiz' : `₺${kargoUcreti.toFixed(2)}`}</span>
              </div>
              {indirim > 0 && (
                <div className="flex justify-between text-[13px] text-[#a8b885]">
                  <span>İndirim (%10)</span>
                  <span>-₺{indirim.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* İndirim kodu */}
            <div className="flex gap-2 mb-6">
              <input value={kod} onChange={e => setKod(e.target.value)} placeholder="İndirim kodu"
                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-2.5 text-[12px] text-white placeholder-[#8a92a8] outline-none focus:border-[rgba(232,164,184,0.35)]" />
              <button onClick={kodUygula} className="gradient-bg text-white px-4 py-2.5 rounded-xl text-[12px] font-medium">
                Uygula
              </button>
            </div>
            {kodHata && <p className="text-[#e8a4b8] text-[11px] mb-4">{kodHata}</p>}
            {kargoUcreti > 0 && (
              <p className="text-[11px] text-[#8a92a8] mb-4">₺{(500 - toplam()).toFixed(0)} daha ekleyin, kargo ücretsiz!</p>
            )}

            <div className="border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Toplam</span>
                <span className="font-display text-[22px] gradient-text">₺{genelToplam.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/odeme" className="gradient-bg text-white w-full py-4 rounded-full text-[13px] font-medium tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_8px_32px_rgba(196,118,142,0.3)]">
              <ShoppingBag size={16} />Siparişi Tamamla
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
