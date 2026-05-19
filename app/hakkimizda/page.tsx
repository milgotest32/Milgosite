import { supabase } from '@/lib/supabase/server'

const DEFAULT = {
  baslik: 'Kalitenin ve Doğallığın İzinde',
  alt_baslik: 'Biz Kimiz',
  giris_metni: 'Milgo Çiğ Süt, Türkiye ve Avrupa\'nın en büyük süt üretim çiftliği olan Ata Sancak Acıpayam Tarım İşletmesi\'nde üstün hijyen koşullarında üretilmektedir.',
  misyon: 'Temel prensibimiz, elde edilen sütümüzden dünyada ve Türkiye\'de görülmemiş ürünler geliştirmektir. Güvenilirlik, doğallık ve şeffaflık ilkeleriyle üretimin her aşamasını tüketicilerle paylaşan Milgo, doğal çiğ süt ürünlerini ulusal ve uluslararası pazardaki son tüketicilerine ulaştırmayı hedeflemektedir.',
  ciftlik_baslik: 'Milgo Süt Ürünleri: Mutluluğun Tadı',
  ciftlik_metin: 'Ata Sancak Acıpayam Tarım İşletmesi, 2005 yılının Ağustos ayında Ata Holding ve Sancak Grubu\'nun iş birliğiyle kurulmuştur. 24.000 dekar arazi varlığı ve 4.800\'ü sağmal olmak üzere toplam 10.500 büyükbaş ile Türkiye\'nin ve Avrupa\'nın en büyük damızlık yetiştirme ve süt üretim tesisi konumundadır. Çiftlikte kaliteli ve sağlıklı süt sunabilmek amacıyla çeşitli rasyon denemeleri yapılarak, günlük 400 ton yem hazırlanıp dağıtılmaktadır.',
  urunler_metni: 'Milgo, sadece çiğ süt üretimi ile değil, aynı zamanda çiğ sütten elde edilen özel ürünleriyle de ürün gamını genişletmeye devam etmektedir. Tereyağı ve sürülebilir taze peynir çeşitleri, doğanın sunduğu en kaliteli sütlerden üretilir.',
  tereyag_metni: 'Milgo\'nun enfes tereyağı çeşitleri, seçkin süt çiftliklerinde taze sütlerin özenle işlenmesiyle elde edilir. Sade, Tuzlu, Sarımsaklı & Biberiyeli, Pul Biberli & Kekikli olmak üzere 4 çeşitten oluşur.',
  peynir_metni: 'Milgo\'nun sürülebilir taze peynirleri, özenle seçilmiş sütlerden elde edilir ve katkı maddesi içermez. Sade Tam Yağlı, Sarımsaklı & Kekikli, Hurmalı ve Laktozsuz olmak üzere 4 farklı çeşidi bulunmaktadır.',
  vizyon: 'Milgo, çiğ süt ile başladığı yolculuğuna, yenilikçi ve modern bakış açısıyla ürün ailesini genişletmek adına her geçen gün daha çok çalışmaktadır.',
}

async function geticerik() {
  try {
    const { data } = await supabase.from('site_ayarlar').select('anahtar,deger').eq('grup', 'hakkimizda')
    if (!data?.length) return DEFAULT
    const a: Record<string,string> = {}
    data.forEach((item: any) => { a[item.anahtar] = item.deger || '' })
    return { ...DEFAULT, ...a }
  } catch { return DEFAULT }
}

export default async function HakkimizdaPage() {
  const ic = await geticerik()

  const rozetler = [
    { emoji: '🇪🇺', label: 'AB Onaylı' },
    { emoji: '✅', label: 'Hastalıklardan Ari' },
    { emoji: '🌿', label: '%100 Doğal' },
    { emoji: '🐄', label: '10.500 Büyükbaş' },
    { emoji: '🏡', label: '24.000 Dekar Arazi' },
    { emoji: '🥛', label: 'Günlük 400 Ton Yem' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="py-28 px-8 text-center" style={{background:'linear-gradient(to bottom, #0d1b3e, #080f22)'}}>
        <div className="text-[10px] tracking-[0.4em] uppercase text-[#e8a4b8] mb-3">{ic.alt_baslik}</div>
        <h1 className="font-display text-[clamp(36px,5vw,64px)] font-light text-white mb-6">{ic.baslik}</h1>
        <p className="max-w-2xl mx-auto text-[#8a92a8] text-[15px] leading-[1.9]">{ic.giris_metni}</p>
      </div>

      {/* Rozetler */}
      <div className="max-w-4xl mx-auto px-8 -mt-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {rozetler.map(r => (
            <div key={r.label} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{r.emoji}</div>
              <div className="text-white text-[11px] font-medium leading-tight">{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Misyon */}
      <div className="max-w-3xl mx-auto px-8 py-16">
        <p className="font-display text-[20px] font-light text-white leading-[1.8] mb-6">{ic.misyon}</p>
        <div style={{height:'1px',background:'linear-gradient(to right, transparent, rgba(232,164,184,0.3), transparent)'}} />
      </div>

      {/* Çiftlik */}
      <div className="max-w-3xl mx-auto px-8 pb-12 space-y-6 text-[15px] leading-[1.9] text-[#8a92a8]">
        <h2 className="font-display text-[26px] font-light text-white">{ic.ciftlik_baslik}</h2>
        <p>{ic.ciftlik_metin}</p>
        <p>{ic.urunler_metni}</p>

        {/* Ürün kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="glass rounded-2xl p-6">
            <div className="text-2xl mb-3">🧈</div>
            <h3 className="text-white font-semibold mb-2 text-[15px]">Tereyağı Çeşitleri</h3>
            <p className="text-[13px] leading-[1.8]">{ic.tereyag_metni}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-2xl mb-3">🧀</div>
            <h3 className="text-white font-semibold mb-2 text-[15px]">Sürülebilir Peynirler</h3>
            <p className="text-[13px] leading-[1.8]">{ic.peynir_metni}</p>
          </div>
        </div>

        <p className="font-display text-[17px] font-light text-white">{ic.vizyon}</p>
      </div>

      {/* İletişim bilgisi */}
      <div className="max-w-3xl mx-auto px-8 pb-20">
        <div className="glass rounded-2xl p-6 text-[13px] text-[#8a92a8] space-y-1">
          <p className="text-white font-semibold mb-2">KEBA GIDA San. ve Tic. A.Ş.</p>
          <p>📍 Akat Mah. Nispetiye Cad. Ayhan Apt. No:55 D:2 Etiler 34337 İSTANBUL</p>
          <p>📞 0532 010 49 50 &nbsp;|&nbsp; 0212 352 10 76</p>
          <p>🏷️ Hayvancılık İşletme No: TR20000009999</p>
        </div>
      </div>
    </div>
  )
}
