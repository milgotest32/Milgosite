'use client'
import { useState } from 'react'

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '' })
  const [gonderildi, setGonderildi] = useState(false)

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#fff', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '20px' }}>
          Bize Ulaşın
        </div>
        <h1 style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.05, margin: 0 }}>
          İletişim
        </h1>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>

          {/* Bilgiler */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { emoji: '📞', baslik: 'Telefon', icerik: '(0212) 352 10 76', href: 'tel:02123521076' },
              { emoji: '✉️', baslik: 'E-posta', icerik: 'bilgi@milgo.com.tr', href: 'mailto:bilgi@milgo.com.tr' },
              { emoji: '📍', baslik: 'Adres', icerik: 'Akat Mah. Etiler Nispetiye Cad. No:55/2, Beşiktaş / İstanbul', href: '#' },
              { emoji: '💬', baslik: 'WhatsApp', icerik: 'Hızlı sipariş için WhatsApp', href: 'https://wa.me/902123521076' },
            ].map(item => (
              <a key={item.baslik} href={item.href}
                style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff', border: '1px solid rgba(26,10,18,0.07)', borderRadius: '20px', padding: '20px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(26,10,18,.04)', transition: 'box-shadow .2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(232,86,122,.12)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,10,18,.04)')}>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#E8567A', fontWeight: 800, marginBottom: '4px' }}>{item.baslik}</div>
                  <div style={{ fontSize: '14px', color: '#1A0A12' }}>{item.icerik}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: '#fff', borderRadius: '28px', padding: 'clamp(24px,4vw,40px)', border: '1px solid rgba(26,10,18,0.07)', boxShadow: '0 4px 24px rgba(26,10,18,.06)' }}>
            {gonderildi ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif', fontSize: '22px', fontWeight: 400, color: '#1A0A12', margin: '0 0 8px' }}>Mesajınız Alındı!</h3>
                <p style={{ color: '#7A6070', fontSize: '14px' }}>En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", serif', fontSize: '26px', fontWeight: 400, color: '#1A0A12', margin: '0 0 24px' }}>Bize Yazın</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(['Ad Soyad', 'E-posta', 'Konu'] as const).map(label => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '8px', fontWeight: 700 }}>{label}</label>
                      <input
                        style={{ width: '100%', background: '#FDFBF9', border: '1.5px solid rgba(26,10,18,0.12)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        value={form[label === 'Ad Soyad' ? 'ad' : label === 'E-posta' ? 'email' : 'konu']}
                        onChange={e => setForm({ ...form, [label === 'Ad Soyad' ? 'ad' : label === 'E-posta' ? 'email' : 'konu']: e.target.value })}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#7A6070', marginBottom: '8px', fontWeight: 700 }}>Mesaj</label>
                    <textarea
                      rows={4}
                      style={{ width: '100%', background: '#FDFBF9', border: '1.5px solid rgba(26,10,18,0.12)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                      value={form.mesaj}
                      onChange={e => setForm({ ...form, mesaj: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => setGonderildi(true)}
                    style={{ background: '#1A0A12', color: '#fff', width: '100%', padding: '15px', borderRadius: '50px', border: 'none', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', transition: 'background .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#E8567A')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#1A0A12')}>
                    Gönder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
