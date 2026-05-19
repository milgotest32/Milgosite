'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const slugify = (t: string) => t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

const bos = { baslik:'', slug:'', ozet:'', icerik:'', gorsel_url:'', durum:'taslak' }

export default function BlogPage() {
  const [yazilar, setYazilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>({ ...bos })
  const [mode, setMode] = useState<'liste'|'yeni'|'duzenle'>('liste')
  const [secili, setSecili] = useState<any>(null)

  const yukle = () => {
    supabase.from('site_blog_yazilar').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setYazilar(data || []); setLoading(false) })
  }
  useEffect(() => { yukle() }, [])

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const kaydet = async () => {
    if (!form.baslik) { toast.error('Başlık zorunlu'); return }
    const veri = { ...form, slug: form.slug || slugify(form.baslik) }
    if (mode === 'yeni') {
      await supabase.from('site_blog_yazilar').insert(veri)
      toast.success('Yazı oluşturuldu')
    } else {
      await supabase.from('site_blog_yazilar').update({ ...veri, updated_at: new Date().toISOString() }).eq('id', secili.id)
      toast.success('Yazı güncellendi')
    }
    setMode('liste'); setForm({ ...bos }); setSecili(null); yukle()
  }

  const sil = async (id: string, baslik: string) => {
    if (!confirm(`"${baslik}" silinsin mi?`)) return
    await supabase.from('site_blog_yazilar').delete().eq('id', id)
    toast.success('Silindi'); yukle()
  }

  const duzenle = (yazi: any) => { setSecili(yazi); setForm(yazi); setMode('duzenle') }

  const inpStyle: React.CSSProperties = { width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  const lbl = (t: string) => <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{t}</label>

  const DURUM_RENK: Record<string, any> = {
    yayinda: { bg: '#F0FDF4', tx: '#22C55E' },
    taslak: { bg: '#F8F7FC', tx: '#9CA3AF' },
  }

  if (mode !== 'liste') return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>{mode === 'yeni' ? 'Yeni Blog Yazısı' : 'Yazıyı Düzenle'}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setMode('liste'); setForm({ ...bos }) }} style={{ padding: '10px 20px', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '50px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>İptal</button>
          <button onClick={kaydet} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Kaydet</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>{lbl('Başlık *')}<input value={form.baslik} onChange={e => { set('baslik', e.target.value); if (!form.slug || mode === 'yeni') set('slug', slugify(e.target.value)) }} style={inpStyle} placeholder="Yazı başlığı" /></div>
          <div>{lbl('Slug')}<input value={form.slug} onChange={e => set('slug', e.target.value)} style={inpStyle} placeholder="otomatik-olusturulur" /></div>
          <div>{lbl('Özet')}<textarea value={form.ozet} onChange={e => set('ozet', e.target.value)} rows={3} style={{ ...inpStyle, resize: 'vertical' }} placeholder="Kısa özet..." /></div>
          <div>{lbl('İçerik')}<textarea value={form.icerik} onChange={e => set('icerik', e.target.value)} rows={12} style={{ ...inpStyle, resize: 'vertical' }} placeholder="Yazı içeriği..." /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '12px' }}>Yayın Durumu</h3>
            <select value={form.durum} onChange={e => set('durum', e.target.value)} style={{ ...inpStyle }}>
              <option value="taslak">Taslak</option>
              <option value="yayinda">Yayında</option>
            </select>
          </div>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '12px' }}>Kapak Görseli</h3>
            {lbl('Görsel URL')}
            <input value={form.gorsel_url} onChange={e => set('gorsel_url', e.target.value)} style={inpStyle} placeholder="https://..." />
            {form.gorsel_url && <img src={form.gorsel_url} alt="" style={{ width: '100%', borderRadius: '8px', marginTop: '10px', objectFit: 'cover', aspectRatio: '16/9' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Blog Yazıları</h1>
        <button onClick={() => setMode('yeni')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} />Yeni Yazı
        </button>
      </div>
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
            {['Başlık', 'Tarih', 'Durum', 'İşlem'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</td></tr>
              : yazilar.length === 0 ? <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Henüz blog yazısı yok</td></tr>
              : yazilar.map((y, i) => {
                const d = DURUM_RENK[y.durum] || DURUM_RENK.taslak
                return (
                  <tr key={y.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1C1B2E', margin: '0 0 2px' }}>{y.baslik}</p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, fontFamily: 'monospace' }}>{y.slug}</p>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{new Date(y.created_at).toLocaleDateString('tr-TR')}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: d.bg, color: d.tx }}>{y.durum}</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a href={`/blog/${y.slug}`} target="_blank" rel="noreferrer" style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F0EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', textDecoration: 'none' }}><Eye size={13} /></a>
                        <button onClick={() => duzenle(y)} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#EBF7FC', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B9FCC' }}><Edit size={13} /></button>
                        <button onClick={() => sil(y.id, y.baslik)} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><Trash2 size={13} /></button>
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
