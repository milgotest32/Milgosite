'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, RefreshCw, ShieldCheck, Truck, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const ekle = useSepet(s => s.ekle)
  const [eklendi, setEklendi] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_urunler').select('*').eq('aktif', true).order('sira').then(({ data }: { data: any }) => setUrunler(data || []))
  }, [])

  const sepeteEkle = (urun: Urun) => {
    ekle(urun)
    setEklendi(urun.id)
    setTimeout(() => setEklendi(null), 1500)
  }

  const populer = urunler.filter(u => u.populer)

  return (
    <div className="bg-[#f0eef8]">

      {/* HERO */}
      <section className="px-6 lg:px-16 pt-12 pb-0 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="py-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-[11px] text-[#4dd0e8] font-semibold tracking-wide mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4dd0e8] animate-pulse" />
              Çiftliğimizden Sofranıza
            </div>
            <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light leading-[1.1] text-[#2d2d4e] mb-5">
              Mutluluğun<br/>
              <span className="italic" style={{background:'linear-gradient(135deg, #e8729a, #4dd0e8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>Tadını</span><br/>
              Hissedin
            </h1>
            <p className="text-[15px] leading-[1.85] text-[#6b7280] max-w-[420px] mb-8">
              ATASANCAK Çiftliği'nden günlük toplanan çiğ süt ve geleneksel yöntemlerle hazırlanan süt ürünleri. %100 doğal, katkısız.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/urunler" className="gradient-bg text-white text-[13px] font-semibold px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(232,114,154,0.3)] hover:opacity-90 hover:-translate-y-0.5 transition-all">
                Hemen Sipariş Ver
              </Link>
              <Link href="/abonelik" className="bg-white text-[#e8729a] text-[13px] font-medium px-8 py-3.5 rounded-full border border-[#f5c4d0] hover:bg-[#fce8ef] transition-all">
                Abonelik Planları
              </Link>
            </div>
            <div className="flex gap-6 mt-10 pt-8 border-t border-white/60">
              {[['10.500', 'Büyükbaş'], ['%100', 'Doğal'], ['AB', 'Onaylı'], ['0', 'Katkı']].map(([s, a]) => (
                <div key={a}>
                  <div className="font-display text-[28px] font-light" style={{background:'linear-gradient(135deg, #e8729a, #4dd0e8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>{s}</div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">{a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ - görsel */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] bg-[#f5c4d0]">
              <img src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg?w=600"
                alt="Çiğ Süt" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
            </div>
            {/* Floating kart */}
            <div className="absolute top-8 -left-6 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fce8ef] rounded-xl flex items-center justify-center text-xl">🥛</div>
                <div>
                  <div className="text-[12px] font-semibold text-[#2d2d4e]">Çiğ Süt 2L</div>
                  <div className="text-[11px] text-[#e8729a] font-bold">₺130</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 -right-4 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e8f4fd] rounded-xl flex items-center justify-center text-xl">🚚</div>
                <div>
                  <div className="text-[12px] font-semibold text-[#2d2d4e]">Aynı Gün</div>
                  <div className="text-[11px] text-[#4dd0e8] font-bold">Teslimat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-10 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{icon:<Truck size={22}/>, renk:'#4dd0e8', bg:'#e8f4fd', baslik:'Hızlı Teslimat', ac:'İstanbul içi aynı gün'},{icon:<ShieldCheck size={22}/>, renk:'#e8729a', bg:'#fce8ef', baslik:'Güvenli Ödeme', ac:'SSL korumalı'},{icon:<RefreshCw size={22}/>, renk:'#4dd0e8', bg:'#e8f4fd', baslik:'Abonelik Sistemi', ac:'Her hafta kapınıza'},{icon:<Star size={22}/>, renk:'#e8729a', bg:'#fce8ef', baslik:'AB Onaylı', ac:'Sertifikalı üretim'}].map(item => (
            <div key={item.baslik} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#f0eef8]">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background:item.bg, color:item.renk}}>
                {item.icon}
              </div>
              <div className="text-[13px] font-semibold text-[#2d2d4e] mb-1">{item.baslik}</div>
              <div className="text-[11px] text-[#9ca3af]">{item.ac}</div>
            </div>
          ))}
        </div>
      </section>

      {/* EN ÇOK SATANLAR - pembe bölüm */}
      <section className="mx-4 lg:mx-16 rounded-[40px] bg-[#f5c4d0] py-14 px-6 lg:px-12 mb-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#e8729a] font-semibold mb-2">Öne Çıkanlar</div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-light text-[#2d2d4e]">
              EN ÇOK <span className="italic text-[#e8729a]">SATANLAR</span>
            </h2>
          </div>
          <Link href="/urunler" className="text-[#e8729a] text-[12px] font-semibold hover:underline hidden md:block">
            Tüm Ürünler →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(populer.length ? populer : urunler.slice(0,4)).map(urun => (
            <div key={urun.id} className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all shadow-sm">
              <div className="aspect-square bg-[#f8f5ff] relative overflow-hidden p-4">
                {urun.fotograf_url ? (
                  <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🥛</div>
                )}
                {urun.yeni && (
                  <div className="absolute top-3 left-3 gradient-bg text-white text-[8px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full">Yeni</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-[14px] font-semibold text-[#2d2d4e] mb-1 line-clamp-2">{urun.ad}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="font-display text-[20px] text-[#e8729a] font-light">₺{urun.fiyat.toFixed(2)}</div>
                  <button onClick={() => sepeteEkle(urun)}
                    className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center text-white text-lg hover:scale-110 transition-all shadow-md">
                    {eklendi === urun.id ? <Check size={14}/> : '+'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABONELİK */}
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#e8f4fd] rounded-full px-4 py-2 text-[11px] text-[#4dd0e8] font-semibold mb-5">
              <RefreshCw size={12} />Haftalık Abonelik
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,46px)] font-light text-[#2d2d4e] mb-4">
              Her Hafta<br/><span className="italic" style={{background:'linear-gradient(135deg, #e8729a, #4dd0e8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>Kapınıza</span> Gelsin
            </h2>
            <p className="text-[14px] leading-[1.85] text-[#6b7280] mb-6">Haftalık düzenli teslimat ile taze ürünleri hiç düşünmeden alın.</p>
            <div className="space-y-3 mb-8">
              {['İstediğiniz zaman iptal edin', 'Miktarı değiştirin', 'Her Cuma teslimat', 'Abonelere özel indirim'].map(oz => (
                <div key={oz} className="flex items-center gap-3 text-[13px] text-[#2d2d4e]">
                  <div className="w-5 h-5 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" />
                  </div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="gradient-bg text-white text-[13px] font-semibold px-8 py-3.5 rounded-full inline-flex shadow-[0_8px_24px_rgba(232,114,154,0.3)] hover:opacity-90 transition-all">
              Abonelik Başlat
            </Link>
          </div>
          <div className="space-y-3">
            {[{ad:'Başlangıç', det:'2L · Haftada Bir', fiyat:'₺520', one:false},{ad:'Aile', det:'4L · Haftada Bir', fiyat:'₺980', one:true},{ad:'Premium', det:'6L · Haftada Bir', fiyat:'₺1.380', one:false}].map(plan => (
              <div key={plan.ad} className={`bg-white rounded-2xl px-6 py-5 flex items-center justify-between border-2 transition-all hover:-translate-x-1 ${plan.one ? 'border-[#e8729a] shadow-[0_4px_20px_rgba(232,114,154,0.15)]' : 'border-[#f0eef8]'}`}>
                {plan.one && <div className="absolute ml-[calc(100%-80px)] -mt-8 gradient-bg text-white text-[8px] font-bold tracking-wide uppercase px-3 py-1 rounded-full">Popüler</div>}
                <div>
                  <div className="font-display text-[18px] text-[#2d2d4e]">{plan.ad}</div>
                  <div className="text-[12px] text-[#9ca3af]">{plan.det}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-[24px]" style={{background:'linear-gradient(135deg, #e8729a, #4dd0e8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>{plan.fiyat}</div>
                  <div className="text-[10px] text-[#9ca3af]">/ AY</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section className="px-6 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[0.3em] uppercase text-[#4dd0e8] font-semibold mb-2">Müşterilerimiz</div>
            <h2 className="font-display text-[clamp(28px,3vw,40px)] font-light text-[#2d2d4e]">
              Sizden <span className="italic text-[#e8729a]">Gelenler</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[{harf:'E', renk:'#fce8ef', txt:'#e8729a', ad:'Ebru G.', konum:'İstanbul', metin:'"Sütün tadı gayet güzel ve doğal hissettiriyor. Milgo ile tanışınca gerçek sütün ne olduğunu anladım."'},{harf:'H', renk:'#e8f4fd', txt:'#4dd0e8', ad:'Hatice B.', konum:'İstanbul · Abonelik', metin:'"Süt gerçekten çok taze ve doğal. Şişeyi açtığınızda hiç rahatsız edici koku yok."'},{harf:'N', renk:'#fce8ef', txt:'#e8729a', ad:'Nermin A.', konum:'İstanbul', metin:'"Hurmalı taze peynirle başladım, sonra tüm ürünleri denedim. Hepsi mükemmel!"'}].map(y => (
              <div key={y.ad} className="bg-[#f8f5ff] rounded-2xl p-6 border border-[#f0eef8]">
                <div className="text-[#f5c4d0] text-lg mb-4">★★★★★</div>
                <p className="font-display italic text-[15px] leading-[1.7] text-[#2d2d4e] mb-5">{y.metin}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]" style={{background:y.renk, color:y.txt}}>{y.harf}</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#2d2d4e]">{y.ad}</div>
                    <div className="text-[11px] text-[#9ca3af]">{y.konum}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÜLTEN */}
      <section className="py-16 px-6 text-center bg-[#f0eef8]">
        <h2 className="font-display text-[clamp(28px,4vw,50px)] font-light text-[#2d2d4e] mb-3">
          İlk Siparişte <span className="italic" style={{background:'linear-gradient(135deg, #e8729a, #4dd0e8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>%10 İndirim</span>
        </h2>
        <p className="text-[14px] text-[#9ca3af] mb-8">Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <div className="flex max-w-[420px] mx-auto bg-white rounded-full overflow-hidden shadow-sm border border-[#f0eef8]">
          <input type="email" placeholder="E-posta adresiniz" className="flex-1 bg-transparent border-none px-5 py-3.5 text-[13px] text-[#2d2d4e] placeholder-[#9ca3af] outline-none" />
          <button className="gradient-bg text-white text-[11px] font-semibold tracking-wide uppercase px-6 py-2.5 m-1 rounded-full">
            Katıl
          </button>
        </div>
      </section>
    </div>
  )
}
