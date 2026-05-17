'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase'
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown, LogOut, Package, MapPin, Settings } from 'lucide-react'

const KATEGORILER = [
  { slug: 'sut', ad: 'Çiğ Süt', emoji: '🥛' },
  { slug: 'peynir', ad: 'Peynir', emoji: '🧀' },
  { slug: 'tereyag', ad: 'Tereyağı', emoji: '🧈' },
]

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [urunDropdown, setUrunDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [aramaAcik, setAramaAcik] = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')
  const adet = useSepet(s => s.adetToplam())
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null))
  }, [])

  const cikisYap = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setUserDropdown(false)
  }

  return (
    <>
      {/* Top band */}
      <div className="gradient-bg text-white text-center py-2 text-[11px] font-medium tracking-wide">
        🚚 İstanbul içi aynı gün teslimat · İlk siparişte <strong>%10 indirim: MILGO10</strong>
      </div>

      <nav className="sticky top-0 z-50 bg-white border-b border-sinir shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center gap-4">
          
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-normal text-metin mr-4 flex-shrink-0">
            milgo<span className="text-pembe-koy">.</span>
          </Link>

          {/* Menü - masaüstü */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {/* Ürünler dropdown */}
            <div className="relative" onMouseEnter={() => setUrunDropdown(true)} onMouseLeave={() => setUrunDropdown(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-medium text-metin-2 hover:text-pembe-koy rounded-xl hover:bg-pembe-acik transition-all">
                Ürünler <ChevronDown size={14} className={`transition-transform ${urunDropdown ? 'rotate-180' : ''}`} />
              </button>
              {urunDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-sinir p-2">
                  {KATEGORILER.map(k => (
                    <Link key={k.slug} href={`/urunler?kategori=${k.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-lav text-[13px] font-medium text-metin transition-colors">
                      <span className="text-lg">{k.emoji}</span> {k.ad}
                    </Link>
                  ))}
                  <div className="border-t border-sinir mt-2 pt-2">
                    <Link href="/urunler" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-lav text-[13px] font-semibold text-pembe-koy transition-colors">
                      Tüm Ürünler →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {[['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Blog', '/blog']].map(([ad, href]) => (
              <Link key={href} href={href} className="px-4 py-2 text-[13px] font-medium text-metin-2 hover:text-pembe-koy rounded-xl hover:bg-pembe-acik transition-all">
                {ad}
              </Link>
            ))}
          </div>

          {/* Sağ taraf */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Arama */}
            <button onClick={() => setAramaAcik(!aramaAcik)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-lav text-metin-2 hover:text-pembe-koy transition-all">
              <Search size={18} strokeWidth={2} />
            </button>

            {/* Favoriler */}
            <Link href="/favoriler" className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-lav text-metin-2 hover:text-pembe-koy transition-all">
              <Heart size={18} strokeWidth={2} />
            </Link>

            {/* Kullanıcı */}
            <div className="relative">
              <button onClick={() => setUserDropdown(!userDropdown)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-lav text-metin-2 hover:text-pembe-koy transition-all">
                <User size={18} strokeWidth={2} />
              </button>
              {userDropdown && (
                <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-sinir p-2 z-50">
                  {user ? (
                    <>
                      <div className="px-3 py-2 mb-1">
                        <div className="text-[12px] text-metin-2">Hoş geldin</div>
                        <div className="text-[13px] font-semibold text-metin truncate">{user.email}</div>
                      </div>
                      <div className="border-t border-sinir my-1" />
                      {[{icon:<Package size={14}/>, ad:'Siparişlerim', href:'/hesabim/siparisler'},{icon:<Heart size={14}/>, ad:'Favorilerim', href:'/favoriler'},{icon:<MapPin size={14}/>, ad:'Adreslerim', href:'/hesabim/adresler'},{icon:<Settings size={14}/>, ad:'Hesap Ayarları', href:'/hesabim'}].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setUserDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-lav text-[13px] font-medium text-metin transition-colors">
                          <span className="text-metin-2">{item.icon}</span>{item.ad}
                        </Link>
                      ))}
                      <div className="border-t border-sinir my-1" />
                      <button onClick={cikisYap} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-[13px] font-medium text-red-500 transition-colors w-full">
                        <LogOut size={14} />Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" onClick={() => setUserDropdown(false)} className="block px-3 py-2.5 rounded-xl hover:bg-lav text-[13px] font-semibold text-pembe-koy transition-colors">Giriş Yap</Link>
                      <Link href="/kayit" onClick={() => setUserDropdown(false)} className="block px-3 py-2.5 rounded-xl hover:bg-lav text-[13px] font-medium text-metin transition-colors">Üye Ol</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sepet */}
            <Link href="/sepet" className="relative flex items-center gap-2 bg-lav hover:bg-pembe-acik px-4 py-2 rounded-xl transition-all">
              <ShoppingBag size={18} strokeWidth={2} className="text-pembe-koy" />
              <span className="text-[13px] font-semibold text-metin hidden sm:block">Sepet</span>
              {adet > 0 && (
                <span className="w-5 h-5 gradient-bg rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {adet}
                </span>
              )}
            </Link>

            {/* Mobil menü butonu */}
            <button onClick={() => setMenuAcik(!menuAcik)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-lav text-metin transition-all ml-1">
              {menuAcik ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Arama barı */}
        {aramaAcik && (
          <div className="border-t border-sinir px-4 py-3 bg-white">
            <div className="max-w-xl mx-auto flex items-center gap-3 bg-lav rounded-xl px-4 py-2.5">
              <Search size={16} className="text-metin-2 flex-shrink-0" />
              <input autoFocus value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter') { router.push(`/urunler?ara=${aramaMetni}`); setAramaAcik(false); }}}
                placeholder="Ürün, kategori ara..." className="flex-1 bg-transparent text-[14px] text-metin placeholder-metin-2 outline-none" />
              <button onClick={() => setAramaAcik(false)} className="text-metin-2 hover:text-metin">
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobil menü */}
      {menuAcik && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden flex flex-col pt-20 px-6 overflow-y-auto">
          <div className="space-y-1">
            {[['🥛 Çiğ Süt', '/urunler?kategori=sut'],['🧀 Peynir', '/urunler?kategori=peynir'],['🧈 Tereyağı', '/urunler?kategori=tereyag'],['Tüm Ürünler', '/urunler'],['Abonelik', '/abonelik'],['Çiftliğimiz', '/ciftligimiz'],['Tarifler', '/tarifler']].map(([ad, href]) => (
              <Link key={href} href={href} onClick={() => setMenuAcik(false)}
                className="block px-4 py-3.5 text-[15px] font-medium text-metin hover:text-pembe-koy hover:bg-lav rounded-xl transition-all">
                {ad}
              </Link>
            ))}
          </div>
          <div className="border-t border-sinir mt-6 pt-6 space-y-2">
            {user ? (
              <button onClick={cikisYap} className="w-full btn-secondary px-6 py-3">Çıkış Yap</button>
            ) : (
              <>
                <Link href="/giris" onClick={() => setMenuAcik(false)} className="block w-full btn-primary px-6 py-3 text-center">Giriş Yap</Link>
                <Link href="/kayit" onClick={() => setMenuAcik(false)} className="block w-full btn-secondary px-6 py-3 text-center">Üye Ol</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
