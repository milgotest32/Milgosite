import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Gizlilik Politikası | milgo.' }
export const dynamic = 'force-dynamic'

const S = {
  wrap: { maxWidth: '800px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) 16px', fontFamily: 'Nunito,sans-serif', color: '#1A0A12', lineHeight: '1.9', fontSize: '15px' } as React.CSSProperties,
  h2: { fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginTop: '32px', marginBottom: '12px' } as React.CSSProperties,
  p: { color: '#4B3A46', marginBottom: '14px' } as React.CSSProperties,
}

export default function GizlilikPage() {
  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#FEE8EF 0%,#EBF5FC 100%)', padding: 'clamp(40px,6vw,80px) 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1A0A12', margin: 0 }}>Gizlilik Politikası</h1>
      </div>
      <div style={S.wrap}>
        <p style={S.p}><strong>KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ KİŞİSEL VERİLERİN KORUNMASI, İŞLENMESİ ve GİZLİLİK POLİTİKASI</strong><br/>
        Hazırlayan: KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ Kişisel Verilerin Korunması Komitesi<br/>
        Yürürlük Tarihi: Mart 2025</p>

        <p style={S.p}>Politika'nın hazırlanmış olduğu Türkçe dilindeki hali ile herhangi bir çeviri hali arasında bir uyuşmazlık çıktığı hallerde, Türkçe metni dikkate alınmalıdır. İşbu belge KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ'nin yazılı izni olmaksızın çoğaltılıp dağıtılamaz.</p>

        <h2 style={S.h2}>1. GİRİŞ</h2>
        <p style={S.p}>Kişisel verilerin korunması KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ'nin en önemli öncelikleri arasındadır. İşbu Politika çerçevesinde Şirketimiz tarafından gerçekleştirilen kişisel veri işleme faaliyetleri, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") başta olmak üzere ilgili tüm mevzuata uygun şekilde yürütülmektedir.</p>

        <h2 style={S.h2}>2. AMAÇ VE KAPSAM</h2>
        <p style={S.p}>Bu Politika; KEBA GIDA çalışanları, çalışan adayları, tedarikçi çalışanları ve yetkilileri, müşteriler, ziyaretçiler ve diğer üçüncü kişilere ait kişisel verilerin işlenmesine ilişkin usul ve esasları belirlemek amacıyla hazırlanmıştır.</p>

        <h2 style={S.h2}>3. KİŞİSEL VERİLERİN İŞLENME İLKELERİ</h2>
        <p style={S.p}>KEBA GIDA, kişisel verileri aşağıdaki ilkeler çerçevesinde işlemektedir:</p>
        <ul style={{ paddingLeft: '20px', color: '#4B3A46', lineHeight: '2' }}>
          <li>Hukuka ve dürüstlük kurallarına uygun olma</li>
          <li>Doğru ve gerektiğinde güncel olma</li>
          <li>Belirli, açık ve meşru amaçlar için işlenme</li>
          <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma</li>
          <li>İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilme</li>
        </ul>

        <h2 style={S.h2}>4. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h2>
        <p style={S.p}>Kişisel verileriniz; ürün ve hizmetlerin sunulması, sipariş yönetimi, müşteri ilişkileri, fatura/sözleşme süreçleri, kampanya ve promosyon bildirimleri, yasal yükümlülüklerin yerine getirilmesi ve güvenliğin sağlanması amaçlarıyla işlenmektedir.</p>

        <h2 style={S.h2}>5. KİŞİSEL VERİLERİN AKTARILMASI</h2>
        <p style={S.p}>Kişisel verileriniz; hizmet aldığımız tedarikçiler, iş ortakları, kurye ve lojistik firmaları, ödeme kuruluşları ile yasal zorunluluk halinde kamu kurumlarıyla KVKK'nın 8. ve 9. maddelerinde belirtilen koşullar çerçevesinde paylaşılabilmektedir.</p>

        <h2 style={S.h2}>6. KİŞİSEL VERİ SAHİBİNİN HAKLARI</h2>
        <p style={S.p}>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
        <ul style={{ paddingLeft: '20px', color: '#4B3A46', lineHeight: '2' }}>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını öğrenme ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmiş ise düzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini isteme</li>
          <li>Yapılan işlemlerin üçüncü kişilere bildirilmesini isteme</li>
          <li>Aleyhine sonuç doğuran otomatik sistemlere itiraz etme</li>
          <li>Kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme</li>
        </ul>

        <h2 style={S.h2}>7. VERİ GÜVENLİĞİ</h2>
        <p style={S.p}>KEBA GIDA, kişisel verilerin hukuka aykırı işlenmesini önlemek, yetkisiz erişimi engellemek ve verilerin güvenli muhafazasını sağlamak amacıyla uygun teknik ve idari tedbirleri almaktadır.</p>

        <h2 style={S.h2}>8. İLETİŞİM</h2>
        <p style={S.p}>Haklarınızı kullanmak veya soru ve talepleriniz için:<br/>
        <strong>E-posta:</strong> bilgi@milgo.com.tr<br/>
        <strong>Adres:</strong> Akat Mah. Nisbetiye Cad. Ayhan Apt. No:55/2 Beşiktaş / İSTANBUL<br/>
        <strong>Tel:</strong> (0212) 352 10 76</p>

        <p style={{ ...S.p, marginTop: '40px', fontSize: '13px', color: '#9CA3AF', borderTop: '1px solid #F0ECF5', paddingTop: '20px' }}>
          Son güncelleme: Mart 2025 · KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ
        </p>
      </div>
    </div>
  )
}
