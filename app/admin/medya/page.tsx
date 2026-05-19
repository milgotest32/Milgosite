'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Link } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function MedyaPage() {
  const [dosyalar, setDosyalar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [kopyalanan, setKopyalanan] = useState('')
  const [urlForm, setUrlForm] = useState('')
  const [sekme, setSekme] = useState<'galeri'|'url'>('galeri')
  const fileRef = useRef<HTMLInputElement>(null)

  const yukle = async () => {
    const { data } = await supabase.from('site_medya').select('*').order('created_at', { ascending: false })
    setDosyalar(data || [])
    setLoading(false)
  }
  useEffect(() => { yukle() }, [])

  const dosyaYukle = async (files: FileList | null) => {
    if (!files?.length) return
    setYukleniyor(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const yol = `medya/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: upload, error } = await supabase.storage.from('site-medya').upload(yol, file, { upsert: false })
      if (error) { toast.error(`${file.name}: ${error.message}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('site-medya').getPublicUrl(yol)
      await supabase.from('site_medya').insert({ url: publicUrl, dosya_adi: file.name, boyut: file.size, tip: file.type, yol })
    }
    toast.success('Yükleme tamamlandı')
    setYukleniyor(false)
    yukle()
  }

  const urlEkle = async () => {
    if (!urlForm.trim()) return
    await supabase.from('site_medya').insert({ url: urlForm, dosya_adi: urlForm.split('/').pop() || 'görsel', tip: 'url' })
    toast.success('URL eklendi')
    setUrlForm('')
    yukle()
  }

  const sil = async (id: string, yol?: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return
    if (yol) await supabase.storage.from('site-medya').remove([yol])
    await supabase.from('site_medya').delete().eq('id', id)
    toast.success('Silindi')
    yukle()
  }

  const kopyala = (url: string) => {
    navigator.clipboard.writeText(url)
    setKopyalanan(url)
    toast.success('URL kopyalandı!')
    setTimeout(() => setKopyalanan(''), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>Medya & Logo</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Görsel yükleyin ve URL'leri kopyalayın</p>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={yukleniyor}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Upload size={15} />{yukleniyor ? 'Yükleniyor...' : 'Görsel Yükle'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*,.svg" multiple style={{ display: 'none' }} onChange={e => dosyaYukle(e.target.files)} />
      </div>

      {/* Sürükle bırak alanı */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); dosyaYukle(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
        style={{ border: '2px dashed #E8E4F0', borderRadius: '16px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px', background: '#FAFAF9', transition: 'all .2s' }}>
        <Upload size={32} style={{ color: '#D1D5DB', margin: '0 auto 12px', display: 'block' }} />
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1C1B2E', marginBottom: '4px' }}>Görsel sürükleyin veya tıklayın</p>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>PNG, JPG, SVG, WebP desteklenir</p>
      </div>

      {/* URL ile ekle */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link size={14} style={{ color: '#E07090' }} /> URL ile Görsel Ekle
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={urlForm} onChange={e => setUrlForm(e.target.value)}
            placeholder="https://example.com/gorsel.jpg"
            style={{ flex: 1, background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={urlEkle} style={{ background: '#1C1B2E', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Ekle</button>
        </div>
      </div>

      {/* Galeri */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>Medya Galerisi ({dosyalar.length})</h3>
        {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p>
          : dosyalar.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <ImageIcon size={40} style={{ color: '#F0ECF5', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Henüz görsel eklenmemiş</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' }}>
              {dosyalar.map(d => (
                <div key={d.id} style={{ borderRadius: '12px', border: '1px solid #F0ECF5', overflow: 'hidden', background: '#F8F7FC', position: 'relative', group: 'true' } as any}>
                  <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#F0EEF8' }}>
                    <img src={d.url} alt={d.dosya_adi} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: '11px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 0 6px' }}>{d.dosya_adi}</p>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => kopyala(d.url)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', background: kopyalanan === d.url ? '#F0FDF4' : '#EBF7FC', border: 'none', borderRadius: '6px', padding: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer', color: kopyalanan === d.url ? '#22C55E' : '#3B9FCC' }}>
                        {kopyalanan === d.url ? <Check size={11} /> : <Copy size={11} />}
                        {kopyalanan === d.url ? 'Kopyalandı' : 'URL Kopyala'}
                      </button>
                      <button onClick={() => sil(d.id, d.yol)}
                        style={{ width: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#EF4444' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}
