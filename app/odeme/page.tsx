'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, User } from 'lucide-react'

export default function OdemePage() {
  const router = useRouter()
  const { items, toplam, temizle } = useSepet()
  const [adim, setAdim] = useState<'bilgi' | 'odeme'>('bilgi')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [form, setForm] = useState({
    ad: '', soyad: '', email: '', telefon: '',
    adres: '', ilce: '', sehir: 'İstanbul', notlar: ''
  })

  const kargo = toplam() > 500 ? 0 : 49.90
  const genel = toplam() + kargo

  const siparisOlustur = async () => {
    setYukleniyor(true)
    try {
      const { data: siparis } = await supabase.from('site_siparisler').insert({
        musteri_ad: `${form.ad} ${form.soyad}`,
        musteri_email: form.email,
        musteri_telefon: form.telefon,
        teslimat_adres: form.adres,
        teslimat_ilce: form.ilce,
        teslimat_sehir: form.sehir,
        toplam: genel,
        kargo_ucreti: kargo,
        notlar: form.notlar,
        durum: 'bekliyor',
        odeme_durumu: 'odendi',
        odeme_yontemi: 'kart',
      }).select().single()

      if (siparis) {
        await supabase.from('site_siparis_kalemleri').insert(
          items.map(({ urun, adet }) => ({
            siparis_id: siparis.id,
            urun_id: urun.id,
            urun_ad: urun.ad,
            urun_fiyat: urun.fiyat,
            adet,
            fotograf_url: urun.fotograf_url,
          }))
        )
        temizle()
        router.push(`/siparis-onay?id=${siparis.id}`)
      }
    } catch (e) { console.error(e) }
    setYukleniyor(false)
  }

  const inp = (label: string, key: keyof typeof form, placeholder?: string, type = 'text') => (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
        placeholder={placeholder}
        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#8a92a8] outline-none focus:border-[rgba(232,164,184,0.35)] transition-colors" />
    </div>
  )

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-8 lg:px-16 py-16">
      <Link href="/sepet" className="flex items-center gap-2 text-[#8a92a8] hover:text-[#f5c8d8] text-[12px] mb-10 transition-colors">
        <ArrowLeft size={14} />Sepete Dön
      </Link>

      <h1 className="font-display text-[clamp(32px,4vw,52px)] font-light mb-12">
        Siparişi <span className="gradient-text italic">Tamamla</span>
      </h1>

      {/* Adımlar */}
      <div className="flex items-center gap-4 mb-12">
        {[{id:'bilgi', icon:<User size={14}/>, label:'Bilgiler'}, {id:'odeme', icon:<CreditCard size={14}/>, label:'Ödeme'}].map((a, i) => (
          <div key={a.id} className="flex items-center gap-3">
            {i > 0 && <div className="w-12 h-px bg-white/10" />}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] transition-all ${adim === a.id ? 'gradient-bg text-white' : 'glass text-[#8a92a8]'}`}>
              {a.icon}{a.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {adim === 'bilgi' && (
            <div className="glass rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-[22px] font-light flex items-center gap-2 mb-2">
                <Truck size={18} className="text-[#e8a4b8]" />Teslimat Bilgileri
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {inp('Ad', 'ad', 'Adınız')}
                {inp('Soyad', 'soyad', 'Soyadınız')}
              </div>
              {inp('E-posta', 'email', 'ornek@email.com', 'email')}
              {inp('Telefon', 'telefon', '0532 xxx xx xx', 'tel')}
              {inp('Adres', 'adres', 'Sokak, No, Daire')}
              <div className="grid grid-cols-2 gap-4">
                {inp('İlçe', 'ilce', 'Beşiktaş')}
                {inp('Şehir', 'sehir', 'İstanbul')}
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">Sipariş Notu (isteğe bağlı)</label>
                <textarea value={form.notlar} onChange={e => setForm({...form, notlar: e.target.value})}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#8a92a8] outline-none focus:border-[rgba(232,164,184,0.35)] resize-none h-24"
                  placeholder="Teslimat ile ilgili notunuz..." />
              </div>
              <button onClick={() => setAdim('odeme')}
                className="gradient-bg text-white w-full py-4 rounded-full text-[13px] font-medium tracking-wide hover:opacity-90 transition-all">
                Ödemeye Geç →
              </button>
            </div>
          )}

          {adim === 'odeme' && (
            <div className="glass rounded-2xl p-8 space-y-5">
              <h2 className="font-display text-[22px] font-light flex items-center gap-2 mb-2">
                <CreditCard size={18} className="text-[#e8a4b8]" />Ödeme Bilgileri
              </h2>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">Kart Numarası</label>
                <input className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#8a92a8] outline-none" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">Son Kullanma</label>
                  <input className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#8a92a8] outline-none" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">CVV</label>
                  <input className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#8a92a8] outline-none" placeholder="123" />
                </div>
              </div>
              <div className="glass rounded-xl p-4 text-[12px] text-[#8a92a8] flex items-center gap-3">
                🔒 Ödeme bilgileriniz SSL ile şifrelenmektedir.
              </div>
              <button onClick={siparisOlustur} disabled={yukleniyor}
                className="gradient-bg text-white w-full py-4 rounded-full text-[13px] font-medium tracking-wide hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {yukleniyor ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />İşleniyor...</> : `Siparişi Onayla · ₺${genel.toFixed(2)}`}
              </button>
              <button onClick={() => setAdim('bilgi')} className="text-[#8a92a8] text-[12px] w-full text-center hover:text-white transition-colors">
                ← Geri Dön
              </button>
            </div>
          )}
        </div>

        {/* Sipariş özeti */}
        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="font-display text-[18px] font-light mb-5">Sipariş Özeti</h3>
            <div className="space-y-3 mb-5">
              {items.map(({ urun, adet }) => (
                <div key={urun.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0d1b3e] overflow-hidden flex-shrink-0">
                    {urun.fotograf_url && <img src={urun.fotograf_url} alt={urun.ad} className="w-full h-full object-cover" style={{filter:'brightness(0.7)'}} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-white truncate">{urun.ad}</div>
                    <div className="text-[11px] text-[#8a92a8]">x{adet}</div>
                  </div>
                  <div className="text-[13px] gradient-text font-display">₺{(urun.fiyat * adet).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#8a92a8]">Ara Toplam</span>
                <span>₺{toplam().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#8a92a8]">Kargo</span>
                <span>{kargo === 0 ? 'Ücretsiz' : `₺${kargo.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="font-medium">Toplam</span>
                <span className="font-display text-[20px] gradient-text">₺{genel.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
