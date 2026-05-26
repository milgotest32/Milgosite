'use client'
import { useSepet } from '@/lib/sepet'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users, Percent, FileText,
  Image, Globe, Map, Settings, BarChart2, LogOut, ChevronRight, Bell, Shield, Info, ArrowLeftRight, Store, Gift, Mail,
  Star, MessageSquare, MapPin, RefreshCw
} from 'lucide-react'

const MENU = [
  { grup: 'Genel', items: [
    { href: '/admin', icon: <LayoutDashboard size={16}/>, ad: 'Dashboard' },
    { href: '/admin/raporlar', icon: <BarChart2 size={16}/>, ad: 'Raporlar' },
  ]},
  { grup: 'Katalog', items: [
    { href: '/admin/urunler', icon: <Package size={16}/>, ad: 'Ürünler' },
    { href: '/admin/paketler', icon: <Package size={16}/>, ad: 'Paketler' },
    { href: '/admin/kategoriler', icon: <Tag size={16}/>, ad: 'Kategoriler' },
  ]},
  { grup: 'Satış', items: [
    { href: '/admin/siparisler', icon: <ShoppingBag size={16}/>, ad: 'Siparişler' },
    { href: '/admin/musteriler', icon: <Users size={16}/>, ad: 'Müşteriler' },
    { href: '/admin/kuponlar', icon: <Percent size={16}/>, ad: 'Kuponlar' },
    { href: '/admin/referans', icon: <Gift size={16}/>, ad: 'Referans' },
    { href: '/admin/mail-sablonlar', icon: <Mail size={16}/>, ad: 'Mail Şablonları' },
    { href: '/admin/yorumlar', icon: <Star size={16}/>, ad: 'Yorumlar' },
    { href: '/admin/mesajlar', icon: <MessageSquare size={16}/>, ad: 'Mesajlar' },
    { href: '/admin/abonelikler', icon: <RefreshCw size={16}/>, ad: 'Abonelikler' },
    { href: '/admin/raporlar/bolgeler', icon: <MapPin size={16}/>, ad: 'Bölge Raporu' },
  ]},
  { grup: 'İçerik', items: [
    { href: '/admin/hakkimizda', icon: <Info size={16}/>, ad: 'Hakkımızda' },
    { href: '/admin/popup', icon: <Bell size={16}/>, ad: 'Popup' },
    { href: '/admin/blog', icon: <FileText size={16}/>, ad: 'Blog' },
    { href: '/admin/bannerlar', icon: <Image size={16}/>, ad: 'Bannerlar' },
    { href: '/admin/medya', icon: <Image size={16}/>, ad: 'Medya' },
  ]},
  { grup: 'Sistem', items: [
    { href: '/admin/seo', icon: <Globe size={16}/>, ad: 'SEO' },
    { href: '/admin/yonlendirmeler', icon: <ArrowLeftRight size={16}/>, ad: 'Yönlendirmeler' },
    { href: '/admin/fiyuu', icon: <Store size={16}/>, ad: 'Fiyuu' },
    { href: '/admin/hizmet-bolgeleri', icon: <Map size={16}/>, ad: 'Hizmet Bölgeleri' },
    { href: '/admin/bolge-bildirimler', icon: <Bell size={16}/>, ad: 'Bölge Bildirimleri' },
    { href: '/admin/roller', icon: <Shield size={16}/>, ad: 'Rol & Yetkiler' },
    { href: '/admin/ayarlar', icon: <Settings size={16}/>, ad: 'Ayarlar' },
  ]},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [yetkiKontrol, setYetkiKontrol] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      // Rol kontrolü - SECURITY DEFINER RPC ile RLS bypass
      const { data: role, error: roleError } = await supabase.rpc('get_my_role')
      if (roleError || (role !== 'admin' && role !== 'superadmin')) {
        router.push('/')
        return
      }
      setUser(data.session.user)
      document.body.classList.add('admin-body')
      setYetkiKontrol(false)
    })
  }, [router])

  const { temizle } = useSepet()
  const cikis = async () => { temizle(); await supabase.auth.signOut(); router.push('/giris') }

  if (yetkiKontrol) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F8F7FC'}}>
      <p style={{color:'#9CA3AF',fontSize:'14px'}}>Yetki kontrol ediliyor...</p>
    </div>
  )

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#F8F7FC',fontFamily:'"Plus Jakarta Sans",sans-serif'}}>
      <aside style={{width: collapsed ? '64px' : '220px',background:'#1C1B2E',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,bottom:0,zIndex:50,transition:'width 0.25s',overflow:'hidden'}}>
        <div style={{padding:'20px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
          <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'14px',fontWeight:700,color:'#fff'}}>M</div>
          {!collapsed && <div>
            <div style={{fontSize:'15px',fontWeight:700,color:'#fff',fontFamily:'"Playfair Display",serif'}}>milgo<span style={{color:'#F4A7B9'}}>.</span></div>
            <div style={{fontSize:'9px',color:'rgba(255,255,255,0.4)',letterSpacing:'0.15em',textTransform:'uppercase'}}>Admin Panel</div>
          </div>}
        </div>
        <nav style={{flex:1,overflowY:'auto',padding:'12px 8px'}}>
          {MENU.map(g => (
            <div key={g.grup} style={{marginBottom:'4px'}}>
              {!collapsed && <div style={{fontSize:'9px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',padding:'8px 8px 4px'}}>{g.grup}</div>}
              {g.items.map(item => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link key={item.href} href={item.href}
                    style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'10px',marginBottom:'2px',textDecoration:'none',background:active?'rgba(244,167,185,0.15)':'transparent',color:active?'#F4A7B9':'rgba(255,255,255,0.55)',fontSize:'13px',fontWeight:active?600:400,transition:'all 0.15s',whiteSpace:'nowrap'}}>
                    <span style={{flexShrink:0}}>{item.icon}</span>
                    {!collapsed && item.ad}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div style={{padding:'12px 8px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'10px',color:'rgba(255,255,255,0.4)',fontSize:'13px',textDecoration:'none',marginBottom:'4px',whiteSpace:'nowrap'}}>
            <Globe size={16}/>
            {!collapsed && 'Siteye Git'}
          </Link>
          <button onClick={cikis} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'10px',color:'rgba(255,255,255,0.4)',fontSize:'13px',background:'none',border:'none',cursor:'pointer',width:'100%',fontFamily:'inherit',whiteSpace:'nowrap'}}>
            <LogOut size={16}/>
            {!collapsed && 'Çıkış'}
          </button>
        </div>
      </aside>
      <div style={{marginLeft: collapsed ? '64px' : '220px',flex:1,display:'flex',flexDirection:'column',transition:'margin-left 0.25s'}}>
        <header style={{background:'#fff',borderBottom:'1px solid #F0ECF5',padding:'0 24px',height:'56px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:40}}>
          <button onClick={()=>setCollapsed(!collapsed)} style={{background:'none',border:'none',cursor:'pointer',color:'#6B7280',display:'flex',alignItems:'center'}}>
            <ChevronRight size={18} style={{transform:collapsed?'none':'rotate(180deg)',transition:'transform 0.25s'}}/>
          </button>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <button style={{background:'none',border:'none',cursor:'pointer',color:'#6B7280',position:'relative'}}>
              <Bell size={18}/>
            </button>
            <div style={{width:'32px',height:'32px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff'}}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{flex:1,padding:'24px',overflowY:'auto'}}>
          {children}
        </main>
      </div>
    </div>
  )
}
