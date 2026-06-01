import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import Link from 'next/link'
import { XCircle } from 'lucide-react'
export default function SiparisBasarisiz() {
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      <div style={{width:'80px',height:'80px',background:'#FEF2F2',borderRadius:'24px',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px'}}>
        <XCircle size={40} style={{color:'#EF4444'}}/>
      </div>
      <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',color:'#1C1B2E',marginBottom:'12px'}}>Ödeme Başarısız</h1>
      <p style={{fontSize:'14px',color:'#6B7280',maxWidth:'360px',lineHeight:'1.8',marginBottom:'32px'}}>Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin veya başka bir ödeme yöntemi kullanın.</p>
      <div style={{display:'flex',gap:'12px'}}>
        <Link href="/sepet" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700}}>Tekrar Dene</Link>
        <Link href="/iletisim" style={{background:'#fff',color:'#1C1B2E',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:600,border:'2px solid #F0ECF5'}}>Destek Al</Link>
      </div>
    </div>
  )
}
