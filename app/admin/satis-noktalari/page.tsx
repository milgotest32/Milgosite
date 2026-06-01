'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, GripVertical, Eye, EyeOff, Save } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function SatisNoktalariPage() {
  const [liste, setListe] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [yeni, setYeni] = useState({ ad: '', logo_url: '', link: '' })
  const [ekliyor, setEkliyor] = useState(false)

  const yukle = async () => {
    const { data } = await supabase.from('site_satis_noktalari').select('*').order('sira')
    setListe(data || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const ekle = async () => {
    if (!yeni.ad || !yeni.logo_url) { toast.error('Ad ve logo URL zorunlu'); return }
    setEkliyor(true)
    const { error } = await supabase.from('site_satis_noktalari').insert({
      ad: yeni.ad, logo_url: yeni.logo_url, link: yeni.link || null,
      sira: liste.length
    })
    if (error) toast.error('Eklenemedi')
    else { toast.success('Eklendi'); setYeni({ ad: '', logo_url: '', link: '' }); yukle() }
    setEkliyor(false)
  }

  const sil = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('site_satis_noktalari').delete().eq('id', id)
    toast.success('Silindi')
    yukle()
  }

  const toggleAktif = async (id: string, aktif: boolean) => {
    await supabase.from('site_satis_noktalari').update({ aktif: !aktif }).eq('id', id)
    setListe(prev => prev.map(i => i.id === id ? { ...i, aktif: !aktif } : i))
  }

  const siraGuncelle = async (id: string, yeniSira: number) => {
    await supabase.from('site_satis_noktalari').update({ sira: yeniSira }).eq('id', id)
    yukle()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>🏪 Satış Noktaları</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Ana sayfada görünecek satış noktası logolarını yönetin</p>
        </div>
      </div>

      {/* Yeni Ekle */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>➕ Yeni Ekle</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          {[
            { label: 'Marka Adı *', key: 'ad', placeholder: 'örn. Fresh Market' },
            { label: 'Logo URL *', key: 'logo_url', placeholder: 'https://...' },
            { label: 'Link (opsiyonel)', key: 'link', placeholder: 'https://...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{label}</label>
              <input
                value={(yeni as any)[key]}
                onChange={e => setYeni(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>
          ))}
        </div>
        {yeni.logo_url && (
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={yeni.logo_url} alt="önizleme" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #F0ECF5', background: '#F8F7FC' }} onError={e => (e.currentTarget.style.display = 'none')} />
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Logo önizlemesi</span>
          </div>
        )}
        <button onClick={ekle} disabled={ekliyor}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={14} /> {ekliyor ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </div>

      {/* Liste */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>Mevcut Logolar ({liste.length})</h2>
        </div>
        {loading ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</p>
        ) : liste.length === 0 ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Henüz satış noktası eklenmemiş</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {liste.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #F8F7FC', opacity: item.aktif ? 1 : 0.5 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => i > 0 && siraGuncelle(item.id, item.sira - 1)} disabled={i === 0}
                    style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: '#9CA3AF', fontSize: '10px', padding: '2px' }}>▲</button>
                  <button onClick={() => i < liste.length - 1 && siraGuncelle(item.id, item.sira + 1)} disabled={i === liste.length - 1}
                    style={{ background: 'none', border: 'none', cursor: i < liste.length - 1 ? 'pointer' : 'default', color: '#9CA3AF', fontSize: '10px', padding: '2px' }}>▼</button>
                </div>
                <img src={item.logo_url} alt={item.ad}
                  style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #F0ECF5', background: '#F8F7FC', flexShrink: 0 }}
                  onError={e => (e.currentTarget.style.background = '#fee2e2')} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>{item.ad}</div>
                  {item.link && <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.link}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => toggleAktif(item.id, item.aktif)} title={item.aktif ? 'Gizle' : 'Göster'}
                    style={{ background: item.aktif ? '#F0FDF4' : '#F8F7FC', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: item.aktif ? '#22C55E' : '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                    {item.aktif ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => sil(item.id)} title="Sil"
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
