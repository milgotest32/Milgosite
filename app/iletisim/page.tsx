'use client'
import { useState } from 'react'

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', email: '', konu: '', mesaj: '' })
  const [gonderildi, setGonderildi] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ad || !form.email || !form.mesaj) { setHata('Lütfen tüm alanları doldurun.'); return }
    setYukleniyor(true)
    setHata('')
    try {
      const r = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Gönderim başarısız')
      setGonderildi(true)
    } catch (err: any) {
      setHata(err.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    }
    setYukleniyor(false)
  }

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #FEE8EF 0%, #EBF5FC 100%)', padding: 'clamp(48px,8vw,96px) 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#fff', color: '#E8567A', fontSize: '10px', fontWeight: 800, letterSpacing: '.15em', textTransform: 'uppercase', padding: '7px 14px', borderRadius: '50px', marginBottom: '20px' }}>
          Bize Ulaşın
        </div>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(36px,5vw,68px)', fontWeight: 400, color: '#1A0A12', lineHeight: 1.05, margin: 0 }}>İletişim</h1>
      </div>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { emoji: '📞', baslik: 'Telefon', icerik: '(0212) 352 10 76', href: 'tel:02123521076' },
              { emoji: '✉️', baslik: 'E-posta', icerik: 'bilgi@milgo.com.tr', href: 'mailto:bilgi@milgo.com.tr' },
              { emoji: '📍', baslik: 'Adres', icerik: 'Akat Mah. Etiler Nispetiye Cad. No:55/2, Beşiktaş / İstanbul', href: '#' },
              { emoji: '💬', baslik: 'WhatsApp', icerik: 'Hızlı sipariş için WhatsApp', href: 'https://wa.me/902123521076' },
            ].map(item => (
              <a key={item.baslik} href={item.href}
                style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#fff', border: '1px solid rgba(26,10,18,0.07)', borderRadius: '20px', padding: '20px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(26,10,18,.04)' }}>
                <div style={{ fontSize: '28px', flexShrink: 0 }}>{item.emoji}</div>
                <div>
                  <div style={{ fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#E8567A', fontWeight: 800, marginBottom: '4px' }}>{item.baslik}</div>
                  <div style={{ fontSize: '14px', color: '#1A0A12' }}>{item.icerik}</div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ background: '#fff', borderRadius: '28px', padding: 'clamp(24px,4vw,40px)', border: '1px solid rgba(26,10,18,0.07)', boxShadow: '0 4px 24px rgba(26,10,18,.06)' }}>
            {gonderildi ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '22px', fontWeight: 400, color: '#1A0A12', margin: '0 0 8px' }}>Mesajınız Alındı!</h3>
                <p style={{ color: '#7A6070', fontSize: '14px' }}>En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <form onSubmit={gonder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: '22px', fontWeight: 400, color: '#1A0A12', margin: '0 0 8px' }}>Mesaj Gönderin</h2>
                {hata && <div style={{ background: '#FEE8EF', border: '1px solid #F4A7B9', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#E8567A' }}>{hata}</div>}
                {[['ad','Adınız','Adınız Soyadınız'],['email','E-posta','ornek@email.com'],['konu','Konu','Konunuz']].map(([k,l,p]) => (
                  <div key={k}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>{l}</label>
                    <input type={k==='email'?'email':'text'} value={(form as any)[k]} onChange={e => set(k, e.target.value)}
                      placeholder={p} style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.08)', borderRadius: '14px', padding: '12px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#7A6070', marginBottom: '6px' }}>Mesajınız</label>
                  <textarea value={form.mesaj} onChange={e => set('mesaj', e.target.value)} rows={4} placeholder="Mesajınızı buraya yazın..."
                    style={{ width: '100%', background: 'rgba(26,10,18,0.04)', border: '1.5px solid rgba(26,10,18,0.08)', borderRadius: '14px', padding: '12px 16px', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={yukleniyor}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #E8567A, #3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {yukleniyor ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
