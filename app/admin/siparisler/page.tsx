'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Eye } from 'lucide-react'
export const dynamic = 'force-dynamic'

const DURUM_RENK: Record<string, any> = {
  bekliyor: { bg: '#FEF3C7', tx: '#F59E0B' },
  onaylandi: { bg: '#EBF7FC', tx: '#3B9FCC' },
  kargoda: { bg: '#F5F3FF', tx: '#8B5CF6' },
  teslim: { bg: '#F0FDF4', tx: '#22C55E' },
  iptal: { bg: '#FEF2F2', tx: '#EF4444' },
}

export default function SiparislerPage() {
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [arama, setArama] = useState('')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => { setSiparisler(d.data || []); setLoading(false) })
  }, [])

  const filtrelendi = siparisler.filter(s =>
    !arama || s.siparis_no?.includes(arama) || s.musteri_ad?.toLowerCase().includes(arama.toLowerCase()) || s.musteri_email?.includes(arama)
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Siparişler</h1>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ara..."
            style={{ background: '#fff', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '8px 16px 8px 34px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '220px' }} />
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
            {['Sipariş No', 'Müşteri', 'Bölge', 'Tutar', 'Ödeme', 'Durum', 'Tarih', ''].map(h =>
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>{h}</th>
            )}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</td></tr>
              : filtrelendi.length === 0 ? <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Sipariş bulunamadı</td></tr>
              : filtrelendi.map((s, i) => {
                const d = DURUM_RENK[s.durum] || { bg: '#F8F7FC', tx: '#9CA3AF' }
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>{s.siparis_no}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', margin: '0 0 2px' }}>{s.musteri_ad || '—'}</p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{s.musteri_email}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>{s.teslimat_ilce || s.adres?.ilce || '—'}</span>
                      {(s.teslimat_sehir || s.adres?.sehir) && <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'block' }}>{s.teslimat_sehir || s.adres?.sehir}</span>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>₺{s.toplam?.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280', background: '#F8F7FC', padding: '2px 8px', borderRadius: '6px', border: '1px solid #F0ECF5' }}>
                        {s.odeme_yontemi === 'kapida' ? '🚪 Kapıda' : s.odeme_yontemi === 'havale' ? '🏦 Havale' : '💳 Kart'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: d.bg, color: d.tx }}>{s.durum || 'bekliyor'}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/admin/siparisler/${s.id}`} style={{ width: '30px', height: '30px', background: '#F0EEF8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#6B7280' }}><Eye size={13} /></Link>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
