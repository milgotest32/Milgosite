'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package, ChevronRight } from 'lucide-react'
export const dynamic = 'force-dynamic'
 
export default function SiparislerimPage() {
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const router = useRouter()
 
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const user = data.session.user
      const { data: sip } = await supabase
        .from('site_siparisler')
        .select('*, site_siparis_kalemleri(*)')
        .or(`musteri_id.eq.${user.id},musteri_email.eq.${user.email}`)
        .order('created_at', { ascending: false })
      setSiparisler(sip || [])
      setYukleniyor(false)
    })
  }, [router])
 
  const AKIM = [
    { key: 'bekliyor',  ad: 'Sipariş Alındı', emoji: '🕐' },
    { key: 'onaylandi', ad: 'Onaylandı',       emoji: '✅' },
    { key: 'kuryede',   ad: 'Kurye Yolda',     emoji: '🛵' },
    { key: 'teslim',    ad: 'Teslim Edildi',   emoji: '🎉' },
  ]

  const DURUM: Record<string, string> = {
    bekliyor:       'Sipariş Alındı',
    onaylandi:      'Onaylandı',
    kargoda:        'Kurye Yolda',
    kuryede:        'Kurye Yolda',
    teslim:         'Teslim Edildi',
    teslim_edildi:  'Teslim Edildi',
    iptal:          'İptal Edildi',
    iade:           'İade Edildi',
  }
  const DURUM_RENK: Record<string, { bg: string; color: string }> = {
    bekliyor:       { bg: '#FEF3C7', color: '#D97706' },
    onaylandi:      { bg: '#EBF7FC', color: '#3B9FCC' },
    kargoda:        { bg: '#FFF7ED', color: '#EA7C2B' },
    kuryede:        { bg: '#FFF7ED', color: '#EA7C2B' },
    teslim:         { bg: '#F0FDF4', color: '#16A34A' },
    teslim_edildi:  { bg: '#F0FDF4', color: '#16A34A' },
    iptal:          { bg: '#FEF2F2', color: '#EF4444' },
    iade:           { bg: '#FEF2F2', color: '#EF4444' },
  }

  const durumIndex = (d: string) => {
    const normalized = d === 'kargoda' ? 'kuryede' : (d === 'teslim_edildi' ? 'teslim' : d)
    return ['bekliyor','onaylandi','kuryede','teslim'].indexOf(normalized)
  }
 
  if (yukleniyor) return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #E8567A', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
 
  return (
    <div style={{ minHeight: '100vh', background: '#F8F5FF', padding: '40px 16px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link href="/hesabim" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF', textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Hesabıma Dön
        </Link>
 
        <h1 style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 32, fontWeight: 600, color: '#1A0A12', marginBottom: 24 }}>
          Siparişlerim
        </h1>
 
        {siparisler.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '64px 24px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <Package size={48} color="#D1C4D8" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A0A12', marginBottom: 8 }}>Henüz sipariş yok</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 24 }}>İlk siparişinizi vermek ister misiniz?</p>
            <Link href="/urunler" style={{ background: '#E8567A', color: '#fff', padding: '12px 32px', borderRadius: 50, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {siparisler.map(s => {
              const durum = s.durum || 'bekliyor'
              const renk = DURUM_RENK[durum] || { bg: '#F8F7FC', color: '#9CA3AF' }
              const kalemSayisi = Array.isArray(s.site_siparis_kalemleri) ? s.site_siparis_kalemleri.length : 0
              const odemeIkon = s.odeme_yontemi === 'kapida' ? '🚪 Kapıda' : s.odeme_yontemi === 'havale' ? '🏦 Havale' : '💳 Kart'
 
              return (
                <Link key={s.id} href={`/hesabim/siparisler/${s.id}`} style={{textDecoration:'none'}}>
                  <div style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.04)', cursor:'pointer', transition:'box-shadow 0.2s' }}>
                    {/* Üst satır */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Sipariş No</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1A0A12', fontFamily: 'monospace' }}>#{s.siparis_no}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{ background: renk.bg, color: renk.color, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 50 }}>
                          {DURUM[durum] || durum}
                        </span>
                        <ChevronRight size={16} color="#9CA3AF"/>
                      </div>
                    </div>
 
                    {/* Tarih */}
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 14 }}>
                      {new Date(s.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>

                    {/* Durum timeline */}
                    {durum !== 'iptal' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
                        {AKIM.map((a, i) => {
                          const aktifIdx = durumIndex(durum)
                          const tamamlandi = i <= aktifIdx
                          const aktif = i === aktifIdx
                          return (
                            <div key={a.key} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                                <div style={{
                                  width: 28, height: 28, borderRadius: '50%',
                                  background: tamamlandi ? '#E8567A' : '#F0ECF5',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 13,
                                  boxShadow: aktif ? '0 0 0 3px rgba(232,86,122,0.2)' : 'none',
                                  flexShrink: 0,
                                }}>
                                  {tamamlandi ? <span style={{ fontSize: 11 }}>{a.emoji}</span> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1C4D8', display: 'block' }} />}
                                </div>
                                <span style={{ fontSize: 9, color: tamamlandi ? '#E8567A' : '#9CA3AF', fontWeight: aktif ? 700 : 400, whiteSpace: 'nowrap' }}>{a.ad}</span>
                              </div>
                              {i < 3 && <div style={{ flex: 1, height: 2, background: i < aktifIdx ? '#E8567A' : '#F0ECF5', margin: '0 4px', marginBottom: 14 }} />}
                            </div>
                          )
                        })}
                      </div>
                    )}
                    {durum === 'iptal' && (
                      <div style={{ background: '#FEF2F2', borderRadius: 10, padding: '8px 12px', marginBottom: 14, fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
                        ❌ Bu sipariş iptal edildi
                      </div>
                    )}

                    {/* Ürün önizleme */}
                    {s.site_siparis_kalemleri?.slice(0,3).map((k: any) => (
                      <div key={k.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        {k.urun_gorsel ? (
                          <img src={k.urun_gorsel} alt={k.urun_ad} style={{width:32,height:32,objectFit:'cover',borderRadius:8,border:'1px solid #F0ECF5',flexShrink:0}}/>
                        ) : (
                          <div style={{width:32,height:32,background:'#F8F7FC',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            <Package size={14} color="#D1C4D8"/>
                          </div>
                        )}
                        <span style={{fontSize:12,color:'#6B7280'}}>{k.urun_ad} <span style={{color:'#9CA3AF'}}>×{k.adet}</span></span>
                      </div>
                    ))}
                    {kalemSayisi > 3 && <div style={{fontSize:11,color:'#9CA3AF',marginBottom:8}}>+{kalemSayisi-3} ürün daha</div>}
 
                    {/* Alt satır */}
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#6B7280' }}>
                          {kalemSayisi > 0 ? `${kalemSayisi} ürün` : 'Sipariş'}
                        </span>
                        <span style={{ fontSize: 11, color: '#6B7280', background: '#F8F7FC', padding: '3px 9px', borderRadius: 8 }}>
                          {odemeIkon}
                        </span>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#1A0A12' }}>
                        ₺{s.toplam?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
