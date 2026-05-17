'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Check } from 'lucide-react'

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
    await supabase.from('site_abonelikler').insert({
      musteri_ad: form.ad, musteri_email: form.email,
      musteri_telefon: form.telefon,
      teslimat_adres: `${form.adres}, ${form.ilce}`,
      plan: secili, haftalik_litre: plan.litre, fiyat: plan.fiyat,
    })
    setBasari(true)
    setYukleniyor(false)
  }

  if (basari) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
      <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-6">
        <Check size={32} className="text-white" />
      </div>
      <h2 className="font-display text-4xl font-light mb-3">Aboneliğiniz Başladı! 🎉</h2>
      <p className="text-[#8a92a8]">Bu Cuma ilk teslimatınız kapınızda olacak.</p>
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-20 px-8 text-center relative overflow-hidden" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(196,118,142,0.12) 0%, transparent 60%)'}} />
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">⟳ Haftalık Abonelik</div>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light relative">
          Her Hafta <span className="gradient-text italic">Kapınıza</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-16">
        {/* Planlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {PLANLAR.map(plan => (
            <div key={plan.slug} onClick={() => setSecili(plan.slug)}
              className={`relative glass rounded-2xl p-6 cursor-pointer transition-all ${secili === plan.slug ? 'border-[rgba(232,164,184,0.4)] bg-[rgba(232,164,184,0.06)] -translate-y-1' : 'hover:border-[rgba(232,164,184,0.2)]'}`}>
              {plan.one && <div className="absolute top-0 right-5 gradient-bg text-white text-[7px] tracking-[0.25em] uppercase px-3 py-1 rounded-b-xl font-bold">Popüler</div>}
              <div className="w-5 h-5 rounded-full border-2 mb-4 flex items-center justify-center" style={{borderColor: secili === plan.slug ? '#e8a4b8' : 'rgba(255,255,255,0.15)'}}>
                {secili === plan.slug && <div className="w-2.5 h-2.5 rounded-full bg-[#e8a4b8]" />}
              </div>
              <h3 className="font-display text-[22px] font-light mb-1">{plan.ad}</h3>
              <div className="font-display text-[32px] gradient-text mb-1">₺{plan.fiyat}</div>
              <div className="text-[11px] text-[#8a92a8] mb-5">/ Ay · {plan.litre}L Haftalık</div>
              <div className="space-y-2">
                {plan.ozellikler.map(oz => (
                  <div key={oz} className="flex items-center gap-2 text-[12px] text-white/70">
                    <Check size={12} className="text-[#e8a4b8] flex-shrink-0" />{oz}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
          <h3 className="font-display text-[22px] font-light mb-6">Teslimat Bilgileri</h3>
          <div className="space-y-4">
            {[['Ad Soyad', 'ad', 'text'], ['E-posta', 'email', 'email'], ['Telefon', 'telefon', 'tel'], ['Adres', 'adres', 'text'], ['İlçe', 'ilce', 'text']].map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">{label}</label>
                <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[rgba(232,164,184,0.35)] transition-colors" />
              </div>
            ))}
          </div>
          <button onClick={kaydet} disabled={yukleniyor}
            className="gradient-bg text-white w-full py-4 rounded-full text-[13px] font-medium tracking-wide mt-6 hover:opacity-90 transition-all disabled:opacity-50">
            {yukleniyor ? 'İşleniyor...' : 'Aboneliği Başlat'}
          </button>
        </div>
      </div>
    </div>
  )
}
