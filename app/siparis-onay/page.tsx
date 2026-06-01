'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
export const dynamic = 'force-dynamic'
function Icerik() {
  const p = useSearchParams()
  const siparis = p.get('siparis')
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      <div style={{width:'80px',height:'80px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 16px 40px rgba(224,112,144,0.35)',marginBottom:'24px'}}>
        <CheckCircle size={40} style={{color:'#fff'}}/>
      </div>
      <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'40px',color:'#1C1B2E',marginBottom:'12px'}}>Siparişiniz Alındı! 🎉</h1>
      <p style={{fontSize:'15px',color:'#6B7280',maxWidth:'400px',lineHeight:1.7,marginBottom:'16px'}}>Siparişiniz başarıyla oluşturuldu. Hazırlanıp en kısa sürede kapınıza teslim edilecektir.</p>
      {siparis && <div style={{background:'#fff',borderRadius:'16px',padding:'12px 24px',marginBottom:'32px',border:'1px solid #F0ECF5'}}><span style={{fontSize:'12px',color:'#9CA3AF'}}>Sipariş No: </span><span style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',fontFamily:'monospace'}}>{siparis}</span></div>}
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center'}}>
        <Link href="/urunler" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700,display:'flex',alignItems:'center',gap:'8px'}}>Alışverişe Devam <ArrowRight size={14}/></Link>
        <Link href="/hesabim/siparisler" style={{background:'#fff',color:'#1C1B2E',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:600,border:'2px solid #F0ECF5',display:'flex',alignItems:'center',gap:'8px'}}><Package size={14}/>Siparişlerim</Link>
      </div>
    </div>
  )
}
export default function SiparisOnayPage() {
  return <Suspense fallback={null}><Icerik/></Suspense>
}
