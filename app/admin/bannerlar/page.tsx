'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const bos = { baslik: '', alt_baslik: '', buton_yazi: '', buton_link: '/', gorsel_url: '', renk_sol: '#FEE8EF', renk_sag: '#EBF5FC', sira: 0 }

export default function BannerlarPage() {
  const [bannerlar, setBannerlar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...bos, goster: false })

  const yukle = () => { supabase.from('site_bannerlar').select('*').order('sira').then(({ data }) => { setBannerlar(data || []); setLoading(false) }) }
  useEffect(() => { yukle() }, [])

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const ekle = async () => {
    if (!form.baslik) { toast.error('Başlık zorunlu'); return }
    const { goster, ...veri } = form
    await supabase.from('site_bannerlar').insert({ ...veri, aktif: true })
    toast.success('Banner eklendi')
    setForm({ ...bos, goster: false })
    yukle()
  }

  const toggleAktif = async (id: string, aktif: boolean) => {
    await supabase.from('site_bannerlar').update({ aktif }).eq('id', id)
    setBannerlar(prev => prev.map(b => b.id === id ? { ...b, aktif } : b))
  }

  const sil = async (id: string) => {
    if (!confirm('Bu banneri silmek istediğinizden emin misiniz?')) return
    await supabase.from('site_bannerlar').delete().eq('id', id)
    toast.success('Silindi'); yukle()
  }

  const inpStyle: React.CSSProperties = { width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const lbl = (t: string) => <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{t}</label>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>Bannerlar</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Ana sayfa hero ve kampanya bannerleri</p>
        </div>
        <button onClick={() => set('goster', true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} />Banner Ekle
        </button>
      </div>

      {form.goster && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '2px solid #F4A7B9', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>Yeni Banner</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>{lbl('Ana Başlık *')}<input value={form.baslik} onChange={e => set('baslik', e.target.value)} style={inpStyle} placeholder="Çiftlikten Sofranıza" /></div>
            <div>{lbl('Alt Başlık')}<input value={form.alt_baslik} onChange={e => set('alt_baslik', e.target.value)} style={inpStyle} placeholder="Taze ve doğal ürünler" /></div>
            <div>{lbl('Buton Yazısı')}<input value={form.buton_yazi} onChange={e => set('buton_yazi', e.target.value)} style={inpStyle} placeholder="Alışverişe Başla" /></div>
            <div>{lbl('Buton Linki')}<input value={form.buton_link} onChange={e => set('buton_link', e.target.value)} style={inpStyle} placeholder="/urunler" /></div>
            <div>{lbl('Görsel URL')}<input value={form.gorsel_url} onChange={e => set('gorsel_url', e.target.value)} style={inpStyle} placeholder="https://..." /></div>
            <div>{lbl('Sıra')}<input type="number" value={form.sira} onChange={e => set('sira', parseInt(e.target.value))} style={inpStyle} /></div>
            <div>
              {lbl('Sol Renk')}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={form.renk_sol} onChange={e => set('renk_sol', e.target.value)} style={{ width: '48px', height: '40px', borderRadius: '8px', border: '1px solid #F0ECF5', padding: '4px', cursor: 'pointer' }} />
                <input value={form.renk_sol} onChange={e => set('renk_sol', e.target.value)} style={{ ...inpStyle, flex: 1 }} />
              </div>
            </div>
            <div>
              {lbl('Sağ Renk')}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={form.renk_sag} onChange={e => set('renk_sag', e.target.value)} style={{ width: '48px', height: '40px', borderRadius: '8px', border: '1px solid #F0ECF5', padding: '4px', cursor: 'pointer' }} />
                <input value={form.renk_sag} onChange={e => set('renk_sag', e.target.value)} style={{ ...inpStyle, flex: 1 }} />
              </div>
            </div>
          </div>
          {/* Önizleme */}
          {(form.baslik || form.gorsel_url) && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', background: `linear-gradient(135deg, ${form.renk_sol}, ${form.renk_sag})`, padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '24px', color: '#1A0A12', margin: '0 0 6px', fontFamily: 'Nunito, sans-serif' }}>{form.baslik || 'Başlık'}</h3>
                <p style={{ fontSize: '14px', color: '#7A6070', margin: '0 0 16px' }}>{form.alt_baslik}</p>
                {form.buton_yazi && <span style={{ background: '#1A0A12', color: '#fff', padding: '10px 20px', borderRadius: '50px', fontSize: '13px', fontWeight: 700 }}>{form.buton_yazi}</span>}
              </div>
              {form.gorsel_url && <img src={form.gorsel_url} alt="" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '16px' }} />}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => set('goster', false)} style={{ padding: '10px 20px', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '50px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>İptal</button>
            <button onClick={ekle} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Kaydet</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p>
          : bannerlar.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Henüz banner eklenmemiş</p>
            </div>
          ) : bannerlar.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${b.aktif ? '#F4A7B9' : '#F0ECF5'}`, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${b.renk_sol || '#FEE8EF'}, ${b.renk_sag || '#EBF5FC'})`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#1A0A12', margin: '0 0 4px', fontFamily: 'Nunito, sans-serif' }}>{b.baslik}</h3>
                  <p style={{ fontSize: '12px', color: '#7A6070', margin: 0 }}>{b.alt_baslik}</p>
                </div>
                {b.gorsel_url && <img src={b.gorsel_url} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />}
              </div>
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Sıra: {b.sira} · {b.buton_link}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => toggleAktif(b.id, !b.aktif)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '50px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: b.aktif ? '#F0FDF4' : '#FEF2F2', color: b.aktif ? '#22C55E' : '#EF4444' }}>
                    {b.aktif ? <Eye size={11} /> : <EyeOff size={11} />} {b.aktif ? 'Aktif' : 'Pasif'}
                  </button>
                  <button onClick={() => sil(b.id)} style={{ width: '30px', height: '30px', background: '#FEF2F2', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
