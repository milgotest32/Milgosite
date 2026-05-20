'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package, User, MapPin, CreditCard, FileText, Tag, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const DURUM_RENK: Record<string,{bg:string,color:string}> = {
  bekliyor:  { bg:'#FEF3C7', color:'#F59E0B' },
  onaylandi: { bg:'#EBF7FC', color:'#3B9FCC' },
  kargoda:   { bg:'#F5F3FF', color:'#8B5CF6' },
  kuryede:   { bg:'#F5F3FF', color:'#8B5CF6' },
  teslim:    { bg:'#F0FDF4', color:'#22C55E' },
  iptal:     { bg:'#FEF2F2', color:'#EF4444' },
}

const DURUM_AD: Record<string,string> = {
  bekliyor:'Bekliyor', onaylandi:'Onaylandı', kargoda:'Kargoda', kuryede:'Kuryede', teslim:'Teslim Edildi', iptal:'İptal'
}

function InfoRow({label,value,mono=false}:{label:string,value:any,mono?:boolean}) {
  if (!value && value !== 0) return null
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'8px 0',borderBottom:'1px solid #F8F7FC'}}>
      <span style={{fontSize:'12px',color:'#9CA3AF',flexShrink:0,marginRight:'12px'}}>{label}</span>
      <span style={{fontSize:'13px',fontWeight:600,color:'#1C1B2E',textAlign:'right',fontFamily:mono?'monospace':'inherit'}}>{value}</span>
    </div>
  )
}

