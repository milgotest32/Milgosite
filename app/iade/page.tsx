import type { Metadata } from 'next'
export const metadata: Metadata = { title:'İade Politikası' }
export default function IadePage() {
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'48px 24px'}}>
      <div style={{maxWidth:'720px',margin:'0 auto',background:'#fff',borderRadius:'24px',padding:'48px',border:'1px solid #F0ECF5'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',color:'#1C1B2E',marginBottom:'32px'}}>İade Politikası</h1>
        {[['İade Koşulları','Gıda ürünleri olmaları nedeniyle ürünlerimiz, teslim sonrasında açılmamış ve bozulmamış olmaları koşuluyla 24 saat içinde iade kabul edilir.'],['İade Süreci','İade talebinizi bilgi@milgo.com.tr adresine veya (0212) 352 10 76 numaralı telefona bildirin. İade kargo ücretini biz karşılıyoruz.'],['Geri Ödeme','Onaylanan iadeler 3-5 iş günü içinde kartınıza iade edilir. Havale ile ödeyenlerin banka bilgilerini iletmesi gerekmektedir.']].map(([h,p])=>(
          <div key={h} style={{marginBottom:'24px'}}>
            <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'8px'}}>{h}</h2>
            <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.8'}}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
