'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, ShoppingBag, Heart, Star, ArrowRight, RefreshCw, ShieldCheck, Truck, Award } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])

  useEffect(() => {
    supabase.from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .eq('durum', 'active')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }: any) => setUrunler(data || []))
  }, [])

  const featured = urunler.filter(u => u.featured)
  const goster = featured.length > 0 ? featured : urunler.slice(0, 4)
  const hero_gorsel = urunler[0]?.site_product_images?.[0]?.url

  return (
    <div style={{ background: '#F0EEF8', overflowX: 'hidden' }}>

      {/* HERO */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px 24px' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>

          {/* Sol */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EBF7FC', color: '#3B9FCC', fontSize: '11px', fontWeight: 700, padding: '6px 14px', borderRadius: '50px', marginBottom: '20px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B9FCC', display: 'inline-block' }} />
              Çiftliğimizden Sofranıza
            </span>

            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: '1.1', color: '#1C1B2E', marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Mutluluğun<br />
              <span style={{ fontStyle: 'italic', color: '#E07090' }}>Tadını</span><br />
              Hissedin
            </h1>

            <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#6B7280', maxWidth: '380px', marginBottom: '28px' }}>
              ATASANCAK Çiftliği'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. %100 doğal, katkısız.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link href="/urunler" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', fontSize: '13px', fontWeight: 700, padding: '12px 24px', borderRadius: '50px', textDecoration: 'none', boxShadow: '0 6px 20px rgba(224,112,144,0.35)' }}>
                <ShoppingBag size={15} />Alışverişe Başla
              </Link>
              <Link href="/abonelik" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#E07090', fontSize: '13px', fontWeight: 600, padding: '12px 22px', borderRadius: '50px', textDecoration: 'none', border: '2px solid #F4A7B9' }}>
                <RefreshCw size={14} />Abonelik
              </Link>
            </div>

            {/* İstatistikler */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(26,10,18,0.08)' }}>
              {[['10.5K', 'Büyükbaş'], ['%100', 'Doğal'], ['AB', 'Onaylı'], ['0', 'Katkı']].map(([s, a]) => (
                <div key={a} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — masaüstünde görünür */}
          <div className="hidden lg:block" style={{ position: 'relative' }}>
            <div style={{ borderRadius: '28px', overflow: 'hidden', aspectRatio: '4/5', background: 'linear-gradient(135deg,#F5C4D0,#C8E8F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              {hero_gorsel
                ? <img src={hero_gorsel} alt="Milgo Ürün" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="eager" />
                : <img src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg" alt="Milgo Çiğ Süt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="eager" />
              }
            </div>
            {/* Floating kartlar */}
            <div style={{ position: 'absolute', left: '-14px', top: '12%', background: '#fff', borderRadius: '14px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', background: '#FEF0F4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🥛</div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1B2E' }}>Çiğ Süt 2L</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#E07090' }}>₺130</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', right: '-14px', bottom: '14%', background: '#fff', borderRadius: '14px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', background: '#EBF7FC', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⭐</div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#1C1B2E' }}>4.9/5 Puan</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>500+ Yorum</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobil görsel */}
          <div className="lg:hidden" style={{ borderRadius: '24px', overflow: 'hidden', aspectRatio: '1', background: 'linear-gradient(135deg,#F5C4D0,#C8E8F5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <img src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg" alt="Milgo Çiğ Süt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="eager" />
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section style={{ background: '#fff', borderTop: '1px solid #F0ECF5', borderBottom: '1px solid #F0ECF5', padding: '16px' }}>
        <div className="features-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { icon: <Truck size={16} />, renk: '#3B9FCC', bg: '#EBF7FC', t: 'Hızlı Teslimat', a: 'Aynı gün İstanbul' },
            { icon: <ShieldCheck size={16} />, renk: '#E07090', bg: '#FEF0F4', t: 'Güvenli Ödeme', a: 'SSL korumalı' },
            { icon: <RefreshCw size={16} />, renk: '#3B9FCC', bg: '#EBF7FC', t: 'Abonelik', a: 'Her hafta kapına' },
            { icon: <Award size={16} />, renk: '#E07090', bg: '#FEF0F4', t: 'AB Onaylı', a: 'Sertifikalı üretim' },
          ].map(item => (
            <div key={item.t} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', background: item.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.renk, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C1B2E' }}>{item.t}</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ÜRÜNLER */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 16px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ display: 'inline-block', background: '#FEF0F4', color: '#E07090', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', marginBottom: '6px' }}>En Çok Satanlar</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(24px, 3vw, 34px)', color: '#1C1B2E', margin: 0 }}>
              Çok <span style={{ fontStyle: 'italic', color: '#E07090' }}>Sevilenler</span>
            </h2>
          </div>
          <Link href="/urunler" style={{ fontSize: '13px', fontWeight: 600, color: '#E07090', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Tümünü Gör <ArrowRight size={13} />
          </Link>
        </div>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {goster.slice(0, 4).map(urun => <ProductCard key={urun.id} urun={urun} />)}
        </div>
      </section>

      {/* ABONELİK */}
      <section style={{ margin: '0 16px 40px', borderRadius: '28px', overflow: 'hidden', background: 'linear-gradient(135deg,#F5C4D0,#C8E8F5)' }}>
        <div className="banner-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(224,112,144,0.15)', color: '#E07090', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', marginBottom: '14px' }}>⟳ Haftalık Abonelik</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px, 3vw, 34px)', color: '#1C1B2E', marginBottom: '14px' }}>
              Her Hafta Taze,<br /><span style={{ fontStyle: 'italic', color: '#E07090' }}>Hiç Düşünmeden</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {['İstediğiniz zaman iptal', 'Miktar değiştirme', 'Her Cuma teslimat', 'Abonelere %10 indirim'].map(oz => (
                <div key={oz} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1C1B2E' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={9} color="#fff" />
                  </div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1C1B2E', color: '#fff', padding: '12px 24px', borderRadius: '50px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              Abonelik Başlat <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[{ ad: 'Başlangıç', det: '2L · Haftada Bir', fiyat: '520', hot: false }, { ad: 'Aile', det: '4L · Haftada Bir', fiyat: '980', hot: true }, { ad: 'Premium', det: '6L · Haftada Bir', fiyat: '1.380', hot: false }].map(plan => (
              <div key={plan.ad} style={{ background: 'rgba(255,255,255,0.88)', borderRadius: '18px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: plan.hot ? '2px solid #E07090' : '2px solid transparent' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', fontFamily: '"Playfair Display", serif' }}>
                    {plan.ad}
                    {plan.hot && <span style={{ fontSize: '9px', fontWeight: 700, background: '#E07090', color: '#fff', padding: '2px 8px', borderRadius: '50px', marginLeft: '8px' }}>Popüler</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{plan.det}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', color: '#E07090' }}>₺{plan.fiyat}</div>
                  <div style={{ fontSize: '10px', color: '#9CA3AF' }}>/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YORUMLAR */}
      <section style={{ padding: '40px 16px', background: '#fff', borderTop: '1px solid #F0ECF5', borderBottom: '1px solid #F0ECF5' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ display: 'inline-block', background: '#FEF0F4', color: '#E07090', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', marginBottom: '8px' }}>500+ Mutlu Müşteri</span>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px, 3vw, 34px)', color: '#1C1B2E' }}>
              Sizden <span style={{ fontStyle: 'italic', color: '#E07090' }}>Gelenler</span>
            </h2>
          </div>
          <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[
              { h: 'E', ad: 'Ebru G.', lok: 'Beşiktaş', metin: '"Sütün tadı gerçekten çok farklı. Marketten alışkanlığım gitti, artık sadece Milgo!"' },
              { h: 'H', ad: 'Hatice B.', lok: 'Kadıköy · Abone', metin: '"3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem!"' },
              { h: 'M', ad: 'Mehmet K.', lok: 'Şişli', metin: '"Çocuklar için doğal süt arıyordum. AB onaylı olması güven veriyor."' },
            ].map(y => (
              <div key={y.ad} style={{ background: '#F0EEF8', borderRadius: '18px', padding: '20px', border: '1px solid #F0ECF5' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} style={{ color: '#FBBF24' }} fill="#FBBF24" />)}
                </div>
                <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '14px', color: '#1C1B2E', lineHeight: '1.7', marginBottom: '14px' }}>{y.metin}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#F4A7B9,#7EC8E3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff' }}>{y.h}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>{y.ad}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{y.lok}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÜLTEN */}
      <section style={{ padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#1C1B2E', marginBottom: '8px' }}>
          İlk Siparişte <span style={{ fontStyle: 'italic', color: '#E07090' }}>%10 İndirim</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <form style={{ display: 'flex', maxWidth: '400px', margin: '0 auto', background: '#fff', borderRadius: '18px', border: '1px solid #F0ECF5', padding: '5px' }} onSubmit={e => { e.preventDefault(); toast.success('Teşekkürler! Hoş geldiniz 🎉') }}>
          <input type="email" placeholder="E-posta adresiniz" style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', minWidth: 0 }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '13px', padding: '10px 18px', fontSize: '12px', fontWeight: 700, cursor: 'none', fontFamily: 'inherit', flexShrink: 0 }}>Katıl</button>
        </form>
      </section>
    </div>
  )
}
