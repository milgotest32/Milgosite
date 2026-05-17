'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, User, Menu, X, Search, Heart, ChevronDown, Package, MapPin, Settings, LogOut, Shield } from 'lucide-react'
import MiniCart from '../cart/MiniCart'

const KATEGORILER = [
  { slug: 'cig-sut', ad: 'Çiğ Süt', emoji: '🥛' },
  { slug: 'peynir', ad: 'Peynir', emoji: '🧀' },
  { slug: 'tereyagi', ad: 'Tereyağı', emoji: '🧈' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuAcik, setMenuAcik] = useState(false)
  const [sepetAcik, setSepetAcik] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [urunMenu, setUrunMenu] = useState(false)
  const [aramaAcik, setAramaAcik] = useState(false)
  const [arama, setArama] = useState('')
  const adet = useSepet(s => s.adetToplam())
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user || null))
    return () => subscription.unsubscribe()
  }, [])

  const cikis = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setUserMenu(false)
  }

  const aramaYap = (e: React.FormEvent) => {
    e.preventDefault()
    if (arama.trim()) { router.push(`/arama?q=${encodeURIComponent(arama)}`); setAramaAcik(false) }
  }

  const S = {
    nav: { background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid #F0ECF5', position:'sticky' as const, top:0, zIndex:100, boxShadow:'0 1px 12px rgba(224,112,144,0.06)' } as React.CSSProperties,
    inner: { maxWidth:'1280px', margin:'0 auto', padding:'0 24px', height:'66px', display:'flex', alignItems:'center', gap:'8px' } as React.CSSProperties,
    logo: { fontFamily:'"Instrument Serif", "Playfair Display", serif', fontSize:'26px', color:'#1C1B2E', textDecoration:'none', marginRight:'12px', flexShrink:0, letterSpacing:'-0.01em' } as React.CSSProperties,
    link: { padding:'8px 12px', fontSize:'13px', fontWeight:500, color:'#6B7280', textDecoration:'none', borderRadius:'10px', transition:'all 0.2s', whiteSpace:'nowrap' as const } as React.CSSProperties,
    iconBtn: { width:'36px', height:'36px', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px', color:'#6B7280', background:'transparent', border:'none', cursor:'none', flexShrink:0 } as React.CSSProperties,
    dropdown: { position:'absolute' as const, top:'calc(100% + 8px)', background:'#fff', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', border:'1px solid #F0ECF5', padding:'8px', minWidth:'200px', zIndex:200 } as React.CSSProperties,
    dropItem: { display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', fontSize:'13px', fontWeight:500, color:'#1C1B2E', textDecoration:'none' } as React.CSSProperties,
  }

  return (
    <>
      {/* Band */}
      <div style={{background:'linear-gradient(90deg,#E07090,#3B9FCC)',color:'#fff',textAlign:'center',padding:'8px 16px',fontSize:'12px',fontWeight:500}}>
        🚚 İstanbul içi aynı gün teslimat · <strong>MILGO10</strong> kodu ile ilk siparişte %10 indirim
      </div>

      <nav style={S.nav}>
        <div style={S.inner}>
          <Link href="/" style={S.logo}>milgo<span style={{color:'#E07090'}}>.</span></Link>

          {/* Masaüstü nav */}
          <div style={{display:'flex',alignItems:'center',gap:'2px',flex:1}} className="hidden lg:flex">
            <div style={{position:'relative'}} onMouseEnter={()=>setUrunMenu(true)} onMouseLeave={()=>setUrunMenu(false)}>
              <button style={{...S.link,display:'flex',alignItems:'center',gap:'4px',background:'none',border:'none',cursor:'none'} as React.CSSProperties}>
                Ürünler <ChevronDown size={13} style={{transition:'transform 0.2s',transform:urunMenu?'rotate(180deg)':'none'}}/>
              </button>
              {urunMenu && (
                <div style={S.dropdown}>
                  <Link href="/urunler" style={{...S.dropItem,color:'#9CA3AF',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase'}} className="px-3 py-2 block">Tüm Ürünler</Link>
                  {KATEGORILER.map(k=>(
                    <Link key={k.slug} href={`/kategoriler/${k.slug}`} style={S.dropItem}>{k.emoji} {k.ad}</Link>
                  ))}
                  <div style={{borderTop:'1px solid #F0ECF5',marginTop:'6px',paddingTop:'6px'}}>
                    <Link href="/kampanyalar" style={{...S.dropItem,color:'#E07090',fontWeight:700}}>🔥 Kampanyalar</Link>
                    <Link href="/indirimler" style={{...S.dropItem,color:'#E07090',fontWeight:700}}>💸 İndirimdekiler</Link>
                  </div>
                </div>
              )}
            </div>
            {[['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Blog','/blog'],['Hakkımızda','/hakkimizda']].map(([ad,href])=>(
              <Link key={href} href={href} style={S.link}>{ad}</Link>
            ))}
          </div>

          {/* Sağ */}
          <div style={{display:'flex',alignItems:'center',gap:'2px',marginLeft:'auto'}}>
            {/* Arama */}
            <button onClick={()=>setAramaAcik(!aramaAcik)} style={S.iconBtn}><Search size={18} strokeWidth={1.75}/></button>

            {/* Favori */}
            <Link href="/hesabim/favoriler" style={{...S.iconBtn, textDecoration:'none'} as React.CSSProperties}><Heart size={18} strokeWidth={1.75}/></Link>

            {/* Kullanıcı */}
            <div style={{position:'relative'}}>
              <button onClick={()=>setUserMenu(!userMenu)} style={S.iconBtn}><User size={18} strokeWidth={1.75}/></button>
              {userMenu && (
                <div style={{...S.dropdown,right:0,left:'auto'}}>
                  {user ? (
                    <>
                      <div style={{padding:'8px 12px 12px',borderBottom:'1px solid #F0ECF5',marginBottom:'6px'}}>
                        <div style={{fontSize:'11px',color:'#9CA3AF'}}>Hoş geldin</div>
                        <div style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'170px'}}>{user.email}</div>
                      </div>
                      {[{icon:<Package size={14}/>,ad:'Siparişlerim',href:'/hesabim/siparisler'},{icon:<Heart size={14}/>,ad:'Favorilerim',href:'/hesabim/favoriler'},{icon:<MapPin size={14}/>,ad:'Adreslerim',href:'/hesabim/adresler'},{icon:<Settings size={14}/>,ad:'Hesap Ayarları',href:'/hesabim'}].map(item=>(
                        <Link key={item.href} href={item.href} onClick={()=>setUserMenu(false)} style={S.dropItem}>
                          <span style={{color:'#9CA3AF'}}>{item.icon}</span>{item.ad}
                        </Link>
                      ))}
                      <div style={{borderTop:'1px solid #F0ECF5',marginTop:'6px',paddingTop:'6px'}}>
                        <Link href="/admin" onClick={()=>setUserMenu(false)} style={{...S.dropItem,color:'#6B7280'}}><Shield size={14}/>Admin Panel</Link>
                        <button onClick={cikis} style={{...S.dropItem,color:'#ef4444',background:'none',border:'none',width:'100%',cursor:'none'} as React.CSSProperties}><LogOut size={14}/>Çıkış Yap</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/giris" onClick={()=>setUserMenu(false)} style={{...S.dropItem,color:'#E07090',fontWeight:700}}>Giriş Yap</Link>
                      <Link href="/kayit" onClick={()=>setUserMenu(false)} style={S.dropItem}>Üye Ol</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sepet */}
            <button onClick={()=>setSepetAcik(true)} style={{display:'flex',alignItems:'center',gap:'8px',background:'#F0EEF8',padding:'8px 14px',borderRadius:'12px',border:'none',cursor:'none',flexShrink:0} as React.CSSProperties}>
              <ShoppingBag size={18} strokeWidth={1.75} style={{color:'#E07090'}}/>
              <span style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}} className="hidden sm:block">Sepet</span>
              {adet > 0 && <span style={{width:'18px',height:'18px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',borderRadius:'50%',fontSize:'10px',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{adet}</span>}
            </button>

            {/* Mobil menu */}
            <button onClick={()=>setMenuAcik(!menuAcik)} style={{...S.iconBtn,display:'flex'} as React.CSSProperties} className="lg:hidden">
              {menuAcik ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {/* Arama barı */}
        {aramaAcik && (
          <div style={{borderTop:'1px solid #F0ECF5',padding:'12px 24px',background:'#fff'}}>
            <form onSubmit={aramaYap} style={{maxWidth:'600px',margin:'0 auto',display:'flex',alignItems:'center',gap:'8px',background:'#F0EEF8',borderRadius:'12px',padding:'0 16px'}}>
              <Search size={16} style={{color:'#9CA3AF',flexShrink:0}}/>
              <input autoFocus value={arama} onChange={e=>setArama(e.target.value)} placeholder="Ürün, kategori ara..."
                style={{flex:1,background:'transparent',border:'none',padding:'12px 0',fontSize:'14px',color:'#1C1B2E',outline:'none'}}/>
              {arama && <button type="button" onClick={()=>setArama('')} style={{background:'none',border:'none',cursor:'none',color:'#9CA3AF'}}><X size={14}/></button>}
            </form>
          </div>
        )}
      </nav>

      {/* Mini sepet overlay */}
      {sepetAcik && (
        <>
          <div onClick={()=>setSepetAcik(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:199}}/>
          <MiniCart onClose={()=>setSepetAcik(false)}/>
        </>
      )}

      {/* Mobil menü */}
      {menuAcik && (
        <div style={{position:'fixed',inset:0,zIndex:150,background:'#fff',paddingTop:'80px',overflowY:'auto'}} className="lg:hidden">
          <div style={{padding:'0 24px'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
              {[['🥛 Çiğ Süt','/kategoriler/cig-sut'],['🧀 Peynir','/kategoriler/peynir'],['🧈 Tereyağı','/kategoriler/tereyagi'],['Tüm Ürünler','/urunler'],['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Blog','/blog'],['Hakkımızda','/hakkimizda'],['İletişim','/iletisim']].map(([ad,href])=>(
                <Link key={href} href={href} onClick={()=>setMenuAcik(false)}
                  style={{display:'block',padding:'14px 16px',fontSize:'16px',fontWeight:500,color:'#1C1B2E',textDecoration:'none',borderRadius:'12px'}}>
                  {ad}
                </Link>
              ))}
            </div>
            <div style={{borderTop:'1px solid #F0ECF5',marginTop:'24px',paddingTop:'24px',display:'flex',flexDirection:'column',gap:'10px'}}>
              {user ? (
                <button onClick={()=>{cikis();setMenuAcik(false)}} style={{background:'#fff',border:'2px solid #F4A7B9',color:'#E07090',fontWeight:600,fontSize:'14px',padding:'14px',borderRadius:'50px',cursor:'none'}}>Çıkış Yap</button>
              ) : (
                <>
                  <Link href="/giris" onClick={()=>setMenuAcik(false)} style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',fontWeight:700,fontSize:'14px',padding:'14px',borderRadius:'50px',textAlign:'center',textDecoration:'none',display:'block'}}>Giriş Yap</Link>
                  <Link href="/kayit" onClick={()=>setMenuAcik(false)} style={{background:'#fff',border:'2px solid #F4A7B9',color:'#E07090',fontWeight:600,fontSize:'14px',padding:'14px',borderRadius:'50px',textAlign:'center',textDecoration:'none',display:'block'}}>Üye Ol</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
