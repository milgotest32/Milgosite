'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Check, RefreshCw, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

const PLANLAR = [
  { slug: 'baslangic', ad: 'Başlangıç', litre: 2, fiyat: 520, ozellikler: ['2 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi'] },
  { slug: 'aile', ad: 'Aile', litre: 4, fiyat: 980, one: true, ozellikler: ['4 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi', '%5 indirim'] },
  { slug: 'premium', ad: 'Premium', litre: 6, fiyat: 1380, ozellikler: ['6 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi', '%10 indirim', 'Öncelikli teslimat'] },
]

export default function AbonelikClient() {
  const [secili, setSecili] = useState('aile')
  const [form, setForm] = useState({ ad: '', email: '', telefon: '', adres: '', ilce: '' })
  const [userId, setUserId] = useState<string | null>(null)
  const [sezon, setSezon] = useState<any>(null)
  const [onkayitEmail, setOnkayitEmail] = useState('')
  const [onkayitDurum, setOnkayitDurum] = useState<'bos'|'gonderiliyor'|'tamam'>('bos')
  const [kapasite, setKapasite] = useState<{ aktif: boolean; planlar?: any[] }>({ aktif: false })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (!user) return
      setUserId(user.id)
      supabase.from('site_users').select('ad,soyad,telefon').eq('id', user.id).single().then(({ data }: any) => {
        if (data) setForm((f: any) => ({ ...f, ad: `${data.ad || ''} ${data.soyad || ''}`.trim(), email: user.email || '', telefon: data.telefon || '' }))
        else setForm((f: any) => ({ ...f, email: user.email || '' }))
      })
    })
  }, [])
  useEffect(() => {
    fetch('/api/sezon').then(r => r.json()).then(setSezon).catch(() => {})
    fetch('/api/kapasite').then(r => r.json()).then(data => setKapasite(data)).catch(() => {})
  }, [])

  const [basari, setBasari] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const kaydet = async () => {
    if (!form.ad || !form.email || !form.telefon || !form.adres || !form.ilce) {
      setHata('Lütfen tüm alanları doldurun.'); return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setHata('Geçerli bir e-posta adresi girin.'); return
    }
    setHata('')
    const plan = PLANLAR.find(p => p.slug === secili)!
    setYukleniyor(true)

    // Kapasite sistemi açıksa güncel fiyatı kilitle
    const kapasiePlani = kapasite.aktif ? kapasite.planlar?.find((p: any) => p.plan === secili) : null
    const guncelFiyat = kapasiePlani ? kapasiePlani.guncelFiyat : plan.fiyat
    const rezervasyonAyi = kapasite.aktif && kapasite.planlar ? new Date().toISOString().slice(0, 7) : null

    await supabase.from('site_abonelikler').insert({
      musteri_id: userId || undefined,
      musteri_ad: form.ad, musteri_email: form.email,
      musteri_telefon: form.telefon,
      teslimat_adres: `${form.adres}, ${form.ilce}`,
      plan: secili, haftalik_litre: plan.litre, fiyat: guncelFiyat,
      kilitli_fiyat: kapasite.aktif ? guncelFiyat : null,
      rezervasyon_ayi: rezervasyonAyi,
    })

    // n8n webhook bildirimi
    try {
      const { data: whData } = await supabase.from('site_ayarlar').select('deger').eq('grup','webhook').eq('anahtar','abonelik_webhook_url').single()
      const webhookUrl = whData?.deger
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ad: form.ad,
            email: form.email,
            telefon: form.telefon,
            adres: `${form.adres}, ${form.ilce}`,
            plan: plan.ad,
            haftalik_litre: plan.litre,
            aylik_fiyat: plan.fiyat,
            kayit_tarihi: new Date().toISOString(),
          })
        })
      }
    } catch { /* webhook hatası aboneliği engellemesin */ }

    setBasari(true)
    setYukleniyor(false)
  }

  if (basari) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px', background: '#FDFBF9' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 32px rgba(232,86,122,.3)' }}>
        <Check size={32} color="#fff" />
      </div>
      <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 400, color: '#1A0A12', marginBottom: '12px' }}>Aboneliğiniz Başladı! 🎉</h2>
      <p style={{ color: '#7A6070', fontSize: '15px' }}>Bu Cuma ilk teslimatınız kapınızda olacak.</p>
    </div>
  )

  const inpStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.1)',
    borderRadius: '14px', padding: '13px 16px', fontSize: '14px', color: '#1A0A12',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
  }

  const onkayitGonder = async () => {
    if (!onkayitEmail || !onkayitEmail.includes('@')) return
    setOnkayitDurum('gonderiliyor')
    const r = await fetch('/api/sezon-onkayit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: onkayitEmail })
    })
    const d = await r.json()
    if (d.ok) setOnkayitDurum('tamam')
    else setOnkayitDurum('bos')
  }

  // Sezon kapalıysa ön kayıt ekranı göster
  if (sezon && !sezon.sezon_aktif) {
    return (
      <div style={{ maxWidth: '560px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🥛</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontSize: 'clamp(28px,5vw,40px)', color: '#1A0A12', marginBottom: '12px' }}>
          Çiğ Süt Sezonu Kapalı
        </h1>
        <p style={{ fontSize: '15px', color: '#7A6070', marginBottom: '32px', lineHeight: 1.6 }}>
          {sezon.kapali_mesaj}
        </p>
        {sezon.onkayit_aktif && (
          onkayitDurum === 'tamam' ? (
            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '20px', fontSize: '15px', color: '#166534', fontWeight: 600 }}>
              ✓ Kaydınız alındı! Sezon açılınca size haber vereceğiz.
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '14px', color: '#7A6070', marginBottom: '12px' }}>Sezon açılınca haber almak ister misiniz?</p>
              <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
                <input value={onkayitEmail} onChange={e => setOnkayitEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  style={{ flex: 1, background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '14px 20px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={onkayitGonder} disabled={onkayitDurum === 'gonderiliyor'}
                  style={{ background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}>
                  {onkayitDurum === 'gonderiliyor' ? '...' : 'Haber Ver'}
                </button>
              </div>
            </div>
          )
        )}
      </div>
    )
  }

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <style>{`
        .abo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .abo-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media(max-width:768px){ .abo-grid{grid-template-columns:1fr;} .abo-form-grid{grid-template-columns:1fr;} }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '20px' }}>
          <RefreshCw size={12} /> Haftalık Abonelik
        </div>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.05, margin: '0 0 12px' }}>
          Her Hafta Taze Süt
        </h1>
        <p style={{ color: '#7A6070', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>Çiftlikten kapınıza, haftada bir otomatik teslimat. İstediğiniz zaman iptal.</p>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) 16px' }}>
        {/* Planlar */}
        <div className="abo-grid" style={{ marginBottom: '40px' }}>
          {PLANLAR.map(plan => (
            <div key={plan.slug} onClick={() => setSecili(plan.slug)}
              style={{ background: '#fff', borderRadius: '24px', padding: '28px 24px', cursor: 'pointer', border: `2px solid ${secili===plan.slug?'#E8567A':'rgba(26,10,18,0.08)'}`, position: 'relative', transition: 'all .2s', boxShadow: secili===plan.slug?'0 8px 32px rgba(232,86,122,0.15)':'none' }}>
              {plan.one && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#E8567A', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '4px 14px', borderRadius: '50px', whiteSpace: 'nowrap' }}>EN POPÜLER</div>}
              <h3 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '22px', color: '#1A0A12', marginBottom: '4px' }}>{plan.ad}</h3>
              <p style={{ fontSize: '13px', color: '#7A6070', marginBottom: '16px' }}>{plan.litre}L / hafta</p>
              {(() => {
                const kp = kapasite.aktif ? kapasite.planlar?.find((p: any) => p.plan === plan.slug) : null
                return (
                  <>
                    <p style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '32px', color: '#1A0A12', marginBottom: kp ? '8px' : '20px' }}>
                      ₺{kp ? kp.guncelFiyat : plan.fiyat}<span style={{ fontSize: '13px', color: '#7A6070' }}>/ay</span>
                    </p>
                    {kp && !kp.dolu && (
                      <div style={{ marginBottom: '16px' }}>
                        {/* Doluluk çubuğu */}
                        <div style={{ background: '#F3F4F6', borderRadius: '99px', height: '6px', marginBottom: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '99px', width: `${kp.dolulukYuzde}%`, background: kp.dolulukYuzde > 80 ? '#E8567A' : kp.dolulukYuzde > 50 ? '#F59E0B' : '#22C55E', transition: 'width 0.5s' }} />
                        </div>
                        <p style={{ fontSize: '11px', color: '#7A6070', margin: 0 }}>
                          {kp.dolulukYuzde}% dolu · {kp.kalan} yer kaldı
                          {kp.sonrakiFiyat && kp.sonrakiKalan && (
                            <span style={{ color: '#E8567A', fontWeight: 700 }}> · {kp.sonrakiKalan} sonra ₺{kp.sonrakiFiyat}</span>
                          )}
                        </p>
                      </div>
                    )}
                    {kp?.dolu && (
                      <div style={{ marginBottom: '16px', background: '#FEE8EF', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', color: '#E8567A', fontWeight: 700 }}>
                        Bu ay doldu — gelecek aya kayıt alınıyor
                      </div>
                    )}
                  </>
                )
              })()}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.ozellikler.map(o => (
                  <div key={o} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1A0A12' }}>
                    <Check size={14} style={{ color: '#E8567A', flexShrink: 0 }} /> {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: '28px', padding: 'clamp(24px,4vw,40px)', border: '1px solid rgba(26,10,18,0.07)', boxShadow: '0 4px 24px rgba(26,10,18,.06)' }}>
          <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '24px', color: '#1A0A12', marginBottom: '24px' }}>Teslimat Bilgileri</h2>
          {hata && <div style={{ background: '#FEE8EF', border: '1px solid #F4A7B9', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#E8567A', fontWeight: 600 }}>{hata}</div>}
          <div className="abo-form-grid" style={{ marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>Ad Soyad *</label>
              <input value={form.ad} onChange={e => set('ad', e.target.value)} placeholder="Adınız Soyadınız" style={inpStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>E-posta *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ornek@email.com" style={inpStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>Telefon *</label>
              <input type="tel" value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="0532 xxx xx xx" style={inpStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>İlçe *</label>
              <input value={form.ilce} onChange={e => set('ilce', e.target.value)} placeholder="Beşiktaş" style={inpStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>Teslimat Adresi *</label>
            <textarea value={form.adres} onChange={e => set('adres', e.target.value)} placeholder="Mahalle, sokak, bina no, daire no..."
              style={{ ...inpStyle, resize: 'none', height: '80px' }} />
          </div>
          <button onClick={kaydet} disabled={yukleniyor}
            style={{ width: '100%', background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: yukleniyor ? 0.7 : 1 }}>
            {yukleniyor ? 'Kaydediliyor...' : (() => {
              const kp = kapasite.aktif ? kapasite.planlar?.find((p: any) => p.plan === secili) : null
              if (kp?.dolu) return 'Gelecek Aya Kayıt Ol →'
              if (kp) return `₺${kp.guncelFiyat} Fiyatı Kilitle →`
              return `${PLANLAR.find(p=>p.slug===secili)?.ad} Planı Başlat →`
            })()}
          </button>
        </div>
      </div>
    </div>
  )
}
