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
      ['Gizlilik', '/gizlilik'],
      ['İade Politikası', '/iade'],
      ['Mesafeli Satış', '/mesafeli'],
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
          <span className="footer-copy">© {yr} milgo. · Keba Gıda San. Tic. A.Ş.</span>
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
