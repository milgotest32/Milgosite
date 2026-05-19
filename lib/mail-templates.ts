export function siparisMail(siparis: any, items: any[]): string {
  const satirlar = items.map(i => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0ecf5">${i.urun_ad}</td>
      <td style="padding:10px;border-bottom:1px solid #f0ecf5;text-align:center">${i.adet}</td>
      <td style="padding:10px;border-bottom:1px solid #f0ecf5;text-align:right">₺${(i.birim_fiyat * i.adet).toFixed(2)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F0EEF8;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">
    <div style="background:#1A0A12;borderRadius:16px;padding:28px;text-align:center;margin-bottom:24px">
      <h1 style="color:#fff;margin:0;font-size:28px">milgo<span style="color:#F4A7B9">.</span></h1>
      <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:13px">Çiftlikten Sofranıza</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px;margin-bottom:16px">
      <h2 style="color:#1A0A12;margin:0 0 8px;font-size:20px">Siparişiniz Alındı! 🎉</h2>
      <p style="color:#7A6070;margin:0 0 20px;font-size:14px">Sipariş numaranız: <strong style="color:#E8567A">#${siparis.siparis_no}</strong></p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#F0EEF8">
            <th style="padding:10px;text-align:left;font-size:12px;color:#7A6070">ÜRÜN</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#7A6070">ADET</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#7A6070">FİYAT</th>
          </tr>
        </thead>
        <tbody>${satirlar}</tbody>
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:2px solid #F0EEF8">
        ${siparis.kargo_ucreti > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#7A6070;margin-bottom:6px"><span>Kargo</span><span>₺${siparis.kargo_ucreti.toFixed(2)}</span></div>` : '<div style="font-size:13px;color:#22C55E;margin-bottom:6px">🎉 Ücretsiz Kargo</div>'}
        ${siparis.indirim > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#22C55E;margin-bottom:6px"><span>İndirim</span><span>-₺${siparis.indirim.toFixed(2)}</span></div>` : ''}
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#1A0A12;margin-top:8px"><span>Toplam</span><span>₺${siparis.toplam.toFixed(2)}</span></div>
      </div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:20px;margin-bottom:16px">
      <h3 style="color:#1A0A12;margin:0 0 10px;font-size:15px">Teslimat Adresi</h3>
      <p style="color:#7A6070;margin:0;font-size:14px;line-height:1.6">
        ${siparis.musteri_ad}<br/>
        ${siparis.teslimat_adres}<br/>
        ${siparis.teslimat_ilce} / ${siparis.teslimat_sehir}
      </p>
    </div>
    <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:24px">
      Sorularınız için: <a href="mailto:bilgi@milgo.com.tr" style="color:#E8567A">bilgi@milgo.com.tr</a>
    </p>
  </div>
</body>
</html>`
}

export function adminSiparisMail(siparis: any): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F0EEF8;font-family:Arial,sans-serif">
  <div style="max-width:500px;margin:0 auto;padding:32px 16px">
    <div style="background:#1A0A12;border-radius:16px;padding:20px;text-align:center;margin-bottom:20px">
      <h2 style="color:#fff;margin:0">🛍 Yeni Sipariş!</h2>
    </div>
    <div style="background:#fff;border-radius:16px;padding:24px">
      <p style="margin:0 0 8px"><strong>Sipariş No:</strong> #${siparis.siparis_no}</p>
      <p style="margin:0 0 8px"><strong>Müşteri:</strong> ${siparis.musteri_ad}</p>
      <p style="margin:0 0 8px"><strong>E-posta:</strong> ${siparis.musteri_email}</p>
      <p style="margin:0 0 8px"><strong>Telefon:</strong> ${siparis.musteri_telefon || '-'}</p>
      <p style="margin:0 0 8px"><strong>Adres:</strong> ${siparis.teslimat_adres}, ${siparis.teslimat_ilce}</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#E8567A"><strong>Toplam:</strong> ₺${siparis.toplam?.toFixed(2)}</p>
    </div>
  </div>
</body>
</html>`
}
