import { createServerClient } from '@/lib/supabase/server'

const DEFAULT = {
  baslik: 'Kalitenin ve Doğallığın İzinde',
  alt_baslik: 'Biz Kimiz',
  giris_metni: 'Milgo Çiğ Süt, Türkiye ve Avrupa\'nın en büyük süt üretim çiftliği olan Ata Sancak Acıpayam Tarım İşletmesi\'nde üstün hijyen koşullarında üretilmektedir.',
  misyon: 'Temel prensibimiz, elde edilen sütümüzden dünyada ve Türkiye\'de görülmemiş ürünler geliştirmektir. Güvenilirlik, doğallık ve şeffaflık ilkeleriyle üretimin her aşamasını tüketicilerle paylaşan Milgo, doğal çiğ süt ürünlerini ulusal ve uluslararası pazardaki son tüketicilerine ulaştırmayı hedeflemektedir.',
  ciftlik_baslik: 'Milgo Süt Ürünleri: Mutluluğun Tadı',
  ciftlik_metin: 'Ata Sancak Acıpayam Tarım İşletmesi, 2005 yılının Ağustos ayında Ata Holding ve Sancak Grubu\'nun iş birliğiyle kurulmuştur. 24.000 dekar arazi varlığı ve 4.800\'ü sağmal olmak üzere toplam 10.500 büyükbaş ile Türkiye\'nin ve Avrupa\'nın en büyük damızlık yetiştirme ve süt üretim tesisi konumundadır.',
  urunler_metni: 'Milgo, sadece çiğ süt üretimi ile değil, çiğ sütten elde edilen özel ürünleriyle de ürün gamını genişletmeye devam etmektedir. Tereyağı ve sürülebilir taze peynir çeşitleri, doğanın sunduğu en kaliteli sütlerden üretilir.',
  tereyag_metni: 'Sade, Tuzlu, Sarımsaklı & Biberiyeli, Pul Biberli & Kekikli olmak üzere 4 çeşitten oluşan Milgo Tereyağı; sağlıklı ve lezzetli bir seçenektir.',
  peynir_metni: 'Katkı maddesi içermeyen sürülebilir taze peynirlerimiz; Sade Tam Yağlı, Sarımsaklı & Kekikli, Hurmalı ve Laktozsuz olmak üzere 4 farklı çeşitte sunulmaktadır.',
  vizyon: 'Milgo, çiğ süt ile başladığı yolculuğuna, yenilikçi ve modern bakış açısıyla ürün ailesini genişletmek adına her geçen gün daha çok çalışmaktadır.',
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
    { emoji: '🥛', label: 'Günlük 400 Ton' },
  ]

  return (
    <div style={{background:'#fff', minHeight:'100vh'}}>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg, #FEF0F4, #EBF7FC)', padding:'64px 24px 48px', textAlign:'center'}}>
        <div style={{fontSize:'11px', letterSpacing:'0.3em', textTransform:'uppercase', color:'#E07090', marginBottom:'12px', fontWeight:600}}>{ic.alt_baslik}</div>
        <h1 style={{fontFamily:'"Playfair Display",serif', fontSize:'clamp(32px,5vw,56px)', fontWeight:400, color:'#1C1B2E', marginBottom:'20px', lineHeight:1.2}}>{ic.baslik}</h1>
        <p style={{maxWidth:'600px', margin:'0 auto', color:'#6B7280', fontSize:'15px', lineHeight:1.8}}>{ic.giris_metni}</p>
      </div>

      {/* Rozetler */}
      <div style={{maxWidth:'900px', margin:'-28px auto 0', padding:'0 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'12px'}}>
          {rozetler.map(r => (
            <div key={r.label} style={{background:'#fff', border:'1px solid #F0ECF5', borderRadius:'16px', padding:'16px 8px', textAlign:'center', boxShadow:'0 2px 12px rgba(224,112,144,0.08)'}}>
              <div style={{fontSize:'22px', marginBottom:'6px'}}>{r.emoji}</div>
              <div style={{fontSize:'11px', color:'#6B7280', fontWeight:600, lineHeight:1.3}}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Misyon */}
      <div style={{maxWidth:'760px', margin:'0 auto', padding:'56px 24px 40px'}}>
        <p style={{fontFamily:'"Playfair Display",serif', fontSize:'20px', fontWeight:400, color:'#1C1B2E', lineHeight:1.8, marginBottom:'32px'}}>{ic.misyon}</p>
        <div style={{height:'1px', background:'linear-gradient(to right, transparent, #F0ECF5, transparent)'}}/>
      </div>

      {/* Çiftlik hikayesi */}
      <div style={{maxWidth:'760px', margin:'0 auto', padding:'0 24px 40px'}}>
        <h2 style={{fontFamily:'"Playfair Display",serif', fontSize:'28px', fontWeight:400, color:'#1C1B2E', marginBottom:'20px'}}>{ic.ciftlik_baslik}</h2>
        <p style={{color:'#6B7280', fontSize:'15px', lineHeight:1.9, marginBottom:'16px'}}>{ic.ciftlik_metin}</p>
        <p style={{color:'#6B7280', fontSize:'15px', lineHeight:1.9}}>{ic.urunler_metni}</p>
      </div>

      {/* Ürün kartları */}
      <div style={{maxWidth:'760px', margin:'0 auto', padding:'0 24px 40px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
          {[
            {emoji:'🧈', baslik:'Tereyağı Çeşitleri', metin: ic.tereyag_metni},
            {emoji:'🧀', baslik:'Sürülebilir Peynirler', metin: ic.peynir_metni},
          ].map(k => (
            <div key={k.baslik} style={{background:'#F8F7FC', border:'1px solid #F0ECF5', borderRadius:'20px', padding:'28px'}}>
              <div style={{fontSize:'28px', marginBottom:'12px'}}>{k.emoji}</div>
              <h3 style={{fontSize:'15px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>{k.baslik}</h3>
              <p style={{fontSize:'13px', color:'#6B7280', lineHeight:1.8}}>{k.metin}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vizyon */}
      <div style={{maxWidth:'760px', margin:'0 auto', padding:'0 24px 40px'}}>
        <div style={{background:'linear-gradient(135deg,#FEF0F4,#EBF7FC)', borderRadius:'20px', padding:'32px'}}>
          <p style={{fontFamily:'"Playfair Display",serif', fontSize:'18px', color:'#1C1B2E', lineHeight:1.8, fontStyle:'italic'}}>{ic.vizyon}</p>
        </div>
      </div>

      {/* İletişim */}
      <div style={{maxWidth:'760px', margin:'0 auto', padding:'0 24px 64px'}}>
        <div style={{border:'1px solid #F0ECF5', borderRadius:'20px', padding:'28px'}}>
          <p style={{fontWeight:700, color:'#1C1B2E', marginBottom:'12px', fontSize:'14px'}}>KEBA GIDA San. ve Tic. A.Ş.</p>
          <div style={{display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px', color:'#6B7280'}}>
            <p>📍 Akat Mah. Nispetiye Cad. Ayhan Apt. No:55 D:2 Etiler 34337 İSTANBUL</p>
            <p>📞 0532 010 49 50 &nbsp;|&nbsp; 0212 352 10 76</p>
            <p>🏷️ Hayvancılık İşletme No: TR20000009999</p>
          </div>
        </div>
      </div>

    </div>
  )
}
