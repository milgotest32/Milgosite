'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Search, Eye } from 'lucide-react'
export const dynamic = 'force-dynamic'

const AKIM = [
  { key: 'bekliyor',  ad: 'Sipariş Alındı', emoji: '🕐', bg: '#FEF3C7', tx: '#F59E0B' },
  { key: 'onaylandi', ad: 'Onaylandı',       emoji: '✅', bg: '#EBF7FC', tx: '#3B9FCC' },
  { key: 'kuryede',   ad: 'Kurye Yolda',     emoji: '🛵', bg: '#FFF7ED', tx: '#EA7C2B' },
  { key: 'teslim',    ad: 'Teslim Edildi',   emoji: '🎉', bg: '#F0FDF4', tx: '#22C55E' },
]
const IPTAL = { key: 'iptal', ad: 'İptal', emoji: '❌', bg: '#FEF2F2', tx: '#EF4444' }

const DURUM_RENK: Record<string, any> = {
  bekliyor:  { bg: '#FEF3C7', tx: '#F59E0B' },
  onaylandi: { bg: '#EBF7FC', tx: '#3B9FCC' },
  kuryede:   { bg: '#FFF7ED', tx: '#EA7C2B' },
  teslim:    { bg: '#F0FDF4', tx: '#22C55E' },
  iptal:     { bg: '#FEF2F2', tx: '#EF4444' },
}

const DURUM_AD: Record<string, string> = {
  bekliyor: 'Sipariş Alındı', onaylandi: 'Onaylandı',
  kuryede: 'Kurye Yolda', teslim: 'Teslim Edildi', iptal: 'İptal',
}

export default function SiparislerPage() {
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hata, setHata] = useState('')
  const [arama, setArama] = useState('')
  const [guncelleniyor, setGuncelleniyor] = useState<string | null>(null)

  const durumGuncelle = async (id: string, yeniDurum: string) => {
    setGuncelleniyor(id + yeniDurum)
    const { error } = await supabase.from('site_siparisler').update({ durum: yeniDurum }).eq('id', id)
    if (!error) setSiparisler(prev => prev.map(s => s.id === id ? { ...s, durum: yeniDurum } : s))
    setGuncelleniyor(null)
  }

  useEffect(() => {
    supabase
      .from('site_siparisler')
      .select('*, site_siparis_kalemleri(*)')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) {
          console.error('Sipariş yükleme hatası:', error)
          setHata(error.message)
        } else {
          setSiparisler(data || [])
        }
        setLoading(false)
      })
  }, [])

  const filtrelendi = siparisler.filter(s =>
    !arama ||
    s.siparis_no?.toLowerCase().includes(arama.toLowerCase()) ||
    s.musteri_ad?.toLowerCase().includes(arama.toLowerCase()) ||
    s.musteri_email?.toLowerCase().includes(arama.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Siparişler</h1>
          {!loading && <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{siparisler.length} sipariş</p>}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Sipariş no, müşteri..."
            style={{ background: '#fff', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '8px 16px 8px 34px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '240px' }} />
        </div>
      </div>

      {hata && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '16px', marginBottom: '16px', color: '#EF4444', fontSize: '13px' }}>
          ⚠️ Hata: {hata}<br/>
          <small style={{ color: '#9CA3AF' }}>Supabase RLS politikası siparişlere erişimi engelliyor olabilir. Supabase Dashboard &gt; Table Editor &gt; site_siparisler &gt; RLS politikalarını kontrol edin.</small>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
              {['Sipariş No', 'Müşteri', 'Bölge / İlçe', 'Tutar', 'Ödeme', 'Durum', 'Tarih', ''].map(h =>
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</td></tr>
            ) : filtrelendi.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>
                {siparisler.length === 0 ? 'Henüz sipariş yok' : 'Arama sonucu bulunamadı'}
              </td></tr>
            ) : filtrelendi.map((s, i) => {
              const d = DURUM_RENK[s.durum] || { bg: '#F8F7FC', tx: '#9CA3AF' }
              return (
                <tr key={s.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>{s.siparis_no}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', margin: '0 0 2px' }}>{s.musteri_ad || '—'}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{s.musteri_email}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {s.bolge_adi && <span style={{ fontSize: '11px', fontWeight: 700, color: '#3B9FCC', display: 'block' }}>{s.bolge_adi}</span>}
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{s.teslimat_ilce || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>₺{s.toplam?.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', color: '#6B7280', background: '#F8F7FC', padding: '2px 8px', borderRadius: '6px', border: '1px solid #F0ECF5' }}>
                      {s.odeme_yontemi === 'kapida' ? '🚪 Kapıda' : s.odeme_yontemi === 'havale' ? '🏦 Havale' : '💳 Kart'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: d.bg, color: d.tx }}>
                      {DURUM_AD[s.durum] || s.durum || 'Bekliyor'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '160px' }}>
                      {/* Akım butonları */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {AKIM.map(a => (
                          <button key={a.key} onClick={() => durumGuncelle(s.id, a.key)}
                            disabled={s.durum === a.key || guncelleniyor === s.id + a.key}
                            style={{
                              fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                              border: `1.5px solid ${a.bg}`,
                              background: s.durum === a.key ? a.bg : '#fff',
                              color: s.durum === a.key ? a.tx : '#9CA3AF',
                              cursor: s.durum === a.key ? 'default' : 'pointer',
                              opacity: guncelleniyor === s.id + a.key ? 0.6 : 1,
                              fontFamily: 'inherit',
                              whiteSpace: 'nowrap',
                            }}>
                            {a.emoji} {a.ad}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button onClick={() => durumGuncelle(s.id, 'iptal')}
                          disabled={s.durum === 'iptal'}
                          style={{
                            fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                            border: '1.5px solid #FEE2E2',
                            background: s.durum === 'iptal' ? '#FEF2F2' : '#fff',
                            color: s.durum === 'iptal' ? '#EF4444' : '#9CA3AF',
                            cursor: s.durum === 'iptal' ? 'default' : 'pointer',
                            fontFamily: 'inherit',
                          }}>
                          ❌ İptal
                        </button>
                        <Link href={`/admin/siparisler/${s.id}`}
                          style={{ width: '26px', height: '26px', background: '#F0EEF8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#6B7280', flexShrink: 0 }}>
                          <Eye size={12} />
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
