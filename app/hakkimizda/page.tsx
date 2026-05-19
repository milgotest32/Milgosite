import { createServerClient } from '@/lib/supabase/server'

const DEFAULT = {
  hero_gorsel: 'https://milgo.com.tr/wp-content/uploads/2021/07/milgo-hakkimizda-cig-sut.png',
  sertifika_gorsel: 'https://i.hizliresim.com/tes9ecg.png',
  baslik: 'Milgo: Kalitenin ve Doğallığın İzinde',
  giris_metni: "Milgo Çiğ Süt, Türkiye ve Avrupa'nın en büyük süt üretim çiftliği olan Ata Sancak Acıpayam Tarım İşletmesi'nde üstün hijyen koşullarında üretilmektedir.",
  misyon: "Temel prensibimiz, elde edilen sütümüzden dünyada ve Türkiye'de görülmemiş ürünler geliştirmektir. Güvenilirlik, doğallık ve şeffaflık ilkeleriyle üretimin her aşamasını tüketicilerle paylaşan Milgo, doğal çiğ süt ürünlerini ulusal ve uluslararası pazardaki son tüketicilerine ulaştırmayı hedeflemektedir.",
  ciftlik_baslik: 'Milgo Süt Ürünleri: Mutluluğun Tadı',
  ciftlik_metin: "Ata Sancak Acıpayam Tarım İşletmesi, 2005 yılının Ağustos ayında Ata Holding ve Sancak Grubu'nun iş birliğiyle en son teknolojilerle geliştirilmiş tarım, damızlık ve süt hayvancılığı tesisi inşa etmek ve işletmek amacı ile Acıpayam'da kurulmuştur. 24.000 dekar arazi varlığı ve 4.800'ü sağmal olmak üzere toplam 10.500 büyükbaş ile Türkiye'nin ve Avrupa'nın en büyük damızlık yetiştirme ve süt üretim tesisi konumundadır. Çiftlikte kaliteli ve sağlıklı süt sunabilmek amacıyla çeşitli rasyon denemeleri yapılarak, günlük 400 ton yem hazırlanıp dağıtılmaktadır. Süt inekleri günümüzün en hijyenik ve sağlıklı yıkama teknolojisi olarak bilinen FLUSHING sistemi ile donatılmış sağlıklı ahırlarda yetiştirilmekte ve hayvan gelişim süreçleri dijital olarak takip edilmektedir. Ülkemizde Hastalıklardan Ari belgesini alan ilk Tarım İşletmesidir, aynı zamanda Avrupa Birliği onaylıdır.",
  urunler_metni: "Milgo, sadece çiğ süt üretimi ile değil, aynı zamanda çiğ sütten elde edilen özel ürünleriyle de ürün gamını genişletmeye devam etmektedir. Milgo'nun tereyağı ve sürülebilir taze peynir çeşitleri, doğanın sunduğu en kaliteli sütlerden üretilir. Bu ürünler, seçkin süt çiftliklerinde taze sütlerin özenle işlenmesiyle elde edilir ve en yüksek hijyen standartlarını korur. Sağlık, lezzet ve kaliteye önem veren herkes için Milgo ürünleri, güvenilir bir tercihtir.",
  tereyag_metni: "Milgo'nun enfes tereyağı çeşitleri, seçkin süt çiftliklerinde taze sütlerin özenle işlenmesiyle elde edilir. Sade, Tuzlu, Sarımsaklı & Biberiyeli, Pul Biberli & Kekikli olmak üzere 4 çeşitten oluşan Milgo Tereyağ; sağlıklı, lezzetli ve farklı damak lezzetleri arayanlar için idealdir. Her bir çeşidi, zengin ve yoğun bir tat sunar.",
  peynir_metni: "Milgo'nun sürülebilir taze peynirleri, özenle seçilmiş sütlerden elde edilir ve katkı maddesi içermez. Sade Tam Yağlı, Sarımsaklı & Kekikli, Hurmalı ve Laktozsuz olmak üzere 4 farklı çeşidi bulunmaktadır.",
  vizyon: "Milgo, çiğ süt ile başladığı yolculuğuna, yenilikçi ve modern bakış açısıyla ürün ailesini genişletmek adına her geçen gün daha çok çalışmaktadır.",
}

