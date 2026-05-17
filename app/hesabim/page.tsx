'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
export default function HesabimPage() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-8 py-20">
      <h1 className="font-display text-5xl font-light mb-12">Hesabım</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{emoji:'📦',baslik:'Siparişlerim',ac:'Geçmiş siparişlerinizi görüntüleyin',href:'#'},{emoji:'🔄',baslik:'Aboneliğim',ac:'Abonelik planınızı yönetin',href:'/abonelik'},{emoji:'📍',baslik:'Adreslerim',ac:'Teslimat adreslerinizi yönetin',href:'#'},{emoji:'💳',baslik:'Ödeme Yöntemlerim',ac:'Kayıtlı kartlarınızı yönetin',href:'#'}].map(item => (
          <Link key={item.baslik} href={item.href} className="glass rounded-2xl p-6 hover:border-[rgba(232,164,184,0.3)] hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h3 className="font-display text-[20px] font-light mb-2">{item.baslik}</h3>
            <p className="text-[13px] text-[#8a92a8]">{item.ac}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
