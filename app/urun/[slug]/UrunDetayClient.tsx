'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, RefreshCw, Plus, Minus, Check, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

interface Props { urun: Urun; benzerler: Urun[] }

export default function UrunDetayClient({ urun, benzerler }: Props) {
  const [aktifGorsel, setAktifGorsel] = useState(0)
  const [adet, setAdet] = useState(1)
  const [eklendi, setEklendi] = useState(false)
  const [favori, setFavori] = useState(false)
  const ekle = useSepet(s => s.ekle)

  const gorseller = urun.site_product_images || []
  const aktifUrl = gorseller[aktifGorsel]?.url || ''
  const indirim = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0

  const sepeteEkle = () => {
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun, adet)
    setEklendi(true)
    toast.success(`${urun.name} sepete eklendi!`)
    setTimeout(() => setEklendi(false), 2000)
  }

  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
        {/* Breadcrumb */}
        <nav style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'32px',fontSize:'12px',color:'#9CA3AF'}}>
          <Link href="/" style={{color:'#9CA3AF',textDecoration:'none'}}>Ana Sayfa</Link>
          <ChevronRight size={12}/>
          <Link href="/urunler" style={{color:'#9CA3AF',textDecoration:'none'}}>Ürünler</Link>
          {urun.site_kategoriler && <><ChevronRight size={12}/><Link href={`/kategoriler/${urun.site_kategoriler.slug}`} style={{color:'#9CA3AF',textDecoration:'none'}}>{urun.site_kategoriler.name}</Link></>}
          <ChevronRight size={12}/>
          <span style={{color:'#1C1B2E',fontWeight:500}}>{urun.name}</span>
        </nav>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'start'}}>
          {/* Görseller */}
          <div>
            <div style={{background:'#fff',borderRadius:'24px',overflow:'hidden',aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px',marginBottom:'12px',border:'1px solid #F0ECF5'}}>
              {aktifUrl ? (
                <img src={aktifUrl} alt={urun.name} style={{width:'100%',height:'100%',objectFit:'contain'}} loading="eager"/>
              ) : <span style={{fontSize:'96px'}}>🥛</span>}
            </div>
            {gorseller.length > 1 && (
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {gorseller.map((g,i)=>(
                  <button key={g.id} onClick={()=>setAktifGorsel(i)}
                    style={{width:'72px',height:'72px',borderRadius:'12px',overflow:'hidden',border:`2px solid ${aktifGorsel===i?'#E07090':'#F0ECF5'}`,background:'#fff',cursor:'none',transition:'border-color 0.2s',padding:'6px'}}>
                    <img src={g.url} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div>
            <div style={{display:'flex',gap:'8px',marginBottom:'12px',flexWrap:'wrap'}}>
              {urun.yeni && <span style={{background:'#EBF7FC',color:'#3B9FCC',fontSize:'10px',fontWeight:700,padding:'4px 10px',borderRadius:'50px'}}>YENİ</span>}
              {indirim > 0 && <span style={{background:'#FEF0F4',color:'#E07090',fontSize:'10px',fontWeight:700,padding:'4px 10px',borderRadius:'50px'}}>-%{indirim} İNDİRİM</span>}
              {urun.site_kategoriler && <span style={{background:'#F0EEF8',color:'#6B7280',fontSize:'10px',fontWeight:700,padding:'4px 10px',borderRadius:'50px'}}>{urun.site_kategoriler.name}</span>}
            </div>

            <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',fontWeight:400,color:'#1C1B2E',lineHeight:1.2,marginBottom:'16px'}}>{urun.name}</h1>

            {/* Yıldızlar */}
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
              <div style={{display:'flex',gap:'2px'}}>
                {[1,2,3,4,5].map(s=><Star key={s} size={16} className="text-yellow-400" fill="currentColor"/>)}
              </div>
              <span style={{fontSize:'13px',color:'#6B7280',fontWeight:500}}>4.9 (48 yorum)</span>
            </div>

            {/* Fiyat */}
            <div style={{display:'flex',alignItems:'flex-end',gap:'12px',marginBottom:'24px'}}>
              <span style={{fontFamily:'"Playfair Display",serif',fontSize:'40px',fontWeight:400,color:'#1C1B2E'}}>₺{urun.fiyat.toFixed(2)}</span>
              {urun.eski_fiyat && <span style={{fontSize:'20px',color:'#9CA3AF',textDecoration:'line-through',marginBottom:'4px'}}>₺{urun.eski_fiyat.toFixed(2)}</span>}
            </div>

            {urun.aciklama && <p style={{fontSize:'14px',lineHeight:'1.8',color:'#6B7280',marginBottom:'24px'}}>{urun.aciklama}</p>}

            {/* Sertifikalar */}
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'24px'}}>
              {['🇪🇺 AB Onaylı','🌿 %100 Doğal','✓ Katkısız'].map(s=>(
                <span key={s} style={{background:'#F0EEF8',color:'#1C1B2E',fontSize:'11px',fontWeight:600,padding:'6px 12px',borderRadius:'50px',border:'1px solid #F0ECF5'}}>{s}</span>
              ))}
            </div>

            {/* Adet & Sepet */}
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
              <div style={{display:'flex',alignItems:'center',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'12px',overflow:'hidden'}}>
                <button onClick={()=>setAdet(Math.max(1,adet-1))} style={{width:'44px',height:'44px',display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'none',color:'#6B7280'}}><Minus size={16}/></button>
                <span style={{width:'44px',textAlign:'center',fontSize:'16px',fontWeight:700,color:'#1C1B2E'}}>{adet}</span>
                <button onClick={()=>setAdet(adet+1)} style={{width:'44px',height:'44px',display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'none',color:'#6B7280'}}><Plus size={16}/></button>
              </div>
              <button onClick={sepeteEkle} disabled={urun.stok_takip && urun.stok <= 0}
                style={{flex:1,height:'44px',borderRadius:'50px',border:'none',fontFamily:'inherit',fontSize:'14px',fontWeight:700,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',cursor:'none',transition:'all 0.25s',background:eklendi?'#22c55e':'linear-gradient(135deg,#E07090,#3B9FCC)',boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>
                {eklendi ? <><Check size={16}/>Sepete Eklendi!</> : <><ShoppingBag size={16}/>Sepete Ekle · ₺{(urun.fiyat*adet).toFixed(2)}</>}
              </button>
              <button onClick={()=>setFavori(!favori)}
                style={{width:'44px',height:'44px',borderRadius:'12px',border:`2px solid ${favori?'#F4A7B9':'#F0ECF5'}`,background: favori?'#FEF0F4':'#fff',display:'flex',alignItems:'center',justifyContent:'center',cursor:'none',transition:'all 0.25s'}}>
                <Heart size={18} className={favori?'text-[#E07090]':'text-[#9CA3AF]'} fill={favori?'#E07090':'none'}/>
              </button>
            </div>

            {/* Stok */}
            {urun.stok_takip && (
              <p style={{fontSize:'12px',color: urun.stok>10?'#22c55e':urun.stok>0?'#f59e0b':'#ef4444',fontWeight:600,marginBottom:'20px'}}>
                {urun.stok>10?'✓ Stokta var':urun.stok>0?`⚠️ Son ${urun.stok} adet`:'✕ Stok tükendi'}
              </p>
            )}

            {/* Teslimat kartı */}
            <div style={{background:'#fff',borderRadius:'16px',padding:'20px',border:'1px solid #F0ECF5'}}>
              <p style={{fontSize:'11px',fontWeight:700,letterSpacing:'0.15em',textTransform:'uppercase',color:'#9CA3AF',marginBottom:'14px'}}>Teslimat & İade</p>
              {[{icon:<Truck size={14}/>,t:'İstanbul içi aynı gün teslimat'},{icon:<RefreshCw size={14}/>,t:'30 gün içinde ücretsiz iade'},{icon:<ShieldCheck size={14}/>,t:'Soğuk zincir ile güvenli taşıma'}].map((item,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'12px',color:'#6B7280',marginBottom:'8px'}}>
                  <span style={{color:'#E07090'}}>{item.icon}</span>{item.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benzer Ürünler */}
        {benzerler.length > 0 && (
          <div style={{marginTop:'64px'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',color:'#1C1B2E',marginBottom:'24px'}}>Benzer Ürünler</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
              {benzerler.map(u=><ProductCard key={u.id} urun={u}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
