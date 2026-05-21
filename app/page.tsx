'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import type { Urun } from '@/lib/types'
import { Check, ArrowRight, RefreshCw, Star } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'

// Ana sayfa varsayılan metinleri
const VARSAYILAN: Record<string, string> = {
  // Hero
  hero_rozet: 'Çiftliğimizden Sofranıza',
  hero_baslik_1: 'Mutluluğun',
  hero_baslik_2: 'Tadını',
  hero_baslik_3: 'Hissedin',
  hero_aciklama: "ATASANCAK Çiftliği'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. Doğal, katkısız.",
  hero_btn_siparis: 'Hemen Sipariş Ver',
  hero_btn_abonelik: 'Abonelik',
  hero_stat_1_sayi: '10.5K',
  hero_stat_1_etiket: 'Büyükbaş',
  hero_stat_2_sayi: '✓',
  hero_stat_2_etiket: 'Katkısız',
  hero_stat_3_sayi: 'AB',
  hero_stat_3_etiket: 'Onaylı',
  hero_kart_1_emoji: '🥛',
  hero_kart_1_ad: 'Çiğ Süt 2L',
  hero_kart_1_alt: '₺130',
  hero_kart_2_emoji: '⭐',
  hero_kart_2_ad: '4.9/5 Puan',
  hero_kart_2_alt: '500+ Yorum',
  hero_gorsel_url: 'https://market.milgo.com.tr/cdn/shop/files/Milgo_UrunGorselleri_CigSut_1260x1600px_1.jpg',

  // Ticker
  ticker_1: 'Çiğ Süt',  ticker_1b: 'Günlük Taze',
  ticker_2: 'Peynir',   ticker_2b: '5 Çeşit',
  ticker_3: 'Tereyağı', ticker_3b: 'Katkısız',
  ticker_4: 'Abonelik', ticker_4b: 'Her Cuma',
  ticker_5: 'AB Onaylı',ticker_5b: 'Sertifikalı',
  ticker_6: 'İstanbul', ticker_6b: 'Aynı Gün',

  // Kategoriler
  kategoriler_tag: 'Kategoriler',
  kategoriler_baslik: 'Doğallığı',
  kategoriler_baslik_italik: 'Keşfedin',
  kat_1_etiket: 'En Çok Satan', kat_1_ad: 'Çiğ İnek Sütü',
  kat_2_etiket: 'Peynir',       kat_2_ad: 'Sürülebilir Peynir',
  kat_3_etiket: 'Tereyağı',     kat_3_ad: 'Doğal Tereyağı',
  kat_4_etiket: 'Özel',         kat_4_ad: 'Abonelik',

  // Ürünler
  urunler_tag: 'En Çok Satanlar',
  urunler_baslik: 'Çok',
  urunler_baslik_italik: 'Sevilenler',
  urunler_tumu: 'Tümünü Gör',

  // Paketler
  paketler_tag: '🎁 Özel Fırsatlar',
  paketler_baslik: 'Hazır Paketlerimiz',
  paketler_tumu: 'Tümünü Gör →',

  // Abonelik
  abonelik_tag: '⟳ Haftalık Abonelik',
  abonelik_baslik: 'Her Hafta Taze,',
  abonelik_baslik_italik: 'Hiç Düşünmeden',
  abonelik_madde_1: 'İstediğiniz zaman iptal',
  abonelik_madde_2: 'Miktarı değiştirme',
  abonelik_madde_3: 'Her Cuma teslimat',
  abonelik_madde_4: 'Abonelere %10 indirim',
  abonelik_btn: 'Abonelik Başlat',
  abonelik_plan_1_ad: 'Başlangıç', abonelik_plan_1_detay: '2L · Haftada Bir', abonelik_plan_1_fiyat: '520',
  abonelik_plan_2_ad: 'Aile',      abonelik_plan_2_detay: '4L · Haftada Bir', abonelik_plan_2_fiyat: '980',
  abonelik_plan_3_ad: 'Premium',   abonelik_plan_3_detay: '6L · Haftada Bir', abonelik_plan_3_fiyat: '1.380',

  // Yorumlar
  yorumlar_tag: 'Müşterilerimiz',
  yorumlar_baslik: 'Sizden',
  yorumlar_baslik_italik: 'Gelenler',
  yorum_1_harf: 'E', yorum_1_ad: 'Ebru G.', yorum_1_lokasyon: 'Beşiktaş, İstanbul',
  yorum_1_metin: '\"Sütün tadı gerçekten çok farklı. Marketten alışkanlığım gitti, artık sadece Milgo.\"',
  yorum_2_harf: 'H', yorum_2_ad: 'Hatice B.', yorum_2_lokasyon: 'Kadıköy · Abonelik',
  yorum_2_metin: '\"3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem!\"',
  yorum_3_harf: 'M', yorum_3_ad: 'Mehmet K.', yorum_3_lokasyon: 'Şişli, İstanbul',
  yorum_3_metin: '\"Çocuklar için doğal süt arıyordum. AB onaylı olması güven veriyor.\"',

  // Bülten
  bulten_baslik: 'İlk Siparişte',
  bulten_baslik_italik: '%10 İndirim',
  bulten_aciklama: 'Bültene katılın, özel tekliflerden ilk siz haberdar olun.',
  bulten_placeholder: 'E-posta adresiniz',
  bulten_btn: 'Katıl',
}

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])
  const [paketler, setPaketler] = useState<any[]>([])
  const [ic, setIc] = useState<Record<string, string>>(VARSAYILAN)

  const urunleriYukle = () => {
    const bolgeId = localStorage.getItem('milgo_bolge_id')
    const hizmet = localStorage.getItem('milgo_hizmet')
    if (hizmet === 'false') { setUrunler([]); return }

    supabase.from('site_products')
      .select('*, site_product_images(*), site_kategoriler(name,slug)')
      .eq('durum', 'active').order('created_at', { ascending: false }).limit(8)
      .then(({ data }: any) => {
        let tumUrunler = data || []
        if (bolgeId) {
          tumUrunler = tumUrunler.filter((u: any) =>
            u.bolge_ids && u.bolge_ids.includes(bolgeId)
          )
        } else {
          tumUrunler = []
        }
        setUrunler(tumUrunler)
      })
  }

  useEffect(() => {
    // Ana sayfa içeriklerini yükle
    supabase.from('site_ayarlar').select('*').eq('grup', 'anasayfa').then(({ data }) => {
      if (data && data.length > 0) {
        const icerik: Record<string, string> = { ...VARSAYILAN }
        data.forEach((row: any) => { icerik[row.anahtar] = row.deger || '' })
        setIc(icerik)
      }
    })

    urunleriYukle()
    window.addEventListener('milgo_konum_degisti', urunleriYukle)
    supabase.from('site_paketler')
      .select('*, site_paket_urunleri(adet, site_products(id,name,slug,fiyat,site_product_images(*)))')
      .eq('aktif', true)
      .order('one_cikan', { ascending: false })
      .then(({ data }: any) => setPaketler(data || []))
    return () => window.removeEventListener('milgo_konum_degisti', urunleriYukle)
  }, [])

  const t = (k: string) => ic[k] ?? VARSAYILAN[k] ?? ''

  const featured = urunler.filter(u => u.featured).slice(0, 4)
  const goster = featured.length ? featured : urunler.slice(0, 4)

  return (
    <div style={{ background: '#FDFBF9', overflowX: 'hidden' }}>

      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="blob blob-p" style={{ width: '400px', height: '400px', top: '-80px', left: '-80px' }} />
        <div className="blob blob-b" style={{ width: '300px', height: '300px', bottom: '-60px', right: '-60px' }} />

        <div className="hero-grid" style={{ position: 'relative', zIndex: 2, minHeight: '88vh' }}>

          {/* Sol — metin */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px,6vw,80px) clamp(20px,5vw,64px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEE8EF', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '24px', width: 'fit-content' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8567A', animation: 'pulse 2s ease infinite', display: 'inline-block' }} />
              {t('hero_rozet')}
            </div>

            <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: .95, color: '#1A0A12', marginBottom: '20px', letterSpacing: '-.02em' }}>
              {t('hero_baslik_1')}<br />
              <em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400', fontSize: '1.1em' }}>{t('hero_baslik_2')}</em><br />
              <span>{t('hero_baslik_3')}</span>
            </h1>

            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#7A6070', maxWidth: '380px', marginBottom: '32px' }}>
              {t('hero_aciklama')}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/urunler" className="btn-dark">{t('hero_btn_siparis')}</Link>
              <Link href="/abonelik" className="btn-outline"><RefreshCw size={14} />{t('hero_btn_abonelik')}</Link>
            </div>

            <div style={{ display: 'flex', gap: '28px', paddingTop: '24px', borderTop: '1px solid rgba(26,10,18,.08)', flexWrap: 'wrap' }}>
              {[
                [t('hero_stat_1_sayi'), t('hero_stat_1_etiket')],
                [t('hero_stat_2_sayi'), t('hero_stat_2_etiket')],
                [t('hero_stat_3_sayi'), t('hero_stat_3_etiket')],
              ].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '32px', color: '#E8567A', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: '11px', color: '#7A6070', marginTop: '4px', fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — masaüstünde görsel */}
          <div className="hero-right-desktop" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '0 0 0 80px', overflow: 'hidden', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)' }}>
                <img src={t('hero_gorsel_url')} alt="Milgo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '32px', animation: 'float 6s ease-in-out infinite', mixBlendMode: 'multiply' }} />
              </div>
            </div>
            {/* Float kartlar */}
            {[
              { style: { top: '15%', left: '-14px' }, emoji: t('hero_kart_1_emoji'), ad: t('hero_kart_1_ad'), alt: t('hero_kart_1_alt'), altColor: '#E8567A', delay: '0s' },
              { style: { bottom: '20%', right: '-10px' }, emoji: t('hero_kart_2_emoji'), ad: t('hero_kart_2_ad'), alt: t('hero_kart_2_alt'), altColor: '#7A6070', delay: '1.5s' },
            ].map((k, i) => (
              <div key={i} style={{ position: 'absolute', ...k.style, background: '#fff', borderRadius: '20px', padding: '12px 16px', boxShadow: '0 8px 32px rgba(26,10,18,.12)', zIndex: 3, animation: `float 4s ease-in-out ${k.delay} infinite` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEE8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{k.emoji}</div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1A0A12' }}>{k.ad}</div>
                    <div style={{ fontSize: '11px', color: k.altColor, fontWeight: 600 }}>{k.alt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobil görsel */}
          <div className="hero-right-mobile" style={{ background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', alignItems: 'center', justifyContent: 'center', padding: '24px', minHeight: '220px' }}>
            <img src={t('hero_gorsel_url')} alt="Milgo"
              style={{ width: '55%', maxWidth: '200px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </div>
        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className="ticker">
        <div className="tick-inner">
          {[...Array(2)].map((_, rep) =>
            [
              [t('ticker_1'), t('ticker_1b')],
              [t('ticker_2'), t('ticker_2b')],
              [t('ticker_3'), t('ticker_3b')],
              [t('ticker_4'), t('ticker_4b')],
              [t('ticker_5'), t('ticker_5b')],
              [t('ticker_6'), t('ticker_6b')],
            ].map(([a, b], i) => (
              <div key={`${rep}-${i}`} className="tick-item"><strong>{a}</strong><span className="tick-dot">✦</span>{b}</div>
            ))
          )}
        </div>
      </div>

      {/* ===== KATEGORİLER ===== */}
      <section style={{ padding: 'clamp(32px,5vw,72px) clamp(16px,4vw,64px) clamp(16px,3vw,32px)', maxWidth: '1400px', margin: '0 auto' }}>
        <span className="sec-tag">{t('kategoriler_tag')}</span>
        <h2 className="sec-h">{t('kategoriler_baslik')} <em>{t('kategoriler_baslik_italik')}</em></h2>

        <div className="cat-grid">
          {[
            { bg: 'linear-gradient(135deg,#FEE8EF,#FBCFE8)', emoji: '🥛', lbl: t('kat_1_etiket'), ad: t('kat_1_ad'), href: '/kategoriler/cig-sut', first: true },
            { bg: 'linear-gradient(135deg,#EBF5FC,#BFDBFE)', emoji: '🧀', lbl: t('kat_2_etiket'), ad: t('kat_2_ad'), href: '/kategoriler/peynir', first: false },
            { bg: 'linear-gradient(135deg,#F0FDF4,#BBF7D0)', emoji: '🧈', lbl: t('kat_3_etiket'), ad: t('kat_3_ad'), href: '/kategoriler/tereyagi', first: false },
            { bg: 'linear-gradient(135deg,#FFF7ED,#FED7AA)', emoji: '🔄', lbl: t('kat_4_etiket'), ad: t('kat_4_ad'), href: '/abonelik', first: false },
          ].map((k) => (
            <Link key={k.href} href={k.href}
              className={`card-2026${k.first ? ' cat-first' : ''}`}
              style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: k.bg, minHeight: '180px', height: '100%', display: 'flex', alignItems: 'flex-end', padding: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '36px' }}>{k.emoji}</div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '4px' }}>{k.lbl}</div>
                  <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '20px', color: '#1A0A12', marginBottom: '12px' }}>{k.ad}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#1A0A12', color: '#fff', padding: '7px 16px', borderRadius: '50px', fontSize: '11px', fontWeight: 700 }}>İncele →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ÜRÜNLER ===== */}
      <section style={{ padding: 'clamp(16px,3vw,32px) clamp(16px,4vw,64px) clamp(32px,5vw,56px)', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span className="sec-tag">{t('urunler_tag')}</span>
            <h2 className="sec-h" style={{ marginBottom: 0 }}>{t('urunler_baslik')} <em>{t('urunler_baslik_italik')}</em></h2>
          </div>
          <Link href="/urunler" style={{ fontSize: '13px', fontWeight: 700, color: '#E8567A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            {t('urunler_tumu')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="prod-grid">
          {goster.map(u => <ProductCard key={u.id} urun={u} />)}
        </div>
      </section>

      {/* Hazır Paketler */}
      {paketler.length > 0 && (
        <section style={{ padding: 'clamp(32px,5vw,72px) clamp(16px,4vw,64px)', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase' as const, color: '#E8567A', display: 'block', marginBottom: '6px' }}>{t('paketler_tag')}</span>
              <h2 style={{ fontFamily: 'var(--font-cormorant),serif', fontSize: 'clamp(28px,4vw,44px)', color: '#1A0A12', margin: 0 }}>{t('paketler_baslik')}</h2>
            </div>
            <a href="/paketler" style={{ fontSize: '13px', fontWeight: 700, color: '#E8567A', textDecoration: 'none' }}>{t('paketler_tumu')}</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '16px' }}>
            {paketler.slice(0, 4).map((p: any) => {
              const kalemler = p.site_paket_urunleri || []
              const ayriToplam = kalemler.reduce((t: number, k: any) => t + (k.site_products?.fiyat || 0) * k.adet, 0)
              const tasarruf = ayriToplam - p.fiyat
              const yuzde = ayriToplam > 0 ? Math.round((tasarruf / ayriToplam) * 100) : 0
              return (
                <a key={p.id} href={`/paketler/${p.slug}`} style={{ textDecoration: 'none', background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F0ECF5', display: 'block', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  {p.gorsel_url ? (
                    <img src={p.gorsel_url} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>🎁</div>
                  )}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontFamily: 'var(--font-nunito),sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A0A12', marginBottom: '6px' }}>{p.name}</h3>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '10px' }}>
                      {kalemler.map((k: any) => `${k.site_products?.name} ×${k.adet}`).join(' + ')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {tasarruf > 0 && <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through', display: 'block' }}>₺{ayriToplam.toFixed(2)}</span>}
                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#1A0A12' }}>₺{p.fiyat.toFixed(2)}</span>
                      </div>
                      {yuzde > 0 && <span style={{ background: '#F0FDF4', color: '#22C55E', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '50px' }}>%{yuzde} indirim</span>}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* ===== ABONELİK ===== */}
      <section style={{ margin: '0 clamp(12px,3vw,48px) clamp(40px,6vw,72px)', borderRadius: '32px', overflow: 'hidden', background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', position: 'relative' }}>
        <div className="blob blob-p" style={{ width: '280px', height: '280px', top: '-60px', right: '-40px', opacity: .4 }} />
        <div className="banner-grid" style={{ padding: 'clamp(28px,5vw,64px)', position: 'relative', zIndex: 2 }}>

          {/* Sol — başlık */}
          <div>
            <span className="sec-tag">{t('abonelik_tag')}</span>
            <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(24px,4vw,44px)', color: '#1A0A12', lineHeight: 1.1, marginBottom: '16px' }}>
              {t('abonelik_baslik')}<br /><em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400', fontSize: '1.1em' }}>{t('abonelik_baslik_italik')}</em>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[t('abonelik_madde_1'), t('abonelik_madde_2'), t('abonelik_madde_3'), t('abonelik_madde_4')].filter(Boolean).map(o => (
                <div key={o} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1A0A12', fontWeight: 500 }}>
                  <div style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', background: '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} color="#fff" />
                  </div>
                  {o}
                </div>
              ))}
            </div>
            <Link href="/abonelik" className="btn-dark">{t('abonelik_btn')} <ArrowRight size={14} /></Link>
          </div>

          {/* Sağ — planlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { a: t('abonelik_plan_1_ad'), d: t('abonelik_plan_1_detay'), f: t('abonelik_plan_1_fiyat'), hot: false },
              { a: t('abonelik_plan_2_ad'), d: t('abonelik_plan_2_detay'), f: t('abonelik_plan_2_fiyat'), hot: true },
              { a: t('abonelik_plan_3_ad'), d: t('abonelik_plan_3_detay'), f: t('abonelik_plan_3_fiyat'), hot: false },
            ].map(p => (
              <div key={p.a} style={{
                background: 'rgba(255,255,255,.92)', borderRadius: '18px', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: `2px solid ${p.hot ? '#E8567A' : 'transparent'}`,
                boxShadow: p.hot ? '0 4px 20px rgba(232,86,122,.15)' : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '18px', color: '#1A0A12', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {p.a}
                    {p.hot && <span style={{ fontSize: '9px', fontWeight: 800, background: '#E8567A', color: '#fff', padding: '3px 10px', borderRadius: '50px', letterSpacing: '.08em', fontFamily: 'Nunito, sans-serif' }}>POPÜLER</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#7A6070', marginTop: '2px' }}>{p.d}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '26px', color: '#E8567A', lineHeight: 1 }}>₺{p.f}</div>
                  <div style={{ fontSize: '10px', color: '#7A6070' }}>/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YORUMLAR ===== */}
      <section style={{ padding: 'clamp(40px,6vw,72px) clamp(16px,4vw,64px)', background: '#1A0A12' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(244,167,185,.15)', color: '#F4A7B9', fontSize: '10px', fontWeight: 800, letterSpacing: '.25em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', marginBottom: '12px' }}>{t('yorumlar_tag')}</span>
            <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(24px,4vw,44px)', color: '#fff' }}>{t('yorumlar_baslik')} <em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400', fontSize: '1.1em' }}>{t('yorumlar_baslik_italik')}</em></h2>
          </div>
          <div className="rev-grid">
            {[
              { h: t('yorum_1_harf'), a: t('yorum_1_ad'), l: t('yorum_1_lokasyon'), metin: t('yorum_1_metin') },
              { h: t('yorum_2_harf'), a: t('yorum_2_ad'), l: t('yorum_2_lokasyon'), metin: t('yorum_2_metin') },
              { h: t('yorum_3_harf'), a: t('yorum_3_ad'), l: t('yorum_3_lokasyon'), metin: t('yorum_3_metin') },
            ].map(y => (
              <div key={y.a} style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '24px', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#FBBF24" style={{ color: '#FBBF24' }} />)}
                </div>
                <p style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,.85)', marginBottom: '18px' }}>{y.metin}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8567A,#5BA4CF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '13px' }}>{y.h}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{y.a}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)' }}>{y.l}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BÜLTEN ===== */}
      <section style={{ padding: 'clamp(48px,7vw,88px) clamp(20px,4vw,48px)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(24px,4vw,48px)', color: '#1A0A12', marginBottom: '10px' }}>
          {t('bulten_baslik')} <em style={{ fontStyle: 'italic', color: '#E8567A', fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif", fontWeight: '400', fontSize: '1.1em' }}>{t('bulten_baslik_italik')}</em>
        </h2>
        <p style={{ fontSize: '14px', color: '#7A6070', marginBottom: '24px' }}>{t('bulten_aciklama')}</p>
        <form onSubmit={e => e.preventDefault()}
          style={{ display: 'flex', maxWidth: '420px', margin: '0 auto', background: 'rgba(26,10,18,.04)', border: '1.5px solid rgba(26,10,18,.1)', borderRadius: '16px', padding: '5px' }}>
          <input type="email" placeholder={t('bulten_placeholder')}
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 14px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Nunito, sans-serif', minWidth: 0 }} />
          <button type="submit" className="btn-primary" style={{ borderRadius: '12px', padding: '10px 18px', flexShrink: 0, fontSize: '13px' }}>{t('bulten_btn')}</button>
        </form>
      </section>
    </div>
  )
}
