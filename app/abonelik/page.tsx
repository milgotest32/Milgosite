'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Check, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'

const PLANLAR = [
  { slug: 'baslangic', ad: 'Başlangıç', litre: 2, fiyat: 520, ozellikler: ['2 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi'] },
  { slug: 'aile', ad: 'Aile', litre: 4, fiyat: 980, one: true, ozellikler: ['4 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi', '%5 indirim'] },
  { slug: 'premium', ad: 'Premium', litre: 6, fiyat: 1380, ozellikler: ['6 Litre çiğ süt', 'Haftada bir teslimat', 'İptal garantisi', '%10 indirim', 'Öncelikli teslimat'] },
]

export default function AbonelikPage() {
  const [secili, setSecili] = useState('aile')
  const [form, setForm] = useState({ ad: '', email: '', telefon: '', adres: '', ilce: '' })
  const [basari, setBasari] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)

  const kaydet = async () => {
    const plan = PLANLAR.find(p => p.slug === secili)!
    setYukleniyor(true)
    if (supabase) {
      await supabase.from('site_abonelikler').insert({
        musteri_ad: form.ad, musteri_email: form.email,
        musteri_telefon: form.telefon,
        teslimat_adres: `${form.adres}, ${form.ilce}`,
        plan: secili, haftalik_litre: plan.litre, fiyat: plan.fiyat,
      })
    }
    setBasari(true)
    setYukleniyor(false)
  }

  if (basari) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px', background: '#FDFBF9' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 32px rgba(232,86,122,.3)' }}>
        <Check size={32} color="#fff" />
      </div>
      <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(28px,5vw,44px)', fontWeight: 400, color: '#1A0A12', marginBottom: '12px' }}>Aboneliğiniz Başladı! 🎉</h2>
      <p style={{ color: '#7A6070', fontSize: '15px' }}>Bu Cuma ilk teslimatınız kapınızda olacak.</p>
    </div>
  )

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '20px' }}>
          <RefreshCw size={12} /> Haftalık Abonelik
        </div>
        <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.05, margin: '0 0 12px' }}>
          Her Hafta <em style={{ fontStyle: 'italic', color: '#E8567A' }}>Kapınıza</em>
        </h1>
        <p style={{ color: '#7A6070', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>Taze çiğ sütü her hafta düzenli olarak evinize teslim ediyoruz.</p>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {PLANLAR.map(plan => (
            <div key={plan.slug} onClick={() => setSecili(plan.slug)}
              style={{
                position: 'relative', borderRadius: '24px', padding: '28px 24px', cursor: 'pointer',
                background: '#fff', border: `2px solid ${secili === plan.slug ? '#E8567A' : 'rgba(26,10,18,0.08)'}`,
                boxShadow: secili === plan.slug ? '0 8px 32px rgba(232,86,122,.15)' : '0 2px 12px rgba(26,10,18,.05)',
                transform: secili === plan.slug ? 'translateY(-4px)' : 'none',
                transition: 'all .2s',
              }}>
              {plan.one && (
                <div style={{ position: 'absolute', top: 0, right: '20px', background: '#E8567A', color: '#fff', fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '0 0 12px 12px', fontWeight: 800 }}>
                  Popüler
                </div>
              )}
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${secili === plan.slug ? '#E8567A' : 'rgba(26,10,18,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {secili === plan.slug && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E8567A' }} />}
              </div>
              <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '22px', fontWeight: 400, color: '#1A0A12', margin: '0 0 4px' }}>{plan.ad}</h3>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '36px', color: '#E8567A', lineHeight: 1, margin: '8px 0 2px' }}>₺{plan.fiyat}</div>
              <div style={{ fontSize: '12px', color: '#7A6070', marginBottom: '20px' }}>/ Ay · {plan.litre}L Haftalık</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.ozellikler.map(oz => (
                  <div key={oz} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1A0A12' }}>
                    <Check size={13} color="#E8567A" style={{ flexShrink: 0 }} /> {oz}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: '28px', padding: 'clamp(24px,4vw,48px)', maxWidth: '520px', margin: '0 auto', border: '1px solid rgba(26,10,18,0.07)', boxShadow: '0 4px 24px rgba(26,10,18,.06)' }}>
          <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '26px', fontWeight: 400, color: '#1A0A12', margin: '0 0 24px' }}>Teslimat Bilgileri</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {([['Ad Soyad', 'ad', 'text'], ['E-posta', 'email', 'email'], ['Telefon', 'telefon', 'tel'], ['Adres', 'adres', 'text'], ['İlçe', 'ilce', 'text']] as [string,string,string][]).map(([label, key, type]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '8px', fontWeight: 700 }}>{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  style={{ width: '100%', background: '#FDFBF9', border: '1.5px solid rgba(26,10,18,0.12)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
          <button onClick={kaydet} disabled={yukleniyor}
            style={{ background: yukleniyor ? 'rgba(26,10,18,0.3)' : '#1A0A12', color: '#fff', width: '100%', padding: '16px', borderRadius: '50px', border: 'none', fontSize: '14px', fontWeight: 700, marginTop: '24px', fontFamily: 'inherit', cursor: 'pointer' }}>
            {yukleniyor ? 'İşleniyor...' : 'Aboneliği Başlat'}
          </button>
        </div>
      </div>
    </div>
  )
}