async function geticerik() {
  try {
    const supabase = createServerClient()
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
    { emoji: '🏡', label: '24.000 Dekar' },
    { emoji: '🥛', label: '400 Ton/Gün Yem' },
  ]

  return (
    <div style={{background:'#fff', minHeight:'100vh'}}>

      {/* Hero - görsel + başlık yan yana */}
      <div style={{background:'linear-gradient(135deg,#FEF0F4,#EBF7FC)', padding:'64px 24px'}}>
        <div style={{maxWidth:'1000px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center'}}>
          <div>
            <div style={{fontSize:'11px', letterSpacing:'0.3em', textTransform:'uppercase', color:'#E07090', marginBottom:'16px', fontWeight:600}}>Biz Kimiz</div>
            <h1 style={{fontFamily:'"Playfair Display",serif', fontSize:'clamp(28px,4vw,44px)', fontWeight:400, color:'#1C1B2E', marginBottom:'20px', lineHeight:1.3}}>{ic.baslik}</h1>
            <p style={{color:'#6B7280', fontSize:'15px', lineHeight:1.9, marginBottom:'24px'}}>{ic.giris_metni}</p>
            <p style={{color:'#6B7280', fontSize:'14px', lineHeight:1.9}}>{ic.misyon}</p>
          </div>
          <div style={{borderRadius:'24px', overflow:'hidden', boxShadow:'0 20px 60px rgba(224,112,144,0.15)'}}>
            <img src={ic.hero_gorsel} alt="Milgo Çiğ Süt" style={{width:'100%', height:'420px', objectFit:'contain', background:'transparent', display:'block'}}/>
          </div>
        </div>
      </div>

      {/* Rozetler */}
      <div style={{maxWidth:'1000px', margin:'-28px auto 0', padding:'0 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'12px'}}>
          {rozetler.map(r => (
            <div key={r.label} style={{background:'#fff', border:'1px solid #F0ECF5', borderRadius:'16px', padding:'20px 8px', textAlign:'center', boxShadow:'0 4px 16px rgba(224,112,144,0.08)'}}>
              <div style={{fontSize:'24px', marginBottom:'8px'}}>{r.emoji}</div>
              <div style={{fontSize:'11px', color:'#6B7280', fontWeight:600, lineHeight:1.4}}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Çiftlik bölümü */}
      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'64px 24px 0'}}>
        <h2 style={{fontFamily:'"Playfair Display",serif', fontSize:'32px', fontWeight:400, color:'#1C1B2E', marginBottom:'24px', textAlign:'center'}}>{ic.ciftlik_baslik}</h2>
        <div style={{height:'2px', width:'60px', background:'linear-gradient(90deg,#E07090,#3B9FCC)', borderRadius:'2px', margin:'0 auto 40px'}}/>
        <p style={{color:'#6B7280', fontSize:'15px', lineHeight:2, marginBottom:'20px'}}>{ic.ciftlik_metin}</p>
        <p style={{color:'#6B7280', fontSize:'15px', lineHeight:2}}>{ic.urunler_metni}</p>
      </div>

      {/* Ürün kartları */}
      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'40px 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
          <div style={{background:'linear-gradient(135deg,#FEF0F4,#fff)', border:'1px solid #F0ECF5', borderRadius:'24px', padding:'32px'}}>
            <div style={{fontSize:'36px', marginBottom:'16px'}}>🧈</div>
            <h3 style={{fontFamily:'"Playfair Display",serif', fontSize:'20px', fontWeight:400, color:'#1C1B2E', marginBottom:'12px'}}>Tereyağı Çeşitleri</h3>
            <p style={{fontSize:'14px', color:'#6B7280', lineHeight:1.9}}>{ic.tereyag_metni}</p>
          </div>
          <div style={{background:'linear-gradient(135deg,#EBF7FC,#fff)', border:'1px solid #F0ECF5', borderRadius:'24px', padding:'32px'}}>
            <div style={{fontSize:'36px', marginBottom:'16px'}}>🧀</div>
            <h3 style={{fontFamily:'"Playfair Display",serif', fontSize:'20px', fontWeight:400, color:'#1C1B2E', marginBottom:'12px'}}>Sürülebilir Peynirler</h3>
            <p style={{fontSize:'14px', color:'#6B7280', lineHeight:1.9}}>{ic.peynir_metni}</p>
          </div>
        </div>
      </div>

      {/* Vizyon + Sertifika */}
      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'0 24px 40px', display:'grid', gridTemplateColumns:'1fr auto', gap:'32px', alignItems:'center'}}>
        <div style={{background:'linear-gradient(135deg,#FEF0F4,#EBF7FC)', borderRadius:'24px', padding:'36px'}}>
          <p style={{fontFamily:'"Playfair Display",serif', fontSize:'19px', color:'#1C1B2E', lineHeight:1.9, fontStyle:'italic'}}>&ldquo;{ic.vizyon}&rdquo;</p>
        </div>
        {ic.sertifika_gorsel && (
          <img src={ic.sertifika_gorsel} alt="Milgo Sertifika" style={{height:'120px', objectFit:'contain'}}/>
        )}
      </div>

      {/* İletişim */}
      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'0 24px 64px'}}>
        <div style={{border:'1px solid #F0ECF5', borderRadius:'20px', padding:'28px', display:'flex', gap:'40px', flexWrap:'wrap'}}>
          <div>
            <p style={{fontWeight:700, color:'#1C1B2E', marginBottom:'12px', fontSize:'14px'}}>KEBA GIDA San. ve Tic. A.Ş.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px', color:'#6B7280'}}>
              <p>📍 Akat Mah. Nispetiye Cad. Ayhan Apt. No:55 D:2 Etiler 34337 İSTANBUL</p>
              <p>📞 0532 010 49 50 &nbsp;|&nbsp; 0212 352 10 76</p>
              <p>🏷️ Hayvancılık İşletme No: TR20000009999</p>
              <p>📄 Çiğ Süt Arzı İçin İzin Belgesi Tarihi: 26.11.2020</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
