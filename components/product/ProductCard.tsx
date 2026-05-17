'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, Star, ShoppingBag, Check } from 'lucide-react'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import toast from 'react-hot-toast'

interface Props { urun: Urun; view?: 'grid' | 'list' }

export default function ProductCard({ urun, view = 'grid' }: Props) {
  const [favori, setFavori] = useState(false)
  const [eklendi, setEklendi] = useState(false)
  const ekle = useSepet(s => s.ekle)
  const gorsel = urun.site_product_images?.find(g => g.ana)?.url || urun.site_product_images?.[0]?.url

  const sepeteEkle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (urun.stok_takip && urun.stok <= 0) { toast.error('Stok tükendi'); return }
    ekle(urun)
    setEklendi(true)
    toast.success(`${urun.name} sepete eklendi`)
    setTimeout(() => setEklendi(false), 2000)
  }

  const indirimYuzde = urun.eski_fiyat ? Math.round((1 - urun.fiyat / urun.eski_fiyat) * 100) : 0

  return (
    <Link href={`/urun/${urun.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-[#F0ECF5] hover:-translate-y-1 hover:shadow-xl transition-all duration-300" style={{boxShadow:'0 2px 12px rgba(224,112,144,0.06)'}}>
      {/* Görsel */}
      <div className="relative aspect-square bg-[#F0EEF8] overflow-hidden flex items-center justify-center p-5">
        {gorsel ? (
          <img src={gorsel} alt={urun.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <span className="text-6xl">🥛</span>
        )}
        
        {/* Rozetler */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {urun.yeni && <span style={{background:'#3B9FCC',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'50px'}}>YENİ</span>}
          {urun.indirimli && indirimYuzde > 0 && <span style={{background:'#E07090',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'50px'}}>-%{indirimYuzde}</span>}
          {urun.stok_takip && urun.stok <= 0 && <span style={{background:'#6B7280',color:'#fff',fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'50px'}}>TÜKENDI</span>}
        </div>

        {/* Favori */}
        <button
          onClick={e => { e.preventDefault(); setFavori(!favori) }}
          style={{position:'absolute',top:'10px',right:'10px',width:'30px',height:'30px',borderRadius:'50%',background:'#fff',border:'none',display:'flex',alignItems:'center',justifyContent:'center',opacity: favori ? 1 : 0,transition:'opacity 0.2s',cursor:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}
          className="group-hover:opacity-100">
          <Heart size={14} className={favori ? 'text-[#E07090]' : 'text-[#6B7280]'} fill={favori ? '#E07090' : 'none'} />
        </button>
      </div>

      {/* İçerik */}
      <div style={{padding:'14px 16px'}}>
        <p style={{fontSize:'10px',color:'#9CA3AF',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:600}}>{urun.site_kategoriler?.name}</p>
        <h3 style={{fontSize:'14px',fontWeight:600,color:'#1C1B2E',marginBottom:'8px',lineHeight:'1.3',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{urun.name}</h3>
        
        {/* Yıldızlar */}
        <div style={{display:'flex',alignItems:'center',gap:'2px',marginBottom:'10px'}}>
          {[1,2,3,4,5].map(s=><Star key={s} size={10} className="text-yellow-400" fill="currentColor"/>)}
          <span style={{fontSize:'10px',color:'#9CA3AF',marginLeft:'4px'}}>(48)</span>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <span style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E'}} className="font-display">₺{urun.fiyat.toFixed(2)}</span>
            {urun.eski_fiyat && <span style={{fontSize:'11px',color:'#9CA3AF',textDecoration:'line-through',marginLeft:'6px'}}>₺{urun.eski_fiyat.toFixed(2)}</span>}
          </div>
          <button
            onClick={sepeteEkle}
            disabled={urun.stok_takip && urun.stok <= 0}
            style={{width:'36px',height:'36px',borderRadius:'50%',border:'none',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,transition:'all 0.25s',cursor:'none',background: eklendi ? '#22c55e' : 'linear-gradient(135deg,#E07090,#3B9FCC)',boxShadow:'0 4px 12px rgba(224,112,144,0.35)'}}>
            {eklendi ? <Check size={15}/> : <span style={{fontSize:'18px',lineHeight:1}}>+</span>}
          </button>
        </div>
      </div>
    </Link>
  )
}
