import Link from 'next/link'
export default function Footer() {
  return (
    <footer className="bg-white border-t border-sinir mt-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 pb-0">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="font-display text-3xl text-metin block mb-2">milgo<span className="text-pembe-koy">.</span></Link>
            <p className="text-[11px] tracking-[0.3em] uppercase text-metin-2 mb-4">Mutluluğun Tadı</p>
            <p className="text-[13px] leading-relaxed text-metin-2 max-w-[240px] mb-5">Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.</p>
            <div className="space-y-2">
              {[['📞','(0212) 352 10 76','tel:02123521076'],['✉️','bilgi@milgo.com.tr','mailto:bilgi@milgo.com.tr'],['📍','Etiler, Beşiktaş / İstanbul','#']].map(([i,t,h]) => (
                <a key={t} href={h} className="flex items-center gap-2 text-[12px] text-metin-2 hover:text-pembe-koy transition-colors"><span>{i}</span>{t}</a>
              ))}
            </div>
          </div>
          {[
            {baslik:'Ürünler', linkler:[['Çiğ Süt','/urunler?kategori=sut'],['Peynir','/urunler?kategori=peynir'],['Tereyağı','/urunler?kategori=tereyag'],['Tüm Ürünler','/urunler']]},
            {baslik:'Keşfet', linkler:[['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Tarifler','/tarifler'],['Hakkımızda','/hakkimizda']]},
            {baslik:'Hesap', linkler:[['Giriş Yap','/giris'],['Üye Ol','/kayit'],['Siparişlerim','/hesabim/siparisler'],['İletişim','/iletisim']]},
          ].map(({baslik,linkler}) => (
            <div key={baslik}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-pembe-koy font-bold mb-5">{baslik}</h4>
              <div className="space-y-3">{linkler.map(([ad,href]) => <Link key={ad} href={href} className="block text-[13px] text-metin-2 hover:text-pembe-koy transition-colors">{ad}</Link>)}</div>
            </div>
          ))}
        </div>
        {/* Kart logoları + bottom */}
        <div className="border-t border-sinir py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-metin-2">© 2025 milgo. · Keba Gıda San. Tic. A.Ş.</span>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {['💳','🏦','📱'].map((i,idx) => <div key={idx} className="w-9 h-6 bg-lav rounded flex items-center justify-center text-sm">{i}</div>)}
            </div>
            <div className="flex gap-2">
              {[['📸','https://instagram.com/milgosut'],['▶','https://youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'],['f','https://facebook.com/milgosut']].map(([i,h]) => (
                <a key={h} href={h} target="_blank" rel="noreferrer" className="w-8 h-8 bg-lav rounded-lg flex items-center justify-center text-metin-2 hover:bg-pembe-acik hover:text-pembe-koy transition-all text-sm">{i}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
