import type { Metadata } from 'next'
export const metadata: Metadata = { title:'Mesafeli Satış Sözleşmesi' }
export default function MesafeliPage() {
  return (
    <div style={{minHeight:'100vh',background:'#F0EEF8',padding:'48px 24px'}}>
      <div style={{maxWidth:'720px',margin:'0 auto',background:'#fff',borderRadius:'24px',padding:'48px',border:'1px solid #F0ECF5'}}>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',color:'#1C1B2E',marginBottom:'32px'}}>Mesafeli Satış Sözleşmesi</h1>
        <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.8',marginBottom:'16px'}}><strong>SATICI:</strong> Keba Gıda San. Tic. A.Ş., Etiler/Beşiktaş, İstanbul</p>
        <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.8',marginBottom:'16px'}}><strong>ALICI:</strong> Siteye üye olan veya sipariş veren kişi</p>
        <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.8'}}>Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında düzenlenmiştir. Sipariş vermeniz bu sözleşmeyi kabul ettiğiniz anlamına gelir. Detaylı bilgi için bilgi@milgo.com.tr adresine yazabilirsiniz.</p>
      </div>
    </div>
  )
}
