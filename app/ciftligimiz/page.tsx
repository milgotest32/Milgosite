export default function CiftligimizPage() {
  return (
    <div className="min-h-screen">
      <div className="py-24 px-8 text-center relative" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">ATASANCAK Çiftliği</div>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light">Çiftliğimizi <span className="gradient-text italic">Keşfedin</span></h1>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="font-display text-4xl font-light mb-6">Türkiye'nin En Büyük <span className="gradient-text italic">Damızlık Çiftliği</span></h2>
            <p className="text-[14px] leading-[1.9] text-[#8a92a8] mb-5">ATASANCAK Çiftliği, 24.000 dekar arazi üzerine kuruludur ve 4.800 sağmal olmak üzere toplam 10.500 büyükbaş ile Türkiye ve Avrupa'nın en büyük damızlık yetiştirme tesisidir.</p>
            <p className="text-[14px] leading-[1.9] text-[#8a92a8]">Ülkemizin ilk Hastalıklardan Ari ve AB onaylı süt işletmelerinden biriyiz.</p>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-square">
            <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600" alt="Çiftlik" className="w-full h-full object-cover" style={{filter:'brightness(0.7) saturate(0.6)'}} />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[['10.500','Büyükbaş'],['4.800','Sağmal İnek'],['24.000','Dekar Arazi'],['400T','Günlük Yem']].map(([sayi,ac]) => (
            <div key={ac} className="glass rounded-2xl p-6 text-center">
              <div className="font-display text-[36px] gradient-text font-light">{sayi}</div>
              <div className="text-[11px] text-[#8a92a8] mt-2">{ac}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
