'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { RefreshCw, ArrowLeft, Pause, Play, Minus, Plus, AlertCircle, Check } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const PLANLAR = [
  { slug: 'baslangic', ad: 'Başlangıç', litre: 2, fiyat: 520 },
  { slug: 'aile',      ad: 'Aile',      litre: 4, fiyat: 980 },
  { slug: 'premium',   ad: 'Premium',   litre: 6, fiyat: 1380 },
]

const PLAN_RENK: Record<string, string> = {
  baslangic: '#3B9FCC', aile: '#E8567A', premium: '#8B5CF6',
}

export default function AboneliğimPage() {
  const [abonelik, setAbonelik] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [islem, setIslem] = useState(false)
  const [planDegistir, setPlanDegistir] = useState(false)
  const [seciliPlan, setSeciliPlan] = useState('')
  const [iptalOnay, setIptalOnay] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const user = data.session.user
      const { data: ab } = await supabase
        .from('site_abonelikler')
        .select('*')
        .or(`musteri_id.eq.${user.id},musteri_email.eq.${user.email}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      setAbonelik(ab)
      if (ab) setSeciliPlan(ab.plan)
      setYukleniyor(false)
    })
  }, [router])

  const durumGuncelle = async (yeniAktif: boolean) => {
    setIslem(true)
    const { error } = await supabase
      .from('site_abonelikler')
      .update({ aktif: yeniAktif, durum: yeniAktif ? 'aktif' : 'durduruldu' })
      .eq('id', abonelik.id)
    if (error) { toast.error('İşlem başarısız'); setIslem(false); return }
    setAbonelik((a: any) => ({ ...a, aktif: yeniAktif, durum: yeniAktif ? 'aktif' : 'durduruldu' }))
    toast.success(yeniAktif ? 'Aboneliğiniz devam ediyor!' : 'Aboneliğiniz durduruldu.')
    setIslem(false)
  }

  const planGuncelle = async () => {
    if (seciliPlan === abonelik.plan) { setPlanDegistir(false); return }
    setIslem(true)
    const plan = PLANLAR.find(p => p.slug === seciliPlan)!
    const { error } = await supabase
      .from('site_abonelikler')
      .update({ plan: seciliPlan, haftalik_litre: plan.litre, fiyat: plan.fiyat })
      .eq('id', abonelik.id)
    if (error) { toast.error('Plan güncellenemedi'); setIslem(false); return }
    setAbonelik((a: any) => ({ ...a, plan: seciliPlan, haftalik_litre: plan.litre, fiyat: plan.fiyat }))
    toast.success('Planınız güncellendi!')
    setPlanDegistir(false)
    setIslem(false)
  }

  const iptalEt = async () => {
    setIslem(true)
    const { error } = await supabase
      .from('site_abonelikler')
      .update({ aktif: false, durum: 'iptal' })
      .eq('id', abonelik.id)
    if (error) { toast.error('İptal işlemi başarısız'); setIslem(false); return }
    setAbonelik((a: any) => ({ ...a, aktif: false, durum: 'iptal' }))
    toast.success('Aboneliğiniz iptal edildi.')
    setIptalOnay(false)
    setIslem(false)
  }

  if (yukleniyor) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #F4A7B9', borderTopColor: '#E8567A', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8', padding: 'clamp(24px,4vw,48px) 16px', fontFamily: 'Nunito, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link href="/hesabim" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={14} /> Hesabıma Dön
        </Link>

        {abonelik ? (
          <>
            {/* Durum kartı */}
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: PLAN_RENK[abonelik.plan] || '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={22} color="#fff" />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', margin: '0 0 2px' }}>Aboneliğim</h1>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '50px', background: `${PLAN_RENK[abonelik.plan] || '#E8567A'}20`, color: PLAN_RENK[abonelik.plan] || '#E8567A', textTransform: 'uppercase' }}>
                      {abonelik.plan} plan
                    </span>
                  </div>
                </div>
                {/* Durum rozeti */}
                <span style={{
                  fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '50px',
                  background: abonelik.aktif ? '#F0FDF4' : '#FEF2F2',
                  color: abonelik.aktif ? '#16a34a' : '#dc2626'
                }}>
                  {abonelik.aktif ? '● Aktif' : abonelik.durum === 'iptal' ? '✕ İptal Edildi' : '⏸ Durduruldu'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  ['Haftalık Miktar', `${abonelik.haftalik_litre}L çiğ süt`],
                  ['Aylık Fiyat', `₺${abonelik.fiyat}`],
                  ['Teslimat Adresi', abonelik.teslimat_adres],
                  ['Sonraki Teslimat', abonelik.sonraki_teslimat ? new Date(abonelik.sonraki_teslimat).toLocaleDateString('tr-TR') : 'Her Cuma'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: '#F0EEF8', borderRadius: '12px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A0A12' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Aksiyon butonları - iptal edilmişse gösterme */}
              {abonelik.durum !== 'iptal' && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {abonelik.aktif ? (
                    <button onClick={() => durumGuncelle(false)} disabled={islem}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                      <Pause size={14} /> Duraklat
                    </button>
                  ) : (
                    <button onClick={() => durumGuncelle(true)} disabled={islem}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', color: '#16a34a', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                      <Play size={14} /> Devam Ettir
                    </button>
                  )}
                  <button onClick={() => setPlanDegistir(true)} disabled={islem}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EBF5FC', color: '#3B9FCC', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <RefreshCw size={14} /> Plan Değiştir
                  </button>
                  <button onClick={() => setIptalOnay(true)} disabled={islem}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#dc2626', border: 'none', borderRadius: '12px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <AlertCircle size={14} /> İptal Et
                  </button>
                </div>
              )}
            </div>

            {/* Plan değiştirme */}
            {planDegistir && (
              <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A0A12', marginBottom: '16px' }}>Plan Seçin</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {PLANLAR.map(p => (
                    <button key={p.slug} onClick={() => setSeciliPlan(p.slug)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '14px', border: `2px solid ${seciliPlan === p.slug ? PLAN_RENK[p.slug] : '#F0ECF5'}`, background: seciliPlan === p.slug ? `${PLAN_RENK[p.slug]}10` : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A0A12' }}>{p.ad}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{p.litre}L · Haftada Bir</div>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: PLAN_RENK[p.slug] }}>₺{p.fiyat}<span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 400 }}>/ay</span></div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={planGuncelle} disabled={islem}
                    style={{ flex: 1, background: '#1A0A12', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Check size={14} /> Planı Güncelle
                  </button>
                  <button onClick={() => { setPlanDegistir(false); setSeciliPlan(abonelik.plan) }}
                    style={{ padding: '12px 18px', background: '#F0EEF8', color: '#7A6070', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            {/* İptal onayı */}
            {iptalOnay && (
              <div style={{ background: '#FEF2F2', borderRadius: '20px', border: '1px solid #FECACA', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#991b1b', margin: '0 0 4px' }}>Aboneliği iptal etmek istediğinize emin misiniz?</p>
                    <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>Bu işlem geri alınamaz. Tekrar abone olmak için yeniden kayıt yapmanız gerekir.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={iptalEt} disabled={islem}
                    style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    Evet, İptal Et
                  </button>
                  <button onClick={() => setIptalOnay(false)}
                    style={{ background: '#fff', color: '#7A6070', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Vazgeç
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '48px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
            <RefreshCw size={48} style={{ color: '#F0ECF5', margin: '0 auto 16px', display: 'block' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', marginBottom: '8px' }}>Aktif aboneliğiniz yok</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '20px' }}>Haftalık taze çiğ süt teslimatı için abone olun.</p>
            <Link href="/abonelik" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', color: '#fff', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Abonelik Planlarına Bak
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
