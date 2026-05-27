'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ShoppingCart, RefreshCw, User, Clock, Send } from 'lucide-react'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default function AdminSepetler() {
  const [sepetler, setSepetler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState<'hepsi'|'urunlu'|'terk'>('hepsi')

  const yukle = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_sepetler')
      .select(`
        id, user_id, updated_at, created_at,
        site_sepet_kalemleri(id, urun_ad, adet, fiyat, product_id),
        site_users(ad, soyad, email, telefon)
      `)
      .order('updated_at', { ascending: false })
      .limit(100)

    if (error) console.error(error)
    setSepetler(data || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const filtrelenmis = sepetler.filter(s => {
    const kalemleri = s.site_sepet_kalemleri || []
    if (filtre === 'urunlu') return kalemleri.length > 0
    if (filtre === 'terk') {
      const saat = (Date.now() - new Date(s.updated_at).getTime()) / 1000 / 60 / 60
      return kalemleri.length > 0 && saat > 2
    }
    return true
  })

  const ozet = {
    toplam: sepetler.length,
    urunlu: sepetler.filter(s => (s.site_sepet_kalemleri?.length || 0) > 0).length,
    terk: sepetler.filter(s => {
      const saat = (Date.now() - new Date(s.updated_at).getTime()) / 1000 / 60 / 60
      return (s.site_sepet_kalemleri?.length || 0) > 0 && saat > 2
    }).length,
    toplam_tutar: sepetler.reduce((t, s) =>
      t + (s.site_sepet_kalemleri || []).reduce((st: number, k: any) => st + (k.fiyat * k.adet), 0), 0)
  }

  const saat = (tarih: string) => {
    const diff = (Date.now() - new Date(tarih).getTime()) / 1000 / 60
    if (diff < 60) return `${Math.round(diff)}dk önce`
    if (diff < 1440) return `${Math.round(diff/60)}sa önce`
    return `${Math.round(diff/1440)}gün önce`
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:800,color:'#1C1B2E'}}>Aktif Sepetler</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Hangi üye sepete ne bırakmış</p>
        </div>
        <button onClick={yukle} style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <RefreshCw size={15} style={{color:'#6B7280'}}/>
        </button>
      </div>

      {/* Özet */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'20px'}}>
        {[
          { label:'Toplam Sepet', val: ozet.toplam, renk:'#E07090', bg:'#FEE8EF' },
          { label:'Ürünlü Sepet', val: ozet.urunlu, renk:'#3B9FCC', bg:'#EBF7FC' },
          { label:'Terk Edilen (+2sa)', val: ozet.terk, renk:'#F59E0B', bg:'#FEF9EC' },
          { label:'Toplam Değer', val: `₺${ozet.toplam_tutar.toFixed(2)}`, renk:'#22c55e', bg:'#F0FDF4' },
        ].map((k,i) => (
          <div key={i} style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'16px 20px'}}>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginBottom:'6px',fontWeight:600}}>{k.label}</p>
            <p style={{fontSize:'22px',fontWeight:800,color:k.renk}}>{k.val}</p>
          </div>
        ))}
      </div>

      {/* Filtre */}
      <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
        {([['hepsi','Hepsi'],['urunlu','Ürünlü'],['terk','Terk Edilen']] as any[]).map(([key,label]) => (
          <button key={key} onClick={()=>setFiltre(key)}
            style={{padding:'8px 16px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',
              background:filtre===key?'linear-gradient(135deg,#E07090,#3B9FCC)':'#F0ECF5',
              color:filtre===key?'#fff':'#6B7280'}}>
            {label}
          </button>
        ))}
      </div>

      {/* Sepet listesi */}
      {loading ? (
        <div style={{textAlign:'center',padding:'48px',color:'#9CA3AF'}}>Yükleniyor...</div>
      ) : filtrelenmis.length === 0 ? (
        <div style={{textAlign:'center',padding:'48px',color:'#9CA3AF'}}>
          <ShoppingCart size={40} style={{margin:'0 auto 12px',display:'block',opacity:.3}}/>
          <p>Sepet bulunamadı.</p>
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
          {filtrelenmis.map(s => {
            const kalemleri = s.site_sepet_kalemleri || []
            const user = s.site_users
            const toplam = kalemleri.reduce((t: number, k: any) => t + (k.fiyat * k.adet), 0)
            const saatFark = (Date.now() - new Date(s.updated_at).getTime()) / 1000 / 60 / 60
            const terkEdildi = kalemleri.length > 0 && saatFark > 2

            return (
              <div key={s.id} style={{background:'#fff',borderRadius:'16px',border:`1px solid ${terkEdildi?'#FED7AA':'#F0ECF5'}`,padding:'16px 20px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px'}}>
                  {/* Sol: Kullanıcı bilgisi */}
                  <div style={{display:'flex',alignItems:'center',gap:'12px',minWidth:0}}>
                    <div style={{width:'40px',height:'40px',borderRadius:'12px',background:s.user_id?'#FEE8EF':'#F0ECF5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      {s.user_id ? <User size={18} style={{color:'#E07090'}}/> : <span style={{fontSize:'18px'}}>👻</span>}
                    </div>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>
                        {user ? `${user.ad || ''} ${user.soyad || ''}`.trim() || 'İsimsiz' : 'Misafir'}
                      </p>
                      <p style={{fontSize:'12px',color:'#9CA3AF'}}>{user?.email || 'E-posta yok'}</p>
                      {user?.telefon && <p style={{fontSize:'12px',color:'#9CA3AF'}}>{user.telefon}</p>}
                    </div>
                  </div>

                  {/* Sağ: Tutar ve zaman */}
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <p style={{fontSize:'16px',fontWeight:800,color:'#1C1B2E'}}>₺{toplam.toFixed(2)}</p>
                    <div style={{display:'flex',alignItems:'center',gap:'4px',justifyContent:'flex-end',marginTop:'2px'}}>
                      <Clock size={11} style={{color:'#9CA3AF'}}/>
                      <span style={{fontSize:'11px',color:'#9CA3AF'}}>{saat(s.updated_at)}</span>
                    </div>
                    {terkEdildi && (
                      <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'50px',background:'#FEF9EC',color:'#F59E0B',display:'inline-block',marginTop:'4px'}}>
                        Terk Edildi
                      </span>
                    )}
                  </div>
                </div>

                {/* Ürünler */}
                {kalemleri.length > 0 ? (
                  <div style={{marginTop:'12px',paddingTop:'12px',borderTop:'1px solid #F0ECF5'}}>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                      {kalemleri.map((k: any, i: number) => (
                        <div key={i} style={{background:'#F8F7FC',borderRadius:'8px',padding:'5px 10px',fontSize:'12px',color:'#1C1B2E',display:'flex',alignItems:'center',gap:'6px'}}>
                          <span style={{fontWeight:700}}>{k.adet}×</span>
                          <span>{k.urun_ad}</span>
                          <span style={{color:'#9CA3AF'}}>₺{(k.fiyat*k.adet).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{marginTop:'10px',paddingTop:'10px',borderTop:'1px solid #F0ECF5'}}>
                    <p style={{fontSize:'12px',color:'#D1D5DB',fontStyle:'italic'}}>Sepet boş</p>
                  </div>
                )}

                {/* Mail gönder butonu (terk edilmişse) */}
                {terkEdildi && user?.email && (
                  <div style={{marginTop:'10px',display:'flex',justifyContent:'flex-end'}}>
                    <Link href={`/admin/mail-sablonlar`}
                      style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'6px 14px',borderRadius:'8px',fontSize:'11px',fontWeight:700,textDecoration:'none'}}>
                      <Send size={11}/> Mail Gönder
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
