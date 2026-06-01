import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function WhatsappAydinlatmaPage() {
  return (
    <div style={{background:'#fff', minHeight:'100vh'}}>
      <div style={{maxWidth:'860px', margin:'0 auto', padding:'64px 24px'}}>

        <h1 style={{fontFamily:'"Playfair Display",serif', fontSize:'28px', fontWeight:400, color:'#1C1B2E', marginBottom:'8px', lineHeight:1.4}}>
          MİLGO ANIK İLETİŞİMLERİ KAPSAMINDA İŞLENECEK KİŞİSEL VERİLERE YÖNELİK AYDINLATMA METNİ
        </h1>
        <div style={{height:'2px', width:'60px', background:'linear-gradient(90deg,#E07090,#3B9FCC)', borderRadius:'2px', margin:'20px 0 32px'}}/>

        <div style={{fontSize:'14px', lineHeight:1.9, color:'#6B7280', display:'flex', flexDirection:'column', gap:'24px'}}>

          <p>
            Keba Gıda Sanayi ve Ticaret Anonim Şirketi ("Milgo", "Veri Sorumlusu") olarak kişisel verilerinizin korunmasına değer veriyor, dolayısıyla sizin de aynı hassasiyeti göstermenizi bekliyoruz. Bu sebeple hangi kişisel verilerinizi ne amaçla kullandığımızı detaylarıyla anlatan bu metni okumanız, bunların idari ve teknik güvenliğinden "Veri Sorumlusu" sıfatıyla sorumlu olan Milgo'nun yükümlülüklerini net bir şekilde anladığınızı göstermeniz bizim için çok önemlidir.
          </p>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>Neden bu metni okuyorum?</h2>
            <p>
              7 Nisan 2016 tarihinde yürürlüğe giren 6698 sayılı Kişisel Verilerin Korunması Kanununun ("KVKK") 10. maddesi, kişisel verileri işlenen (kullanılan) kişilerin (KVKK'da ilgili kişi olarak ifade edilmektedir) bu verileri kullanan "Veri Sorumlusu" tarafından bilgilendirilmesini zorunlu kılmaktadır. Bizler de Veri Sorumlusu olarak sizler hakkında işleyeceğimiz kişisel verilerle ilgili bilgilendirildiğinizi ispat etmek durumundayız.
            </p>
          </div>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>Kullanılan kişisel verileriniz neler olup hangi yollarla elde edilmektedir?</h2>
            <p style={{marginBottom:'16px'}}>
              Milgo olarak aydınlatma metni kapsamındaki kişisel verilerinizi, Whatsapp Chatbot sistemi üzerinden iletişim kurmanız vasıtasıyla dijital yollarla elde etmekteyiz. Elde edilen kişisel verilerinizin neler olduğu ve elde etmemizin hukuki sebebi aşağıda açıklanmıştır:
            </p>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
                <thead>
                  <tr style={{background:'#F8F7FC'}}>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>Veri Kategorisi</th>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>İşlenen Kişisel Verileriniz</th>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>Elde Etmenin Hukuki Sebebi</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Kimlik Verisi', 'İletişiminiz dahilinde yer vermeniz halinde adınız, soyadınız', 'Belirtilen bilgileriniz, Whatsapp Chatbot sistemi aracılığıyla sizinle iletişim kurmamız vasıtasıyla temel hak ve özgürlüklerinize zarar vermemek kaydıyla hukuken geçerli sayılan menfaatlerimizin yerine getirilebilmesi için işlemenin zorunlu olması hukuki sebebiyle elde edilmektedir.'],
                    ['İletişim Verisi', 'İletişiminiz dahilinde yer vermeniz halinde e-posta adresiniz, telefon numaranız', ''],
                    ['Müşteri İşlem Verisi', 'Talep, şikâyet ya da önerileriniz, sunduğunuz açıklamalarınız, sorularınız, iletişime geçtiğiniz tarih ve saat bilgisi, iletişiminiz üzerine gerçekleştirilen geri dönüşler', ''],
                  ].map(([kat, veri, sebep], i) => (
                    <tr key={i} style={{background: i % 2 === 0 ? '#fff' : '#FAFAF9'}}>
                      <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', fontWeight:600, color:'#1C1B2E', verticalAlign:'top', whiteSpace:'nowrap'}}>{kat}</td>
                      <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>{veri}</td>
                      <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>{sebep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>Elde edilen kişisel verileriniz hangi amaçla ve hukuki sebeple kullanılmaktadır?</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'13px'}}>
                <thead>
                  <tr style={{background:'#F8F7FC'}}>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>Kişisel Veri İşleme Amacı</th>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>İlgili Kişisel Veri Kategorisi</th>
                    <th style={{padding:'12px 16px', textAlign:'left', fontWeight:700, color:'#1C1B2E', border:'1px solid #F0ECF5'}}>İşleme Hukuki Sebebi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>
                      <ul style={{margin:0, paddingLeft:'16px', display:'flex', flexDirection:'column', gap:'6px'}}>
                        <li>İletişim talebinize yönelik kayıtların oluşturulması</li>
                        <li>Şikâyet ve taleplerinize yönelik sonuçları takip edebilmek ve çözümleyebilmek</li>
                        <li>Müşteri ilişkileri hizmetlerinin iyileştirilmesi adına kalite ölçümleri ve analizler yapabilmek</li>
                        <li>Talep, şikâyet veya önerileriniz kapsamında incelemelerin yapılması</li>
                        <li>Tarafınızla talep, şikâyet, öneri veya sorularınıza yönelik iletişim faaliyetlerinin yürütülebilmesi</li>
                      </ul>
                    </td>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>Kimlik, İletişim, Müşteri İşlem kategorilerindeki verileriniz</td>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>Temel hak ve özgürlüklerinize zarar vermemek kaydıyla hukuken geçerli sayılan menfaatlerimizin yerine getirilebilmesi için işlemenin zorunlu olması hukuki sebebiyle işlenmektedir.</td>
                  </tr>
                  <tr style={{background:'#FAFAF9'}}>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>
                      <ul style={{margin:0, paddingLeft:'16px', display:'flex', flexDirection:'column', gap:'6px'}}>
                        <li>İletişim talepleriniz kapsamında geri dönüşlerde bulunmak</li>
                        <li>Talep, şikâyet, öneri veya sorularınız ile tarafınıza iletilen cevapların kaydedilmesi</li>
                      </ul>
                    </td>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>Kimlik, İletişim, Müşteri İşlem kategorilerindeki verileriniz</td>
                    <td style={{padding:'12px 16px', border:'1px solid #F0ECF5', verticalAlign:'top'}}>Bir hakkın korunması, kullanılması ve tesisi için işlemenin zorunlu olması hukuki sebebiyle işlenmektedir.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:'12px', padding:'14px 16px', marginTop:'16px', fontSize:'13px', color:'#92400E'}}>
              ⚠️ Gerçekleştirdiğiniz iletişimler kapsamında KVKK uyarınca açık rızanızı almamız gereken bir kişisel ve/veya özel nitelikli kişisel verinizi paylaşmanız durumunda, yukarıda belirtilen işleme amaçlarının yerine getirilebilmesi adına açık rıza verdiğiniz varsayılacak, gerekmesi halinde bu kapsamda kalan verileriniz özelinde imha süreçleri yürütülecektir.
            </div>
          </div>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>Kişisel verileriniz başkalarına aktarılıyor mu?</h2>
            <p style={{marginBottom:'12px'}}>Evet, kişisel verilerinizi özetle iş ortaklarımıza, resmî kurumlara, denetçilerimize, avukatlarımıza, mali müşavirlerimize aktarmak durumunda kalabiliyoruz. Ancak aktarımı yalnızca belirli amaçlar çerçevesinde ve bilginiz dahilinde yapıyoruz. Dolayısıyla kişisel verileriniz;</p>
            <ul style={{paddingLeft:'20px', display:'flex', flexDirection:'column', gap:'8px'}}>
              <li>Hizmetlerimizi sunabilmek ve sunduğumuz hizmetlerin kalitesini arttırmak amacıyla anlaşmalı olduğumuz tedarikçilerimize ve hizmet sağlayıcılarımıza,</li>
              <li>Yetkili kurum ve kuruluşların talep etmesi halinde mevcut kanuni yükümlülüklerimizin yerine getirilmesi amacıyla; düzenleyici ve denetleyici kurumlara ve kanunlarda açıkça kişisel verileri talep etmeye yetkili olan kamu kurum veya kuruluşlarına,</li>
              <li>Hukuk işlerinin takibi amacıyla birlikte çalışmakta olduğumuz yasal takip süreçleri ile ilgili zorunlu kişilere ve danışmanlarımıza aktarılmaktadır.</li>
            </ul>
          </div>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>KVKK size hangi hakları veriyor?</h2>
            <p>KVKK size kişisel verileriniz üzerinde kontrol sağlayabilmeniz amacıyla; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, varsa yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme, kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme, kişisel verilerinizin silinmesini veya yok edilmesini isteme gibi ve bunlarla sınırlı olmamak üzere bir çok hak sağlamaktadır. Bu hakların tamamını ve detaylarını KVKK'nın 11. maddesinde bulabilirsiniz.</p>
          </div>

          <div>
            <h2 style={{fontSize:'16px', fontWeight:700, color:'#1C1B2E', marginBottom:'10px'}}>Haklarınızı nasıl kullanabilirsiniz?</h2>
            <p>Belirtilen haklarınızı kullanmak isterseniz taleplerinizi bize yazılı olarak (örneğin ihtarname veya iadeli taahhütlü mektup vasıtasıyla) veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da bize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle iletebilirsiniz.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
