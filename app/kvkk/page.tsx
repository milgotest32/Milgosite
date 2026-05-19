import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Açık Rıza Metni (KVKK) | milgo.' }
export const dynamic = 'force-dynamic'

const S = {
  wrap: { maxWidth: '800px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) 16px', fontFamily: 'Nunito,sans-serif', color: '#1A0A12', lineHeight: '1.9', fontSize: '15px' } as React.CSSProperties,
  h2: { fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginTop: '32px', marginBottom: '12px' } as React.CSSProperties,
  p: { color: '#4B3A46', marginBottom: '14px' } as React.CSSProperties,
}

export default function KVKKPage() {
  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#FEE8EF 0%,#EBF5FC 100%)', padding: 'clamp(40px,6vw,80px) 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1A0A12', margin: 0 }}>Açık Rıza Metni (KVKK)</h1>
      </div>
      <div style={S.wrap}>
        <p style={S.p}><strong>KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ AYDINLATMA METNİ</strong></p>

        <p style={S.p}>KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ ("KEBA GIDA") olarak kişisel verilerin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu kapsamda 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca aydınlatma yükümlülüğümüzü yerine getirmek amacıyla aşağıdaki açıklamaları dikkatinize sunmak isteriz.</p>

        <h2 style={S.h2}>a) Veri Sorumlusu</h2>
        <p style={S.p}>Veri Sorumlusu sıfatıyla KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ kişisel bilgilerinizi aşağıda açıklandığı çerçevede kaydedecek, saklayacak, güncelleyecek ve mevzuatın izin verdiği durumlarda üçüncü kişilere aktarabilecektir.</p>

        <h2 style={S.h2}>b) Kişisel Verilerin Toplanması ve İşlenmesi</h2>
        <p style={S.p}>Kişisel verileriniz; Şirketimiz birimleri ve ofisleri, sosyal medya mecraları, mobil uygulamalar ve benzeri vasıtalarla sözlü, yazılı ya da elektronik olarak toplanabilecektir. Şirketimizin sunduğu ürün ve hizmetlerden yararlandığınız müddetçe kişisel verileriniz işlenebilecektir.</p>

        <p style={S.p}>Toplanan kişisel verileriniz; Şirketin ticari güvenliğinin temini, insan kaynakları politikalarının yürütülmesi, ticari stratejilerin belirlenmesi ve uygulanması amaçlarıyla KVKK'nın 5 ve 6. maddelerinde belirtilen şartlar dahilinde işlenecektir.</p>

        <p style={S.p}>Ayrıca satışlar, indirimler, kampanyalar ve promosyonlar hakkında bilgilendirme amacıyla da işlenecektir.</p>

        <h2 style={S.h2}>c) Kişisel Verilerin Aktarılabileceği Kişiler</h2>
        <p style={S.p}>Toplanan kişisel verileriniz; iş ortakları, tedarikçiler, kargo şirketleri, ödeme kuruluşları ve yasal zorunluluk halinde kamu kurumlarıyla, KVKK'nın 8. ve 9. maddeleri çerçevesinde paylaşılabilmektedir.</p>

        <h2 style={S.h2}>d) Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
        <p style={S.p}>Kişisel verileriniz; sözleşmenin kurulması ve ifası, yasal yükümlülüklerin yerine getirilmesi, meşru menfaat ve açık rıza hukuki sebeplerine dayalı olarak otomatik ve otomatik olmayan yöntemlerle toplanmaktadır.</p>

        <h2 style={S.h2}>e) Kişisel Veri Sahibinin Hakları</h2>
        <p style={S.p}>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul style={{ paddingLeft: '20px', color: '#4B3A46', lineHeight: '2' }}>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse bilgi talep etme</li>
          <li>Eksik veya yanlış işlenmiş ise düzeltilmesini isteme</li>
          <li>KVKK'nın 7. maddesi çerçevesinde silinmesini isteme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri öğrenme</li>
          <li>Otomatik sistemlere dayalı aleyhine sonuçlara itiraz etme</li>
          <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
        </ul>

        <h2 style={S.h2}>f) Açık Rıza</h2>
        <p style={S.p}>Yukarıda açıklanan amaçlar doğrultusunda kişisel verilerimin işlenmesine, yurt içi ve yurt dışındaki üçüncü kişilere aktarılmasına ve tarafıma ticari elektronik ileti gönderilmesine açık rıza vermekteyim.</p>

        <h2 style={S.h2}>İletişim</h2>
        <p style={S.p}>
          <strong>E-posta:</strong> bilgi@milgo.com.tr<br/>
          <strong>Adres:</strong> Akat Mah. Nisbetiye Cad. Ayhan Apt. No:55/2 Beşiktaş / İSTANBUL<br/>
          <strong>Tel:</strong> (0212) 352 10 76
        </p>

        <p style={{ ...S.p, marginTop: '40px', fontSize: '13px', color: '#9CA3AF', borderTop: '1px solid #F0ECF5', paddingTop: '20px' }}>
          KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ · Mart 2025
        </p>
      </div>
    </div>
  )
}
