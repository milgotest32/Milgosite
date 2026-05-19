import Link from 'next/link'

const yr = new Date().getFullYear()

const LINKS = [
  {
    baslik: 'Ürünler',
    items: [
      ['Çiğ Süt', '/kategoriler/cig-sut'],
      ['Peynir', '/kategoriler/peynir'],
      ['Tereyağı', '/kategoriler/tereyagi'],
      ['Kampanyalar', '/kampanyalar'],
      ['İndirimdekiler', '/indirimler'],
    ],
  },
  {
    baslik: 'Keşfet',
    items: [
      ['Hakkımızda', '/hakkimizda'],
      ['Çiftliğimiz', '/ciftligimiz'],
      ['Blog', '/blog'],
      ['SSS', '/sss'],
      ['İletişim', '/iletisim'],
    ],
  },
  {
    baslik: 'Yasal',
    items: [
      ['Mesafeli Satış Sözleşmesi', '/mesafeli-satis'],
      ['Gizlilik Politikası', '/gizlilik-politikasi'],
      ['Açık Rıza Metni (KVKK)', '/kvkk'],
      ['İade ve İptal Politikası', '/iade-politikasi'],
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#1A0A12', color: 'rgba(255,255,255,0.6)' }}>
      <style>{`
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 24px 0;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        .footer-brand-col {}
        .footer-logo {
          font-family: var(--font-nunito), Nunito, sans-serif;
          font-size: 28px;
          color: #fff;
          margin-bottom: 4px;
        }
        .footer-tagline {
          font-size: 10px;
          letter-spacing: .3em;
          text-transform: uppercase;
          color: rgba(255,255,255,.35);
          margin-bottom: 16px;
        }
        .footer-desc {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,.5);
          max-width: 240px;
          margin-bottom: 20px;
        }
        .footer-contacts { display: flex; flex-direction: column; gap: 8px; }
        .footer-contact-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: rgba(255,255,255,.5);
          text-decoration: none;
        }
        .footer-col-title {
          font-size: 10px; font-weight: 800;
          letter-spacing: .25em; text-transform: uppercase;
          color: #E8567A; margin-bottom: 18px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-link {
          font-size: 13px; color: rgba(255,255,255,.5);
          text-decoration: none; transition: color .2s;
        }
        .footer-link:hover { color: #fff; }
        .footer-badges {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;
        }
        .footer-badge {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          padding: 6px 12px; border-radius: 50px;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,.6);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,.06);
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy { font-size: 11px; color: rgba(255,255,255,.25); }
        .footer-socials { display: flex; gap: 8px; }
        .footer-social {
          width: 34px; height: 34px;
          background: rgba(255,255,255,.08);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; text-decoration: none;
          color: rgba(255,255,255,.5);
          transition: background .2s;
        }
        .footer-social:hover { background: rgba(232,86,122,.3); }

        /* MOBİL */
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
          .footer-desc { max-width: 100%; }
        }

        @media (max-width: 480px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .footer-brand-col { grid-column: auto; }
        }
      `}</style>

      <div className="footer-inner">
        <div className="footer-top">
          {/* Marka */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <img src="https://jxfegluntgssrgpnvscs.supabase.co/storage/v1/object/public/site-medya/medya/1779186053874-lpldyhy0u38.png" alt="milgo." style={{height:"36px",width:"auto",objectFit:"contain"}}/>
            </div>
            <p className="footer-tagline">Mutluluğun Tadı</p>
            <p className="footer-desc">
              Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.
            </p>
            <div className="footer-contacts">
              {[
                ['📞', '(0212) 352 10 76', 'tel:02123521076'],
                ['✉️', 'bilgi@milgo.com.tr', 'mailto:bilgi@milgo.com.tr'],
                ['📍', 'Etiler, Beşiktaş / İstanbul', '#'],
              ].map(([emoji, text, href]) => (
                <a key={text} href={href} className="footer-contact-link">
                  {emoji} {text}
                </a>
              ))}
            </div>
          </div>

          {/* Link kolonları */}
          {LINKS.map(col => (
            <div key={col.baslik}>
              <h4 className="footer-col-title">{col.baslik}</h4>
              <div className="footer-links">
                {col.items.map(([ad, href]) => (
                  <Link key={ad} href={href} className="footer-link">{ad}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sertifikalar */}
        <div className="footer-badges">
          {['🇪🇺 AB Onaylı', '✓ Hastalıklardan Ari', '🌿 %100 Doğal', '🔒 SSL Güvenli'].map(s => (
            <span key={s} className="footer-badge">{s}</span>
          ))}
        </div>

        {/* Alt bar */}
        <div className="footer-bottom">
          <div style={{display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap',justifyContent:'center'}}>
            <span className="footer-copy">© {yr} milgo. · Keba Gıda San. Tic. A.Ş.</span>
            <a href="https://www.eticaret.gov.tr" target="_blank" rel="noreferrer" title="ETBİS - E-Ticaret Bilgi Sistemi">
              <img src="data:image/png;base64,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" alt="ETBİS" style={{height:'40px',width:'auto',objectFit:'contain',borderRadius:'6px'}}/>
            </a>
          </div>
          <div className="footer-socials">
            {[
              ['📸', 'https://instagram.com/milgosut'],
              ['▶', 'https://youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'],
              ['f', 'https://facebook.com/milgosut'],
            ].map(([icon, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="footer-social">{icon}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
