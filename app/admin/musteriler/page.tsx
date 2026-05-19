'use client'
import { useEffect, useState } from 'react'
import { Search, User } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function MusterilerPage() {
  const [musteriler, setMusteriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [arama, setArama] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setMusteriler(d.data || []); setLoading(false) })
  }, [])

  const filtrelendi = musteriler.filter(m =>
    !arama || m.email?.includes(arama) || `${m.ad} ${m.soyad}`.toLowerCase().includes(arama.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Müşteriler</h1>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ara..."
            style={{ background: '#fff', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '8px 16px 8px 34px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '220px' }} />
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
            {['Müşteri', 'E-posta', 'Rol', 'Kayıt Tarihi'].map(h =>
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>{h}</th>
            )}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</td></tr>
              : filtrelendi.length === 0 ? <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Müşteri bulunamadı</td></tr>
              : filtrelendi.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {m.email?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E' }}>{m.ad ? `${m.ad} ${m.soyad || ''}` : '—'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{m.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: m.role === 'admin' ? '#FEF0F4' : '#F0FDF4', color: m.role === 'admin' ? '#E07090' : '#22C55E' }}>{m.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{m.created_at ? new Date(m.created_at).toLocaleDateString('tr-TR') : '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
