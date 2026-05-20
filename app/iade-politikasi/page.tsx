import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'İade ve İptal Politikası | milgo.' }
export const dynamic = 'force-dynamic'

const S = {
  wrap: { maxWidth: '800px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) 16px', fontFamily: 'Nunito,sans-serif', color: '#1A0A12', lineHeight: '1.9', fontSize: '15px' } as React.CSSProperties,
  h2: { fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginTop: '32px', marginBottom: '12px' } as React.CSSProperties,
  p: { color: '#4B3A46', marginBottom: '14px' } as React.CSSProperties,
  note: { background: '#FEF0F4', border: '1px solid #F4A7B9', borderRadius: '12px', padding: '14px 18px', marginBottom: '14px', color: '#E8567A', fontWeight: 600, fontSize: '14px' } as React.CSSProperties,
}

export default function IadePolitikasiPage() {
  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#FEE8EF 0%,#EBF5FC 100%)', padding: 'clamp(40px,6vw,80px) 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1A0A12', margin: 0 }}>İade ve İptal Politikası</h1>
      </div>
      <div style={S.wrap}>
        <p style={S.p}><strong>KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ</strong></p>

        <div style={S.note}>
          ⚠️ Çiğ süt ürünleri doğası gereği hızla bozulabilen hassas ürünler olduğu için iade hakkı kapsamına girmemektedir.
        </div>

        <h2 style={S.h2}>1. İADE KOŞULLARI</h2>
        <p style={S.p}>Aşağıdaki durumlarda iade hakkı doğmaktadır:</p>
        <ul style={{ paddingLeft: '20px', color: '#4B3A46', lineHeight: '2' }}>
          <li>Teslimat sırasında fark edilemeyen yabancı madde, küflenme, bombaj veya renk bozukluğu gibi ayıplı ürünler</li>
          <li>Yanlış ürün teslimi</li>
          <li>Hasarlı veya ambalajı bozulmuş ürünler</li>
        </ul>

        <h2 style={S.h2}>2. İADE SÜRECİ</h2>
        <p style={S.p}>2.1. Ayıplı veya hatalı ürün tespitinde <strong>(0212) 352 10 76</strong> numaralı hattı arayarak ya da <strong>bilgi@milgo.com.tr</strong> adresine e-posta göndererek Müşteri İlişkileri ile iletişime geçiniz.</p>
        <p style={S.p}>2.2. Müşteri İlişkileri bildiriminizi aldıktan sonra en geç <strong>7 iş günü</strong> içinde geri dönüş yapacaktır.</p>
        <p style={S.p}>2.3. İade onayı sonrasında ürünü fatura ve sipariş numarasıyla birlikte belirtilen adrese gönderiniz.</p>
        <p style={S.p}>2.4. Fişsiz, faturasız ve tutanaksız gönderilen ürünlerin iadeleri kesinlikle kabul edilmeyecektir.</p>

        <h2 style={S.h2}>3. İADE BEDELİNİN ÖDENMESİ</h2>
        <p style={S.p}>3.1. <strong>Kredi kartı ödemelerinde:</strong> İade onayından sonra 14 gün içinde ilgili bankaya iade yapılır. Bankanın hesabınıza yansıtma süreci 2-3 haftayı bulabilir.</p>
        <p style={S.p}>3.2. <strong>Havale/EFT ödemelerinde:</strong> İade onayından sonra 14 gün içinde ödeme yapılan hesaba aktarılır.</p>
        <p style={S.p}>3.3. Kurye ücretleri iade edilmez. İade edilecek tutar yalnızca ürün bedelidir.</p>

        <h2 style={S.h2}>4. DEĞİŞİM</h2>
        <p style={S.p}>Değişim hakkı yalnızca aynı ürüne ilişkin kullanılabilir. Farklı bir ürünle değişim mümkün değildir. Değişim kurye ücreti alıcı tarafından karşılanır.</p>

        <h2 style={S.h2}>5. İPTAL</h2>
        <p style={S.p}>5.1. Sipariş kuryeye verilmeden önce iptal talebinde bulunulabilir. İptal için <strong>(0212) 352 10 76</strong> numaralı hattı arayınız.</p>
        <p style={S.p}>5.2. Kuryeye verilmiş siparişlerde iptal mümkün olmayıp teslim alındıktan sonra iade süreci başlatılabilir.</p>
        <p style={S.p}>5.3. Haksız iptal veya teslim almaktan imtina halinde SATICI'dan herhangi bir talepte bulunulamaz.</p>

        <h2 style={S.h2}>6. CAYMA HAKKI</h2>
        <p style={S.p}>6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında çabuk bozulabilen veya son kullanma tarihi geçebilecek mallarda (çiğ süt ürünleri dahil) cayma hakkı kullanılamaz. Diğer ürünlerde teslim tarihinden itibaren <strong>14 gün</strong> içinde cayma hakkı kullanılabilir.</p>

        <h2 style={S.h2}>7. İLETİŞİM</h2>
        <p style={S.p}>
          <strong>Müşteri Hizmetleri:</strong> (0212) 352 10 76<br/>
          <strong>E-posta:</strong> bilgi@milgo.com.tr<br/>
          <strong>Adres:</strong> Akat Mah. Nisbetiye Cad. Ayhan Apt. No:55/2 Beşiktaş / İSTANBUL<br/>
          <strong>Çalışma Saatleri:</strong> Hafta içi 09:00 – 18:00
        </p>

        <p style={{ ...S.p, marginTop: '40px', fontSize: '13px', color: '#9CA3AF', borderTop: '1px solid #F0ECF5', paddingTop: '20px' }}>
          KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ · Son güncelleme: Mart 2025
        </p>
      </div>
    </div>
  )
}
