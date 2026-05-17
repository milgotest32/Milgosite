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
      {/* Band */}
      <div className="bg-gradient-to-r from-[#c4768e] via-[#2d5299] to-[#c4768e] bg-[length:200%] animate-[bandGrad_4s_linear_infinite] text-white text-center py-2.5 text-[11px] tracking-[0.2em] uppercase">
        🚚 İstanbul içi aynı gün teslimat &nbsp;·&nbsp; İlk siparişte %10 indirim: <strong>MILGO10</strong>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(8,15,34,0.92)] backdrop-blur-xl border-b border-[rgba(232,164,184,0.1)] px-8 lg:px-16 h-[68px] flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-light text-white">
          milgo<span className="text-[#e8a4b8]">.</span>
        </Link>

        <div className="hidden md:flex gap-8">
          {[['Ürünler', '/urunler'], ['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Hakkımızda', '/hakkimizda']].map(([ad, href]) => (
            <Link key={href} href={href} className="text-white/60 hover:text-[#f5c8d8] text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 font-medium">
              {ad}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/hesabim" className="text-white/60 hover:text-white transition-colors p-2">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link href="/sepet" className="relative text-white/60 hover:text-white transition-colors p-2">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {adet > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-bg rounded-full text-[9px] text-white flex items-center justify-center font-semibold">
                {adet}
              </span>
            )}
          </Link>
          <Link href="/urunler" className="hidden md:inline-flex gradient-bg text-white text-[11px] tracking-[0.15em] uppercase font-medium px-6 py-2.5 rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(196,118,142,0.3)]">
            Sipariş Ver
          </Link>
          <button onClick={() => setMenuAcik(!menuAcik)} className="md:hidden text-white/70 p-2">
            {menuAcik ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobil menü */}
      {menuAcik && (
        <div className="fixed inset-0 z-40 bg-[#080f22]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {[['Ürünler', '/urunler'], ['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Hakkımızda', '/hakkimizda'], ['İletişim', '/iletisim']].map(([ad, href]) => (
            <Link key={href} href={href} onClick={() => setMenuAcik(false)}
              className="font-display text-4xl font-light text-white/80 hover:text-[#e8a4b8] transition-colors">
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
