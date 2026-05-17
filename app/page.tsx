'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, ShoppingBag, Heart, Star, ArrowRight, RefreshCw, ShieldCheck, Truck, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [eklendi, setEklendi] = useState<string | null>(null)
  const [favoriler, setFavoriler] = useState<string[]>([])
  const ekle = useSepet(s => s.ekle)

  useEffect(() => {
    supabase.from('site_urunler').select('*').eq('aktif', true).order('sira')
      .then(({ data }: any) => setUrunler(data || []))
  }, [])

  const sepeteEkle = (e: React.MouseEvent, urun: Urun) => {
    e.preventDefault()
    ekle(urun)
    setEklendi(urun.id)
    setTimeout(() => setEklendi(null), 1500)
  }

  const populer = urunler.filter(u => u.populer)

  return (
    <div className="bg-[#F0EEF8]">

      {/* HERO */}
      <section className="px-4 lg:px-16 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Sol */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#EBF7FC] text-[#3B9FCC] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B9FCC] animate-pulse" />
              Çiftliğimizden Sofranıza
            </span>
            
            <h1 className="font-display text-[42px] lg:text-[56px] leading-[1.15] text-[#1C1B2E] mb-5">
              Mutluluğun<br/>
              <span className="text-[#E07090] italic">Tadını</span><br/>
              Hissedin
            </h1>
            
            <p className="text-[15px] leading-[1.7] text-[#6B7280] mb-7 max-w-md">
              ATASANCAK Çiftliği'nden günlük toplanan çiğ süt ve geleneksel yöntemlerle hazırlanan ürünler. %100 doğal, katkısız.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/urunler" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E07090] to-[#3B9FCC] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all">
                <ShoppingBag size={16} /> Alışverişe Başla
              </Link>
              <Link href="/abonelik" className="inline-flex items-center justify-center gap-2 bg-white text-[#E07090] font-semibold text-[14px] px-7 py-3.5 rounded-full border-2 border-[#F4A7B9] hover:bg-[#FEF0F4] transition-all">
                <RefreshCw size={16} /> Abonelik Planları
              </Link>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-white/60">
              {[['10.5K', 'Büyükbaş'], ['24K', 'Dekar'], ['%100', 'Doğal'], ['AB', 'Onaylı']].map(([s, a]) => (
                <div key={a} className="text-center">
                  <div className="font-display text-[20px] font-normal bg-gradient-to-r from-[#E07090] to-[#3B9FCC] bg-clip-text text-transparent">{s}</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">{a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ - görsel */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-[32px] overflow-hidden bg-[#F5C4D0] aspect-[4/5] flex items-center justify-center p-8">
              <img
                src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg"
                alt="Milgo Çiğ Süt"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="absolute -left-4 top-10 bg-white rounded-2xl p-3.5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#FEF0F4] rounded-xl flex items-center justify-center text-lg">🥛</div>
                <div>
                  <div className="text-[12px] font-semibold text-[#1C1B2E]">Çiğ Süt 2L</div>
                  <div className="text-[13px] font-bold text-[#E07090]">₺130</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-16 bg-white rounded-2xl p-3.5 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#EBF7FC] rounded-xl flex items-center justify-center text-lg">🚚</div>
                <div>
                  <div className="text-[12px] font-semibold text-[#1C1B2E]">Aynı Gün</div>
                  <div className="text-[11px] text-[#3B9FCC] font-bold">Teslimat</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobil ürün görseli */}
          <div className="lg:hidden rounded-3xl overflow-hidden bg-[#F5C4D0] aspect-square flex items-center justify-center p-6">
            <img
              src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg"
              alt="Milgo Çiğ Süt"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="bg-white border-y border-[#F0ECF5] py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {icon:<Truck size={18}/>, renk:'text-[#3B9FCC]', bg:'bg-[#EBF7FC]', baslik:'Hızlı Teslimat', ac:'İstanbul içi aynı gün'},
              {icon:<ShieldCheck size={18}/>, renk:'text-[#E07090]', bg:'bg-[#FEF0F4]', baslik:'Güvenli Ödeme', ac:'SSL ile korumalı'},
              {icon:<RefreshCw size={18}/>, renk:'text-[#3B9FCC]', bg:'bg-[#EBF7FC]', baslik:'Abonelik', ac:'Her hafta kapınıza'},
              {icon:<Award size={18}/>, renk:'text-[#E07090]', bg:'bg-[#FEF0F4]', baslik:'AB Onaylı', ac:'Sertifikalı üretim'},
            ].map(item => (
              <div key={item.baslik} className="flex items-center gap-3">
                <div className={`w-9 h-9 ${item.bg} ${item.renk} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1C1B2E]">{item.baslik}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{item.ac}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EN ÇOK SATANLAR */}
      <section className="py-12 px-4 lg:px-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="inline-block bg-[#FEF0F4] text-[#E07090] text-[11px] font-semibold px-3 py-1 rounded-full mb-2">En Çok Satanlar</span>
            <h2 className="font-display text-[28px] lg:text-[36px] text-[#1C1B2E]">
              Çok <span className="text-[#E07090] italic">Sevilenler</span>
            </h2>
          </div>
          <Link href="/urunler" className="text-[13px] font-semibold text-[#E07090] hover:underline hidden md:flex items-center gap-1">
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(populer.length ? populer : urunler.slice(0, 4)).map(urun => (
            <Link href={`/urun/${urun.slug}`} key={urun.id} className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-[#F0ECF5] group block">
              {/* Görsel */}
              <div className="relative aspect-square bg-[#F0EEF8] p-4 flex items-center justify-center">
                {urun.fotograf_url ? (
                  <img src={urun.fotograf_url} alt={urun.ad}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-5xl">🥛</span>
                )}
                {urun.yeni && (
                  <span className="absolute top-2.5 left-2.5 bg-[#EBF7FC] text-[#3B9FCC] text-[10px] font-bold px-2 py-0.5 rounded-full">Yeni</span>
                )}
                <button
                  onClick={e => { e.preventDefault(); setFavoriler(prev => prev.includes(urun.id) ? prev.filter(f => f !== urun.id) : [...prev, urun.id]) }}
                  className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center transition-all ${favoriler.includes(urun.id) ? 'text-[#E07090]' : 'text-[#9CA3AF] opacity-0 group-hover:opacity-100'}`}>
                  <Heart size={13} fill={favoriler.includes(urun.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* İçerik */}
              <div className="p-4">
                <p className="text-[10px] text-[#9CA3AF] mb-1 capitalize">{urun.kategori}</p>
                <h3 className="text-[13px] font-semibold text-[#1C1B2E] mb-2 line-clamp-2 leading-snug">{urun.ad}</h3>
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400" fill="currentColor" />)}
                  <span className="text-[10px] text-[#9CA3AF] ml-1">(48)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-bold text-[#1C1B2E]">₺{urun.fiyat.toFixed(2)}</span>
                  <button
                    onClick={e => sepeteEkle(e, urun)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-110 shadow-md ${eklendi === urun.id ? 'bg-green-500' : 'bg-gradient-to-br from-[#E07090] to-[#3B9FCC]'}`}>
                    {eklendi === urun.id ? <Check size={14} /> : <span className="text-lg leading-none">+</span>}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABONELİK BANNER */}
      <section className="mx-4 lg:mx-16 rounded-3xl overflow-hidden mb-12" style={{background:'linear-gradient(135deg, #F5C4D0 0%, #C8E8F5 100%)'}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-white/60 text-[#E07090] text-[11px] font-semibold px-3 py-1 rounded-full mb-4">⟳ Haftalık Abonelik</span>
            <h2 className="font-display text-[28px] lg:text-[38px] text-[#1C1B2E] mb-4">
              Her Hafta Taze,<br/>
              <span className="text-[#E07090] italic">Hiç Düşünmeden</span>
            </h2>
            <div className="space-y-2.5 mb-7">
              {['İstediğiniz zaman iptal', 'Miktarı istediğiniz zaman değiştirin', 'Her Cuma teslimat', 'Abonelere %10 indirim'].map(oz => (
                <div key={oz} className="flex items-center gap-2.5 text-[13px] text-[#1C1B2E]">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E07090] to-[#3B9FCC] flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" />
                  </div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="inline-flex items-center gap-2 bg-[#1C1B2E] text-white font-semibold text-[14px] px-7 py-3.5 rounded-full hover:opacity-90 transition-all">
              Abonelik Başlat <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {[{ad:'Başlangıç', det:'2L · Haftada Bir', fiyat:'520', one:false},{ad:'Aile', det:'4L · Haftada Bir', fiyat:'980', one:true},{ad:'Premium', det:'6L · Haftada Bir', fiyat:'1.380', one:false}].map(plan => (
              <div key={plan.ad} className={`bg-white/80 backdrop-blur rounded-2xl px-5 py-4 flex items-center justify-between ${plan.one ? 'ring-2 ring-[#E07090]' : ''}`}>
                <div>
                  <div className="text-[15px] font-semibold text-[#1C1B2E]">{plan.ad}</div>
                  <div className="text-[12px] text-[#9CA3AF]">{plan.det}</div>
                </div>
                <div className="text-right">
                  <div className="text-[22px] font-bold text-[#E07090]">₺{plan.fiyat}</div>
                  <div className="text-[10px] text-[#9CA3AF]">/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section className="py-12 bg-white border-y border-[#F0ECF5]">
        <div className="max-w-7xl mx-auto px-4 lg:px-16">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#FEF0F4] text-[#E07090] text-[11px] font-semibold px-3 py-1 rounded-full mb-3">500+ Mutlu Müşteri</span>
            <h2 className="font-display text-[28px] lg:text-[36px] text-[#1C1B2E]">
              Sizden <span className="text-[#E07090] italic">Gelenler</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {harf:'E', ad:'Ebru G.', konum:'Beşiktaş', metin:'"Sütün tadı gerçekten çok farklı. Artık sadece Milgo. Teslimat da çok hızlı!"'},
              {harf:'H', ad:'Hatice B.', konum:'Kadıköy · Abone', metin:'"3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem!"'},
              {harf:'M', ad:'Mehmet K.', konum:'Şişli', metin:'"Çocukların için doğal süt arıyordum. AB onaylı olması güven veriyor."'},
            ].map(y => (
              <div key={y.ad} className="bg-[#F0EEF8] rounded-2xl p-5 border border-[#F0ECF5]">
                <div className="flex items-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-yellow-400" fill="currentColor" />)}
                </div>
                <p className="text-[14px] text-[#6B7280] leading-relaxed mb-4 italic">{y.metin}</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F4A7B9] to-[#7EC8E3] flex items-center justify-center text-white font-bold text-[13px]">{y.harf}</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1C1B2E]">{y.ad}</div>
                    <div className="text-[11px] text-[#9CA3AF]">{y.konum}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÜLTEN */}
      <section className="py-14 px-4 text-center">
        <h2 className="font-display text-[28px] lg:text-[40px] text-[#1C1B2E] mb-3">
          İlk Siparişte <span className="text-[#E07090] italic">%10 İndirim</span>
        </h2>
        <p className="text-[14px] text-[#9CA3AF] mb-7">Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <form className="flex max-w-sm mx-auto bg-white rounded-2xl border border-[#F0ECF5] shadow-sm p-1.5 gap-2" onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-4 py-2 text-[13px] text-[#1C1B2E] placeholder-[#9CA3AF] outline-none bg-transparent" />
          <button type="submit" className="bg-gradient-to-r from-[#E07090] to-[#3B9FCC] text-white font-semibold text-[12px] px-5 py-2.5 rounded-xl flex-shrink-0">Katıl</button>
        </form>
      </section>
    </div>
  )
}
