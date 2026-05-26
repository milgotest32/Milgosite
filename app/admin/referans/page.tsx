'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Gift, Users, TrendingUp, Copy, RefreshCw, Power } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function ReferansSistemi() {
  const [ayarlar, setAyarlar] = useState<any>({ aktif:'0', gonderen:'50', gelen:'50', min:'200' })
  const [referanslar, setReferanslar] = useState<any[]>([])
  const [stats, setStats] = useState({ toplam:0, aktif:0, kullanimlar:0, kazanilan:0 })
  const [loading, setLoading] = useState(true)
  const [kayit, setKayit] = useState(false)

  const yukle = async () => {
    setLoading(true)
    const { data: ays } = await supabase.from('site_ayarlar').select('anahtar,deger').eq('grup','referans')
    const ayObj: any = {}
    ays?.forEach((a:any) => {
      if (a.anahtar === 'referans_aktif') ayObj.aktif = a.deger
      if (a.anahtar === 'referans_gonderen_indirim') ayObj.gonderen = a.deger
      if (a.anahtar === 'referans_gelen_indirim') ayObj.gelen = a.deger
      if (a.anahtar === 'referans_min_siparis') ayObj.min = a.deger
    })
    setAyarlar((p:any) => ({...p, ...ayObj}))

    const { data: refs } = await supabase.from('site_referanslar')
      .select('*, site_referans_kullanimlari(count)').order('created_at', { ascending: false })
    setReferanslar(refs || [])

    const { data: kulls } = await supabase.from('site_referans_kullanimlari').select('indirim_tutari')
    setStats({
      toplam: refs?.length || 0,
      aktif: refs?.filter((r:any) => r.aktif).length || 0,
      kullanimlar: kulls?.length || 0,
      kazanilan: kulls?.reduce((t:number, k:any) => t + (k.indirim_tutari || 0), 0) || 0,
    })
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const kaydet = async () => {
    setKayit(true)
    const updates = [
      { anahtar:'referans_aktif', deger: ayarlar.aktif, grup:'referans' },
      { anahtar:'referans_gonderen_indirim', deger: ayarlar.gonderen, grup:'referans' },
      { anahtar:'referans_gelen_indirim', deger: ayarlar.gelen, grup:'referans' },
      { anahtar:'referans_min_siparis', deger: ayarlar.min, grup:'referans' },
    ]
    for (const u of updates) {
      await supabase.from('site_ayarlar').update({ deger: u.deger }).eq('anahtar', u.anahtar).eq('grup', u.grup)
    }
    toast.success('Ayarlar kaydedildi')
    setKayit(false)
  }

  const inp = (label: string, key: string, tip = 'number') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}</label>
      <input type={tip} value={ayarlar[key]||''} onChange={e=>setAyarlar((p:any)=>({...p,[key]:e.target.value}))}
        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
    </div>
  )

  const card = (label: string, val: any, icon: any, renk: string) => (
    <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
        <span style={{fontSize:'12px',color:'#6B7280',fontWeight:600}}>{label}</span>
        <div style={{width:'32px',height:'32px',borderRadius:'10px',background:`${renk}15`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {icon}
        </div>
      </div>
      <div style={{fontSize:'24px',fontWeight:800,color:'#1C1B2E'}}>{val}</div>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:800,color:'#1C1B2E'}}>Referans Sistemi</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Arkadaşını getir, ikisi de kazansın</p>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={yukle} style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
            <RefreshCw size={15} style={{color:'#6B7280'}}/>
          </button>
          <button onClick={kaydet} disabled={kayit} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            {kayit ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Sistem açma/kapama */}
      <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',marginBottom:'16px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'40px',height:'40px',borderRadius:'12px',background: ayarlar.aktif==='1' ? '#dcfce7' : '#fee2e2',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Power size={18} style={{color: ayarlar.aktif==='1' ? '#22c55e' : '#ef4444'}}/>
            </div>
            <div>
              <p style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>Referans Sistemi</p>
              <p style={{fontSize:'12px',color:'#9CA3AF'}}>{ayarlar.aktif==='1' ? '✅ Aktif — müşteriler referans kodu alabilir' : '❌ Kapalı — kimse referans kodu alamaz'}</p>
            </div>
          </div>
          <label style={{position:'relative',display:'inline-block',width:'48px',height:'26px',cursor:'pointer'}}>
            <input type="checkbox" checked={ayarlar.aktif==='1'} onChange={e=>setAyarlar((p:any)=>({...p,aktif:e.target.checked?'1':'0'}))} style={{opacity:0,width:0,height:0}}/>
            <span style={{position:'absolute',inset:0,background:ayarlar.aktif==='1'?'#22c55e':'#d1d5db',borderRadius:'13px',transition:'.3s'}}>
              <span style={{position:'absolute',left:ayarlar.aktif==='1'?'24px':'2px',top:'2px',width:'22px',height:'22px',background:'#fff',borderRadius:'50%',transition:'.3s'}}/>
            </span>
          </label>
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
        {card('Toplam Referans', stats.toplam, <Gift size={15} style={{color:'#E07090'}}/>, '#E07090')}
        {card('Aktif Referans', stats.aktif, <Users size={15} style={{color:'#3B9FCC'}}/>, '#3B9FCC')}
        {card('Toplam Kullanım', stats.kullanimlar, <TrendingUp size={15} style={{color:'#22c55e'}}/>, '#22c55e')}
        {card('Kazandırılan ₺', `₺${stats.kazanilan}`, <Gift size={15} style={{color:'#f59e0b'}}/>, '#f59e0b')}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
        {/* Ayarlar */}
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
          <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>İndirim Ayarları</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {inp('Gönderen İndirimi (₺)', 'gonderen')}
            {inp('Gelen Üye İndirimi (₺)', 'gelen')}
            {inp('Min. Sipariş Tutarı (₺)', 'min')}
          </div>
          <div style={{marginTop:'16px',padding:'12px',background:'#EBF7FC',borderRadius:'10px',fontSize:'12px',color:'#3B9FCC',lineHeight:'1.6'}}>
            <strong>Nasıl çalışır?</strong><br/>
            Müşteri referans kodunu paylaşır → Yeni üye kaydolurken kodu girer → İkisi de indirim kazanır. İndirim ilk siparişte otomatik uygulanır.
          </div>
        </div>

        {/* Referans listesi */}
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
          <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Referans Kodları</h2>
          {loading ? <p style={{color:'#9CA3AF',fontSize:'13px'}}>Yükleniyor...</p> : referanslar.length === 0 ? (
            <p style={{color:'#9CA3AF',fontSize:'13px',fontStyle:'italic'}}>Henüz referans kodu oluşturulmamış.</p>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'300px',overflowY:'auto'}}>
              {referanslar.map((r:any) => (
                <div key={r.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:'#F8F7FC',borderRadius:'10px'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <code style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',background:'#fff',padding:'2px 8px',borderRadius:'6px',border:'1px solid #F0ECF5'}}>{r.kod}</code>
                      <button onClick={()=>{navigator.clipboard.writeText(r.kod);toast.success('Kopyalandı')}} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}>
                        <Copy size={12}/>
                      </button>
                    </div>
                    <p style={{fontSize:'11px',color:'#9CA3AF',marginTop:'2px'}}>{r.kullanim_sayisi} kullanım · ₺{r.kazanilan_indirim} kazandı</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'50px',background:r.aktif?'#dcfce7':'#fee2e2',color:r.aktif?'#16a34a':'#dc2626'}}>
                      {r.aktif ? 'Aktif' : 'Pasif'}
                    </span>
                    <button onClick={async()=>{
                      await supabase.from('site_referanslar').update({aktif:!r.aktif}).eq('id',r.id)
                      yukle()
                    }} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}>
                      <Power size={13}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
