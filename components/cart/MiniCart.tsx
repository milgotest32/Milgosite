'use client'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { X, ShoppingBag } from 'lucide-react'

export default function MiniCart({ onClose }: { onClose: () => void }) {
  const { items, cikar, araToplam, adetToplam } = useSepet()
  return (
    <div style={{position:'fixed',top:0,right:0,bottom:0,width:'min(380px, 100vw)',background:'#fff',zIndex:1001,boxShadow:'-4px 0 32px rgba(0,0,0,0.12)',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'20px 24px',borderBottom:'1px solid #F0ECF5',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E'}}>Sepetim ({adetToplam()})</h2>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'#6B7280'}}><X size={20}/></button>
      </div>
      
      {items.length === 0 ? (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'16px'}}>
          <ShoppingBag size={48} style={{color:'#F0ECF5'}}/>
          <p style={{color:'#9CA3AF',fontSize:'14px'}}>Sepetiniz boş</p>
          <Link href="/urunler" onClick={onClose} style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',textDecoration:'none',fontSize:'13px',fontWeight:600}}>Alışverişe Başla</Link>
        </div>
      ) : (
        <>
          <div style={{flex:1,overflowY:'auto',padding:'16px 24px',display:'flex',flexDirection:'column',gap:'12px'}}>
            {items.map(({urun,adet})=>{
              const g=urun.site_product_images?.[0]?.url
              return(
                <div key={urun.id} style={{display:'flex',gap:'12px',alignItems:'center',background:'#F0EEF8',borderRadius:'16px',padding:'12px'}}>
                  <div style={{width:'60px',height:'60px',borderRadius:'12px',background:'#fff',overflow:'hidden',flexShrink:0}}>
                    {g?<img src={g} alt={urun.name} style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/>:<span style={{fontSize:'28px',display:'flex',alignItems:'center',justifyContent:'center',height:'100%'}}>🥛</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{urun.name}</p>
                    <p style={{fontSize:'12px',color:'#6B7280'}}>x{adet} · ₺{(urun.fiyat*adet).toFixed(2)}</p>
                  </div>
                  <button onClick={()=>cikar(urun.id)} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}><X size={14}/></button>
                </div>
              )
            })}
          </div>
          <div style={{padding:'20px 24px',paddingBottom:'calc(20px + env(safe-area-inset-bottom, 0px))',borderTop:'1px solid #F0ECF5'}} className="minicart-bottom">
            <style>{`
              @media (max-width: 768px) {
                .minicart-bottom { padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; }
              }
            `}</style>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
              <span style={{fontWeight:600,color:'#1C1B2E'}}>Toplam</span>
              <span style={{fontSize:'20px',fontWeight:700,color:'#1C1B2E'}} className="font-display">₺{araToplam().toFixed(2)}</span>
            </div>
            <Link href="/sepet" onClick={onClose} style={{display:'block',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',textAlign:'center',padding:'14px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:600,boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>Sepete Git</Link>
          </div>
        </>
      )}
    </div>
  )
}
