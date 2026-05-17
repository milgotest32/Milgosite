import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#f0eef8] pt-14 pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-3xl font-light text-[#2d2d4e] block mb-1">
              milgo<span className="text-[#e8729a]">.</span>
            </Link>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#9ca3af] mb-4">Mutluluğun Tadı</p>
            <p className="text-[13px] leading-relaxed text-[#6b7280] mb-5 max-w-[240px]">
              Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.
            </p>
            <div className="space-y-2">
              {[['📞', '(0212) 352 10 76', 'tel:02123521076'], ['✉️', 'bilgi@milgo.com.tr', 'mailto:bilgi@milgo.com.tr'], ['📍', 'Etiler, Beşiktaş / İstanbul', '#']].map(([icon, text, href]) => (
                <a key={text} href={href} className="flex items-center gap-2 text-[12px] text-[#6b7280] hover:text-[#e8729a] transition-colors">
                  <span>{icon}</span>{text}
                </a>
              ))}
            </div>
          </div>
          {[
            {baslik:'Ürünler', linkler:[['Çiğ Süt','/urunler?kategori=sut'],['Peynir Çeşitleri','/urunler?kategori=peynir'],['Tereyağı','/urunler?kategori=tereyag'],['Tüm Ürünler','/urunler']]},
            {baslik:'Keşfet', linkler:[['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Tarifler','/tarifler'],['Hakkımızda','/hakkimizda']]},
            {baslik:'Yardım', linkler:[['Sipariş Takip','/hesabim'],['İade Politikası','/iletisim'],['KVKK','/iletisim'],['İletişim','/iletisim']]},
          ].map(({baslik,linkler}) => (
            <div key={baslik}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#e8729a] font-bold mb-5">{baslik}</h4>
              <div className="space-y-3">
                {linkler.map(([ad,href]) => (
                  <Link key={ad} href={href} className="block text-[13px] text-[#6b7280] hover:text-[#e8729a] transition-colors">{ad}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#f0eef8] py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-[11px] text-[#9ca3af]">© 2025 milgo. · Keba Gıda San. Tic. A.Ş.</span>
          <div className="flex gap-3">
            {[['📸','https://www.instagram.com/milgosut/'],['▶','https://www.youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'],['f','https://www.facebook.com/milgosut/']].map(([icon,href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-[#f0eef8] rounded-full flex items-center justify-center text-[#6b7280] hover:text-[#e8729a] hover:bg-[#fce8ef] transition-all text-sm">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
