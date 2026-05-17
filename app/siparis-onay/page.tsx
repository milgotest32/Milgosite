'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

function SiparisOnayIcerik() {
  const params = useSearchParams()
  const id = params.get('id')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% 30%, rgba(196,118,142,0.12) 0%, transparent 60%)'}} />
      <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mb-8 shadow-[0_16px_48px_rgba(196,118,142,0.4)] relative z-10">
        <CheckCircle size={40} className="text-white" />
      </div>
      <h1 className="font-display text-[clamp(36px,5vw,64px)] font-light mb-4 relative z-10">
        Siparişiniz <span className="gradient-text italic">Alındı!</span>
      </h1>
      <p className="text-[15px] text-[#8a92a8] max-w-md mb-4 relative z-10">
        Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanıp kapınıza teslim edilecektir.
      </p>
      {id && <p className="text-[12px] text-[#8a92a8] glass rounded-full px-4 py-2 mb-10 relative z-10">Sipariş No: {id.slice(0, 8).toUpperCase()}</p>}
      <div className="flex gap-4 flex-wrap justify-center relative z-10">
        <Link href="/urunler" className="gradient-bg text-white px-10 py-4 rounded-full text-[13px] font-medium tracking-wide hover:opacity-90 transition-all">
          Alışverişe Devam Et
        </Link>
        <Link href="/hesabim" className="glass text-[#f5c8d8] px-10 py-4 rounded-full text-[13px] hover:bg-[rgba(232,164,184,0.1)] transition-all">
          Siparişlerim
        </Link>
      </div>
    </div>
  )
}

export default function SiparisOnay() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-[#e8a4b8] border-t-transparent animate-spin" /></div>}>
      <SiparisOnayIcerik />
    </Suspense>
  )
}
