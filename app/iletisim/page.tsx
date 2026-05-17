export default function IletisimPage() {
  return (
    <div className="min-h-screen">
      <div className="py-24 px-8 text-center" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">Bize Ulaşın</div>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light">İletişim</h1>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {[{emoji:'📞',baslik:'Telefon',icerik:'(0212) 352 10 76',href:'tel:02123521076'},{emoji:'✉️',baslik:'E-posta',icerik:'bilgi@milgo.com.tr',href:'mailto:bilgi@milgo.com.tr'},{emoji:'📍',baslik:'Adres',icerik:'Akat Mah. Etiler Nispetiye Cad. No:55/2, Beşiktaş / İstanbul',href:'#'},{emoji:'💬',baslik:'WhatsApp',icerik:'Hızlı sipariş için WhatsApp',href:'#'}].map(item => (
            <a key={item.baslik} href={item.href} className="glass rounded-2xl p-5 flex gap-4 hover:border-[rgba(232,164,184,0.3)] transition-all block">
              <div className="text-3xl">{item.emoji}</div>
              <div><div className="text-[10px] tracking-[0.2em] uppercase text-[#e8a4b8] mb-1">{item.baslik}</div><div className="text-[13px] text-white/80">{item.icerik}</div></div>
            </a>
          ))}
        </div>
        <div className="glass rounded-2xl p-8">
          <h3 className="font-display text-[22px] font-light mb-6">Bize Yazın</h3>
          <div className="space-y-4">
            {['Ad Soyad','E-posta','Konu'].map(label => (
              <div key={label}>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">{label}</label>
                <input className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[rgba(232,164,184,0.35)] transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#8a92a8] mb-2">Mesaj</label>
              <textarea className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(232,164,184,0.15)] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[rgba(232,164,184,0.35)] resize-none h-28" />
            </div>
            <button className="gradient-bg text-white w-full py-4 rounded-full text-[13px] font-medium hover:opacity-90 transition-all">Gönder</button>
          </div>
        </div>
      </div>
    </div>
  )
}
