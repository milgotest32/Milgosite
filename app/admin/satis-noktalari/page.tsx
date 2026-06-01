'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function SatisNoktalariPage() {
  const [liste, setListe] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [yeni, setYeni] = useState({ ad: '', logo_url: '', link: '' })
  const [ekliyor, setEkliyor] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const yukle = async () => {
    const { data } = await supabase.from('site_satis_noktalari').select('*').order('sira')
    setListe(data || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const logoYukle = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Sadece resim dosyası yüklenebilir'); return }
    if (file.size > 2 * 1024 * 1024) { toast.error('Dosya 2MB dan kucuk olmali'); return }
    setYukleniyor(true)
    const ext = file.name.split('.').pop()
    const path = `satis-noktalari/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('site-medya').upload(path, file, { upsert: true })
    if (error) { toast.error('Yükleme başarısız'); setYukleniyor(false); return }
    const { data } = supabase.storage.from('site-medya').getPublicUrl(path)
    setYeni(p => ({ ...p, logo_url: data.publicUrl }))
    toast.success('Logo yüklendi')
    setYukleniyor(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) logoYukle(file)
  }

  const ekle = async () => {
    if (!yeni.ad || !yeni.logo_url) { toast.error('Ad ve logo zorunlu'); return }
    setEkliyor(true)
    const { error } = await supabase.from('site_satis_noktalari').insert({
      ad: yeni.ad, logo_url: yeni.logo_url, link: yeni.link || null, sira: liste.length
    })
    if (error) toast.error('Eklenemedi')
    else { toast.success('Eklendi'); setYeni({ ad: '', logo_url: '', link: '' }); yukle() }
    setEkliyor(false)
  }

  const sil = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('site_satis_noktalari').delete().eq('id', id)
    toast.success('Silindi'); yukle()
  }

  const toggleAktif = async (id: string, aktif: boolean) => {
    await supabase.from('site_satis_noktalari').update({ aktif: !aktif }).eq('id', id)
    setListe(prev => prev.map(i => i.id === id ? { ...i, aktif: !aktif } : i))
  }

  const siraGuncelle = async (id: string, yon: number, i: number) => {
    const hedef = liste[i + yon]
    if (!hedef) return
    await supabase.from('site_satis_noktalari').update({ sira: hedef.sira }).eq('id', id)
    await supabase.from('site_satis_noktalari').update({ sira: liste[i].sira }).eq('id', hedef.id)
    yukle()
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>🏪 Satış Noktaları</h1>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Ana sayfada görünecek satış noktası logolarını yönetin</p>
      </div>

      {/* Yeni Ekle */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>➕ Yeni Ekle</h2>

        {/* Sürükle bırak alanı */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#E8567A' : '#F0ECF5'}`,
            borderRadius: '14px',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? '#FEF0F4' : '#F8F7FC',
            transition: 'all 0.2s',
            marginBottom: '16px',
          }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && logoYukle(e.target.files[0])} />
          {yukleniyor ? (
            <p style={{ color: '#E8567A', fontSize: '14px', fontWeight: 600 }}>Yükleniyor...</p>
          ) : yeni.logo_url ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src={yeni.logo_url} alt="logo" style={{ maxHeight: '80px', maxWidth: '160px', objectFit: 'contain', borderRadius: '10px' }} />
              <p style={{ fontSize: '12px', color: '#22C55E', fontWeight: 600 }}>✓ Logo yüklendi — değiştirmek için tekrar tıkla</p>
            </div>
          ) : (
            <div>
              <Upload size={28} style={{ color: '#C4B5CC', marginBottom: '8px' }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#7A6070', margin: 0 }}>Logo sürükle & bırak</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0' }}>veya tıkla · PNG, JPG, SVG · max 2MB</p>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          {[
            { label: 'Marka Adı *', key: 'ad', placeholder: 'örn. Fresh Market' },
            { label: 'Link (opsiyonel)', key: 'link', placeholder: 'https://...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{label}</label>
              <input
                value={(yeni as any)[key]}
                onChange={e => setYeni(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
              />
            </div>
          ))}
        </div>

        <button onClick={ekle} disabled={ekliyor || !yeni.logo_url || !yeni.ad}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: yeni.logo_url && yeni.ad ? 'linear-gradient(135deg,#E8567A,#3B9FCC)' : '#D1D5DB', color: '#fff', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: yeni.logo_url && yeni.ad ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
          <Plus size={14} /> {ekliyor ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </div>

      {/* Liste */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECF5' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button onClick={() => siraGuncelle(item.id, -1, i)} disabled={i === 0}
                    style={{ background: 'none', border: 'none', cursor: i > 0 ? 'pointer' : 'default', color: i > 0 ? '#9CA3AF' : '#E5E7EB', fontSize: '12px', padding: '2px 4px' }}>▲</button>
                  <button onClick={() => siraGuncelle(item.id, 1, i)} disabled={i === liste.length - 1}
                    style={{ background: 'none', border: 'none', cursor: i < liste.length - 1 ? 'pointer' : 'default', color: i < liste.length - 1 ? '#9CA3AF' : '#E5E7EB', fontSize: '12px', padding: '2px 4px' }}>▼</button>
                </div>
                <img src={item.logo_url} alt={item.ad}
                  style={{ width: '72px', height: '56px', objectFit: 'contain', borderRadius: '10px', border: '1px solid #F0ECF5', background: '#F8F7FC', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>{item.ad}</div>
                  {item.link && <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.link}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => toggleAktif(item.id, item.aktif)}
                    style={{ background: item.aktif ? '#F0FDF4' : '#F8F7FC', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: item.aktif ? '#22C55E' : '#9CA3AF', display: 'flex' }}>
                    {item.aktif ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => sil(item.id)}
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#EF4444', display: 'flex' }}>
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
