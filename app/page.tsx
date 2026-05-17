'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useSepet } from '@/lib/sepet'
import type { Urun } from '@/lib/types'
import { Check, ShoppingBag, Heart, Star, ArrowRight, RefreshCw, ShieldCheck, Truck, Award } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'

export default function AnaSayfa() {
  const [urunler, setUrunler] = useState<Urun[]>([])

  useEffect(() => {
    supabase.from('site_products').select('*, site_product_images(*), site_kategoriler(name,slug)').eq('durum', 'active').order('created_at',{ascending:false}).limit(12)
      .then(({ data }: any) => setUrunler(data || []))
  }, [])

  const featured = urunler.filter(u => u.featured)
  const yeni = urunler.filter(u => u.yeni)
  const goster = featured.length > 0 ? featured : urunler.slice(0, 4)
  const hero_gorsel = urunler[0]?.site_product_images?.[0]?.url

  return (
    <div style={{background:'#F0EEF8'}}>

      {/* HERO */}
      <section style={{maxWidth:'1280px',margin:'0 auto',padding:'40px 24px 32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}>
          <div>
            <span style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#EBF7FC',color:'#3B9FCC',fontSize:'11px',fontWeight:700,padding:'6px 14px',borderRadius:'50px',marginBottom:'24px'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#3B9FCC',animation:'pulse 2s infinite'}}/>
              Çiftliğimizden Sofranıza
            </span>
            <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(40px,5vw,68px)',lineHeight:'1.1',color:'#1C1B2E',marginBottom:'20px',letterSpacing:'-0.02em'}}>
              Mutluluğun<br/>
              <span style={{fontStyle:'italic',color:'#E07090'}}>Tadını</span><br/>
              Hissedin
            </h1>
            <p style={{fontSize:'15px',lineHeight:'1.8',color:'#6B7280',maxWidth:'380px',marginBottom:'32px'}}>
              ATASANCAK Çiftliği'nden günlük toplanan çiğ süt, geleneksel yöntemlerle hazırlanan peynir ve tereyağı. %100 doğal, katkısız.
            </p>
            <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'40px'}}>
              <Link href="/urunler" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',fontSize:'14px',fontWeight:700,padding:'14px 28px',borderRadius:'50px',textDecoration:'none',boxShadow:'0 6px 20px rgba(224,112,144,0.35)'}}>
                <ShoppingBag size={16}/>Alışverişe Başla
              </Link>
              <Link href="/abonelik" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#fff',color:'#E07090',fontSize:'14px',fontWeight:600,padding:'14px 28px',borderRadius:'50px',textDecoration:'none',border:'2px solid #F4A7B9'}}>
                <RefreshCw size={16}/>Abonelik
              </Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',paddingTop:'24px',borderTop:'1px solid rgba(255,255,255,0.6)'}}>
              {[['10.5K','Büyükbaş'],['%100','Doğal'],['AB','Onaylı'],['0','Katkı']].map(([s,a])=>(
                <div key={a} style={{textAlign:'center'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{s}</div>
                  <div style={{fontSize:'10px',color:'#9CA3AF',marginTop:'2px'}}>{a}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:'relative'}} className="hidden lg:block">
            <div style={{borderRadius:'32px',overflow:'hidden',aspectRatio:'4/5',background:'linear-gradient(135deg,#F5C4D0,#C8E8F5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px'}}>
              {hero_gorsel ? (
                <img src={hero_gorsel} alt="Milgo Ürünleri" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
              ) : <span style={{fontSize:'96px'}}>🥛</span>}
            </div>
            <div style={{position:'absolute',left:'-16px',top:'10%',background:'#fff',borderRadius:'16px',padding:'12px 16px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'36px',height:'36px',background:'#FEF0F4',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🥛</div>
                <div><div style={{fontSize:'12px',fontWeight:700,color:'#1C1B2E'}}>Çiğ Süt 2L</div><div style={{fontSize:'13px',fontWeight:700,color:'#E07090'}}>₺130</div></div>
              </div>
            </div>
            <div style={{position:'absolute',right:'-16px',bottom:'15%',background:'#fff',borderRadius:'16px',padding:'12px 16px',boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'36px',height:'36px',background:'#EBF7FC',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>⭐</div>
                <div><div style={{fontSize:'12px',fontWeight:700,color:'#1C1B2E'}}>4.9/5 Puan</div><div style={{fontSize:'11px',color:'#9CA3AF'}}>500+ Yorum</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section style={{background:'#fff',borderTop:'1px solid #F0ECF5',borderBottom:'1px solid #F0ECF5',padding:'20px 24px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'20px'}}>
          {[{icon:<Truck size={18}/>,renk:'#3B9FCC',bg:'#EBF7FC',t:'Hızlı Teslimat',a:'İstanbul içi aynı gün'},{icon:<ShieldCheck size={18}/>,renk:'#E07090',bg:'#FEF0F4',t:'Güvenli Ödeme',a:'SSL korumalı'},{icon:<RefreshCw size={18}/>,renk:'#3B9FCC',bg:'#EBF7FC',t:'Abonelik',a:'Her hafta kapınıza'},{icon:<Award size={18}/>,renk:'#E07090',bg:'#FEF0F4',t:'AB Onaylı',a:'Sertifikalı üretim'}].map(item=>(
            <div key={item.t} style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <div style={{width:'36px',height:'36px',background:item.bg,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:item.renk,flexShrink:0}}>{item.icon}</div>
              <div><div style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>{item.t}</div><div style={{fontSize:'11px',color:'#9CA3AF'}}>{item.a}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* En Çok Satanlar */}
      <section style={{maxWidth:'1280px',margin:'0 auto',padding:'56px 24px 32px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'28px'}}>
          <div>
            <span style={{display:'inline-block',background:'#FEF0F4',color:'#E07090',fontSize:'10px',fontWeight:700,padding:'4px 12px',borderRadius:'50px',marginBottom:'8px'}}>En Çok Satanlar</span>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'34px',color:'#1C1B2E'}}>Çok <span style={{fontStyle:'italic',color:'#E07090'}}>Sevilenler</span></h2>
          </div>
          <Link href="/urunler" style={{fontSize:'13px',fontWeight:600,color:'#E07090',textDecoration:'none',display:'flex',alignItems:'center',gap:'4px'}} className="hidden md:flex">
            Tümünü Gör <ArrowRight size={14}/>
          </Link>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'}}>
          {goster.slice(0,4).map(urun=><ProductCard key={urun.id} urun={urun}/>)}
        </div>
      </section>

      {/* Abonelik Banner */}
      <section style={{margin:'0 24px 48px',borderRadius:'32px',overflow:'hidden',background:'linear-gradient(135deg,#F5C4D0,#C8E8F5)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'56px 48px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'48px',alignItems:'center'}}>
          <div>
            <span style={{display:'inline-block',background:'rgba(224,112,144,0.15)',color:'#E07090',fontSize:'10px',fontWeight:700,padding:'4px 12px',borderRadius:'50px',marginBottom:'16px'}}>⟳ Haftalık Abonelik</span>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'34px',color:'#1C1B2E',marginBottom:'16px'}}>Her Hafta Taze,<br/><span style={{fontStyle:'italic',color:'#E07090'}}>Hiç Düşünmeden</span></h2>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'28px'}}>
              {['İstediğiniz zaman iptal','Miktarı değiştirme','Her Cuma teslimat','Abonelere %10 indirim'].map(oz=>(
                <div key={oz} style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'13px',color:'#1C1B2E'}}>
                  <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'linear-gradient(135deg,#E07090,#3B9FCC)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Check size={10} color="#fff"/>
                  </div>
                  {oz}
                </div>
              ))}
            </div>
            <Link href="/abonelik" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#1C1B2E',color:'#fff',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontSize:'14px',fontWeight:700}}>
              Abonelik Başlat <ArrowRight size={14}/>
            </Link>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {[{ad:'Başlangıç',det:'2L · Haftada Bir',fiyat:'520',hot:false},{ad:'Aile',det:'4L · Haftada Bir',fiyat:'980',hot:true},{ad:'Premium',det:'6L · Haftada Bir',fiyat:'1.380',hot:false}].map(plan=>(
              <div key={plan.ad} style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(8px)',borderRadius:'20px',padding:'18px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',border:plan.hot?'2px solid #E07090':'2px solid transparent'}}>
                <div>
                  <div style={{fontSize:'16px',fontWeight:700,color:'#1C1B2E',fontFamily:'"Playfair Display",serif'}}>{plan.ad}{plan.hot&&<span style={{fontSize:'9px',fontWeight:700,background:'#E07090',color:'#fff',padding:'2px 8px',borderRadius:'50px',marginLeft:'8px'}}>Popüler</span>}</div>
                  <div style={{fontSize:'12px',color:'#9CA3AF'}}>{plan.det}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',color:'#E07090'}}>₺{plan.fiyat}</div>
                  <div style={{fontSize:'10px',color:'#9CA3AF'}}>/ ay</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yorumlar */}
      <section style={{padding:'48px 24px',background:'#fff',borderTop:'1px solid #F0ECF5',borderBottom:'1px solid #F0ECF5'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'36px'}}>
            <span style={{display:'inline-block',background:'#FEF0F4',color:'#E07090',fontSize:'10px',fontWeight:700,padding:'4px 12px',borderRadius:'50px',marginBottom:'10px'}}>500+ Mutlu Müşteri</span>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'34px',color:'#1C1B2E'}}>Sizden <span style={{fontStyle:'italic',color:'#E07090'}}>Gelenler</span></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {[{h:'E',ad:'Ebru G.',lok:'Beşiktaş',metin:'"Sütün tadı gerçekten çok farklı. Marketten alışkanlığım gitti, artık sadece Milgo. Teslimat da çok hızlı!"'},{h:'H',ad:'Hatice B.',lok:'Kadıköy · Abone',metin:'"3 aydır aboneyim. Her Cuma taptaze geliyor. Peynirler de muhteşem, sarımsaklısını özellikle tavsiye ederim."'},{h:'M',ad:'Mehmet K.',lok:'Şişli',metin:'"Çocuklar için doğal süt arıyordum. AB onaylı olması güven veriyor. Kesinlikle tavsiye ederim."'}].map(y=>(
              <div key={y.ad} style={{background:'#F0EEF8',borderRadius:'20px',padding:'24px',border:'1px solid #F0ECF5'}}>
                <div style={{display:'flex',gap:'2px',marginBottom:'12px'}}>{[1,2,3,4,5].map(s=><Star key={s} size={14} className="text-yellow-400" fill="currentColor"/>)}</div>
                <p style={{fontFamily:'"Playfair Display",serif',fontStyle:'italic',fontSize:'15px',color:'#1C1B2E',lineHeight:'1.7',marginBottom:'16px'}}>{y.metin}</p>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'linear-gradient(135deg,#F4A7B9,#7EC8E3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,color:'#fff'}}>{y.h}</div>
                  <div><div style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>{y.ad}</div><div style={{fontSize:'11px',color:'#9CA3AF'}}>{y.lok}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bülten */}
      <section style={{padding:'56px 24px',textAlign:'center',background:'#F0EEF8'}}>
        <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',color:'#1C1B2E',marginBottom:'8px'}}>İlk Siparişte <span style={{fontStyle:'italic',color:'#E07090'}}>%10 İndirim</span></h2>
        <p style={{fontSize:'14px',color:'#9CA3AF',marginBottom:'24px'}}>Bültene katılın, özel tekliflerden ilk siz haberdar olun.</p>
        <form style={{display:'flex',maxWidth:'420px',margin:'0 auto',background:'#fff',borderRadius:'20px',border:'1px solid #F0ECF5',padding:'6px'}} onSubmit={e=>e.preventDefault()}>
          <input type="email" placeholder="E-posta adresiniz" style={{flex:1,background:'transparent',border:'none',padding:'10px 16px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
          <button type="submit" style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'14px',padding:'10px 20px',fontSize:'13px',fontWeight:700,cursor:'none',fontFamily:'inherit',flexShrink:0}}>Katıl</button>
        </form>
      </section>
    </div>
  )
}
