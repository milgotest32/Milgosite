'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function GirisPage() {
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [goster, setGoster] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')
  const router = useRouter()
  const girisYap = async (e: React.FormEvent) => {
    e.preventDefault(); setYukleniyor(true); setHata('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) { setHata('E-posta veya şifre hatalı.'); setYukleniyor(false); return }
    router.push('/')
  }
  return (
    <div className="min-h-screen bg-lav flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 text-[13px] text-metin-2 hover:text-pembe-koy mb-8 transition-colors"><ArrowLeft size={14} /> Ana Sayfaya Dön</Link>
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="font-display text-3xl text-metin mb-1">milgo<span className="text-pembe-koy">.</span></div>
            <h1 className="text-[22px] font-semibold text-metin">Giriş Yap</h1>
          </div>
          <form onSubmit={girisYap} className="space-y-4">
            <div><label className="block text-[12px] font-semibold text-metin mb-1.5">E-posta</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" placeholder="ornek@email.com" /></div>
            <div><label className="block text-[12px] font-semibold text-metin mb-1.5">Şifre</label>
              <div className="relative"><input type={goster ? 'text' : 'password'} value={sifre} onChange={e => setSifre(e.target.value)} required className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setGoster(!goster)} className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-2">{goster ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            {hata && <div className="bg-red-50 text-red-600 text-[13px] px-4 py-2.5 rounded-xl">{hata}</div>}
            <button type="submit" disabled={yukleniyor} className="btn-primary w-full py-3.5 disabled:opacity-60">{yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}</button>
          </form>
          <div className="text-center mt-6 text-[13px] text-metin-2">Hesabınız yok mu? <Link href="/kayit" className="text-pembe-koy font-semibold hover:underline">Üye Ol</Link></div>
        </div>
      </div>
    </div>
  )
}
