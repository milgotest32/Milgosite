'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown, LogOut, Package, MapPin, Settings } from 'lucide-react'
import MiniCart from '../cart/MiniCart'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [sepetAcik, setSepetAcik] = useState(false)
  const [userDrop, setUserDrop] = useState(false)
  const [urunDrop, setUrunDrop] = useState(false)
  const [menuAcik, setMenuAcik] = useState(false)
  const [aramaAcik, setAramaAcik] = useState(false)
  const [arama, setArama] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const adet = useSepet(s => s.adetToplam())
  const router = useRouter()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null))
    return () => subscription.unsubscribe()
  }, [])

  const cikis = async () => { await supabase.auth.signOut(); router.push('/'); setUserDrop(false) }

  const dropStyle: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 8px)', background: '#fff',
    borderRadius: '20px', boxShadow: '0 12px 40px rgba(26,10,18,0.15)',
    border: '1px solid rgba(232,86,122,0.1)', padding: '8px',
    minWidth: '190px', zIndex: 200,
  }
  const dropItem: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px', fontSize: '13px',
    fontWeight: 500, color: '#1A0A12', textDecoration: 'none',
    background: 'none', border: 'none', width: '100%', cursor: 'none', fontFamily: 'Syne, sans-serif',
  }
  const iconBtn: React.CSSProperties = {
    width: '38px', height: '38px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', borderRadius: '10px', color: '#7A6070',
    background: 'transparent', border: 'none', cursor: 'none', flexShrink: 0,
  }

  return (
    <>
      {/* Duyuru bandı */}
      <div style={{ background: '#1A0A12', color: 'rgba(255,255,255,0.65)', textAlign: 'center', padding: '8px 16px', fontSize: '12px', fontWeight: 500 }}>
        🚚 İstanbul içi aynı gün teslimat &nbsp;·&nbsp; İlk siparişte <strong style={{ color: '#F4A7B9' }}>%10 indirim: MILGO10</strong>
      </div>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(20px)', background: 'rgba(253,251,249,0.94)',
        borderBottom: '1px solid rgba(232,86,122,0.08)',
        boxShadow: '0 1px 16px rgba(26,10,18,0.05)',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 48px)',
          height: '66px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {/* Logo */}
          <Link href="/" style={{ fontFamily: '"Instrument Serif", serif', fontSize: '26px', color: '#1A0A12', textDecoration: 'none', marginRight: '8px', flexShrink: 0 }}>
            milgo<span style={{ color: '#E8567A' }}>.</span>
          </Link>

          {/* Masaüstü menü */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
              {/* Ürünler dropdown */}
              <div style={{ position: 'relative' }}
                onMouseEnter={() => setUrunDrop(true)}
                onMouseLeave={() => setUrunDrop(false)}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '7px 14px', fontSize: '13px', fontWeight: 500, color: '#7A6070', borderRadius: '10px', background: 'none', border: 'none', cursor: 'none', fontFamily: 'Syne, sans-serif' }}>
                  Ürünler <ChevronDown size={13} style={{ transition: 'transform .2s', transform: urunDrop ? 'rotate(180deg)' : 'none' }} />
                </button>
                {urunDrop && (
                  <div style={dropStyle}>
                    {[{ e: '🥛', a: 'Çiğ Süt', h: '/kategoriler/cig-sut' }, { e: '🧀', a: 'Peynir', h: '/kategoriler/peynir' }, { e: '🧈', a: 'Tereyağı', h: '/kategoriler/tereyagi' }].map(k => (
                      <Link key={k.h} href={k.h} style={dropItem}>{k.e} {k.a}</Link>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(26,10,18,.06)', margin: '6px 0 0', paddingTop: '6px' }}>
                      <Link href="/kampanyalar" style={{ ...dropItem, color: '#E8567A', fontWeight: 700 }}>🔥 Kampanyalar</Link>
                      <Link href="/indirimler" style={{ ...dropItem, color: '#E8567A', fontWeight: 700 }}>💸 İndirimdekiler</Link>
                    </div>
                  </div>
                )}
              </div>
              {[['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Blog', '/blog'], ['Hakkımızda', '/hakkimizda']].map(([a, h]) => (
                <Link key={h} href={h} style={{ padding: '7px 14px', fontSize: '13px', fontWeight: 500, color: '#7A6070', borderRadius: '10px', textDecoration: 'none' }}>{a}</Link>
              ))}
            </div>
          )}

          {/* Sağ ikonlar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
            <button onClick={() => setAramaAcik(!aramaAcik)} style={iconBtn}><Search size={17} strokeWidth={1.75} /></button>
            <Link href="/hesabim/favoriler" style={{ ...iconBtn, textDecoration: 'none' } as any}><Heart size={17} strokeWidth={1.75} /></Link>

            {/* Kullanıcı */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserDrop(!userDrop)} style={iconBtn}><User size={17} strokeWidth={1.75} /></button>
              {userDrop && (
                <div style={{ ...dropStyle, right: 0, left: 'auto' }}>
                  {user ? (
                    <>
                      <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid rgba(26,10,18,.06)', marginBottom: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#7A6070', textTransform: 'uppercase', letterSpacing: '.1em' }}>Hoş geldin</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A0A12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>{user.email}</div>
                      </div>
                      {[{ i: <Package size={14} />, a: 'Siparişlerim', h: '/hesabim/siparisler' }, { i: <Heart size={14} />, a: 'Favorilerim', h: '/hesabim/favoriler' }, { i: <MapPin size={14} />, a: 'Adreslerim', h: '/hesabim/adresler' }, { i: <Settings size={14} />, a: 'Hesabım', h: '/hesabim' }].map(item => (
                        <Link key={item.h} href={item.h} onClick={() => setUserDrop(false)} style={{ ...dropItem, color: '#7A6070' } as any}><span>{item.i}</span>{item.a}</Link>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(26,10,18,.06)', marginTop: '6px', paddingTop: '6px' }}>
                        <Link href="/admin" onClick={() => setUserDrop(false)} style={{ ...dropItem, color: '#7A6070' } as any}>⚙️ Admin Panel</Link>
                        <button onClick={cikis} style={{ ...dropItem, color: '#E8567A' } as any}><LogOut size={14} />Çıkış Yap</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" onClick={() => setUserDrop(false)} style={{ ...dropItem, color: '#E8567A', fontWeight: 700 } as any}>Giriş Yap</Link>
                      <Link href="/kayit" onClick={() => setUserDrop(false)} style={dropItem as any}>Üye Ol</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sepet */}
            <button onClick={() => setSepetAcik(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEE8EF', padding: '8px 14px', borderRadius: '12px', border: 'none', cursor: 'none', flexShrink: 0 }}>
              <ShoppingBag size={17} strokeWidth={1.75} style={{ color: '#E8567A' }} />
              {!isMobile && <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A0A12' }}>Sepet</span>}
              {adet > 0 && <span style={{ width: '18px', height: '18px', background: '#E8567A', borderRadius: '50%', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{adet}</span>}
            </button>

            {/* Mobil hamburger */}
            {isMobile && (
              <button onClick={() => setMenuAcik(!menuAcik)} style={{ ...iconBtn }}>
                {menuAcik ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
          </div>
        </div>

        {/* Arama barı */}
        {aramaAcik && (
          <div style={{ borderTop: '1px solid rgba(232,86,122,.08)', padding: '10px clamp(16px,4vw,48px)', background: 'rgba(253,251,249,0.97)' }}>
            <form onSubmit={e => { e.preventDefault(); if (arama) { router.push(`/arama?q=${arama}`); setAramaAcik(false) } }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(26,10,18,.05)', borderRadius: '14px', padding: '0 16px', maxWidth: '560px', margin: '0 auto' }}>
              <Search size={15} style={{ color: '#7A6070', flexShrink: 0 }} />
              <input autoFocus value={arama} onChange={e => setArama(e.target.value)} placeholder="Ürün ara..."
                style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 0', fontSize: '14px', color: '#1A0A12', outline: 'none', fontFamily: 'Syne, sans-serif' }} />
              <button type="button" onClick={() => setAramaAcik(false)} style={{ background: 'none', border: 'none', cursor: 'none', color: '#7A6070' }}><X size={14} /></button>
            </form>
          </div>
        )}
      </nav>

      {/* Sepet slide */}
      {sepetAcik && (
        <>
          <div onClick={() => setSepetAcik(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,10,18,0.5)', zIndex: 199 }} />
          <MiniCart onClose={() => setSepetAcik(false)} />
        </>
      )}

      {/* Mobil menü — tam ekran overlay */}
      {menuAcik && isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: '#FDFBF9', overflowY: 'auto',
          padding: '80px 24px 40px',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Kapat butonu */}
          <button onClick={() => setMenuAcik(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(26,10,18,.06)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none' }}>
            <X size={20} color="#1A0A12" />
          </button>

          <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: '24px', color: '#1A0A12', marginBottom: '32px' }}>milgo<span style={{ color: '#E8567A' }}>.</span></div>

          {/* Linkler */}
          <div style={{ flex: 1 }}>
            {[
              ['🥛 Çiğ Süt', '/kategoriler/cig-sut'],
              ['🧀 Peynir', '/kategoriler/peynir'],
              ['🧈 Tereyağı', '/kategoriler/tereyagi'],
              ['Tüm Ürünler', '/urunler'],
              ['Abonelik', '/abonelik'],
              ['Çiftliğimiz', '/ciftligimiz'],
              ['Blog', '/blog'],
              ['Hakkımızda', '/hakkimizda'],
              ['İletişim', '/iletisim'],
            ].map(([a, h]) => (
              <Link key={h} href={h} onClick={() => setMenuAcik(false)} style={{
                display: 'block', padding: '16px 0',
                fontSize: '20px', fontWeight: 500, color: '#1A0A12',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(26,10,18,.06)',
              }}>{a}</Link>
            ))}
          </div>

          {/* Auth butonları */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user ? (
              <button onClick={() => { cikis(); setMenuAcik(false) }} style={{ background: 'rgba(26,10,18,.06)', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 600, color: '#1A0A12', cursor: 'none', fontFamily: 'Syne, sans-serif' }}>
                Çıkış Yap
              </button>
            ) : (
              <>
                <Link href="/giris" onClick={() => setMenuAcik(false)} style={{ display: 'block', background: '#1A0A12', color: '#fff', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 700, textAlign: 'center', textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>
                  Giriş Yap
                </Link>
                <Link href="/kayit" onClick={() => setMenuAcik(false)} style={{ display: 'block', border: '2px solid rgba(26,10,18,.15)', color: '#1A0A12', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: 600, textAlign: 'center', textDecoration: 'none', fontFamily: 'Syne, sans-serif' }}>
                  Üye Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
