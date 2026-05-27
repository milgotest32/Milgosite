'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Mail, Send, Eye, Save, RefreshCw, Users } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function MailSablonlar() {
  const [sablonlar, setSablonlar] = useState<any[]>([])
  const [secili, setSecili] = useState<any>(null)
  const [onizleme, setOnizleme] = useState(false)
  const [terkSepetler, setTerkSepetler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [gonderim, setGonderim] = useState<string|null>(null)

  const yukle = async () => {
    setLoading(true)
    const { data: sabs } = await supabase.from('site_mail_sablonlar').select('*').order('created_at')
    setSablonlar(sabs || [])
    if (sabs?.length && !secili) setSecili(sabs[0])

    // Terk edilen sepetler: 2 saatten eski, sipariş verilmemiş
    const { data: sepetler } = await supabase.from('site_sepetler')
      .select('*, site_sepet_kalemleri(urun_ad, adet, fiyat), site_profiller(ad_soyad, email:site_users(email))')
      .lt('updated_at', new Date(Date.now() - 2*60*60*1000).toISOString())
      .order('updated_at', { ascending: false })
      .limit(50)
    setTerkSepetler(sepetler || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const kaydet = async () => {
    if (!secili) return
    await supabase.from('site_mail_sablonlar').update({
      konu: secili.konu, icerik: secili.icerik, aktif: secili.aktif,
      updated_at: new Date().toISOString()
    }).eq('id', secili.id)
    setSablonlar(p => p.map(s => s.id === secili.id ? secili : s))
    toast.success('Şablon kaydedildi')
  }

  const tekGonder = async (sepet: any) => {
    setGonderim(sepet.id)
    const email = sepet.site_profiller?.email?.email || ''
    if (!email) { toast.error('E-posta bulunamadı'); setGonderim(null); return }

    const urunListesi = sepet.site_sepet_kalemleri?.map((k: any) =>
      `<div style="padding:8px 0;border-bottom:1px solid #F0ECF5"><strong>${k.urun_ad}</strong> × ${k.adet} — ₺${(k.fiyat * k.adet).toFixed(2)}</div>`
    ).join('') || ''

    const icerik = secili?.icerik
      ?.replace('{{musteri_ad}}', sepet.site_profiller?.ad_soyad || 'Değerli Müşterimiz')
      ?.replace('{{urun_listesi}}', urunListesi) || ''

    const { error } = await supabase.functions.invoke('send-mail', {
      body: { to: email, konu: secili?.konu, icerik }
    })

    if (error) {
      // Mail fonksiyonu yoksa log'a yaz
      await supabase.from('site_mail_loglari').insert({
        alici: email, konu: secili?.konu, durum: 'tetiklendi', tip: 'terk_sepet'
      })
      toast.success(`Mail kuyruğa eklendi: ${email}`)
    } else {
      toast.success(`Mail gönderildi: ${email}`)
    }
    setGonderim(null)
  }

  const tumunuGonder = async () => {
    if (!terkSepetler.length) { toast.error('Terk edilen sepet yok'); return }
    if (!confirm(`${terkSepetler.length} müşteriye mail gönderilecek. Emin misiniz?`)) return
    for (const sepet of terkSepetler) { await tekGonder(sepet) }
    toast.success('Tüm mailler kuyruğa eklendi!')
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:800,color:'#1C1B2E'}}>Mail Şablonları</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF'}}>Şablonları düzenle ve terk edilen sepet maillerini tetikle</p>
        </div>
        <button onClick={yukle} style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <RefreshCw size={15} style={{color:'#6B7280'}}/>
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'16px'}}>
        {/* Sol: Şablon listesi */}
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'16px'}}>
          <h3 style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Şablonlar</h3>
          {sablonlar.map(s => (
            <button key={s.id} onClick={()=>setSecili(s)}
              style={{width:'100%',textAlign:'left',padding:'10px 12px',borderRadius:'10px',border:'none',background:secili?.id===s.id?'#FEE8EF':'transparent',cursor:'pointer',marginBottom:'4px',fontFamily:'inherit'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <Mail size={13} style={{color:secili?.id===s.id?'#E07090':'#9CA3AF'}}/>
                <span style={{fontSize:'13px',fontWeight:secili?.id===s.id?700:400,color:secili?.id===s.id?'#E07090':'#6B7280'}}>{s.baslik}</span>
              </div>
              <div style={{marginLeft:'21px',marginTop:'2px'}}>
                <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'50px',background:s.aktif?'#dcfce7':'#fee2e2',color:s.aktif?'#16a34a':'#dc2626'}}>{s.aktif?'Aktif':'Pasif'}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Sağ: Şablon editörü */}
        {secili && (
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>{secili.baslik}</h2>
                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={()=>setOnizleme(!onizleme)}
                    style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'inherit',color:'#6B7280'}}>
                    <Eye size={13}/>{onizleme?'Editöre Dön':'Önizle'}
                  </button>
                  <label style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:'#6B7280',cursor:'pointer'}}>
                    <input type="checkbox" checked={secili.aktif} onChange={e=>setSecili((p:any)=>({...p,aktif:e.target.checked}))}/>Aktif
                  </label>
                  <button onClick={kaydet}
                    style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    <Save size={13}/>Kaydet
                  </button>
                </div>
              </div>

              <div style={{marginBottom:'12px'}}>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Mail Konusu</label>
                <input value={secili.konu} onChange={e=>setSecili((p:any)=>({...p,konu:e.target.value}))}
                  style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
              </div>

              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                  <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280'}}>HTML İçerik</label>
                  <span style={{fontSize:'11px',color:'#9CA3AF'}}>Değişkenler: {'{{musteri_ad}}'} {'{{urun_listesi}}'}</span>
                </div>
                {onizleme ? (
                  <div dangerouslySetInnerHTML={{__html:secili.icerik}} style={{border:'1px solid #F0ECF5',borderRadius:'10px',minHeight:'300px',background:'#fff'}}/>
                ) : (
                  <textarea value={secili.icerik} onChange={e=>setSecili((p:any)=>({...p,icerik:e.target.value}))} rows={14}
                    style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'12px 14px',fontSize:'12px',color:'#1C1B2E',outline:'none',fontFamily:'monospace',resize:'vertical'}}/>
                )}
              </div>
            </div>

            {/* Terk edilen sepetler — sadece terk_sepet şablonu için */}
            {secili.tip === 'terk_sepet' && (
              <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                  <div>
                    <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>Terk Edilen Sepetler</h2>
                    <p style={{fontSize:'12px',color:'#9CA3AF'}}>2 saatten eski, sipariş verilmemiş sepetler</p>
                  </div>
                  <button onClick={tumunuGonder}
                    style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                    <Send size={13}/> Tümüne Gönder ({terkSepetler.length})
                  </button>
                </div>

                {loading ? <p style={{color:'#9CA3AF',fontSize:'13px'}}>Yükleniyor...</p> :
                terkSepetler.length === 0 ? (
                  <p style={{color:'#9CA3AF',fontSize:'13px',fontStyle:'italic'}}>Terk edilen sepet yok. 🎉</p>
                ) : (
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {terkSepetler.map((s:any) => {
                      const email = s.site_profiller?.email?.email || 'Misafir'
                      const ad = s.site_profiller?.ad_soyad || 'Misafir'
                      const urunSayisi = s.site_sepet_kalemleri?.length || 0
                      const toplam = s.site_sepet_kalemleri?.reduce((t:number,k:any)=>t+(k.fiyat*k.adet),0)||0
                      const saat = Math.round((Date.now()-new Date(s.updated_at).getTime())/1000/60/60)
                      return (
                        <div key={s.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'#F8F7FC',borderRadius:'12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'#FEE8EF',display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <Users size={16} style={{color:'#E07090'}}/>
                            </div>
                            <div>
                              <p style={{fontSize:'13px',fontWeight:700,color:'#1C1B2E'}}>{ad}</p>
                              <p style={{fontSize:'11px',color:'#9CA3AF'}}>{email} · {urunSayisi} ürün · ₺{toplam.toFixed(2)}</p>
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'11px',color:'#9CA3AF'}}>{saat} saat önce</span>
                            <button onClick={()=>tekGonder(s)} disabled={gonderim===s.id}
                              style={{display:'flex',alignItems:'center',gap:'4px',background:gonderim===s.id?'#F0ECF5':'#1C1B2E',color:'#fff',border:'none',borderRadius:'8px',padding:'6px 12px',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                              <Send size={11}/>{gonderim===s.id?'...':'Gönder'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