function Card({title,icon,children}:{title:string,icon:React.ReactNode,children:React.ReactNode}) {
  return (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',marginBottom:'12px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
        <span style={{color:'#9CA3AF'}}>{icon}</span>
        <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',margin:0}}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function SiparisDetay() {
  const { id } = useParams()
  const [siparis, setSiparis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [durumGuncelleniyor, setDurumGuncelleniyor] = useState(false)
  const [kargoBilgisi, setKargoBilgisi] = useState('')

  useEffect(() => {
    supabase.from('site_siparisler')
      .select('*, site_siparis_kalemleri(*)')
      .eq('id', id as string)
      .single()
      .then(async ({ data }) => {
        // Eğer kalemler boşsa veya yüklenmediyse tekrar dene
        if (data && (!data.site_siparis_kalemleri || data.site_siparis_kalemleri.length === 0)) {
          const { data: kalemler } = await supabase
            .from('site_siparis_kalemleri')
            .select('*')
            .eq('siparis_id', data.id)
          if (kalemler && kalemler.length > 0) {
            data.site_siparis_kalemleri = kalemler
          }
        }
        setSiparis(data)
        setKargoBilgisi(data?.kargo_takip_no || '')
        setLoading(false)
      })
  }, [id])

  const durumGuncelle = async (durum: string) => {
    setDurumGuncelleniyor(true)
    await supabase.from('site_siparisler').update({ durum, updated_at: new Date().toISOString() }).eq('id', id as string)
    setSiparis((s: any) => s ? { ...s, durum } : s)
    toast.success('Durum güncellendi')
    setDurumGuncelleniyor(false)
  }

  const kargoKaydet = async () => {
    await supabase.from('site_siparisler').update({ kargo_takip_no: kargoBilgisi }).eq('id', id as string)
    toast.success('Kargo takip no kaydedildi')
  }

  if (loading) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</div>
  if (!siparis) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Sipariş bulunamadı</div>

  const durum = siparis.durum || 'bekliyor'
  const durumRenk = DURUM_RENK[durum] || { bg:'#F8F7FC', color:'#9CA3AF' }

  return (
    <div>
      {/* Başlık */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/admin/siparisler" style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',color:'#6B7280'}}>
            <ArrowLeft size={16}/>
          </Link>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
              <h1 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',fontFamily:'monospace',margin:0}}>#{siparis.siparis_no}</h1>
              <span style={{background:durumRenk.bg,color:durumRenk.color,fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px'}}>
                {DURUM_AD[durum] || durum}
              </span>
              {siparis.bolge_adi && (
                <span style={{background:'#EBF7FC',color:'#3B9FCC',fontSize:'11px',fontWeight:700,padding:'3px 10px',borderRadius:'50px',display:'flex',alignItems:'center',gap:'4px'}}>
                  📍 {siparis.bolge_adi}
                </span>
              )}
            </div>
            <p style={{fontSize:'12px',color:'#9CA3AF',margin:'3px 0 0'}}>
              <Clock size={11} style={{display:'inline',marginRight:'4px'}}/>
              {new Date(siparis.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}
            </p>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <select value={siparis.durum} onChange={e=>durumGuncelle(e.target.value)}
            disabled={durumGuncelleniyor}
            style={{background:'#fff',border:'1px solid #F0ECF5',borderRadius:'12px',padding:'10px 16px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',cursor:'pointer',fontWeight:600}}>
            {['bekliyor','onaylandi','kargoda','kuryede','teslim','iptal'].map(d=>(
              <option key={d} value={d}>{DURUM_AD[d]||d}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'16px'}}>
        {/* Sol kolon */}
        <div>
          {/* Sipariş Kalemleri */}
          <Card title="Sipariş Kalemleri" icon={<Package size={16}/>}>
            {siparis.site_siparis_kalemleri?.length > 0 ? siparis.site_siparis_kalemleri.map((k: any) => (
              <div key={k.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 0',borderBottom:'1px solid #F8F7FC'}}>
                {k.urun_gorsel ? (
                  <img src={k.urun_gorsel} alt={k.urun_ad} style={{width:'52px',height:'52px',objectFit:'cover',borderRadius:'10px',border:'1px solid #F0ECF5',flexShrink:0}}/>
                ) : (
                  <div style={{width:'52px',height:'52px',background:'#F8F7FC',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Package size={20} color="#D1C4D8"/>
                  </div>
                )}
                <div style={{flex:1}}>
                  <div style={{fontSize:'14px',fontWeight:600,color:'#1C1B2E'}}>{k.urun_ad}</div>
                  {k.varyant_ad && <div style={{fontSize:'11px',color:'#9CA3AF',marginTop:'2px'}}>{k.varyant_ad}</div>}
                  <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'2px'}}>x{k.adet} · ₺{Number(k.birim_fiyat).toFixed(2)} / adet</div>
                </div>
                <div style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',flexShrink:0}}>₺{Number(k.toplam).toFixed(2)}</div>
              </div>
            )) : (
              <p style={{color:'#9CA3AF',fontSize:'13px',textAlign:'center',padding:'16px'}}>Kalem bulunamadı</p>
            )}

            {/* Özet */}
            <div style={{paddingTop:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                <span style={{color:'#9CA3AF'}}>Ara Toplam</span>
                <span style={{fontWeight:600}}>₺{Number(siparis.ara_toplam||siparis.toplam).toFixed(2)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                <span style={{color:'#9CA3AF'}}>Kurye Ücreti</span>
                <span style={{fontWeight:600}}>{siparis.kargo_ucreti===0||siparis.kargo_ucreti===null ? <span style={{color:'#22C55E'}}>Ücretsiz</span> : `₺${Number(siparis.kargo_ucreti).toFixed(2)}`}</span>
              </div>
              {Number(siparis.indirim) > 0 && (
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}>
                  <span style={{color:'#9CA3AF'}}>İndirim {siparis.kupon_kod&&<span style={{fontFamily:'monospace',fontWeight:700,color:'#E07090'}}>({siparis.kupon_kod})</span>}</span>
                  <span style={{fontWeight:600,color:'#22C55E'}}>-₺{Number(siparis.indirim).toFixed(2)}</span>
                </div>
              )}
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:'12px',borderTop:'2px solid #F0ECF5'}}>
                <span style={{fontWeight:700,color:'#1C1B2E',fontSize:'15px'}}>TOPLAM</span>
                <span style={{fontSize:'20px',fontWeight:800,color:'#1C1B2E'}}>₺{Number(siparis.toplam).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Notlar */}
          {siparis.notlar && (
            <Card title="Sipariş Notu" icon={<FileText size={16}/>}>
              <div style={{background:'#FEF3C7',border:'1px solid #FDE68A',borderRadius:'10px',padding:'12px 14px',fontSize:'13px',color:'#92400E',lineHeight:'1.6'}}>
                {siparis.notlar}
              </div>
            </Card>
          )}

          {/* Kargo Takip */}
          <Card title="Kargo Takip" icon={<Package size={16}/>}>
            <div style={{display:'flex',gap:'8px'}}>
              <input
                value={kargoBilgisi}
                onChange={e => setKargoBilgisi(e.target.value)}
                placeholder="Kargo takip numarası..."
                style={{flex:1,background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}
              />
              <button onClick={kargoKaydet}
                style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'10px 18px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
                Kaydet
              </button>
            </div>
            {siparis.kargo_takip_no && (
              <p style={{fontSize:'11px',color:'#9CA3AF',marginTop:'8px'}}>Mevcut: <span style={{fontFamily:'monospace',color:'#3B9FCC'}}>{siparis.kargo_takip_no}</span></p>
            )}
          </Card>
        </div>

        {/* Sağ kolon */}
        <div>
          {/* Müşteri */}
          <Card title="Müşteri Bilgileri" icon={<User size={16}/>}>
            <InfoRow label="Ad Soyad" value={siparis.musteri_ad || `${siparis.teslimat_ad||''} ${siparis.teslimat_soyad||''}`.trim()} />
            <InfoRow label="E-posta" value={siparis.musteri_email} />
            <InfoRow label="Telefon" value={siparis.musteri_telefon || siparis.teslimat_telefon} />
            {siparis.musteri_id && <InfoRow label="Üye ID" value={siparis.musteri_id} mono />}
          </Card>

          {/* Teslimat Adresi */}
          <Card title="Teslimat Adresi" icon={<MapPin size={16}/>}>
            {siparis.bolge_adi && (
              <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:'10px',padding:'10px 14px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'16px'}}>📍</span>
                <div>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#3B9FCC',display:'block'}}>{siparis.bolge_adi}</span>
                  <span style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>{siparis.teslimat_ilce||'—'}</span>
                  {siparis.teslimat_sehir && <span style={{fontSize:'12px',color:'#6B7280',marginLeft:'6px'}}>{siparis.teslimat_sehir}</span>}
                </div>
              </div>
            )}
            <InfoRow label="Adres" value={siparis.teslimat_adres || siparis.adres?.adres} />
            <InfoRow label="İlçe" value={siparis.teslimat_ilce} />
            <InfoRow label="Şehir" value={siparis.teslimat_sehir} />
            <InfoRow label="Posta Kodu" value={siparis.teslimat_posta || siparis.adres?.posta} />
          </Card>

          {/* Ödeme */}
          <Card title="Ödeme Bilgileri" icon={<CreditCard size={16}/>}>
            <InfoRow label="Yöntem" value={
              siparis.odeme_yontemi === 'kapida' ? '🚪 Kapıda Ödeme' :
              siparis.odeme_yontemi === 'havale' ? '🏦 Havale/EFT' : '💳 Kredi Kartı'
            }/>
            <InfoRow label="Durum" value={
              siparis.odeme_durumu || (siparis.odeme_yontemi==='kapida' ? 'Kapıda Ödenecek' : 'Bekliyor')
            }/>
            {siparis.kupon_kod && <InfoRow label="Kupon" value={siparis.kupon_kod} mono />}
            {Number(siparis.indirim) > 0 && <InfoRow label="İndirim" value={`-₺${Number(siparis.indirim).toFixed(2)}`} />}
          </Card>

          {/* Sipariş Meta */}
          <Card title="Sipariş Bilgileri" icon={<Tag size={16}/>}>
            <InfoRow label="Sipariş No" value={`#${siparis.siparis_no}`} mono />
            <InfoRow label="Oluşturulma" value={new Date(siparis.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})} />
            {siparis.updated_at && siparis.updated_at !== siparis.created_at && (
              <InfoRow label="Güncelleme" value={new Date(siparis.updated_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})} />
            )}
            <InfoRow label="Toplam Ürün" value={siparis.site_siparis_kalemleri?.length || 0} />
          </Card>
        </div>
      </div>
    </div>
  )
}
