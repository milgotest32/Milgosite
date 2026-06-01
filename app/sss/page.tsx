import Link from 'next/link'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | milgo.',
  description: 'Milgo hakkında merak ettikleriniz: teslimat bölgeleri, çiğ süt güvenliği, abonelik, iade ve daha fazlası.',
  openGraph: { title: 'SSS | milgo.', description: 'Milgo hakkında sık sorulan sorular ve cevapları.' },
}

const SORULAR = [
  {s:'Ürünleriniz nerede üretiliyor?',c:'Tüm ürünlerimiz ATASANCAK Çiftliği\'nde üretilmektedir. 10.500 büyükbaş hayvana sahip çiftliğimiz, AB standartlarında sertifikalı üretim yapmaktadır.'},
  {s:'Ürünlerim ne zaman teslim edilir?',c:'İstanbul içi siparişler aynı gün teslim edilir. Siparişinizi öğleden önce verirseniz akşam saatlerinde kapınızdadır.'},
  {s:'Abonelik sistemi nasıl çalışıyor?',c:'Haftalık abonelikle seçtiğiniz ürünler otomatik olarak kapınıza gelir. İstediğiniz zaman ürünleri, miktarı değiştirebilir veya aboneliği iptal edebilirsiniz.'},
  {s:'İade politikanız nedir?',c:'Ürünle ilgili herhangi bir sorun yaşarsanız 24 saat içinde bize bildirmeniz yeterlidir. Sorunuzu çözmeye çalışır, gerektiğinde tam iade yaparız.'},
  {s:'Ürünlerinizde katkı maddesi var mı?',c:'Hayır, ürünlerimizin hiçbirinde katkı maddesi, koruyucu veya tatlandırıcı yoktur. Tamamen doğal ürünler sunuyoruz.'},
  {s:'Hangi ödeme yöntemlerini kabul ediyorsunuz?',c:'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz PayTR güvencesiyle işlenmektedir.'},
]

export default function SSSPage() {

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SORULAR.map(s => ({
      '@type': 'Question',
      name: s.s,
      acceptedAnswer: { '@type': 'Answer', text: s.c }
    }))
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <div style={{minHeight:'100vh',background:'#F0EEF8'}}>
      <div style={{background:'linear-gradient(135deg,#FEF0F4,#EBF7FC)',padding:'48px 24px',textAlign:'center',marginBottom:'0'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'40px',color:'#1C1B2E',marginBottom:'8px'}}>Sık Sorulan Sorular</h1>
        <p style={{color:'#6B7280',fontSize:'14px'}}>Aklınızdaki soruların cevapları burada</p>
      </div>
      <div style={{maxWidth:'720px',margin:'0 auto',padding:'48px 24px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {SORULAR.map((item,i)=>(
            <details key={i} style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',overflow:'hidden'}}>
              <summary style={{padding:'18px 20px',fontSize:'15px',fontWeight:600,color:'#1C1B2E',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                {item.s}
                <span style={{fontSize:'20px',color:'#E07090',flexShrink:0}}>+</span>
              </summary>
              <div style={{padding:'0 20px 18px',fontSize:'14px',color:'#6B7280',lineHeight:'1.7',borderTop:'1px solid #F0ECF5',paddingTop:'16px'}}>{item.c}</div>
            </details>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'40px'}}>
          <p style={{color:'#9CA3AF',fontSize:'14px',marginBottom:'16px'}}>Cevabını bulamadınız mı?</p>
          <Link href="/iletisim" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'14px 32px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700}}>Bize Ulaşın</Link>
        </div>
      </div>
    </div>
    </>
  )
}
