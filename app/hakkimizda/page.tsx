export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      <div className="py-24 px-8 text-center" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">Biz Kimiz</div>
        <h1 className="font-display text-[clamp(40px,5vw,68px)] font-light">Hakkımızda</h1>
      </div>
      <div className="max-w-3xl mx-auto px-8 py-20 space-y-8 text-[15px] leading-[2] text-[#8a92a8]">
        <p className="font-display text-[22px] font-light text-white">Milgo Çiğ Süt, Türkiye ve Avrupa'nın en büyük süt üretim çiftliği ATASANCAK'ta üretilmektedir.</p>
        <p>Temel prensibimiz güvenilirlik, doğallık ve şeffaflıktır. Üretimin her aşamasını tüketicilerle paylaşarak doğal çiğ süt ürünlerini son tüketicimize ulaştırıyoruz.</p>
        <div className="grid grid-cols-3 gap-4 py-4">
          {['🇪🇺 AB Onaylı','✓ Hastalıklardan Ari','🌿 %100 Doğal'].map(s => (
            <div key={s} className="glass rounded-2xl p-5 text-center text-white text-[13px]">{s}</div>
          ))}
        </div>
        <p>Günlük 400 ton yem üretimi, özel tohum denemeleri ve sürekli kalite kontrolleri ile Türkiye'nin en iyi sütünü üretiyoruz.</p>
      </div>
    </div>
  )
}
