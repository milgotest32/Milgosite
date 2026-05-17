'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { ShoppingBag, Check } from 'lucide-react'

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
    <div>
      {/* HERO */}
      <section className="min-h-[calc(100vh-108px)] grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(196,118,142,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(45,82,153,0.2) 0%, transparent 50%)'
        }} />
        <div className="flex flex-col justify-center px-8 lg:px-20 py-20 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[rgba(232,164,184,0.1)] border border-[rgba(232,164,184,0.2)] rounded-full px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-[#f5c8d8] mb-8 w-fit animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8a4b8]" />
            Çiftliğimizden Sofranıza
          </div>
          <h1 className="font-display text-[clamp(48px,5.5vw,82px)] font-light leading-[1.1] mb-7 animate-fade-up" style={{animationDelay:'0.15s',opacity:0,animationFillMode:'forwards'}}>
            Doğanın<br/>
            <span className="gradient-text italic">Saf Lezzeti</span><br/>
            Kapınızda
          </h1>
          <p className="text-[15px] leading-[1.85] text-[#8a92a8] max-w-[420px] mb-10 animate-fade-up" style={{animationDelay:'0.3s',opacity:0,animationFillMode:'forwards'}}>
            ATASANCAK Çiftliği'nden günlük toplanan çiğ süt ve geleneksel yöntemlerle hazırlanan süt ürünleri. %100 doğal, katkısız, taze.
          </p>
          <div className="flex gap-3 flex-wrap animate-fade-up" style={{animationDelay:'0.45s',opacity:0,animationFillMode:'forwards'}}>
            <Link href="/urunler" className="gradient-bg text-white text-[12px] tracking-[0.12em] uppercase font-medium px-9 py-4 rounded-full shadow-[0_8px_32px_rgba(196,118,142,0.35)] hover:opacity-90 hover:-translate-y-1 transition-all">
              Hemen Sipariş Ver
            </Link>
            <Link href="/abonelik" className="glass text-[#f5c8d8] text-[12px] tracking-[0.1em] px-8 py-4 rounded-full hover:bg-[rgba(232,164,184,0.12)] transition-all">
              Abonelik Planları
            </Link>
          </div>
          <div className="flex gap-9 mt-14 pt-9 border-t border-white/5 animate-fade-up" style={{animationDelay:'0.6s',opacity:0,animationFillMode:'forwards'}}>
            {[['10.5K', 'Büyükbaş'], ['24K', 'Dekar Çiftlik'], ['%100', 'Katkısız'], ['AB', 'Onaylı']].map(([sayi, ac]) => (
              <div key={ac}>
                <div className="font-display text-[36px] font-light gradient-text leading-none">{sayi}</div>
                <div className="text-[11px] text-[#8a92a8] mt-1">{ac}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden hidden lg:block">
          <div className="absolute inset-0 z-10" style={{background:'linear-gradient(to right, #080f22 0%, transparent 40%)'}} />
          <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&q=80" alt="Milgo Çiftlik"
            className="w-full h-full object-cover" style={{filter:'brightness(0.5) contrast(1.1) saturate(0.5)'}} />
          {/* Floating kartlar */}
          <div className="absolute top-[15%] right-[8%] z-20 glass rounded-2xl p-4 animate-float">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥛</span>
              <div>
                <div className="text-[13px] font-medium text-[#f5c8d8]">Çiğ Süt 2L</div>
                <div className="text-[11px] text-[#8a92a8]">₺130 · Taze Stok</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[20%] right-[12%] z-20 glass rounded-2xl p-4 animate-float" style={{animationDelay:'1.5s'}}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <div className="text-[13px] font-medium text-[#f5c8d8]">Aynı Gün Teslimat</div>
                <div className="text-[11px] text-[#8a92a8]">İstanbul içi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#152347] border-y border-[rgba(232,164,184,0.1)] py-4 overflow-hidden">
        <div className="flex gap-0 animate-ticker w-max">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex">
              {['Çiğ Süt · Günlük Taze', 'Sürülebilir Peynir · 5 Çeşit', 'Tereyağı · Doğal', 'Abone Ol · Her Cuma Kapına', 'AB Onaylı · Sertifikalı', 'İstanbul · Aynı Gün Teslimat'].map((item, i) => (
                <span key={i} className="flex items-center gap-10 pr-10 whitespace-nowrap text-[12px] text-white/50">
                  <strong className="text-[#f5c8d8] font-medium">{item.split('·')[0].trim()}</strong>
                  <span className="text-[#c4768e] text-[8px]">✦</span>
                  {item.split('·')[1]?.trim()}
                  <span className="text-[#c4768e] text-[8px]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* EN ÇOK SATANLAR */}
      <section className="py-24 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#e8a4b8] mb-3">
              <span className="w-5 h-px bg-[#e8a4b8]" />En Çok Satanlar
            </div>
            <h2 className="font-display text-[clamp(32px,3.5vw,50px)] font-light">
              Doğallığı <span className="gradient-text italic">Hissedin</span>
            </h2>
          </div>
          <Link href="/urunler" className="text-[#8a92a8] text-[12px] tracking-[0.15em] uppercase hover:text-[#f5c8d8] transition-colors flex items-center gap-2">
            Tüm Ürünler →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(populer.length ? populer : urunler.slice(0, 4)).map(urun => (
            <div key={urun.id} className="group relative rounded-3xl overflow-hidden bg-[#0d1b3e] aspect-[3/4] cursor-pointer">
              {urun.fotograf_url && (
                <img src={urun.fotograf_url} alt={urun.ad}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{filter:'brightness(0.4) contrast(1.1) saturate(0.5)'}} />
              )}
              {!urun.fotograf_url && <div className="w-full h-full bg-gradient-to-br from-[#1e3a6e] to-[#0d1b3e] flex items-center justify-center text-6xl">🥛</div>}
              <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(8,15,34,0.98) 0%, rgba(8,15,34,0.2) 50%, transparent 80%)'}}>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {urun.yeni && <span className="text-[8px] tracking-[0.25em] uppercase bg-gradient-to-r from-[#c4768e] to-[#b8a4d8] text-white px-3 py-1 rounded-full mb-2 inline-block">Yeni</span>}
                  <div className="text-[9px] tracking-[0.3em] uppercase text-[#e8a4b8] mb-2">{urun.kategori}</div>
                  <h3 className="font-display text-[18px] font-light mb-1 text-white">{urun.ad}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-display text-[20px] gradient-text">
                      ₺{urun.fiyat.toFixed(2)} <small className="text-[11px] text-[#8a92a8] font-sans">/ adet</small>
                    </div>
                    <button onClick={() => sepeteEkle(urun)}
                      className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-[0_8px_24px_rgba(196,118,142,0.4)]">
                      {eklendi === urun.id ? <Check size={16} /> : <span className="text-lg">+</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABONELİK TEASER */}
      <section className="py-24 px-8 lg:px-16 relative overflow-hidden" style={{background:'linear-gradient(135deg, #0d1b3e 0%, #080f22 100%)'}}>
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 0% 50%, rgba(196,118,142,0.1) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, rgba(45,82,153,0.12) 0%, transparent 50%)'}} />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[#f5c8d8] mb-6">
              ⟳ Haftalık Abonelik
            </div>
            <h2 className="font-display text-[clamp(36px,4vw,58px)] font-light leading-[1.1] mb-5">
              Her Hafta<br/><span className="gradient-text italic">Kapınıza</span><br/>Gelsin
            </h2>
            <p className="text-[14px] leading-[1.9] text-[#8a92a8] mb-8">
              Haftalık düzenli teslimat ile taze ürünleri hiç düşünmeden alın. İstediğiniz zaman iptal edin.
            </p>
            <div className="space-y-3 mb-10">
              {['İstediğiniz zaman iptal edin', 'Miktarı istediğiniz zaman değiştirin', 'Her Cuma günü teslimat', 'Abonelere özel indirim'].map(oz => (
                <div key={oz} className="flex items-center gap-3 text-[13px] text-white/80">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[rgba(196,118,142,0.3)] to-[rgba(45,82,153,0.3)] border border-[rgba(232,164,184,0.2)] flex items-center justify-center text-[11px] text-[#f5c8d8] flex-shrink-0">✓</div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="gradient-bg text-white text-[12px] tracking-[0.12em] uppercase font-medium px-9 py-4 rounded-full inline-flex shadow-[0_8px_32px_rgba(196,118,142,0.35)] hover:opacity-90 transition-all">
              Abonelik Başlat
            </Link>
          </div>
          <div className="space-y-3">
            {[{ad:'Başlangıç', det:'2 Litre · Haftada Bir', fiyat:'₺520', one:false}, {ad:'Aile', det:'4 Litre · Haftada Bir', fiyat:'₺980', one:true}, {ad:'Premium', det:'6 Litre · Haftada Bir', fiyat:'₺1.380', one:false}].map(plan => (
              <div key={plan.ad} className={`relative glass rounded-2xl px-6 py-5 flex items-center justify-between transition-all hover:translate-x-1 ${plan.one ? 'border-[rgba(232,164,184,0.3)] bg-[rgba(232,164,184,0.05)]' : ''}`}>
                {plan.one && <div className="absolute top-0 right-6 gradient-bg text-white text-[7px] tracking-[0.3em] uppercase px-3 py-1 rounded-b-xl font-bold">Popüler</div>}
                <div>
                  <div className="font-display text-[20px] font-light">{plan.ad}</div>
                  <div className="text-[12px] text-[#8a92a8]">{plan.det}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-[26px] gradient-text">{plan.fiyat}</div>
                  <div className="text-[10px] text-[#8a92a8] tracking-wide">/ AY</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section className="py-24 px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#e8a4b8] mb-3">Müşterilerimiz</div>
          <h2 className="font-display text-[clamp(32px,3.5vw,50px)] font-light">
            Ne <span className="gradient-text italic">Diyorlar?</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {harf:'E', renk:'from-[#c4768e] to-[#2d5299]', yildiz:'text-[#f5c8d8]', ad:'Ebru G.', konum:'İstanbul', metin:'"Sütün tadı gayet güzel ve doğal hissettiriyor. Milgo ile tanışınca gerçek sütün ne olduğunu anladım."'},
            {harf:'H', renk:'from-[#b8a4d8] to-[#2d5299]', yildiz:'text-[#d4c8f0]', ad:'Hatice B.', konum:'İstanbul · Abonelik', metin:'"Süt gerçekten çok taze ve doğal. Şişeyi açtığınızda rahatsız edici bir koku kesinlikle yok."'},
            {harf:'N', renk:'from-[#c4768e] to-[#b8a4d8]', yildiz:'text-[#f5c8d8]', ad:'Nermin A.', konum:'İstanbul', metin:'"Hurmalı taze peynirle başladım, sonra tüm ürünleri denedim. Hepsi mükemmel lezzet!"'},
          ].map(y => (
            <div key={y.ad} className="glass rounded-3xl p-8 hover:border-[rgba(232,164,184,0.2)] hover:-translate-y-1 transition-all">
              <div className={`text-[14px] tracking-[3px] mb-4 ${y.yildiz}`}>★★★★★</div>
              <p className="font-display italic text-[16px] leading-[1.75] text-white/85 mb-6">{y.metin}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${y.renk} flex items-center justify-center text-white font-semibold`}>{y.harf}</div>
                <div>
                  <div className="text-[13px] font-medium text-white">{y.ad}</div>
                  <div className="text-[11px] text-[#8a92a8]">{y.konum}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BÜLTEN */}
      <section className="py-24 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(196,118,142,0.1) 0%, transparent 60%)'}} />
        <h2 className="font-display text-[clamp(36px,4.5vw,64px)] font-light mb-4 relative">
          İlk Siparişte <span className="gradient-text italic">%10 İndirim</span>
        </h2>
        <p className="text-[14px] text-[#8a92a8] mb-10 relative">Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <div className="flex max-w-[460px] mx-auto glass rounded-full overflow-hidden relative">
          <input type="email" placeholder="E-posta adresiniz" className="flex-1 bg-transparent border-none px-6 py-4 text-white text-[13px] placeholder-[#8a92a8] outline-none" />
          <button className="gradient-bg text-white text-[11px] tracking-[0.15em] uppercase font-medium px-7 py-3 m-1 rounded-full hover:opacity-85 transition-opacity">
            Katıl
          </button>
        </div>
      </section>
    </div>
  )
}
