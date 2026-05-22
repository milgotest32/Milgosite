'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import type { Urun } from '@/lib/types'
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, Plus, Minus, Check, ChevronRight, Package, MapPin, Send, LogIn } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

interface Props { urun: Urun; benzerler: Urun[] }

export default function UrunDetayClient({ urun, benzerler }: Props) {
  const [aktifGorsel, setAktifGorsel] = useState(0)
  const [adet, setAdet] = useState(1)
  const [eklendi, setEklendi] = useState(false)
  const [favori, setFavori] = useState(false)
  const [yorumlar, setYorumlar] = useState<any[]>([])
  const [aktifTab, setAktifTab] = useState<'aciklama'|'ozellikler'|'yorumlar'>('aciklama')
  const [bolgdeVar, setBolgdeVar] = useState<'var' | 'yok' | 'belirsiz'>('belirsiz')
  const ekle = useSepet(s => s.ekle)

  // Yorum formu
  const [user, setUser] = useState<any>(null)
  const [yorumForm, setYorumForm] = useState({ puan: 5, baslik: '', yorum: '' })
  const [yorumGonderiliyor, setYorumGonderiliyor] = useState(false)
  const [kullaniciYorumYapti, setKullaniciYorumYapti] = useState(false)

  const gorseller = urun.site_product_images || []
  const aktifUrl = gorseller[aktifGorsel]?.url || gorseller[0]?.url || ''
  const indirim = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0
  const ozellikler = urun.ozellikler && typeof urun.ozellikler === 'object' ? urun.ozellikler : {}

  useEffect(() => {
    // Kullanıcı oturumu
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null))
  }, [])

  useEffect(() => {
    // Onaylı yorumları yükle
    supabase.from('site_yorumlar')
      .select('*')
      .eq('product_id', urun.id)
      .eq('onaylı', true)
      .order('created_at', { ascending: false })
      .then(({ data }: any) => setYorumlar(data || []))
  }, [urun.id])

  useEffect(() => {
    // Kullanıcı daha önce yorum yaptı mı?
    if (!user) return
    supabase.from('site_yorumlar')
      .select('id')
      .eq('product_id', urun.id)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setKullaniciYorumYapti(!!data))
  }, [user, urun.id])

  useEffect(() => {
    const kontrol = () => {
      const bolgeId = localStorage.getItem('milgo_bolge_id')
      const hizmet = localStorage.getItem('milgo_hizmet')
      if (hizmet === 'false') { setBolgdeVar('yok'); return }
      if (!bolgeId) { setBolgdeVar('belirsiz'); return }
      if ((urun as any).bolge_ids && Array.isArray((urun as any).bolge_ids)) {
        setBolgdeVar((urun as any).bolge_ids.includes(bolgeId))
      } else {
        setBolgdeVar('var')
      }
    }
    kontrol()
    window.addEventListener('milgo_konum_degisti', kontrol)
    return () => window.removeEventListener('milgo_konum_degisti', kontrol)
  }, [urun])

  const sepeteEkle = () => {
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun, adet)
    setEklendi(true)
    toast.success(`${urun.name} sepete eklendi!`)
    setTimeout(() => setEklendi(false), 2000)
  }

  const yorumGonder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || yorumGonderiliyor) return
    if (!yorumForm.yorum.trim()) { toast.error('Yorum alanı boş bırakılamaz'); return }

    setYorumGonderiliyor(true)
    try {
      const { error } = await supabase.from('site_yorumlar').insert({
        product_id: urun.id,
        user_id: user.id,
        ad: user.user_metadata?.ad || user.email?.split('@')[0] || 'Kullanıcı',
        puan: yorumForm.puan,
        baslik: yorumForm.baslik.trim() || null,
        yorum: yorumForm.yorum.trim(),
        onaylı: false,        // Admin onayına düşer
        verified_purchase: false,
      })
      if (error) throw error
      toast.success('Yorumunuz alındı, onaylandıktan sonra yayınlanacak!')
      setYorumForm({ puan: 5, baslik: '', yorum: '' })
      setKullaniciYorumYapti(true)
    } catch {
      toast.error('Yorum gönderilemedi, tekrar deneyin.')
    } finally {
      setYorumGonderiliyor(false)
    }
  }

  const ortPuan = yorumlar.length ? (yorumlar.reduce((t, y) => t + y.puan, 0) / yorumlar.length).toFixed(1) : null

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF9' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(20px,4vw,48px) clamp(16px,4vw,48px)' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', fontSize: '12px', color: '#7A6070', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#7A6070', textDecoration: 'none' }}>Ana Sayfa</Link>
          <ChevronRight size={12} />
          <Link href="/urunler" style={{ color: '#7A6070', textDecoration: 'none' }}>Ürünler</Link>
          {urun.site_kategoriler && (<><ChevronRight size={12} /><Link href={`/kategoriler/${urun.site_kategoriler.slug}`} style={{ color: '#7A6070', textDecoration: 'none' }}>{urun.site_kategoriler.name}</Link></>)}
          <ChevronRight size={12} />
          <span style={{ color: '#1A0A12', fontWeight: 600 }}>{urun.name}</span>
        </nav>

        {/* Ana ürün grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px,5vw,64px)', alignItems: 'start', marginBottom: '56px' }}>

          {/* Görseller */}
          <div>
            <div style={{ background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', borderRadius: '28px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', marginBottom: '12px', position: 'relative' }}>
              {urun.indirimli && indirim > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#E8567A', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '50px' }}>-%{indirim}</div>
              )}
              {aktifUrl
                ? <img src={aktifUrl} alt={urun.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                : <span style={{ fontSize: '96px' }}>🥛</span>}
            </div>
            {gorseller.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {gorseller.map((g, i) => (
                  <button key={g.id} onClick={() => setAktifGorsel(i)}
                    style={{ width: '68px', height: '68px', borderRadius: '14px', overflow: 'hidden', border: `2px solid ${aktifGorsel === i ? '#E8567A' : 'rgba(26,10,18,.1)'}`, background: 'linear-gradient(135deg,#FEE8EF,#EBF5FC)', cursor: 'inherit', padding: '6px', transition: 'border-color .2s' }}>
                    <img src={g.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {urun.yeni && <span style={{ background: '#EBF5FC', color: '#5BA4CF', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>YENİ</span>}
              {indirim > 0 && <span style={{ background: '#FEE8EF', color: '#E8567A', fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '50px' }}>-%{indirim} İNDİRİM</span>}
              {urun.site_kategoriler && <span style={{ background: 'rgba(26,10,18,.06)', color: '#7A6070', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>{urun.site_kategoriler.name}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.1, marginBottom: '14px' }}>{urun.name}</h1>

            {yorumlar.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(Number(ortPuan)) ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />)}
                </div>
                <span style={{ fontSize: '13px', color: '#7A6070', fontWeight: 600 }}>{ortPuan}</span>
                <span style={{ fontSize: '13px', color: '#7A6070' }}>({yorumlar.length} yorum)</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(34px,5vw,50px)', fontWeight: 400, color: '#1A0A12' }}>₺{urun.fiyat.toFixed(2)}</span>
              {urun.eski_fiyat && <span style={{ fontSize: '18px', color: '#7A6070', textDecoration: 'line-through', marginBottom: '6px' }}>₺{urun.eski_fiyat.toFixed(2)}</span>}
            </div>

            {urun.aciklama && (
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#7A6070', marginBottom: '22px', fontWeight: 400 }}>
                {urun.aciklama}
              </p>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {['🇪🇺 AB Onaylı', '🌿 Doğal', '✓ Katkısız'].map(s => (
                <span key={s} style={{ background: 'rgba(26,10,18,.05)', color: '#1A0A12', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '50px', border: '1px solid rgba(26,10,18,.08)' }}>{s}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(26,10,18,.05)', border: '1.5px solid rgba(26,10,18,.1)', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => setAdet(Math.max(1, adet - 1))} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'inherit', color: '#1A0A12' }}><Minus size={15} /></button>
                <span style={{ width: '40px', textAlign: 'center', fontSize: '16px', fontWeight: 700, color: '#1A0A12' }}>{adet}</span>
                <button onClick={() => setAdet(adet + 1)} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'inherit', color: '#1A0A12' }}><Plus size={15} /></button>
              </div>

              {bolgdeVar === 'yok' ? (
                <div style={{ flex: 1, minWidth: '180px', height: '44px', borderRadius: '50px', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>
                  <MapPin size={15} />Bu bölgede mevcut değil
                </div>
              ) : (
                <button onClick={sepeteEkle} disabled={!!(urun.stok_takip && urun.stok <= 0)}
                  style={{ flex: 1, minWidth: '180px', height: '44px', borderRadius: '50px', border: 'none', fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'inherit', transition: 'all .25s', background: eklendi ? '#22c55e' : '#1A0A12' }}>
                  {eklendi ? <><Check size={15} />Eklendi!</> : <><ShoppingBag size={15} />Sepete Ekle · ₺{(urun.fiyat * adet).toFixed(2)}</>}
                </button>
              )}

              <button onClick={() => setFavori(!favori)}
                style={{ width: '44px', height: '44px', borderRadius: '14px', border: `1.5px solid ${favori ? '#E8567A' : 'rgba(26,10,18,.1)'}`, background: favori ? '#FEE8EF' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'inherit', transition: 'all .2s', flexShrink: 0 }}>
                <Heart size={17} style={{ color: favori ? '#E8567A' : '#7A6070' }} fill={favori ? '#E8567A' : 'none'} />
              </button>
            </div>

            {urun.stok_takip && (
              <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '20px', color: urun.stok > 10 ? '#22c55e' : urun.stok > 0 ? '#f59e0b' : '#ef4444' }}>
                {urun.stok > 10 ? `✓ Stokta var (${urun.stok} adet)` : urun.stok > 0 ? `⚠️ Son ${urun.stok} adet!` : '✕ Stok tükendi'}
              </p>
            )}

            {(urun.site_kategoriler?.slug === 'cig-sut' || urun.site_kategoriler?.slug === 'cig-sut-2' || urun.name?.toLowerCase().includes('çiğ süt')) && (
              <div style={{ background: 'linear-gradient(135deg,#FFF7ED,#FEF3C7)', border: '1px solid #FDE68A', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '22px', flexShrink: 0 }}>🥛</span>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Özel Teslimat Günleri</p>
                  <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.6 }}>
                    Çiğ süt teslimatları yalnızca <strong>Cuma ve Cumartesi</strong> günleri yapılmaktadır. Siparişinizi haftanın herhangi bir günü verebilirsiniz, en yakın teslimat gününde teslim edilir.
                  </p>
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(26,10,18,.04)', borderRadius: '20px', padding: '18px 20px', border: '1px solid rgba(26,10,18,.07)' }}>
              <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '12px' }}>Teslimat & İade</p>
              {[
                { icon: <Truck size={13} />, t: urun.site_kategoriler?.slug === 'cig-sut' || urun.name?.toLowerCase().includes('çiğ süt') ? 'Cuma & Cumartesi teslimat' : 'İstanbul içi aynı gün teslimat' },
                { icon: <ShieldCheck size={13} />, t: 'Soğuk zincir ile güvenli taşıma' },
                { icon: <Package size={13} />, t: 'Özel soğutucu ambalajla gönderim' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#7A6070', marginBottom: i < 2 ? '8px' : 0 }}>
                  <span style={{ color: '#E8567A', flexShrink: 0 }}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(26,10,18,.08)', marginBottom: '28px', overflowX: 'auto' }}>
            {([['aciklama','Açıklama'],['ozellikler','Özellikler'],['yorumlar',`Yorumlar (${yorumlar.length})`]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setAktifTab(key)}
                style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: aktifTab === key ? '#E8567A' : '#7A6070', background: 'none', border: 'none', borderBottom: `2px solid ${aktifTab === key ? '#E8567A' : 'transparent'}`, cursor: 'inherit', fontFamily: 'var(--font-nunito), Nunito, sans-serif', whiteSpace: 'nowrap', transition: 'color .2s', marginBottom: '-1px' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Açıklama */}
          {aktifTab === 'aciklama' && (
            <div style={{ maxWidth: '680px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#7A6070', marginBottom: '20px' }}>{urun.aciklama || 'Bu ürün için açıklama bulunmuyor.'}</p>
              {urun.icerik && <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#7A6070', background: 'rgba(26,10,18,.04)', padding: '16px 20px', borderRadius: '16px', borderLeft: '3px solid #E8567A' }}>{urun.icerik}</p>}
            </div>
          )}

          {/* Özellikler */}
          {aktifTab === 'ozellikler' && (
            <div style={{ maxWidth: '560px' }}>
              {Object.keys(ozellikler).length > 0 ? (
                <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(26,10,18,.08)' }}>
                  {Object.entries(ozellikler).map(([k, v], i) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', background: i % 2 === 0 ? 'rgba(26,10,18,.02)' : '#fff', borderBottom: i < Object.keys(ozellikler).length - 1 ? '1px solid rgba(26,10,18,.06)' : 'none' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.08em', width: '140px', flexShrink: 0 }}>{(k as string).replace(/_/g, ' ')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A0A12' }}>{v as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#7A6070', fontSize: '14px' }}>Özellik bilgisi bulunmuyor.</p>
              )}
            </div>
          )}

          {/* Yorumlar */}
          {aktifTab === 'yorumlar' && (
            <div>
              {/* Mevcut yorumlar */}
              {yorumlar.length === 0 ? (
                <p style={{ color: '#7A6070', fontSize: '14px', marginBottom: '32px' }}>Henüz onaylı yorum yok. İlk yorumu sen yap!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px', marginBottom: '40px' }}>
                  {yorumlar.map(y => (
                    <div key={y.id} style={{ background: '#fff', borderRadius: '20px', padding: '20px', border: '1px solid rgba(26,10,18,.07)' }}>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= y.puan ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />)}
                      </div>
                      {y.baslik && <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A0A12', marginBottom: '6px' }}>{y.baslik}</p>}
                      <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#7A6070', marginBottom: '12px' }}>{y.yorum}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8567A,#5BA4CF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff' }}>{y.ad[0]}</div>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A0A12' }}>{y.ad}</span>
                          {y.verified_purchase && <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600, marginLeft: '6px' }}>✓ Onaylı alıcı</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Yorum formu */}
              <div style={{ background: '#fff', borderRadius: '24px', padding: '28px', border: '1px solid rgba(26,10,18,.08)', maxWidth: '560px' }}>
                <h3 style={{ fontFamily: 'var(--font-nunito),sans-serif', fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginBottom: '20px' }}>
                  Yorum Yaz
                </h3>

                {!user ? (
                  /* Giriş yapmamış */
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ fontSize: '14px', color: '#7A6070', marginBottom: '16px' }}>Yorum yazmak için giriş yapmanız gerekiyor.</p>
                    <Link href="/giris"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A0A12', color: '#fff', padding: '10px 22px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                      <LogIn size={15} /> Giriş Yap
                    </Link>
                  </div>
                ) : kullaniciYorumYapti ? (
                  /* Daha önce yorum yapılmış */
                  <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                    <p style={{ fontSize: '13px', color: '#166534', fontWeight: 600, margin: 0 }}>
                      Bu ürün için yorumunuz alındı, onaylandıktan sonra yayınlanacak.
                    </p>
                  </div>
                ) : (
                  /* Yorum formu */
                  <form onSubmit={yorumGonder}>
                    {/* Puan seçimi */}
                    <div style={{ marginBottom: '18px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '10px' }}>Puanınız</p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setYorumForm(f => ({ ...f, puan: s }))}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                            <Star size={28} fill={s <= yorumForm.puan ? '#FBBF24' : 'none'} style={{ color: '#FBBF24', transition: 'all .15s' }} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Başlık */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: '8px' }}>
                        Başlık <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none' }}>(isteğe bağlı)</span>
                      </label>
                      <input
                        type="text"
                        value={yorumForm.baslik}
                        onChange={e => setYorumForm(f => ({ ...f, baslik: e.target.value }))}
                        maxLength={80}
                        placeholder="Kısaca özetleyin..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid rgba(26,10,18,.12)', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'var(--font-nunito),sans-serif', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Yorum metni */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: '8px' }}>
                        Yorumunuz <span style={{ color: '#E8567A' }}>*</span>
                      </label>
                      <textarea
                        required
                        value={yorumForm.yorum}
                        onChange={e => setYorumForm(f => ({ ...f, yorum: e.target.value }))}
                        maxLength={600}
                        rows={4}
                        placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid rgba(26,10,18,.12)', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'var(--font-nunito),sans-serif', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                      />
                      <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', textAlign: 'right' }}>{yorumForm.yorum.length}/600</p>
                    </div>

                    <button type="submit" disabled={yorumGonderiliyor}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: yorumGonderiliyor ? '#9CA3AF' : '#1A0A12', color: '#fff', border: 'none', borderRadius: '12px', padding: '11px 22px', fontSize: '13px', fontWeight: 700, cursor: yorumGonderiliyor ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-nunito),sans-serif', transition: 'background .2s' }}>
                      <Send size={14} />
                      {yorumGonderiliyor ? 'Gönderiliyor…' : 'Yorumu Gönder'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Benzer Ürünler */}
        {benzerler.length > 0 && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="sec-tag">Benzer Ürünler</span>
              <h2 className="sec-h" style={{ marginBottom: 0 }}>Bunları da <em>Sevebilirsiniz</em></h2>
            </div>
            <div className="prod-grid">
              {benzerler.map(u => <ProductCard key={u.id} urun={u} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
