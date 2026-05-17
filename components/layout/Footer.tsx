import Link from 'next/link'
export default function Footer() {
  const yr = new Date().getFullYear()
  return (
    <footer style={{background:'#1C1B2E',color:'rgba(255,255,255,0.7)'}}>
      {/* Üst */}
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'64px 24px 0'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'48px',marginBottom:'48px'}}>
          <div>
            <div style={{fontFamily:'"Instrument Serif","Playfair Display",serif',fontSize:'28px',color:'#fff',marginBottom:'4px'}}>milgo<span style={{color:'#F4A7B9'}}>.</span></div>
            <p style={{fontSize:'10px',letterSpacing:'0.3em',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',marginBottom:'16px'}}>Mutluluğun Tadı</p>
            <p style={{fontSize:'13px',lineHeight:'1.8',color:'rgba(255,255,255,0.5)',maxWidth:'240px',marginBottom:'20px'}}>Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {[['📞','(0212) 352 10 76','tel:02123521076'],['✉️','bilgi@milgo.com.tr','mailto:bilgi@milgo.com.tr'],['📍','Etiler, Beşiktaş / İstanbul','#']].map(([i,t,h])=>(
                <a key={t} href={h} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>{i} {t}</a>
              ))}
            </div>
          </div>
          {[
            {h:'Ürünler', l:[['Çiğ Süt','/kategoriler/cig-sut'],['Peynir','/kategoriler/peynir'],['Tereyağı','/kategoriler/tereyagi'],['Kampanyalar','/kampanyalar'],['İndirimdekiler','/indirimler']]},
            {h:'Bilgi', l:[['Hakkımızda','/hakkimizda'],['Çiftliğimiz','/ciftligimiz'],['Blog','/blog'],['SSS','/sss'],['İletişim','/iletisim']]},
            {h:'Yasal', l:[['Gizlilik','/gizlilik'],['İade Politikası','/iade'],['Mesafeli Satış','/mesafeli'],['Kullanım Koşulları','/kullanim']]},
          ].map(({h,l})=>(
            <div key={h}>
              <h4 style={{fontSize:'10px',fontWeight:700,letterSpacing:'0.25em',textTransform:'uppercase',color:'#F4A7B9',marginBottom:'20px'}}>{h}</h4>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {l.map(([ad,href])=><Link key={ad} href={href} style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>{ad}</Link>)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Sertifikalar */}
        <div style={{display:'flex',gap:'16px',marginBottom:'32px',flexWrap:'wrap'}}>
          {['🇪🇺 AB Onaylı','✓ Hastalıklardan Ari','🌿 %100 Doğal','🔒 SSL Güvenli'].map(s=>(
            <span key={s} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',padding:'6px 14px',borderRadius:'50px',fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.7)'}}>{s}</span>
          ))}
        </div>

        <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'20px 0',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.3)'}}>© {yr} milgo. · Keba Gıda San. Tic. A.Ş. · Tüm hakları saklıdır.</span>
          <div style={{display:'flex',gap:'8px'}}>
            {[['📸','https://instagram.com/milgosut'],['▶','https://youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew'],['f','https://facebook.com/milgosut']].map(([i,h])=>(
              <a key={h} href={h} target="_blank" rel="noreferrer" style={{width:'32px',height:'32px',background:'rgba(255,255,255,0.08)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'rgba(255,255,255,0.5)',textDecoration:'none'}}>{i}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
