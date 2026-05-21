'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, Truck, ChevronRight, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import PaketOnerisi from '@/components/cart/PaketOnerisi'
export const dynamic = 'force-dynamic'

export default function SepetPage() {
  const { items, guncelle, cikar, araToplam, kargoUcreti, genelToplam, setKupon, indirim } = useSepet()
  const [kuponKod, setKuponKod] = useState('')
  const [kuponLoading, setKuponLoading] = useState(false)
  const [kuponMesaj, setKuponMesaj] = useState('')
  const [kuponBas, setKuponBas] = useState(false)

  const kuponUygula = async () => {
    if (!kuponKod.trim()) return
    setKuponLoading(true)
    try {
      const r = await fetch('/api/kupon', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ kod: kuponKod, tutar: araToplam() }) })
      const d = await r.json()
      if (d.gecerli) {
        setKupon(d.kupon, d.indirim)
        setKuponBas(true)
        setKuponMesaj(`✓ %${d.kupon.deger} indirim uygulandı! -₺${d.indirim.toFixed(2)}`)
        toast.success('Kupon uygulandı!')
      } else {
        setKuponMesaj(d.hata)
        toast.error(d.hata)
      }
    } catch { toast.error('Hata oluştu') }
    setKuponLoading(false)
  }

  if (items.length === 0) return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'20px',padding:'24px'}}>
      <div style={{width:'80px',height:'80px',background:'#fff',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(224,112,144,0.1)'}}>
        <ShoppingBag size={36} style={{color:'#F4A7B9'}}/>
      </div>
      <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',color:'#1C1B2E'}}>Sepetiniz Boş</h2>
      <p style={{color:'#9CA3AF',fontSize:'14px'}}>Henüz ürün eklemediniz.</p>
      <Link href="/urunler" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'14px 32px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700,boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>Alışverişe Başla</Link>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'24px 16px'}}>
      <style>{`
        @media (max-width: 768px) {
          .sepet-grid { grid-template-columns: 1fr !important; }
          .sepet-ozet { position: static !important; }
          .urun-satir { flex-wrap: wrap; gap: 12px !important; }
          .urun-sag { width: 100%; justify-content: space-between !important; }
          .urun-fiyat-toplam { display: none !important; }
        }
        @media (max-width: 480px) {
          .urun-gorsel { width: 64px !important; height: 64px !important; }
          .sepet-baslik { font-size: 24px !important; }
        }
      `}</style>

      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <Link href="/urunler" style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#9CA3AF',textDecoration:'none',marginBottom:'24px'}}>
          <ArrowLeft size={14}/>Alışverişe Devam Et
        </Link>
        <h1 className="sepet-baslik" style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',color:'#1C1B2E',marginBottom:'24px'}}>
          Sepetim <span style={{color:'#9CA3AF',fontSize:'22px'}}>({items.length} ürün)</span>
        </h1>

        <div className="sepet-grid" style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'20px',alignItems:'start'}}>
          {/* Ürünler */}
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {items.map(({urun,adet})=>{
              const g=urun.site_product_images?.[0]?.url
              return(
                <div key={urun.id} className="urun-satir" style={{background:'#fff',borderRadius:'20px',padding:'14px 16px',display:'flex',alignItems:'center',gap:'14px',border:'1px solid #F0ECF5'}}>
                  <Link href={`/urun/${urun.slug}`} className="urun-gorsel" style={{width:'80px',height:'80px',borderRadius:'14px',background:'#F0EEF8',overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',padding:'8px',textDecoration:'none'}}>
                    {g?<img src={g} alt={urun.name} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:<span style={{fontSize:'36px'}}>🥛</span>}
                  </Link>
                  <div style={{flex:1,minWidth:0}}>
                    <Link href={`/urun/${urun.slug}`} style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',textDecoration:'none',display:'block',marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{urun.name}</Link>
                    <span style={{fontSize:'15px',fontWeight:700,color:'#E07090'}}>₺{urun.fiyat.toFixed(2)}</span>
                  </div>
                  <div className="urun-sag" style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
                    <div style={{display:'flex',alignItems:'center',background:'#F0EEF8',borderRadius:'10px',overflow:'hidden'}}>
                      <button onClick={()=>guncelle(urun.id,adet-1)} style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'#6B7280'}}><Minus size={13}/></button>
                      <span style={{width:'28px',textAlign:'center',fontSize:'14px',fontWeight:700}}>{adet}</span>
                      <button onClick={()=>guncelle(urun.id,adet+1)} style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'#6B7280'}}><Plus size={13}/></button>
                    </div>
                    <span className="urun-fiyat-toplam" style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',minWidth:'68px',textAlign:'right'}}>₺{(urun.fiyat*adet).toFixed(2)}</span>
                    <button onClick={()=>{cikar(urun.id);toast.success('Ürün kaldırıldı')}} style={{width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center',background:'#FEF2F2',borderRadius:'10px',border:'none',cursor:'pointer',color:'#EF4444',flexShrink:0}}><Trash2 size={15}/></button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Özet */}
          <div className="sepet-ozet" style={{position:'sticky',top:'80px',display:'flex',flexDirection:'column',gap:'12px'}}>
            {/* Kupon */}
            <div style={{background:'#fff',borderRadius:'20px',padding:'20px',border:'1px solid #F0ECF5'}}>
              <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}><Tag size={16} style={{color:'#E07090'}}/>İndirim Kodu</h3>
              {!kuponBas ? (
                <div style={{display:'flex',gap:'8px'}}>
                  <input value={kuponKod} onChange={e=>setKuponKod(e.target.value)} onKeyDown={e=>e.key==='Enter'&&kuponUygula()} placeholder="Kod girin" style={{flex:1,background:'#F0EEF8',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                  <button onClick={kuponUygula} disabled={kuponLoading} style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 16px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                    {kuponLoading?'...':'Uygula'}
                  </button>
                </div>
              ) : null}
              {kuponMesaj && <p style={{fontSize:'12px',marginTop:'8px',color:kuponBas?'#22c55e':'#ef4444',fontWeight:600}}>{kuponMesaj}</p>}
            </div>

            {/* Kurye uyarısı */}
            {kargoUcreti() > 0 && (
              <div style={{background:'#EBF7FC',borderRadius:'16px',padding:'14px 16px',display:'flex',alignItems:'center',gap:'10px'}}>
                <Truck size={16} style={{color:'#3B9FCC',flexShrink:0}}/>
                <p style={{fontSize:'12px',color:'#3B9FCC',fontWeight:600}}>₺{(500-araToplam()).toFixed(0)} daha ekleyin, kurye ücretsiz!</p>
              </div>
            )}

            {/* Toplam */}
            <div style={{background:'#fff',borderRadius:'20px',padding:'24px',border:'1px solid #F0ECF5'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px'}}>Sipariş Özeti</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'20px'}}>
                {[
                  ['Ara Toplam', `₺${araToplam().toFixed(2)}`],
                  ['Kurye', kargoUcreti()===0?'Ücretsiz':`₺${kargoUcreti().toFixed(2)}`],
                  ...(indirim>0?[['İndirim', `-₺${indirim.toFixed(2)}`]]:[])
                ].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                    <span style={{color:'#6B7280'}}>{l}</span>
                    <span style={{fontWeight:600,color:l==='İndirim'?'#22c55e':'#1C1B2E'}}>{v}</span>
                  </div>
                ))}
                <div style={{borderTop:'1px solid #F0ECF5',paddingTop:'12px',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E'}}>Toplam</span>
                  <span style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:400,color:'#1C1B2E'}}>₺{genelToplam().toFixed(2)}</span>
                </div>
              </div>
              <Link href="/odeme" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'16px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700,boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>
                <Lock size={15}/>Güvenli Ödeme<ChevronRight size={15}/>
              </Link>
              <p style={{textAlign:'center',fontSize:'11px',color:'#9CA3AF',marginTop:'10px'}}>SSL ile korumalı güvenli ödeme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
