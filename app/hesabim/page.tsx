'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Package, Heart, MapPin, Settings, ChevronRight, RefreshCw, LogOut } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function HesabimPage() {
  const [user, setUser] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      setUser(data.session.user); setYukleniyor(false)
    })
  }, [router])
  const cikis = async () => { await supabase.auth.signOut(); router.push('/') }
  if (yukleniyor) return <div className="min-h-screen bg-lav flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-pembe-koy border-t-transparent animate-spin" /></div>
  const MENULER = [
    {icon:<Package size={20}/>, baslik:'Siparişlerim', ac:'Geçmiş siparişleriniz', href:'/hesabim/siparisler', renk:'bg-pembe-acik text-pembe-koy'},
    {icon:<Heart size={20}/>, baslik:'Favorilerim', ac:'Beğendiğiniz ürünler', href:'/favoriler', renk:'bg-red-50 text-red-500'},
    {icon:<RefreshCw size={20}/>, baslik:'Aboneliğim', ac:'Abonelik planınız', href:'/abonelik', renk:'bg-mavi-acik text-mavi-koy'},
    {icon:<MapPin size={20}/>, baslik:'Adreslerim', ac:'Teslimat adresleriniz', href:'/hesabim/adresler', renk:'bg-green-50 text-green-600'},
    {icon:<Settings size={20}/>, baslik:'Hesap Ayarları', ac:'Profil ve şifre', href:'/hesabim/ayarlar', renk:'bg-lav text-metin-2'},
  ]
  return (
    <div className="min-h-screen bg-lav py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profil */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white font-bold text-xl font-display">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-[18px] font-semibold text-metin">Hesabım</h1>
              <p className="text-[13px] text-metin-2">{user?.email}</p>
            </div>
          </div>
        </div>
        {/* Menü */}
        <div className="card overflow-hidden mb-4">
          {MENULER.map((item, i) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-6 py-4 hover:bg-lav transition-colors ${i < MENULER.length-1 ? 'border-b border-sinir' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.renk}`}>{item.icon}</div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-metin">{item.baslik}</div>
                <div className="text-[12px] text-metin-2">{item.ac}</div>
              </div>
              <ChevronRight size={16} className="text-metin-2" />
            </Link>
          ))}
        </div>
        <button onClick={cikis} className="w-full card px-6 py-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} /><span className="text-[14px] font-semibold">Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}
