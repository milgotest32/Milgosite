'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSepet } from '@/lib/sepet'
import { ShoppingBag, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const adet = useSepet(s => s.adetToplam())

  return (
    <>
      <div className="bg-gradient-to-r from-[#e8729a] to-[#4dd0e8] text-white text-center py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium">
        🚚 İstanbul içi aynı gün teslimat &nbsp;·&nbsp; İlk siparişte %10 indirim: <strong>MILGO10</strong>
      </div>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#f0eef8] px-6 lg:px-16 h-[68px] flex items-center justify-between shadow-sm">
        <Link href="/" className="font-display text-2xl font-light text-[#2d2d4e]">
          milgo<span className="text-[#e8729a]">.</span>
        </Link>

        <div className="hidden md:flex gap-8">
          {[['Ürünler', '/urunler'], ['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Hakkımızda', '/hakkimizda']].map(([ad, href]) => (
            <Link key={href} href={href} className="text-[#6b7280] hover:text-[#e8729a] text-[12px] tracking-wide font-medium transition-colors">
              {ad}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hesabim" className="text-[#6b7280] hover:text-[#e8729a] transition-colors p-2">
            <User size={20} strokeWidth={1.75} />
          </Link>
          <Link href="/sepet" className="relative text-[#6b7280] hover:text-[#e8729a] transition-colors p-2">
            <ShoppingBag size={20} strokeWidth={1.75} />
            {adet > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-bg rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                {adet}
              </span>
            )}
          </Link>
          <Link href="/urunler" className="hidden md:inline-flex gradient-bg text-white text-[11px] tracking-wide font-semibold px-5 py-2.5 rounded-full hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(232,114,154,0.3)]">
            Sipariş Ver
          </Link>
          <button onClick={() => setMenuAcik(!menuAcik)} className="md:hidden text-[#6b7280] p-2">
            {menuAcik ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuAcik && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden">
          {[['Ürünler', '/urunler'], ['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Hakkımızda', '/hakkimizda'], ['İletişim', '/iletisim']].map(([ad, href]) => (
            <Link key={href} href={href} onClick={() => setMenuAcik(false)}
              className="font-display text-4xl font-light text-[#2d2d4e] hover:text-[#e8729a] transition-colors">
              {ad}
            </Link>
          ))}
          <Link href="/urunler" onClick={() => setMenuAcik(false)} className="gradient-bg text-white px-10 py-3 rounded-full text-sm tracking-widest uppercase mt-4">
            Sipariş Ver
          </Link>
        </div>
      )}
    </>
  )
}
