'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown, LogOut, Package, MapPin, Settings } from 'lucide-react'
import MiniCart from '../cart/MiniCart'

const NAV = {
  wrap: { position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(20px)', background: 'rgba(253,251,249,0.9)', borderBottom: '1px solid rgba(232,86,122,0.08)' },
  logo: { fontFamily: '"Instrument Serif", serif', fontSize: '26px', color: '#1A0A12', textDecoration: 'none', letterSpacing: '-0.01em' },
  link: { fontSize: '13px', fontWeight: 500, color: '#7A6070', padding: '7px 14px', borderRadius: '10px', textDecoration: 'none', transition: 'all .2s', whiteSpace: 'nowrap' as const },
  icon: { width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: '#7A6070', background: 'transparent', border: 'none', cursor: 'none' as const, flexShrink: 0 },
  drop: { position: 'absolute' as const, top: 'calc(100% + 8px)', background: '#fff', borderRadius: '20px', boxShadow: '0 12px 40px rgba(26,10,18,0.14)', border: '1px solid rgba(232,86,122,0.08)', padding: '8px', minWidth: '190px', zIndex: 200 },
  dropItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, color: '#1A0A12', textDecoration: 'none' },
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [sepetAcik, setSepetAcik] = useState(false)
  const [userDrop, setUserDrop] = useState(false)
  const [urunDrop, setUrunDrop] = useState(false)
  const [menuAcik, setMenuAcik] = useState(false)
  const [aramaAcik, setAramaAcik] = useState(false)
  const [arama, setArama] = useState('')
  const adet = useSepet(s => s.adetToplam())
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null))
    return () => subscription.unsubscribe()
  }, [])

  const cikis = async () => { await supabase.auth.signOut(); router.push('/'); setUserDrop(false) }

  return (
    <>
      {/* Duyuru bandı */}
      <div style={{ background: '#1A0A12', color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '8px 16px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}>
        🚚 İstanbul içi aynı gün teslimat &nbsp;·&nbsp; İlk siparişte <strong style={{ color: '#F4A7B9' }}>%10 indirim: MILGO10</strong>
      </div>

      <nav style={{ ...NAV.wrap, top: '36px' }}>
        <Link href="/" style={NAV.logo}>milgo<span style={{ color: '#E8567A' }}>.</span></Link>

        {/* Masaüstü linkler */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, marginLeft: '16px' }} className="hidden lg:flex">
          <div style={{ position: 'relative' }} onMouseEnter={() => setUrunDrop(true)} onMouseLeave={() => setUrunDrop(false)}>
            <button style={{ ...NAV.link, display: 'flex', alignItems: 'center', gap: '4px', background: 'none' }}>
              Ürünler <ChevronDown size={13} style={{ transition: 'transform .2s', transform: urunDrop ? 'rotate(180deg)' : 'none' }} />
            </button>
            {urunDrop && (
              <div style={NAV.drop}>
                {[{ e: '🥛', a: 'Çiğ Süt', h: '/kategoriler/cig-sut' }, { e: '🧀', a: 'Peynir', h: '/kategoriler/peynir' }, { e: '🧈', a: 'Tereyağı', h: '/kategoriler/tereyagi' }].map(k => (
                  <Link key={k.h} href={k.h} style={NAV.dropItem}>{k.e} {k.a}</Link>
                ))}
                <div style={{ borderTop: '1px solid rgba(26,10,18,.06)', marginTop: '6px', paddingTop: '6px' }}>
                  <Link href="/kampanyalar" style={{ ...NAV.dropItem, color: '#E8567A', fontWeight: 700 }}>🔥 Kampanyalar</Link>
                </div>
              </div>
            )}
          </div>
          {[['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Blog', '/blog'], ['Hakkımızda', '/hakkimizda']].map(([a, h]) => (
            <Link key={h} href={h} style={NAV.link}>{a}</Link>
          ))}
        </div>

        {/* Sağ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <button onClick={() => setAramaAcik(!aramaAcik)} style={NAV.icon}><Search size={17} strokeWidth={1.75} /></button>
          <Link href="/hesabim/favoriler" style={{ ...NAV.icon, textDecoration: 'none' } as any}><Heart size={17} strokeWidth={1.75} /></Link>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setUserDrop(!userDrop)} style={NAV.icon}><User size={17} strokeWidth={1.75} /></button>
            {userDrop && (
              <div style={{ ...NAV.drop, right: 0, left: 'auto' }}>
                {user ? (
                  <>
                    <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid rgba(26,10,18,.06)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.1em' }}>Hoş geldin</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A0A12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{user.email}</div>
                    </div>
                    {[{ i: <Package size={14} />, a: 'Siparişlerim', h: '/hesabim/siparisler' }, { i: <Heart size={14} />, a: 'Favorilerim', h: '/hesabim/favoriler' }, { i: <MapPin size={14} />, a: 'Adreslerim', h: '/hesabim/adresler' }, { i: <Settings size={14} />, a: 'Hesabım', h: '/hesabim' }].map(item => (
                      <Link key={item.h} href={item.h} onClick={() => setUserDrop(false)} style={{ ...NAV.dropItem, color: '#7A6070' }}><span>{item.i}</span>{item.a}</Link>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(26,10,18,.06)', marginTop: '6px', paddingTop: '6px' }}>
                      <button onClick={cikis} style={{ ...NAV.dropItem, color: '#E8567A', background: 'none', border: 'none', width: '100%', cursor: 'none', fontFamily: 'inherit' } as any}><LogOut size={14} />Çıkış Yap</button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/giris" onClick={() => setUserDrop(false)} style={{ ...NAV.dropItem, color: '#E8567A', fontWeight: 700 }}>Giriş Yap</Link>
                    <Link href="/kayit" onClick={() => setUserDrop(false)} style={NAV.dropItem}>Üye Ol</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sepet */}
          <button onClick={() => setSepetAcik(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEE8EF', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'none', marginLeft: '4px', flexShrink: 0 }}>
            <ShoppingBag size={17} strokeWidth={1.75} style={{ color: '#E8567A' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A0A12' }} className="hidden sm:block">Sepet</span>
            {adet > 0 && <span style={{ width: '18px', height: '18px', background: '#E8567A', borderRadius: '50%', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{adet}</span>}
          </button>

          <button onClick={() => setMenuAcik(!menuAcik)} style={{ ...NAV.icon, display: 'flex' }} className="lg:hidden">
            {menuAcik ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Arama */}
      {aramaAcik && (
        <div style={{ position: 'fixed', top: '104px', left: 0, right: 0, background: '#fff', borderBottom: '1px solid rgba(232,86,122,.08)', padding: '12px 40px', zIndex: 99 }}>
          <form onSubmit={e => { e.preventDefault(); if (arama) { router.push(`/arama?q=${arama}`); setAramaAcik(false) } }} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(26,10,18,.04)', borderRadius: '14px', padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={15} style={{ color: '#7A6070', flexShrink: 0 }} />
            <input autoFocus value={arama} onChange={e => setArama(e.target.value)} placeholder="Ürün ara..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 0', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'inherit' }} />
            <button type="button" onClick={() => setAramaAcik(false)} style={{ background: 'none', border: 'none', cursor: 'none', color: '#7A6070' }}><X size={14} /></button>
          </form>
        </div>
      )}

      {/* Sepet panel */}
      {sepetAcik && (
        <>
          <div onClick={() => setSepetAcik(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,10,18,0.5)', zIndex: 199 }} />
          <MiniCart onClose={() => setSepetAcik(false)} />
        </>
      )}

      {/* Mobil menü */}
      {menuAcik && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: '#FDFBF9', overflowY: 'auto', paddingTop: '104px', padding: '104px 24px 40px' }} className="lg:hidden">
          {[['🥛 Çiğ Süt', '/kategoriler/cig-sut'], ['🧀 Peynir', '/kategoriler/peynir'], ['🧈 Tereyağı', '/kategoriler/tereyagi'], ['Tüm Ürünler', '/urunler'], ['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Blog', '/blog']].map(([a, h]) => (
            <Link key={h} href={h} onClick={() => setMenuAcik(false)} style={{ display: 'block', padding: '14px 0', fontSize: '18px', fontWeight: 500, color: '#1A0A12', textDecoration: 'none', borderBottom: '1px solid rgba(26,10,18,.06)' }}>{a}</Link>
          ))}
          <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user
              ? <button onClick={() => { cikis(); setMenuAcik(false) }} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Çıkış Yap</button>
              : <>
                <Link href="/giris" onClick={() => setMenuAcik(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Giriş Yap</Link>
                <Link href="/kayit" onClick={() => setMenuAcik(false)} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Üye Ol</Link>
              </>}
          </div>
        </div>
      )}

      {/* Navbar boşluğu için spacer */}
      <div style={{ height: '104px' }} />
    </>
  )
}
