'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { RefreshCw, ArrowLeft, Phone } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function AboneliğimPage() {
  const [abonelik, setAbonelik] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const email = data.session.user.email
      const { data: ab } = await supabase
        .from('site_abonelikler')
        .select('*')
        .eq('musteri_email', email)
        .eq('aktif', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      setAbonelik(ab)
      setYukleniyor(false)
    })
  }, [router])

  const PLAN_RENK: Record<string, string> = {
    baslangic: '#3B9FCC',
    aile: '#E8567A',
    premium: '#8B5CF6',
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
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: PLAN_RENK[abonelik.plan] || '#E8567A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={22} color="#fff" />
                </div>
                <div>
                  <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1A0A12', margin: '0 0 2px' }}>Aboneliğim</h1>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '50px', background: `${PLAN_RENK[abonelik.plan]}20`, color: PLAN_RENK[abonelik.plan] || '#E8567A', textTransform: 'uppercase' }}>
                    {abonelik.plan} plan
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['Haftalık Miktar', `${abonelik.haftalik_litre}L çiğ süt`],
                  ['Aylık Fiyat', `₺${abonelik.fiyat}`],
                  ['Teslimat Adresi', abonelik.teslimat_adres],
                  ['Başlangıç', abonelik.created_at ? new Date(abonelik.created_at).toLocaleDateString('tr-TR') : '-'],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: '#F0EEF8', borderRadius: '12px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A0A12' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F0ECF5', padding: '20px', boxShadow: '0 2px 12px rgba(26,10,18,0.06)' }}>
              <p style={{ fontSize: '13px', color: '#7A6070', margin: '0 0 12px' }}>Aboneliğiniz hakkında değişiklik veya sorularınız için bizi arayın:</p>
              <a href="tel:02123521076" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F0EEF8', color: '#1A0A12', padding: '10px 16px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                <Phone size={15} style={{ color: '#E8567A' }} /> (0212) 352 10 76
              </a>
            </div>
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
