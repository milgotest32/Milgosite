'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MapPin, TrendingUp, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

interface BolgeIstatistik {
  bolge_adi: string
  siparis_sayisi: number
  toplam_gelir: number
  ortalama_siparis: number
  en_cok_urun: string
}

export default function BolgeRaporuPage() {
  const [veriler, setVeriler] = useState<BolgeIstatistik[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [aralik, setAralik] = useState<'7' | '30' | '90' | 'tum'>('30')

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true)
      let q = supabase
        .from('site_siparisler')
        .select('bolge_adi, toplam, site_siparis_kalemleri(urun_ad, adet)')
        .not('bolge_adi', 'is', null)
        .neq('durum', 'iptal')

      if (aralik !== 'tum') {
        const gun = parseInt(aralik)
        const baslangic = new Date()
        baslangic.setDate(baslangic.getDate() - gun)
        q = q.gte('created_at', baslangic.toISOString())
      }

      const { data } = await q

      if (!data) { setYukleniyor(false); return }

      // Bölge bazında grupla
      const gruplar: Record<string, { sayisi: number; gelir: number; urunler: Record<string, number> }> = {}
      data.forEach((s: any) => {
        const bolge = s.bolge_adi || 'Belirsiz'
        if (!gruplar[bolge]) gruplar[bolge] = { sayisi: 0, gelir: 0, urunler: {} }
        gruplar[bolge].sayisi++
        gruplar[bolge].gelir += Number(s.toplam || 0)
        ;(s.site_siparis_kalemleri || []).forEach((k: any) => {
          const ad = k.urun_ad || 'Bilinmiyor'
          gruplar[bolge].urunler[ad] = (gruplar[bolge].urunler[ad] || 0) + (k.adet || 1)
        })
      })

      const istatistikler: BolgeIstatistik[] = Object.entries(gruplar)
        .map(([bolge, v]) => ({
          bolge_adi: bolge,
          siparis_sayisi: v.sayisi,
          toplam_gelir: v.gelir,
          ortalama_siparis: v.sayisi > 0 ? v.gelir / v.sayisi : 0,
          en_cok_urun: Object.entries(v.urunler).sort((a, b) => b[1] - a[1])[0]?.[0] || '-',
        }))
        .sort((a, b) => b.toplam_gelir - a.toplam_gelir)

      setVeriler(istatistikler)
      setYukleniyor(false)
    }
    yukle()
  }, [aralik])

  const toplamGelir = veriler.reduce((t, v) => t + v.toplam_gelir, 0)
  const toplamSiparis = veriler.reduce((t, v) => t + v.siparis_sayisi, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link href="/admin/raporlar" style={{ color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
          <ArrowLeft size={14} /> Raporlar
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>Bölge Bazlı Sipariş Raporu</h1>
      </div>

      {/* Filtre */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {([['7', 'Son 7 Gün'], ['30', 'Son 30 Gün'], ['90', 'Son 90 Gün'], ['tum', 'Tümü']] as const).map(([v, label]) => (
          <button key={v} onClick={() => setAralik(v)}
            style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: aralik === v ? '#1C1B2E' : '#F0ECF5', color: aralik === v ? '#fff' : '#6B7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Özet kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: <MapPin size={18} />, label: 'Aktif Bölge', value: veriler.length, renk: '#3B9FCC' },
          { icon: <ShoppingBag size={18} />, label: 'Toplam Sipariş', value: toplamSiparis, renk: '#E8567A' },
          { icon: <TrendingUp size={18} />, label: 'Toplam Gelir', value: `₺${toplamGelir.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`, renk: '#22c55e' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${k.renk}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.renk, marginBottom: '10px' }}>{k.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1C1B2E', marginBottom: '2px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tablo */}
      {yukleniyor ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>Yükleniyor...</div>
      ) : veriler.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '60px', textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF' }}>Bu dönemde bölge verisi yok.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FDFBF9' }}>
                {['Bölge', 'Sipariş', 'Gelir', 'Ort. Sipariş', 'En Çok Satan', 'Pay'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '1px solid #F0ECF5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {veriler.map((v, i) => {
                const pay = toplamGelir > 0 ? Math.round((v.toplam_gelir / toplamGelir) * 100) : 0
                return (
                  <tr key={v.bolge_adi} style={{ borderBottom: i < veriler.length - 1 ? '1px solid #F0ECF5' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} style={{ color: '#E8567A', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A0A12' }}>{v.bolge_adi}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1A0A12', fontWeight: 600 }}>{v.siparis_sayisi}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1A0A12', fontWeight: 700 }}>₺{v.toplam_gelir.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280' }}>₺{Math.round(v.ortalama_siparis).toLocaleString('tr-TR')}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6B7280', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.en_cok_urun}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#F0ECF5', borderRadius: '3px', minWidth: '60px' }}>
                          <div style={{ height: '100%', background: '#E8567A', borderRadius: '3px', width: `${pay}%` }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#E8567A', minWidth: '30px' }}>%{pay}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
