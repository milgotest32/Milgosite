'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle, ArrowUpRight, Clock } from 'lucide-react'
export const dynamic = 'force-dynamic'

const S = {
  card: { background:'#fff', borderRadius:'16px', border:'1px solid #F0ECF5', padding:'20px' } as React.CSSProperties,
  h2: { fontSize:'20px', fontWeight:700, color:'#1C1B2E', marginBottom:'16px' } as React.CSSProperties,
}

export default function AdminPage() {
  const [stats, setStats] = useState({ siparisler:0, urunler:0, musteriler:0, gelir:0, bugunCiro:0 })
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [dusukStok, setDusukStok] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('site_siparisler').select('*', { count:'exact', head:true }),
      supabase.from('site_products').select('*', { count:'exact', head:true }).neq('durum','deleted'),
      supabase.from('site_users').select('*', { count:'exact', head:true }),
      supabase.from('site_siparisler').select('toplam,created_at').eq('odeme_durumu','odendi'),
      supabase.from('site_siparisler').select('*,site_siparis_kalemleri(*)').order('created_at',{ascending:false}).limit(8),
      supabase.from('site_products').select('id,name,stok,min_stok').eq('stok_takip',true).lt('stok',5).neq('durum','deleted').limit(10),
    ]).then(([sip,urun,mus,gelir,sonSip,dusuk]) => {
      const toplamGelir = (gelir.data||[]).reduce((t:number,s:any) => t+(s.toplam||0), 0)
      const bugun = new Date(); bugun.setHours(0,0,0,0)
      const bugunCiro = (gelir.data||[]).filter((s:any)=>new Date(s.created_at)>=bugun).reduce((t:number,s:any)=>t+(s.toplam||0),0)
      setStats({ siparisler:sip.count||0, urunler:urun.count||0, musteriler:mus.count||0, gelir:toplamGelir, bugunCiro })
      setSiparisler(sonSip.data||[])
      setDusukStok(dusuk.data||[])
      setLoading(false)
    })
  }, [])

  const DURUM_RENK: Record<string,string> = {
    bekliyor:'#F59E0B', onaylandi:'#3B9FCC', kargoda:'#8B5CF6', teslim:'#22C55E', iptal:'#EF4444'
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'24px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Dashboard</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>{new Date().toLocaleDateString('tr-TR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
      </div>

      {/* Stat kartları */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {[
          {icon:<ShoppingBag size={20}/>,baslik:'Toplam Sipariş',deger:stats.siparisler,renk:'#FEF0F4',ic:'#E07090'},
          {icon:<TrendingUp size={20}/>,baslik:'Toplam Gelir',deger:`₺${stats.gelir.toLocaleString('tr-TR',{maximumFractionDigits:0})}`,renk:'#F0FDF4',ic:'#22C55E'},
          {icon:<Package size={20}/>,baslik:'Aktif Ürün',deger:stats.urunler,renk:'#EBF7FC',ic:'#3B9FCC'},
          {icon:<Users size={20}/>,baslik:'Müşteri',deger:stats.musteriler,renk:'#FAF5FF',ic:'#8B5CF6'},
        ].map(item=>(
          <div key={item.baslik} style={S.card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{width:'40px',height:'40px',background:item.renk,borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:item.ic}}>{item.icon}</div>
              <ArrowUpRight size={16} style={{color:'#9CA3AF'}}/>
            </div>
            <div style={{marginTop:'12px',fontSize:'28px',fontWeight:700,color:'#1C1B2E',fontFamily:'"Playfair Display",serif'}}>{item.deger}</div>
            <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'2px'}}>{item.baslik}</div>
          </div>
        ))}
      </div>

      {/* Bugün ciro */}
      <div style={{...S.card, background:'linear-gradient(135deg,#E07090,#3B9FCC)', marginBottom:'24px', padding:'20px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.7)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'6px'}}>Bugünkü Ciro</div>
            <div style={{fontSize:'36px',fontWeight:700,color:'#fff',fontFamily:'"Playfair Display",serif'}}>₺{stats.bugunCiro.toLocaleString('tr-TR',{maximumFractionDigits:0})}</div>
          </div>
          <Clock size={48} style={{color:'rgba(255,255,255,0.2)'}}/>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        {/* Son siparişler */}
        <div style={{...S.card, gridColumn:'span 1'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <h2 style={{...S.h2,marginBottom:0}}>Son Siparişler</h2>
            <Link href="/admin/siparisler" style={{fontSize:'12px',color:'#E07090',textDecoration:'none',fontWeight:600}}>Tümünü Gör →</Link>
          </div>
          {loading ? <p style={{color:'#9CA3AF',fontSize:'13px'}}>Yükleniyor...</p> : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {siparisler.map(s=>(
                <Link key={s.id} href={`/admin/siparisler/${s.id}`} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'#F8F7FC',borderRadius:'10px',textDecoration:'none'}}>
                  <div>
                    <div style={{fontSize:'12px',fontWeight:700,color:'#1C1B2E',fontFamily:'monospace'}}>#{s.siparis_no}</div>
                    <div style={{fontSize:'11px',color:'#9CA3AF'}}>{s.musteri_ad || s.musteri_email}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>₺{s.toplam?.toFixed(2)}</div>
                    <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'50px',background:DURUM_RENK[s.durum]+'20',color:DURUM_RENK[s.durum]}}>{s.durum}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Düşük stok */}
        <div style={S.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <h2 style={{...S.h2,marginBottom:0}}>⚠️ Düşük Stok</h2>
            <Link href="/admin/urunler" style={{fontSize:'12px',color:'#E07090',textDecoration:'none',fontWeight:600}}>Yönet →</Link>
          </div>
          {dusukStok.length === 0 ? (
            <p style={{color:'#9CA3AF',fontSize:'13px'}}>Düşük stok yok ✓</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {dusukStok.map(u=>(
                <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'#FEF2F2',borderRadius:'10px'}}>
                  <div style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'150px'}}>{u.name}</div>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#EF4444',background:'#FEE2E2',padding:'2px 10px',borderRadius:'50px',flexShrink:0}}>{u.stok} adet</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
