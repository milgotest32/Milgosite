'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react'
export const dynamic = 'force-dynamic'

const DURUM: Record<string,string> = {
  bekliyor:'Hazırlanıyor', onaylandi:'Onaylandı', kargoda:'Kuryede', kuryede:'Kuryede', teslim:'Teslim Edildi', iptal:'İptal',
}
const DURUM_RENK: Record<string,{bg:string,color:string}> = {
  bekliyor:  {bg:'#FEF3C7',color:'#D97706'},
  onaylandi: {bg:'#EBF7FC',color:'#3B9FCC'},
  kargoda:   {bg:'#F5F3FF',color:'#8B5CF6'},
  kuryede:   {bg:'#F5F3FF',color:'#8B5CF6'},
  teslim:    {bg:'#F0FDF4',color:'#16A34A'},
  iptal:     {bg:'#FEF2F2',color:'#EF4444'},
}

export default function SiparisDetayPage() {
  const { id } = useParams()
  const router = useRouter()
  const [siparis, setSiparis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const user = data.session.user
      const { data: sip } = await supabase
        .from('site_siparisler')
        .select('*, site_siparis_kalemleri(*)')
        .eq('id', id as string)
        .or(`musteri_id.eq.${user.id},musteri_email.eq.${user.email}`)
        .single()
      if (!sip) { router.push('/hesabim/siparisler'); return }
      setSiparis(sip)
      setLoading(false)
    })
  }, [id, router])

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#F8F5FF',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{width:40,height:40,borderRadius:'50%',border:'3px solid #E8567A',borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (!siparis) return null

  const durum = siparis.durum || 'bekliyor'
  const renk = DURUM_RENK[durum] || {bg:'#F8F7FC',color:'#9CA3AF'}

  return (
    <div style={{minHeight:'100vh',background:'#F8F5FF',padding:'40px 16px',fontFamily:'Nunito,sans-serif'}}>
      <div style={{maxWidth:680,margin:'0 auto'}}>
        <Link href="/hesabim/siparisler" style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13,color:'#9CA3AF',textDecoration:'none',marginBottom:24}}>
          <ArrowLeft size={14}/> Siparişlerime Dön
        </Link>

        {/* Başlık */}
        <div style={{background:'#fff',borderRadius:20,padding:'20px 24px',marginBottom:16,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:8}}>
            <div>
              <p style={{fontSize:11,color:'#9CA3AF',margin:'0 0 4px'}}>Sipariş No</p>
              <h1 style={{fontSize:20,fontWeight:700,color:'#1A0A12',fontFamily:'monospace',margin:0}}>#{siparis.siparis_no}</h1>
            </div>
            <span style={{background:renk.bg,color:renk.color,fontSize:12,fontWeight:700,padding:'6px 14px',borderRadius:50}}>
              {DURUM[durum]||durum}
            </span>
          </div>
          <p style={{fontSize:12,color:'#9CA3AF',margin:'10px 0 0',display:'flex',alignItems:'center',gap:4}}>
            <Clock size={12}/>
            {new Date(siparis.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}
          </p>
          {siparis.kargo_takip_no && (
            <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:10,padding:'10px 14px',marginTop:12,fontSize:13,color:'#1C1B2E'}}>
              📦 Kargo Takip No: <strong style={{fontFamily:'monospace'}}>{siparis.kargo_takip_no}</strong>
            </div>
          )}
        </div>

        {/* Ürünler */}
        <div style={{background:'#fff',borderRadius:20,padding:'20px 24px',marginBottom:16,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <Package size={16} color="#9CA3AF"/><h2 style={{fontSize:15,fontWeight:700,color:'#1A0A12',margin:0}}>Sipariş Edilen Ürünler</h2>
          </div>
          {siparis.site_siparis_kalemleri?.map((k: any) => (
            <div key={k.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid #F3F4F6'}}>
              {k.urun_gorsel ? (
                <img src={k.urun_gorsel} alt={k.urun_ad} style={{width:56,height:56,objectFit:'cover',borderRadius:12,border:'1px solid #F0ECF5',flexShrink:0}}/>
              ) : (
                <div style={{width:56,height:56,background:'#F8F7FC',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Package size={22} color="#D1C4D8"/>
                </div>
              )}
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:'#1A0A12'}}>{k.urun_ad}</div>
                {k.varyant_ad && <div style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>{k.varyant_ad}</div>}
                <div style={{fontSize:12,color:'#9CA3AF',marginTop:2}}>
                  {k.adet} adet × ₺{Number(k.birim_fiyat).toFixed(2)}
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:800,color:'#1A0A12',flexShrink:0}}>₺{Number(k.toplam).toFixed(2)}</div>
            </div>
          ))}

          {/* Özet */}
          <div style={{paddingTop:16,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#6B7280'}}>
              <span>Ara Toplam</span><span style={{fontWeight:600,color:'#1A0A12'}}>₺{Number(siparis.ara_toplam||siparis.toplam).toFixed(2)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#6B7280'}}>
              <span>Teslimat</span>
              <span style={{fontWeight:600,color:siparis.kargo_ucreti===0?'#22C55E':'#1A0A12'}}>
                {siparis.kargo_ucreti===0||siparis.kargo_ucreti===null ? 'Ücretsiz' : `₺${Number(siparis.kargo_ucreti).toFixed(2)}`}
              </span>
            </div>
            {Number(siparis.indirim) > 0 && (
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#6B7280'}}>
                <span>İndirim {siparis.kupon_kod&&<span style={{fontFamily:'monospace',color:'#E07090'}}>({siparis.kupon_kod})</span>}</span>
                <span style={{fontWeight:600,color:'#22C55E'}}>-₺{Number(siparis.indirim).toFixed(2)}</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:12,borderTop:'2px solid #F0ECF5'}}>
              <span style={{fontWeight:700,fontSize:15,color:'#1A0A12'}}>Toplam</span>
              <span style={{fontSize:20,fontWeight:800,color:'#1A0A12'}}>₺{Number(siparis.toplam).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Alt bilgiler */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {/* Teslimat */}
          <div style={{background:'#fff',borderRadius:20,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <MapPin size={16} color="#9CA3AF"/>
              <h3 style={{fontSize:14,fontWeight:700,color:'#1A0A12',margin:0}}>Teslimat Adresi</h3>
            </div>
            {siparis.bolge_adi && (
              <div style={{background:'#EBF7FC',borderRadius:8,padding:'6px 10px',marginBottom:10,fontSize:12,fontWeight:700,color:'#3B9FCC'}}>
                📍 {siparis.bolge_adi}
              </div>
            )}
            <div style={{fontSize:13,color:'#6B7280',lineHeight:'1.7'}}>
              <p style={{fontWeight:600,color:'#1A0A12',margin:'0 0 4px'}}>{siparis.musteri_ad}</p>
              {siparis.musteri_telefon && <p style={{margin:'0 0 4px'}}>{siparis.musteri_telefon}</p>}
              <p style={{margin:'0 0 4px'}}>{siparis.teslimat_adres||siparis.adres?.adres}</p>
              <p style={{margin:0}}>{siparis.teslimat_ilce} / {siparis.teslimat_sehir}</p>
            </div>
            {siparis.notlar && (
              <div style={{background:'#FEF3C7',borderRadius:8,padding:'8px 10px',marginTop:10,fontSize:12,color:'#92400E'}}>
                📝 {siparis.notlar}
              </div>
            )}
          </div>

          {/* Ödeme */}
          <div style={{background:'#fff',borderRadius:20,padding:'20px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <CreditCard size={16} color="#9CA3AF"/>
              <h3 style={{fontSize:14,fontWeight:700,color:'#1A0A12',margin:0}}>Ödeme</h3>
            </div>
            <div style={{fontSize:13,color:'#6B7280',lineHeight:'1.8',display:'flex',flexDirection:'column',gap:6}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span>Yöntem</span>
                <span style={{fontWeight:600,color:'#1A0A12'}}>
                  {siparis.odeme_yontemi==='kapida'?'🚪 Kapıda':siparis.odeme_yontemi==='havale'?'🏦 Havale':'💳 Kart'}
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <span>Durum</span>
                <span style={{fontWeight:600,color:siparis.odeme_durumu==='odendi'?'#22C55E':'#F59E0B'}}>
                  {siparis.odeme_durumu||(siparis.odeme_yontemi==='kapida'?'Kapıda Ödenecek':'Bekliyor')}
                </span>
              </div>
              {siparis.kupon_kod && (
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span>Kupon</span>
                  <span style={{fontWeight:700,fontFamily:'monospace',color:'#E07090'}}>{siparis.kupon_kod}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
