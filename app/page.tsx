'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, ShoppingBag, Heart, Star, ArrowRight, RefreshCw, ShieldCheck, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [eklendi, setEklendi] = useState<string | null>(null)
  const [favoriler, setFavoriler] = useState<string[]>([])
  const ekle = useSepet(s => s.ekle)
  const sliderRef = useRef<HTMLDivElement>(null)

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

  const favoriToggle = (id: string) => {
    setFavoriler(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const populer = urunler.filter(u => u.populer)
  const yeni = urunler.filter(u => u.yeni)

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-lav">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 badge-mavi mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-mavi-koy animate-pulse" />
                Çiftliğimizden Sofranıza
              </div>
              <h1 className="font-display text-[clamp(38px,5vw,64px)] leading-[1.15] text-metin mb-5">
                Mutluluğun<br/>
                <span className="gradient-text italic">Tadını</span><br/>
                Hissedin
              </h1>
              <p className="text-[15px] leading-relaxed text-metin-2 max-w-md mb-8">
                ATASANCAK Çiftliği'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. Hiçbir katkı maddesi, sadece doğallık.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/urunler" className="btn-primary px-7 py-3.5 inline-flex items-center gap-2">
                  <ShoppingBag size={16} /> Alışverişe Başla
                </Link>
                <Link href="/abonelik" className="btn-secondary px-7 py-3.5 inline-flex items-center gap-2">
                  <RefreshCw size={16} /> Abonelik Planları
                </Link>
              </div>
              {/* Güven rozetleri */}
              <div className="flex gap-5 mt-10 pt-8 border-t border-sinir">
                {[['10.500', 'Büyükbaş'], ['24K', 'Dekar Çiftlik'], ['%100', 'Doğal'], ['0', 'Katkı Maddesi']].map(([s, a]) => (
                  <div key={a} className="text-center">
                    <div className="font-display text-[22px] gradient-text">{s}</div>
                    <div className="text-[10px] text-metin-2 mt-0.5 leading-tight">{a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero görsel */}
            <div className="relative">
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] bg-[#f5c4d0]">
                <img
                  src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg"
                  alt="Milgo Çiğ Süt"
                  className="w-full h-full object-contain p-6"
                />
              </div>
              {/* Floating kartlar */}
              <div className="absolute -left-4 top-10 card p-3.5 shadow-xl animate-float">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-pembe-acik rounded-xl flex items-center justify-center text-xl">🥛</div>
                  <div>
                    <div className="text-[12px] font-semibold text-metin">Çiğ Süt 2L</div>
                    <div className="text-[13px] font-bold text-pembe-koy">₺130</div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-16 card p-3.5 shadow-xl animate-float" style={{animationDelay:'1.5s'}}>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-mavi-acik rounded-xl flex items-center justify-center text-xl">⭐</div>
                  <div>
                    <div className="text-[12px] font-semibold text-metin">4.9/5 Puan</div>
                    <div className="text-[11px] text-metin-2">500+ Yorum</div>
                  </div>
                </div>
              </div>
              <div className="absolute left-4 -bottom-4 card px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[12px] font-semibold text-metin">🚚 Bugün kargoya verilir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ÖZELLİKLER ===== */}
      <section className="bg-white border-y border-sinir py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:<Truck size={20}/>, renk:'text-mavi-koy', bg:'bg-mavi-acik', baslik:'Hızlı Teslimat', ac:'İstanbul içi aynı gün'},
              {icon:<ShieldCheck size={20}/>, renk:'text-pembe-koy', bg:'bg-pembe-acik', baslik:'Güvenli Ödeme', ac:'SSL ile korumalı'},
              {icon:<RefreshCw size={20}/>, renk:'text-mavi-koy', bg:'bg-mavi-acik', baslik:'Abonelik Sistemi', ac:'Her hafta kapınıza'},
              {icon:<Award size={20}/>, renk:'text-pembe-koy', bg:'bg-pembe-acik', baslik:'AB Onaylı', ac:'Sertifikalı üretim'},
            ].map(item => (
              <div key={item.baslik} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.bg} ${item.renk} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-metin">{item.baslik}</div>
                  <div className="text-[11px] text-metin-2">{item.ac}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EN ÇOK SATANLAR ===== */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="badge-pembe mb-2 inline-block">En Çok Satanlar</div>
            <h2 className="font-display text-[clamp(26px,3vw,38px)] text-metin">
              Çok <span className="gradient-text italic">Sevilenler</span>
            </h2>
          </div>
          <Link href="/urunler" className="text-[13px] font-semibold text-pembe-koy hover:underline flex items-center gap-1 hidden md:flex">
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(populer.length ? populer : urunler.slice(0,4)).map(urun => (
            <Link href={`/urun/${urun.slug}`} key={urun.id} className="card card-hover group block">
              {/* Görsel */}
              <div className="relative aspect-square bg-lav rounded-t-[19px] overflow-hidden p-4">
                {urun.fotograf_url ? (
                  <img src={urun.fotograf_url} alt={urun.ad}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🥛</div>
                )}
                {/* Yeni badge */}
                {urun.yeni && (
                  <div className="absolute top-2.5 left-2.5 badge-mavi">Yeni</div>
                )}
                {/* Favori */}
                <button onClick={e => { e.preventDefault(); favoriToggle(urun.id); }}
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-all ${favoriler.includes(urun.id) ? 'text-pembe-koy' : 'text-metin-2 opacity-0 group-hover:opacity-100'}`}>
                  <Heart size={14} fill={favoriler.includes(urun.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* İçerik */}
              <div className="p-4">
                <div className="text-[11px] text-metin-2 mb-1 capitalize">{urun.kategori}</div>
                <h3 className="text-[14px] font-semibold text-metin mb-3 line-clamp-2 leading-snug">{urun.ad}</h3>

                {/* Yıldızlar */}
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={11} className="text-yellow-400" fill="currentColor" />
                  ))}
                  <span className="text-[10px] text-metin-2 ml-1">(48)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[18px] font-bold text-metin">₺{urun.fiyat.toFixed(2)}</div>
                    {urun.eski_fiyat && (
                      <div className="text-[11px] text-metin-2 line-through">₺{urun.eski_fiyat.toFixed(2)}</div>
                    )}
                  </div>
                  <button onClick={e => sepeteEkle(e, urun)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-md hover:scale-110 ${eklendi === urun.id ? 'bg-green-500' : 'gradient-bg'}`}>
                    {eklendi === urun.id ? <Check size={16} /> : <span className="text-lg leading-none">+</span>}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/urunler" className="mt-6 flex items-center justify-center gap-2 text-[13px] font-semibold text-pembe-koy hover:underline md:hidden">
          Tüm Ürünleri Gör <ArrowRight size={14} />
        </Link>
      </section>

      {/* ===== PEMBE BANNER ===== */}
      <section className="mx-4 lg:mx-8 rounded-[32px] overflow-hidden mb-12" style={{background:'linear-gradient(135deg, #F5C4D0 0%, #C8E8F5 100%)'}}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="badge-pembe mb-4 inline-block">⟳ Haftalık Abonelik</div>
            <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-metin mb-4">
              Her Hafta Taze,<br/>
              <span className="text-pembe-koy italic">Hiç Düşünmeden</span>
            </h2>
            <p className="text-[14px] text-metin-2 leading-relaxed mb-6 max-w-md">
              Haftalık abonelikle sevdiğiniz ürünler otomatik kapınıza gelir. İstediğiniz zaman değiştirin veya iptal edin.
            </p>
            <div className="space-y-2 mb-8">
              {['İstediğiniz zaman iptal', 'Miktar değiştirme', 'Her Cuma teslimat', 'Abonelere özel %10 indirim'].map(oz => (
                <div key={oz} className="flex items-center gap-2.5 text-[13px] text-metin">
                  <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" />
                  </div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">
              Abonelik Başlat <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[{ad:'Başlangıç', det:'2L · Haftada Bir', fiyat:'520', one:false},{ad:'Aile', det:'4L · Haftada Bir', fiyat:'980', one:true},{ad:'Premium', det:'6L · Haftada Bir', fiyat:'1.380', one:false}].map(plan => (
              <div key={plan.ad} className={`bg-white/80 backdrop-blur rounded-2xl px-5 py-4 flex items-center justify-between ${plan.one ? 'ring-2 ring-pembe-koy shadow-lg' : ''}`}>
                {plan.one && <div className="absolute ml-32 -mt-8 badge-pembe">Popüler</div>}
                <div>
                  <div className="text-[15px] font-semibold text-metin font-display">{plan.ad}</div>
                  <div className="text-[12px] text-metin-2">{plan.det}</div>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-bold text-pembe-koy">₺{plan.fiyat}</div>
                  <div className="text-[10px] text-metin-2">/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YENİ ÜRÜNLER ===== */}
      {yeni.length > 0 && (
        <section className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="badge-mavi mb-2 inline-block">Yeni Gelenler</div>
              <h2 className="font-display text-[clamp(26px,3vw,38px)] text-metin">
                Yeni <span className="gradient-text italic">Ürünler</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {yeni.map(urun => (
              <Link href={`/urun/${urun.slug}`} key={urun.id} className="card card-hover group block">
                <div className="relative aspect-square bg-lav rounded-t-[19px] overflow-hidden p-4">
                  {urun.fotograf_url ? (
                    <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  ) : <div className="w-full h-full flex items-center justify-center text-5xl">🥛</div>}
                  <div className="absolute top-2.5 left-2.5 badge-mavi">Yeni</div>
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold text-metin mb-2">{urun.ad}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-[18px] font-bold text-metin">₺{urun.fiyat.toFixed(2)}</div>
                    <button onClick={e => sepeteEkle(e, urun)} className="w-10 h-10 rounded-full gradient-bg text-white flex items-center justify-center font-bold hover:scale-110 transition-all shadow-md">
                      {eklendi === urun.id ? <Check size={16} /> : <span className="text-lg">+</span>}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== YORUMLAR ===== */}
      <section className="py-14 bg-white border-y border-sinir">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <div className="badge-pembe mb-3 inline-block">500+ Mutlu Müşteri</div>
            <h2 className="font-display text-[clamp(26px,3vw,38px)] text-metin">
              Sizden <span className="gradient-text italic">Gelenler</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {harf:'E', ad:'Ebru G.', konum:'Beşiktaş', puan:5, metin:'Sütün tadı gerçekten çok farklı. Marketten alışkanlığım gitti, artık sadece Milgo. Teslimat da çok hızlı!'},
              {harf:'H', ad:'Hatice B.', konum:'Kadıköy · Abone', puan:5, metin:'3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem, sarımsaklısını özellikle tavsiye ederim.'},
              {harf:'M', ad:'Mehmet K.', konum:'Şişli', puan:5, metin:'Çocukların için doğal süt arıyordum, Milgo buldum. AB onaylı olması güven veriyor. Kesinlikle tavsiye ederim.'},
            ].map(y => (
              <div key={y.ad} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array(y.puan).fill(0).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-[14px] text-metin-2 leading-relaxed mb-5 italic">"{y.metin}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-bg-soft flex items-center justify-center text-white font-bold text-[13px]">{y.harf}</div>
                  <div>
                    <div className="text-[13px] font-semibold text-metin">{y.ad}</div>
                    <div className="text-[11px] text-metin-2">{y.konum}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BÜLTEN ===== */}
      <section className="py-16 px-4 text-center bg-lav">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-[clamp(26px,3.5vw,42px)] text-metin mb-3">
            İlk Siparişte <span className="gradient-text italic">%10 İndirim</span>
          </h2>
          <p className="text-[14px] text-metin-2 mb-7">Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
          <form className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-sinir p-1.5 gap-2" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="E-posta adresiniz" className="flex-1 px-4 py-2.5 text-[14px] text-metin placeholder-metin-2 outline-none bg-transparent" />
            <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl flex-shrink-0">Katıl</button>
          </form>
        </div>
      </section>
    </div>
  )
}
