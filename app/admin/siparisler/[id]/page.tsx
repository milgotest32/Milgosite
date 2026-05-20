'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function SiparisDetay() {
  const { id } = useParams()
  const [siparis, setSiparis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_siparisler').select('*,site_siparis_kalemleri(*)').eq('id', id as string).single()
      .then(({ data }) => { setSiparis(data); setLoading(false) })
  }, [id])

  const durumGuncelle = async (durum: string) => {
    await supabase.from('site_siparisler').update({ durum, updated_at: new Date().toISOString() }).eq('id', id as string)
    setSiparis((s: any) => s ? { ...s, durum } : s)
    toast.success('Durum güncellendi')
  }

  if (loading) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</div>
  if (!siparis) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Sipariş bulunamadı</div>

  const DURUM_RENK: Record<string,string> = { bekliyor:'#F59E0B', onaylandi:'#3B9FCC', kargoda:'#8B5CF6', teslim:'#22C55E', iptal:'#EF4444' }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/admin/siparisler" style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',color:'#6B7280'}}><ArrowLeft size={16}/></Link>
          <div>
            <h1 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',fontFamily:'monospace'}}>#{siparis.siparis_no}</h1>
            <p style={{fontSize:'12px',color:'#9CA3AF'}}>{new Date(siparis.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
          </div>
        </div>
        <select value={siparis.durum} onChange={e=>durumGuncelle(e.target.value)} style={{background:'#fff',border:'1px solid #F0ECF5',borderRadius:'12px',padding:'10px 16px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',cursor:'pointer',fontWeight:600}}>
          {['bekliyor','onaylandi','kuryede','teslim','iptal'].map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'16px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Sipariş Kalemleri</h2>
            {siparis.site_siparis_kalemleri?.map((k: any) => (
              <div key={k.id} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #F0ECF5'}}>
                <div>
                  <div style={{fontSize:'14px',fontWeight:600,color:'#1C1B2E'}}>{k.urun_ad}</div>
                  <div style={{fontSize:'12px',color:'#9CA3AF'}}>x{k.adet} · ₺{k.birim_fiyat?.toFixed(2)} / adet</div>
                </div>
                <div style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>₺{k.toplam?.toFixed(2)}</div>
              </div>
            ))}
            <div style={{paddingTop:'12px',display:'flex',flexDirection:'column',gap:'6px'}}>
              {[['Ara Toplam',`₺${siparis.ara_toplam?.toFixed(2)}`],['Kurye',siparis.kargo_ucreti===0?'Ücretsiz':`₺${siparis.kargo_ucreti?.toFixed(2)}`],[...(siparis.indirim>0?[['İndirim',`-₺${siparis.indirim?.toFixed(2)}`]]:[])]].flat(1).map((item,i)=>Array.isArray(item)&&(
                <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'13px'}}><span style={{color:'#9CA3AF'}}>{item[0]}</span><span style={{fontWeight:600}}>{item[1]}</span></div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:'8px',borderTop:'1px solid #F0ECF5'}}>
                <span style={{fontWeight:700,color:'#1C1B2E'}}>Toplam</span>
                <span style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',fontFamily:'"Playfair Display",serif'}}>₺{siparis.toplam?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Müşteri Bilgileri</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'13px',color:'#6B7280'}}>
              <p style={{fontWeight:600,color:'#1C1B2E'}}>{siparis.musteri_ad}</p>
              <p>{siparis.musteri_email}</p>
              <p>{siparis.musteri_telefon}</p>
            </div>
          </div>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Teslimat Adresi</h3>
            {/* Bölge vurgusu */}
            <div style={{background:'#EBF7FC',border:'1px solid #BAE6FD',borderRadius:'10px',padding:'10px 14px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'16px'}}>📍</span>
              <div>
                {siparis.bolge_adi && <span style={{fontSize:'12px',fontWeight:700,color:'#3B9FCC',display:'block'}}>{siparis.bolge_adi}</span>}
                <span style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>{siparis.teslimat_ilce || '—'}</span>
                <span style={{fontSize:'12px',color:'#6B7280',marginLeft:'6px'}}>{siparis.teslimat_sehir || ''}</span>
              </div>
            </div>
            <div style={{fontSize:'13px',color:'#6B7280',lineHeight:'1.6'}}>
              <p>{siparis.teslimat_adres || siparis.adres?.adres}</p>
              <p style={{fontSize:'11px',color:'#9CA3AF'}}>Posta: {siparis.teslimat_posta || siparis.adres?.posta || '—'}</p>
            </div>
          </div>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Ödeme</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',fontSize:'13px',color:'#6B7280'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Yöntem</span>
                <span style={{fontWeight:700,color:'#1C1B2E'}}>
                  {siparis.odeme_yontemi === 'kapida' ? '🚪 Kapıda Ödeme' : siparis.odeme_yontemi === 'havale' ? '🏦 Havale/EFT' : '💳 Kredi/Banka Kartı'}
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Durum</span>
                <span style={{fontWeight:700,color:siparis.odeme_durumu==='odendi'?'#22C55E':siparis.odeme_yontemi==='kapida'?'#F59E0B':'#F59E0B'}}>
                  {siparis.odeme_durumu || (siparis.odeme_yontemi==='kapida' ? 'Kapıda Ödenecek' : 'Bekliyor')}
                </span>
              </div>
              {siparis.kupon_kod && <div style={{display:'flex',justifyContent:'space-between'}}><span>Kupon</span><span style={{fontWeight:600,fontFamily:'monospace'}}>{siparis.kupon_kod}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
