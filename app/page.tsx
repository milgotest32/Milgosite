'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import type { Urun } from '@/lib/types'
import { Check, ArrowRight, RefreshCw, Star } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    supabase.from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .eq('durum', 'active').order('created_at', { ascending: false }).limit(8)
      .then(({ data }: any) => setUrunler(data || []))
  }, [])

  const featured = urunler.filter(u => u.featured).slice(0, 4)
  const goster = featured.length ? featured : urunler.slice(0, 4)

  return (
    <div style={{ background: '#FDFBF9', overflowX: 'hidden' }}>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="blob blob-p" style={{ width: '500px', height: '500px', top: '-100px', left: '-80px' }} />
        <div className="blob blob-b" style={{ width: '400px', height: '400px', bottom: '-80px', right: '-60px' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          minHeight: isMobile ? 'auto' : '88vh',
          position: 'relative', zIndex: 2,
        }}>
          {/* Sol */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '40px 20px 32px' : 'clamp(40px,6vw,80px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEE8EF', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '8px 16px', borderRadius: '50px', marginBottom: '28px', width: 'fit-content' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8567A', animation: 'pulse 2s ease infinite', display: 'inline-block' }} />
              Çiftliğimizden Sofranıza
            </div>

            <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: isMobile ? '56px' : 'clamp(52px,7vw,88px)', lineHeight: .95, color: '#1A0A12', marginBottom: '20px', letterSpacing: '-.02em' }}>
              Mutlu&shy;luğun<br />
              <em style={{ fontStyle: 'italic', color: '#E8567A' }}>Tadını</em><br />
              <span style={{ fontSize: '1.05em' }}>Hissedin</span>
            </h1>

            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#7A6070', maxWidth: '380px', marginBottom: '36px', fontWeight: 400 }}>
              ATASANCAK Çiftliği'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. %100 doğal, katkısız.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '44px' }}>
              <Link href="/urunler" className="btn-dark">Hemen Sipariş Ver</Link>
              <Link href="/abonelik" className="btn-outline"><RefreshCw size={14} />Abonelik</Link>
            </div>

            <div style={{ display: 'flex', gap: '32px', paddingTop: '24px', borderTop: '1px solid rgba(26,10,18,.08)', flexWrap: 'wrap' }}>
              {[['10.5K', 'Büyükbaş'], ['%100', 'Katkısız'], ['AB', 'Onaylı']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '34px', color: '#E8567A', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#7A6070', marginTop: '4px', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ - masaüstü */}
          {!isMobile && (
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '0 0 0 80px', overflow: 'hidden', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)' }}>
                  <img src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg" alt="Milgo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '32px', animation: 'float 6s ease-in-out infinite', mixBlendMode: 'multiply' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', top: '15%', left: '-14px', background: '#fff', borderRadius: '20px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(26,10,18,.12)', zIndex: 3, animation: 'float 4s ease-in-out infinite' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEE8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🥛</div>
                  <div><div style={{ fontSize: '12px', fontWeight: 700, color: '#1A0A12' }}>Çiğ Süt 2L</div><div style={{ fontSize: '11px', color: '#E8567A', fontWeight: 700 }}>₺130</div></div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '20%', right: '-10px', background: '#fff', borderRadius: '20px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(26,10,18,.12)', zIndex: 3, animation: 'float 4s ease-in-out infinite', animationDelay: '1.5s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EBF5FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⭐</div>
                  <div><div style={{ fontSize: '12px', fontWeight: 700, color: '#1A0A12' }}>4.9/5 Puan</div><div style={{ fontSize: '11px', color: '#7A6070' }}>500+ Yorum</div></div>
                </div>
              </div>
            </div>
          )}

          {/* Mobil görsel */}
          {isMobile && (
            <div style={{ background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 40px', minHeight: '260px' }}>
              <img src="https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg" alt="Milgo"
                style={{ width: '65%', maxWidth: '220px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
          )}
        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className="ticker">
        <div className="tick-inner">
          {[['Çiğ Süt','Günlük Taze'],['Peynir','5 Çeşit'],['Tereyağı','Katkısız'],['Abonelik','Her Cuma'],['AB Onaylı','Sertifikalı'],['İstanbul','Aynı Gün'],['Çiğ Süt','Günlük Taze'],['Peynir','5 Çeşit'],['Tereyağı','Katkısız'],['Abonelik','Her Cuma'],['AB Onaylı','Sertifikalı'],['İstanbul','Aynı Gün']].map(([a,b],i) => (
            <div key={i} className="tick-item"><strong>{a}</strong><span className="tick-dot">✦</span>{b}</div>
          ))}
        </div>
      </div>

      {/* ===== KATEGORİLER ===== */}
      <section style={{ padding: isMobile ? '40px 16px 24px' : 'clamp(48px,6vw,80px) clamp(16px,5vw,80px) clamp(24px,3vw,40px)', maxWidth: '1400px', margin: '0 auto' }}>
        <span className="sec-tag">Kategoriler</span>
        <h2 className="sec-h">Doğallığı <em>Keşfedin</em></h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {[
            { bg: 'linear-gradient(135deg,#FEE8EF,#FBCFE8)', emoji: '🥛', lbl: 'En Çok Satan', ad: 'Çiğ İnek Sütü', href: '/kategoriler/cig-sut', big: !isMobile },
            { bg: 'linear-gradient(135deg,#EBF5FC,#BFDBFE)', emoji: '🧀', lbl: 'Peynir', ad: 'Sürülebilir Peynir', href: '/kategoriler/peynir', big: false },
            { bg: 'linear-gradient(135deg,#F0FDF4,#BBF7D0)', emoji: '🧈', lbl: 'Tereyağı', ad: 'Doğal Tereyağı', href: '/kategoriler/tereyagi', big: false },
            { bg: 'linear-gradient(135deg,#FFF7ED,#FED7AA)', emoji: '🔄', lbl: 'Özel', ad: 'Abonelik', href: '/abonelik', big: false },
            { bg: 'linear-gradient(135deg,#FAF5FF,#E9D5FF)', emoji: '🎁', lbl: 'Hediye', ad: 'Hediye Seti', href: '/kampanyalar', big: false },
          ].map((k, i) => (
            <Link key={k.href} href={k.href} className="card-2026"
              style={{ textDecoration: 'none', display: 'block', gridRow: i === 0 && k.big ? 'span 2' : undefined }}>
              <div style={{ background: k.bg, minHeight: i === 0 && k.big ? '460px' : isMobile ? '160px' : '200px', height: '100%', display: 'flex', alignItems: 'flex-end', padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: i === 0 && !isMobile ? '52px' : '36px' }}>
                  {k.emoji}
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '4px' }}>{k.lbl}</div>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: i === 0 && !isMobile ? '26px' : '18px', color: '#1A0A12' }}>{k.ad}</div>
                  <div style={{ marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1A0A12', color: '#fff', padding: '7px 16px', borderRadius: '50px', fontSize: '11px', fontWeight: 700 }}>İncele →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ÜRÜNLER ===== */}
      <section style={{ padding: isMobile ? '32px 16px' : 'clamp(32px,4vw,56px) clamp(16px,5vw,80px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="sec-tag">En Çok Satanlar</span>
            <h2 className="sec-h" style={{ marginBottom: 0 }}>Çok <em>Sevilenler</em></h2>
          </div>
          <Link href="/urunler" style={{ fontSize: '13px', fontWeight: 700, color: '#E8567A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
          {goster.map(u => <ProductCard key={u.id} urun={u} />)}
        </div>
      </section>

      {/* ===== ABONELİK ===== */}
      <section style={{ margin: isMobile ? '0 12px 48px' : '0 clamp(16px,4vw,80px) 60px', borderRadius: '40px', overflow: 'hidden', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', position: 'relative' }}>
        <div className="blob blob-p" style={{ width: '300px', height: '300px', top: '-80px', right: '-40px', opacity: .4 }} />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '36px', padding: isMobile ? '36px 20px' : 'clamp(40px,5vw,72px)', alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <span className="sec-tag">⟳ Haftalık Abonelik</span>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: isMobile ? '34px' : 'clamp(28px,4vw,48px)', color: '#1A0A12', lineHeight: 1.1, marginBottom: '18px' }}>
              Her Hafta Taze,<br /><em style={{ fontStyle: 'italic', color: '#E8567A' }}>Hiç Düşünmeden</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {['İstediğiniz zaman iptal', 'Miktarı değiştirme', 'Her Cuma teslimat', 'Abonelere %10 indirim'].map(o => (
                <div key={o} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1A0A12', fontWeight: 500 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={10} color="#fff" /></div>
                  {o}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="btn-dark">Abonelik Başlat <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{ a: 'Başlangıç', d: '2L · Haftada Bir', f: '520', hot: false }, { a: 'Aile', d: '4L · Haftada Bir', f: '980', hot: true }, { a: 'Premium', d: '6L · Haftada Bir', f: '1.380', hot: false }].map(p => (
              <div key={p.a} style={{ background: 'rgba(255,255,255,.85)', borderRadius: '22px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: p.hot ? '2px solid #E8567A' : '2px solid transparent' }}>
                <div>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '18px', color: '#1A0A12' }}>
                    {p.a}{p.hot && <span style={{ fontSize: '9px', fontWeight: 800, background: '#E8567A', color: '#fff', padding: '2px 10px', borderRadius: '50px', marginLeft: '10px', fontFamily: 'Syne, sans-serif' }}>POPÜLER</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A6070', marginTop: '2px' }}>{p.d}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '26px', color: '#E8567A' }}>₺{p.f}</div>
                  <div style={{ fontSize: '10px', color: '#7A6070' }}>/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YORUMLAR ===== */}
      <section style={{ padding: isMobile ? '48px 16px' : 'clamp(48px,6vw,72px) clamp(16px,5vw,80px)', background: '#1A0A12' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(244,167,185,.15)', color: '#F4A7B9', fontSize: '10px', fontWeight: 800, letterSpacing: '.25em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', marginBottom: '14px' }}>Müşterilerimiz</span>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: isMobile ? '34px' : 'clamp(28px,4vw,48px)', color: '#fff' }}>Sizden <em style={{ fontStyle: 'italic', color: '#E8567A' }}>Gelenler</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { h: 'E', a: 'Ebru G.', l: 'Beşiktaş, İstanbul', t: '"Sütün tadı gerçekten çok farklı. Marketten alışkanlığım gitti, artık sadece Milgo."' },
              { h: 'H', a: 'Hatice B.', l: 'Kadıköy · Abonelik', t: '"3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem!"' },
              { h: 'M', a: 'Mehmet K.', l: 'Şişli, İstanbul', t: '"Çocuklar için doğal süt arıyordum. AB onaylı olması güven veriyor."' },
            ].map(y => (
              <div key={y.a} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '32px', padding: '28px', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={15} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
                </div>
                <p style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.65, color: 'rgba(255,255,255,.85)', marginBottom: '20px' }}>{y.t}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8567A,#5BA4CF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '14px' }}>{y.h}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{y.a}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.5)' }}>{y.l}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BÜLTEN ===== */}
      <section style={{ padding: isMobile ? '56px 20px' : 'clamp(56px,7vw,96px) 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: isMobile ? '32px' : 'clamp(28px,4vw,52px)', color: '#1A0A12', marginBottom: '10px' }}>
          İlk Siparişte <em style={{ fontStyle: 'italic', color: '#E8567A' }}>%10 İndirim</em>
        </h2>
        <p style={{ fontSize: '14px', color: '#7A6070', marginBottom: '24px' }}>Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', maxWidth: '420px', margin: '0 auto', background: 'rgba(26,10,18,.04)', border: '1.5px solid rgba(26,10,18,.1)', borderRadius: '16px', padding: '5px' }}>
          <input type="email" placeholder="E-posta adresiniz" style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 14px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Syne, sans-serif', minWidth: 0 }} />
          <button type="submit" className="btn-primary" style={{ borderRadius: '12px', padding: '10px 18px', flexShrink: 0 }}>Katıl</button>
        </form>
      </section>
    </div>
  )
}
