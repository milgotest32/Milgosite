import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0d1b3e] border-t border-[rgba(232,164,184,0.08)] pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-3xl font-light text-white block mb-2">
              milgo<span className="text-[#e8a4b8]">.</span>
            </Link>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8a92a8] mb-5">Mutluluğun Tadı</p>
            <p className="text-[13px] leading-relaxed text-[#8a92a8] mb-6 max-w-[260px]">
              Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.
            </p>
            <div className="space-y-2">
              {[['📞', '(0212) 352 10 76', 'tel:02123521076'], ['✉️', 'bilgi@milgo.com.tr', 'mailto:bilgi@milgo.com.tr'], ['📍', 'Etiler, Beşiktaş / İstanbul', '#']].map(([icon, text, href]) => (
                <a key={text} href={href} className="flex items-center gap-2 text-[12px] text-[#8a92a8] hover:text-[#f5c8d8] transition-colors">
                  <span>{icon}</span>{text}
                </a>
              ))}
            </div>
          </div>

          {[
            { baslik: 'Ürünler', linkler: [['Çiğ Süt', '/urunler?kategori=sut'], ['Peynir Çeşitleri', '/urunler?kategori=peynir'], ['Tereyağı', '/urunler?kategori=tereyag'], ['Tüm Ürünler', '/urunler']] },
            { baslik: 'Keşfet', linkler: [['Abonelik', '/abonelik'], ['Çiftliğimiz', '/ciftligimiz'], ['Tarifler', '/tarifler'], ['Belgelerimiz', '/hakkimizda']] },
            { baslik: 'Yardım', linkler: [['Sipariş Takip', '/hesabim'], ['Teslimat Bilgisi', '/iletisim'], ['İade Politikası', '/iletisim'], ['KVKK', '/iletisim'], ['İletişim', '/iletisim']] },
          ].map(({ baslik, linkler }) => (
            <div key={baslik}>
              <h4 className="text-[9px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-6 font-semibold">{baslik}</h4>
              <div className="space-y-3">
                {linkler.map(([ad, href]) => (
                  <Link key={ad} href={href} className="block text-[13px] text-[#8a92a8] hover:text-white transition-colors">
                    {ad}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] text-[#8a92a8]/40 tracking-wide">© 2025 milgo. · Keba Gıda San. Tic. A.Ş.</span>
          <div className="flex gap-3">
            {[['📸', 'https://www.instagram.com/milgosut/'], ['▶', 'https://www.youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'], ['f', 'https://www.facebook.com/milgosut/']].map(([icon, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="w-9 h-9 glass rounded-full flex items-center justify-center text-[#8a92a8] hover:text-[#f5c8d8] transition-colors text-sm">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
