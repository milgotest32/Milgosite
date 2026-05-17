import type { Metadata } from 'next'
export const metadata: Metadata = { title:'Gizlilik Politikası' }
export default function GizlilikPage() {
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'48px 24px'}}>
      <div style={{maxWidth:'720px',margin:'0 auto',background:'#fff',borderRadius:'24px',padding:'48px',border:'1px solid #F0ECF5'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',color:'#1C1B2E',marginBottom:'8px'}}>Gizlilik Politikası</h1>
        <p style={{fontSize:'12px',color:'#9CA3AF',marginBottom:'32px'}}>Son güncelleme: 1 Ocak 2025</p>
        {[['Veri Toplama','Sitemizi kullandığınızda isim, e-posta, telefon ve adres gibi kişisel bilgilerinizi topluyoruz. Bu bilgiler yalnızca siparişinizi işlemek ve hizmetlerimizi sunmak amacıyla kullanılır.'],['Veri Güvenliği','Kişisel bilgileriniz SSL şifreleme ile korunmakta ve güvenli sunucularda saklanmaktadır. Bilgilerinizi üçüncü taraflarla paylaşmıyoruz.'],['Çerezler','Sitemiz deneyiminizi iyileştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.'],['İletişim','Gizlilik politikamızla ilgili sorularınız için bilgi@milgo.com.tr adresine e-posta gönderebilirsiniz.']].map(([h,p])=>(
          <div key={h} style={{marginBottom:'24px'}}>
            <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',marginBottom:'8px'}}>{h}</h2>
            <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.8'}}>{p}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
