import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Mesafeli Satış Sözleşmesi | milgo.' }
export const dynamic = 'force-dynamic'

const S = {
  wrap: { maxWidth: '800px', margin: '0 auto', padding: 'clamp(32px,5vw,64px) 16px', fontFamily: 'Nunito,sans-serif', color: '#1A0A12', lineHeight: '1.9', fontSize: '15px' } as React.CSSProperties,
  h1: { fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 400, color: '#1A0A12', marginBottom: '32px', paddingBottom: '16px', borderBottom: '2px solid #FEE8EF' } as React.CSSProperties,
  h2: { fontSize: '17px', fontWeight: 700, color: '#1A0A12', marginTop: '32px', marginBottom: '12px' } as React.CSSProperties,
  p: { color: '#4B3A46', marginBottom: '14px' } as React.CSSProperties,
}

export default function MesafeliSatisPage() {
  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg,#FEE8EF 0%,#EBF5FC 100%)', padding: 'clamp(40px,6vw,80px) 24px', textAlign: 'center', marginBottom: '0' }}>
        <h1 style={{ fontFamily: 'var(--font-nunito), Nunito, sans-serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, color: '#1A0A12', margin: 0 }}>Mesafeli Satış Sözleşmesi</h1>
      </div>
      <div style={S.wrap}>
        <p style={S.p}><strong>KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ</strong><br/>
        SÖZLEŞME NO: SİPARİŞ ONAYINI TAKİBEN OLUŞAN SİPARİŞ NO</p>

        <h2 style={S.h2}>MADDE 1 – KONU</h2>
        <p style={S.p}>İşbu Mesafeli Satış Sözleşmesi'nin konusu, SATICI'nın, SİPARİŞ VEREN/ALICI'ya satışını yaptığı, aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkındaki Kanun ile Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini içermektedir.</p>

        <h2 style={S.h2}>MADDE 2 – SATICI BİLGİLERİ</h2>
        <p style={S.p}>
          <strong>Ünvanı:</strong> KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ<br/>
          <strong>Adresi:</strong> Akat Mah. Nisbetiye Cad. Ayhan Ap Blok No: 55 İç Kapı No: 2 Beşiktaş / İSTANBUL<br/>
          <strong>Telefon/Şikâyet Hattı:</strong> (0212) 352 10 76<br/>
          <strong>Mersis No:</strong> 0541108916600001
        </p>

        <h2 style={S.h2}>MADDE 3 – SİPARİŞ VEREN/ALICI KİŞİ BİLGİLERİ</h2>
        <p style={S.p}>Sipariş formunda belirtilen bilgiler geçerlidir.</p>

        <h2 style={S.h2}>MADDE 4 – SÖZLEŞME KONUSU ÜRÜN/ÜRÜNLER BİLGİLERİ</h2>
        <p style={S.p}>Sözleşme'ye konu ürün/ürünlerin türü, miktarı, marka/modeli, adedi, satış bedeli ve ödeme şekli sipariş onayında belirtilmektedir.</p>

        <h2 style={S.h2}>MADDE 5 – ÜRÜN BEDELİ VE ÖDEME</h2>
        <p style={S.p}>5.1. SİPARİŞ VEREN/ALICI, vermiş olduğu siparişlerde toplam sipariş tutarı üzerinden kargo dahil tüm bedelleri ödemekle yükümlüdür.</p>
        <p style={S.p}>5.2. Sözleşme konusu ürünlerin teslimatı için sözleşmenin elektronik ortamda onaylanmış olması ve bedelinin ödenmiş olması şarttır.</p>
        <p style={S.p}>5.3. SATICI, uzak dağıtım bölgelerine minimum sipariş tutarları dahilinde teslimat yapma hakkını saklı tutar.</p>
        <p style={S.p}>5.4. Teslimat sonrası kredi kartının yetkisiz kişilerce kullanılması nedeniyle ödeme yapılmaması halinde SİPARİŞ VEREN/ALICI, bildirimi takiben 3 gün içinde ürün bedelini ödemeyi kabul ve taahhüt eder.</p>
        <p style={S.p}>5.5. Tartılı ve alternatif ürünlerden kaynaklanan fiyat farklılıkları ayrıca yansıtılacaktır.</p>
        <p style={S.p}>5.6. SİPARİŞ VEREN/ALICI'nın Sözleşmeden haksız cayması halinde SATICI'dan hiçbir talepte bulunmayacağını kabul ve taahhüt etmektedir.</p>

        <h2 style={S.h2}>MADDE 6 – ÜRÜN İADESİNE İLİŞKİN HÜKÜMLER</h2>
        <p style={S.p}>6.1. Ayıplı ürünler için (0212) 352 10 76 numaralı hattı arayarak KEBA GIDA Müşteri İlişkileri ile iletişime geçilmelidir.</p>
        <p style={S.p}>6.2. Müşteri İlişkileri, bildirim kapsamında en geç 7 gün içinde bilgilendirme yapacaktır.</p>
        <p style={S.p}>6.3. Fabrikaya gönderilen ürünler incelenerek 7 gün içinde sonuç bildirilecektir.</p>
        <p style={S.p}>6.4. Uygunsuzluk tespiti halinde iade ve değişim hakkı doğar. Kredi kartı ödemelerinde iade 14 gün içinde bankaya yapılır. Havale ödemelerinde iade 14 gün içinde gerçekleştirilir. Kargo ücretleri iade edilmez.</p>
        <p style={S.p}>6.5. Fişsiz, faturasız ve tutanaksız gönderilen ürünlerin iadeleri kabul edilmez. <strong>Çiğ süt ürünleri doğası gereği hızla bozulabilen hassas ürünler olduğu için iade hakkı kapsamına girmemektedir.</strong></p>

        <h2 style={S.h2}>MADDE 7 – TESLİMATA İLİŞKİN HÜKÜMLER</h2>
        <p style={S.p}>7.1. Siparişler, kargo şirketinin hizmet verdiği alanlara Türkiye sınırları dahilinde ulaştırılır.</p>
        <p style={S.p}>7.2. Kargo bedeli sipariş tutarı ile birlikte tahsil edilir.</p>
        <p style={S.p}>7.3. Hafta sonu ve tatil günlerinde verilen siparişler ilk iş günü kargoya verilir.</p>
        <p style={S.p}>7.4. Teslimat, sipariş tarihinden itibaren en geç 3 iş günü içinde gerçekleştirilir. Mücbir sebepler veya olağanüstü trafik durumunda bu süre uzayabilir.</p>

        <h2 style={S.h2}>MADDE 8 – CAYMA HAKKI</h2>
        <p style={S.p}>SİPARİŞ VEREN/ALICI, çabuk bozulabilen ya da son kullanma tarihi geçebilecek mallar kapsamında değerlendirilen çiğ süt ürünleri söz konusu olduğunda cayma hakkını kullanamaz. Diğer ürünlerde teslim tarihinden itibaren 14 gün içinde cayma hakkı kullanılabilir.</p>

        <h2 style={S.h2}>MADDE 9 – UYUŞMAZLIK</h2>
        <p style={S.p}>İşbu Sözleşme'den doğabilecek uyuşmazlıklarda Türk Hukuku uygulanır. Uyuşmazlıklarda İstanbul Tüketici Hakem Heyetleri ve Mahkemeleri yetkilidir.</p>

        <p style={{ ...S.p, marginTop: '40px', fontSize: '13px', color: '#9CA3AF', borderTop: '1px solid #F0ECF5', paddingTop: '20px' }}>
          KEBA GIDA SANAYİ VE TİCARET ANONİM ŞİRKETİ · Akat Mah. Nisbetiye Cad. Ayhan Apt. No:55/2 Beşiktaş / İSTANBUL · Tel: (0212) 352 10 76
        </p>
      </div>
    </div>
  )
}
