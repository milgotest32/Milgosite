export default function TariflerPage() {
  const tarifler = [{emoji:'🥞',baslik:'Krep Tarifi',sure:'15 dk',zorluk:'Kolay'},{emoji:'🎂',baslik:'Tuzlu Kek',sure:'45 dk',zorluk:'Orta'},{emoji:'🍮',baslik:'Sütlaç',sure:'30 dk',zorluk:'Kolay'},{emoji:'🧁',baslik:'Cheesecake',sure:'60 dk',zorluk:'Orta'},{emoji:'🍦',baslik:'Kakaolu Dondurma',sure:'20 dk',zorluk:'Kolay'},{emoji:'🧀',baslik:'Lor Peyniri',sure:'30 dk',zorluk:'Kolay'}]
  return (
    <div className="min-h-screen">
      <div className="py-24 px-8 text-center" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">Milgo ile</div>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light">Sütlü <span className="gradient-text italic">Tarifler</span></h1>
      </div>
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tarifler.map(t => (
            <div key={t.baslik} className="glass rounded-2xl p-6 hover:border-[rgba(232,164,184,0.3)] hover:-translate-y-1 transition-all cursor-pointer">
              <div className="text-5xl mb-5">{t.emoji}</div>
              <h3 className="font-display text-[20px] font-light mb-3">{t.baslik}</h3>
              <div className="flex gap-3">
                <span className="glass rounded-full px-3 py-1 text-[10px] text-[#8a92a8]">⏱ {t.sure}</span>
                <span className="glass rounded-full px-3 py-1 text-[10px] text-[#8a92a8]">{t.zorluk}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
