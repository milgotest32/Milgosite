'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSepet } from '@/lib/sepet'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, Truck, ChevronRight } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function SepetPage() {
  const { items, guncelle, cikar, toplam } = useSepet()
  const [kod, setKod] = useState('')
  const [indirim, setIndirim] = useState(0)
  const [kodHata, setKodHata] = useState('')
  const [kodBasari, setKodBasari] = useState(false)
  const kargoUcreti = toplam() >= 500 ? 0 : 49.90
  const genelToplam = toplam() + kargoUcreti - indirim
  const kodUygula = () => {
    if (kod.toUpperCase() === 'MILGO10') { setIndirim(toplam() * 0.1); setKodBasari(true); setKodHata('') }
    else { setKodHata('Geçersiz kod'); setKodBasari(false); setIndirim(0) }
  }
  if (items.length === 0) return (
    <div className="min-h-screen bg-lav flex flex-col items-center justify-center gap-5 px-4">
      <div className="w-20 h-20 bg-pembe-acik rounded-3xl flex items-center justify-center text-4xl">🛒</div>
      <h2 className="font-display text-2xl text-metin">Sepetiniz Boş</h2>
      <p className="text-[14px] text-metin-2">Henüz ürün eklemediniz.</p>
      <Link href="/urunler" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2"><ShoppingBag size={16} />Alışverişe Başla</Link>
    </div>
  )
  return (
    <div className="min-h-screen bg-lav py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/urunler" className="flex items-center gap-2 text-[13px] text-metin-2 hover:text-pembe-koy mb-6 transition-colors"><ArrowLeft size={14} />Alışverişe Devam Et</Link>
        <h1 className="font-display text-[28px] text-metin mb-8">Sepetim <span className="text-metin-2 text-[20px]">({items.length} ürün)</span></h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ürünler */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ urun, adet }) => (
              <div key={urun.id} className="card p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-lav rounded-2xl flex-shrink-0 overflow-hidden">
                  {urun.fotograf_url ? <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-contain p-2" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🥛</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-metin truncate">{urun.ad}</h3>
                  <div className="text-[13px] font-bold text-pembe-koy mt-0.5">₺{urun.fiyat.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center bg-lav rounded-xl overflow-hidden">
                    <button onClick={() => guncelle(urun.id, adet-1)} className="w-8 h-8 flex items-center justify-center hover:bg-sinir transition-colors text-metin"><Minus size={13} /></button>
                    <span className="w-8 text-center text-[14px] font-semibold text-metin">{adet}</span>
                    <button onClick={() => guncelle(urun.id, adet+1)} className="w-8 h-8 flex items-center justify-center hover:bg-sinir transition-colors text-metin"><Plus size={13} /></button>
                  </div>
                  <div className="text-[14px] font-bold text-metin w-16 text-right">₺{(urun.fiyat*adet).toFixed(2)}</div>
                  <button onClick={() => cikar(urun.id)} className="w-8 h-8 flex items-center justify-center text-metin-2 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Özet */}
          <div className="space-y-4">
            {/* İndirim kodu */}
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold text-metin mb-3 flex items-center gap-2"><Tag size={16} className="text-pembe-koy" />İndirim Kodu</h3>
              <div className="flex gap-2">
                <input value={kod} onChange={e => setKod(e.target.value)} placeholder="Kod girin" className="input flex-1 text-[13px] py-2.5" />
                <button onClick={kodUygula} className="btn-primary px-4 py-2.5 rounded-xl text-[13px]">Uygula</button>
              </div>
              {kodHata && <p className="text-red-500 text-[12px] mt-2">{kodHata}</p>}
              {kodBasari && <p className="text-green-600 text-[12px] mt-2">✓ %10 indirim uygulandı!</p>}
            </div>
            {/* Kargo bilgisi */}
            {kargoUcreti > 0 && (
              <div className="bg-mavi-acik rounded-2xl p-4 flex items-center gap-3">
                <Truck size={18} className="text-mavi-koy flex-shrink-0" />
                <p className="text-[12px] text-mavi-koy font-medium">₺{(500-toplam()).toFixed(0)} daha ekleyin, kargo ücretsiz!</p>
              </div>
            )}
            {/* Toplam */}
            <div className="card p-5">
              <h3 className="text-[14px] font-semibold text-metin mb-4">Sipariş Özeti</h3>
              <div className="space-y-2.5 text-[13px]">
                <div className="flex justify-between"><span className="text-metin-2">Ara Toplam</span><span className="font-medium">₺{toplam().toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-metin-2">Kargo</span><span className={kargoUcreti===0?'text-green-600 font-medium':'font-medium'}>{kargoUcreti===0?'Ücretsiz':`₺${kargoUcreti.toFixed(2)}`}</span></div>
                {indirim>0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-₺{indirim.toFixed(2)}</span></div>}
                <div className="border-t border-sinir pt-3 flex justify-between">
                  <span className="font-semibold text-metin text-[15px]">Toplam</span>
                  <span className="font-bold text-[18px] text-metin">₺{genelToplam.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/odeme" className="btn-primary w-full py-3.5 mt-5 flex items-center justify-center gap-2">
                Siparişi Tamamla <ChevronRight size={16} />
              </Link>
              <p className="text-[11px] text-metin-2 text-center mt-3">🔒 SSL ile güvenli ödeme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
