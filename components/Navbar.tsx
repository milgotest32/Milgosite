'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, User, Menu, X, Heart, ChevronDown } from 'lucide-react'

const LINKLER = [
  ['Abonelik', '/abonelik'],
  ['Çiftliğimiz', '/ciftligimiz'],
  ['Blog', '/blog'],
  ['Hakkımızda', '/hakkimizda'],
  
]

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [urunMenu, setUrunMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const adet = useSepet(s => s.adetToplam())
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null))
    return () => subscription.unsubscribe()
  }, [])

  const { temizle } = useSepet()
  const cikis = async () => { temizle(); await supabase.auth.signOut(); router.push('/'); setUserMenu(false) }

  return (
    <>
      {/* Üst band */}
      <div style={{background:'linear-gradient(90deg,#E07090,#3B9FCC)', color:'#fff', textAlign:'center', padding:'8px', fontSize:'12px', fontWeight:'500'}}>
        🚚 İstanbul içi aynı gün teslimat · İlk siparişte <strong>%10 indirim: MILGO10</strong>
      </div>

      <nav style={{background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid #F0ECF5', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 12px rgba(224,112,144,0.06)'}}>
        <div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 16px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>

          {/* Sol: Logo + Linkler */}
          <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
            <Link href="/" style={{fontFamily:'"Playfair Display",serif', fontSize:'24px', color:'#1C1B2E', textDecoration:'none', marginRight:'12px', flexShrink:0}}>
              milgo<span style={{color:'#E07090'}}>.</span>
            </Link>

            {/* Ürünler dropdown */}
            <div style={{position:'relative'}} onMouseEnter={() => setUrunMenu(true)} onMouseLeave={() => setUrunMenu(false)}>
              <button style={{display:'flex', alignItems:'center', gap:'4px', padding:'6px 10px', fontSize:'13px', fontWeight:'500', color:'#6B7280', background:'none', border:'none', cursor:'pointer', borderRadius:'10px', whiteSpace:'nowrap'}}>
                Ürünler <ChevronDown size={13} style={{transition:'transform 0.2s', transform: urunMenu ? 'rotate(180deg)' : 'none'}}/>
              </button>
              {urunMenu && (
                <div style={{position:'absolute', top:'calc(100% + 8px)', background:'#fff', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:'1px solid #F0ECF5', padding:'8px', minWidth:'180px', zIndex:100}}>
                  {[{emoji:'🥛',ad:'Çiğ Süt',href:'/urunler?kategori=sut'},{emoji:'🧀',ad:'Peynir',href:'/urunler?kategori=peynir'},{emoji:'🧈',ad:'Tereyağı',href:'/urunler?kategori=tereyag'}].map(k => (
                    <Link key={k.href} href={k.href} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', color:'#1C1B2E', textDecoration:'none'}}>{k.emoji} {k.ad}</Link>
                  ))}
                  <div style={{borderTop:'1px solid #F0ECF5', marginTop:'6px', paddingTop:'6px'}}>
                    <Link href="/urunler" style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', color:'#E07090', textDecoration:'none'}}>Tüm Ürünler →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Diğer linkler */}
            {LINKLER.map(([ad, href]) => (
              <Link key={href} href={href} style={{padding:'6px 10px', fontSize:'13px', fontWeight:'500', color:'#6B7280', textDecoration:'none', borderRadius:'10px', whiteSpace:'nowrap'}}>
                {ad}
              </Link>
            ))}
          </div>

          {/* Sağ: İkonlar */}
          <div style={{display:'flex', alignItems:'center', gap:'4px', flexShrink:0}}>
            <Link href="/favoriler" style={{width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', color:'#6B7280', textDecoration:'none'}}>
              <Heart size={18} strokeWidth={1.75}/>
            </Link>

            {/* Kullanıcı */}
            <div style={{position:'relative'}}>
              <button onClick={() => setUserMenu(!userMenu)} style={{width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', color:'#6B7280', background:'transparent', border:'none', cursor:'pointer'}}>
                <User size={18} strokeWidth={1.75}/>
              </button>
              {userMenu && (
                <div style={{position:'absolute', top:'calc(100% + 8px)', right:0, background:'#fff', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:'1px solid #F0ECF5', padding:'8px', minWidth:'180px', zIndex:100}}>
                  {user ? (
                    <>
                      <div style={{padding:'8px 12px 12px', borderBottom:'1px solid #F0ECF5', marginBottom:'6px'}}>
                        <div style={{fontSize:'11px', color:'#9CA3AF'}}>Hoş geldin</div>
                        <div style={{fontSize:'13px', fontWeight:'600', color:'#1C1B2E', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{user.email}</div>
                      </div>
                      {[['📦','Siparişlerim','/hesabim/siparisler'],['❤️','Favorilerim','/favoriler'],['⚙️','Hesap Ayarları','/hesabim']].map(([i,ad,href]) => (
                        <Link key={href} href={href} onClick={() => setUserMenu(false)} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', color:'#1C1B2E', textDecoration:'none'}}>{i} {ad}</Link>
                      ))}
                      <div style={{borderTop:'1px solid #F0ECF5', marginTop:'6px', paddingTop:'6px'}}>
                        <button onClick={cikis} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', color:'#ef4444', background:'none', border:'none', width:'100%', cursor:'pointer'}}>🚪 Çıkış Yap</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" onClick={() => setUserMenu(false)} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:'700', color:'#E07090', textDecoration:'none'}}>Giriş Yap</Link>
                      <Link href="/kayit" onClick={() => setUserMenu(false)} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:'500', color:'#1C1B2E', textDecoration:'none'}}>Üye Ol</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sepet */}
            <Link href="/sepet" style={{display:'flex', alignItems:'center', gap:'6px', background:'#F0EEF8', padding:'8px 14px', borderRadius:'12px', textDecoration:'none', flexShrink:0}}>
              <ShoppingBag size={18} strokeWidth={1.75} style={{color:'#E07090'}}/>
              <span style={{fontSize:'13px', fontWeight:'600', color:'#1C1B2E'}}>Sepet</span>
              {adet > 0 && (
                <span style={{width:'18px', height:'18px', background:'linear-gradient(135deg,#E07090,#3B9FCC)', borderRadius:'50%', fontSize:'10px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700'}}>{adet}</span>
              )}
            </Link>

            {/* Hamburger - sadece mobilde */}
            <button onClick={() => setMenuAcik(!menuAcik)} style={{width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', color:'#6B7280', background:'transparent', border:'none', cursor:'pointer'}} className="lg:hidden">
              {menuAcik ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobil menü */}
      {menuAcik && (
        <div style={{position:'fixed', inset:0, zIndex:40, background:'#fff', paddingTop:'80px', paddingLeft:'24px', paddingRight:'24px', overflowY:'auto'}}>
          <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
            {[['🥛 Çiğ Süt','/urunler?kategori=sut'],['🧀 Peynir','/urunler?kategori=peynir'],['🧈 Tereyağı','/urunler?kategori=tereyag'],['Tüm Ürünler','/urunler'],['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Blog','/blog'],['Hakkımızda','/hakkimizda'],['İletişim','/iletisim']].map(([ad,href]) => (
              <Link key={href} href={href} onClick={() => setMenuAcik(false)}
                style={{display:'block', padding:'14px 16px', fontSize:'16px', fontWeight:'500', color:'#1C1B2E', textDecoration:'none', borderRadius:'12px'}}>
                {ad}
              </Link>
            ))}
          </div>
          <div style={{borderTop:'1px solid #F0ECF5', marginTop:'24px', paddingTop:'24px', display:'flex', flexDirection:'column', gap:'10px'}}>
            {user ? (
              <button onClick={cikis} style={{background:'#fff', border:'2px solid #F4A7B9', color:'#E07090', fontWeight:'600', fontSize:'14px', padding:'14px', borderRadius:'50px', cursor:'pointer'}}>Çıkış Yap</button>
            ) : (
              <>
                <Link href="/giris" onClick={() => setMenuAcik(false)} style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)', color:'#fff', fontWeight:'600', fontSize:'14px', padding:'14px', borderRadius:'50px', textAlign:'center', textDecoration:'none', display:'block'}}>Giriş Yap</Link>
                <Link href="/kayit" onClick={() => setMenuAcik(false)} style={{background:'#fff', border:'2px solid #F4A7B9', color:'#E07090', fontWeight:'600', fontSize:'14px', padding:'14px', borderRadius:'50px', textAlign:'center', textDecoration:'none', display:'block'}}>Üye Ol</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
