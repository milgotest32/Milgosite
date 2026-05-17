import Link from 'next/link'
export default function Footer() {
  return (
    <footer style={{background:'#ffffff', borderTop:'1px solid #F0ECF5'}}>
      <div style={{maxWidth:'1280px', margin:'0 auto', padding:'56px 24px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'40px', marginBottom:'48px'}}>
          
          {/* Brand */}
          <div style={{gridColumn:'span 2'}}>
            <Link href="/" style={{fontFamily:'"Playfair Display", serif', fontSize:'28px', color:'#1C1B2E', textDecoration:'none', display:'block', marginBottom:'4px'}}>
              milgo<span style={{color:'#E07090'}}>.</span>
            </Link>
            <p style={{fontSize:'10px', letterSpacing:'0.3em', textTransform:'uppercase', color:'#9CA3AF', marginBottom:'16px'}}>Mutluluğun Tadı</p>
            <p style={{fontSize:'13px', lineHeight:'1.8', color:'#6B7280', maxWidth:'260px', marginBottom:'20px'}}>
              Çiftliğimizden sofranıza, her gün taze ve doğal süt ürünleri.
            </p>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              {[['📞','(0212) 352 10 76','tel:02123521076'],['✉️','bilgi@milgo.com.tr','mailto:bilgi@milgo.com.tr'],['📍','Etiler, Beşiktaş / İstanbul','#']].map(([i,t,h]) => (
                <a key={t} href={h} style={{display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'#6B7280', textDecoration:'none'}}>{i} {t}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {baslik:'Ürünler', linkler:[['Çiğ Süt','/urunler?kategori=sut'],['Peynir','/urunler?kategori=peynir'],['Tereyağı','/urunler?kategori=tereyag'],['Tüm Ürünler','/urunler']]},
            {baslik:'Keşfet', linkler:[['Abonelik','/abonelik'],['Çiftliğimiz','/ciftligimiz'],['Tarifler','/tarifler'],['Hakkımızda','/hakkimizda']]},
          ].map(({baslik,linkler}) => (
            <div key={baslik}>
              <h4 style={{fontSize:'10px', letterSpacing:'0.3em', textTransform:'uppercase', color:'#E07090', fontWeight:'700', marginBottom:'20px'}}>{baslik}</h4>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {linkler.map(([ad,href]) => <Link key={ad} href={href} style={{fontSize:'13px', color:'#6B7280', textDecoration:'none'}}>{ad}</Link>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{borderTop:'1px solid #F0ECF5', padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px'}}>
          <span style={{fontSize:'11px', color:'#9CA3AF'}}>© 2025 milgo. · Keba Gıda San. Tic. A.Ş.</span>
          <div style={{display:'flex', gap:'8px'}}>
            {[['📸','https://instagram.com/milgosut'],['▶','https://youtube.com/channel/UCcpIYitxZKWuKh6f9NvN7ew']].map(([i,h]) => (
              <a key={h} href={h} target="_blank" rel="noreferrer"
                style={{width:'32px', height:'32px', background:'#F0EEF8', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', textDecoration:'none'}}>{i}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
