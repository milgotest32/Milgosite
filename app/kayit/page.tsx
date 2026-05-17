'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function KayitPage() {
  const [form, setForm] = useState({ ad: '', soyad: '', email: '', sifre: '' })
  const [goster, setGoster] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const [basari, setBasari] = useState(false)
  const kayitOl = async (e: React.FormEvent) => {
    e.preventDefault(); setYukleniyor(true); setHata('')
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.sifre, options: { data: { full_name: `${form.ad} ${form.soyad}` } } })
    if (error) { setHata(error.message); setYukleniyor(false); return }
    setBasari(true)
  }
  if (basari) return (
    <div className="min-h-screen bg-lav flex items-center justify-center px-4">
      <div className="card p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-5"><Check size={28} className="text-white" /></div>
        <h2 className="font-display text-2xl text-metin mb-2">Kayıt Başarılı!</h2>
        <p className="text-[14px] text-metin-2 mb-6">E-posta adresinize doğrulama linki gönderdik.</p>
        <Link href="/giris" className="btn-primary px-8 py-3 inline-block">Giriş Yap</Link>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-lav flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 text-[13px] text-metin-2 hover:text-pembe-koy mb-8 transition-colors"><ArrowLeft size={14} /> Ana Sayfaya Dön</Link>
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="font-display text-3xl text-metin mb-1">milgo<span className="text-pembe-koy">.</span></div>
            <h1 className="text-[22px] font-semibold text-metin">Üye Ol</h1>
          </div>
          <form onSubmit={kayitOl} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-[12px] font-semibold text-metin mb-1.5">Ad</label><input value={form.ad} onChange={e => setForm({...form, ad: e.target.value})} required className="input" placeholder="Adınız" /></div>
              <div><label className="block text-[12px] font-semibold text-metin mb-1.5">Soyad</label><input value={form.soyad} onChange={e => setForm({...form, soyad: e.target.value})} required className="input" placeholder="Soyadınız" /></div>
            </div>
            <div><label className="block text-[12px] font-semibold text-metin mb-1.5">E-posta</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="input" placeholder="ornek@email.com" /></div>
            <div><label className="block text-[12px] font-semibold text-metin mb-1.5">Şifre</label>
              <div className="relative"><input type={goster ? 'text' : 'password'} value={form.sifre} onChange={e => setForm({...form, sifre: e.target.value})} required minLength={6} className="input pr-10" placeholder="En az 6 karakter" />
                <button type="button" onClick={() => setGoster(!goster)} className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-2">{goster ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            {hata && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-2.5 rounded-xl">{hata}</div>}
            <button type="submit" disabled={yukleniyor} className="btn-primary w-full py-3.5 disabled:opacity-60">{yukleniyor ? 'Kaydediliyor...' : 'Üye Ol'}</button>
          </form>
          <div className="text-center mt-5 text-[13px] text-metin-2">Zaten üye misiniz? <Link href="/giris" className="text-pembe-koy font-semibold hover:underline">Giriş Yap</Link></div>
        </div>
      </div>
    </div>
  )
}
