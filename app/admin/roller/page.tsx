'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Shield, UserCheck, UserX, Search } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function RollerPage() {
  const [kullanicilar, setKullanicilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [arama, setArama] = useState('')
  const [degistirilen, setDegistirilen] = useState<string | null>(null)

  const yukle = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setKullanicilar(d.data || []); setLoading(false) })
  }
  useEffect(() => { yukle() }, [])

  const rolDegistir = async (id: string, yeniRol: string, email: string) => {
    if (!confirm(`${email} kullanıcısının rolü "${yeniRol}" yapılsın mı?`)) return
    setDegistirilen(id)
    const { error } = await supabase.from('site_users').update({ role: yeniRol }).eq('id', id)
    if (error) { toast.error('Rol değiştirilemedi'); }
    else { toast.success(`Rol "${yeniRol}" olarak güncellendi`); yukle() }
    setDegistirilen(null)
  }

  const filtrelendi = kullanicilar.filter(k =>
    !arama || k.email?.toLowerCase().includes(arama.toLowerCase()) ||
    `${k.ad} ${k.soyad}`.toLowerCase().includes(arama.toLowerCase())
  )

  const ROL_RENK: Record<string, any> = {
    admin: { bg: '#FEF0F4', tx: '#E07090', label: 'Admin' },
    musteri: { bg: '#F0FDF4', tx: '#22C55E', label: 'Müşteri' },
    customer: { bg: '#F0FDF4', tx: '#22C55E', label: 'Müşteri' },
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} style={{ color: '#E07090' }} /> Rol & Yetkiler
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Kullanıcı rollerini yönetin</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Kullanıcı ara..."
            style={{ background: '#fff', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '8px 16px 8px 34px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '220px' }} />
        </div>
      </div>

      {/* Rol açıklamaları */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { rol: 'admin', icon: <Shield size={16} />, baslik: 'Admin', aciklama: 'Tüm panele erişim, ürün/sipariş/kullanıcı yönetimi', renk: '#E07090', bg: '#FEF0F4' },
          { rol: 'musteri', icon: <UserCheck size={16} />, baslik: 'Müşteri', aciklama: 'Sadece kendi hesabını ve siparişlerini görebilir', renk: '#22C55E', bg: '#F0FDF4' },
        ].map(r => (
          <div key={r.rol} style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${r.bg}`, padding: '16px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.renk, flexShrink: 0 }}>
              {r.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '2px' }}>{r.baslik}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{r.aciklama}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
              {['Kullanıcı', 'Mevcut Rol', 'İşlem'].map(h =>
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</td></tr>
            ) : filtrelendi.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Kullanıcı bulunamadı</td></tr>
            ) : filtrelendi.map((k, i) => {
              const rol = ROL_RENK[k.role] || { bg: '#F8F7FC', tx: '#9CA3AF', label: k.role }
              const yukleniyor = degistirilen === k.id
              return (
                <tr key={k.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {k.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E' }}>{k.ad ? `${k.ad} ${k.soyad || ''}` : '—'}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{k.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px', background: rol.bg, color: rol.tx }}>
                      {rol.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {k.role !== 'admin' && (
                        <button onClick={() => rolDegistir(k.id, 'admin', k.email)} disabled={yukleniyor}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: '#FEF0F4', color: '#E07090', fontFamily: 'inherit', opacity: yukleniyor ? 0.5 : 1 }}>
                          <Shield size={11} /> Admin Yap
                        </button>
                      )}
                      {k.role === 'admin' && (
                        <button onClick={() => rolDegistir(k.id, 'musteri', k.email)} disabled={yukleniyor}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: '#F0FDF4', color: '#22C55E', fontFamily: 'inherit', opacity: yukleniyor ? 0.5 : 1 }}>
                          <UserX size={11} /> Müşteri Yap
                        </button>
                      )}
                    </div>
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
