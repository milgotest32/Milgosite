'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, MapPin, Trash2, Upload, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

// KMZ → GeoJSON parser
async function parseKMZ(file: File): Promise<any> {
  const JSZip = (await import('jszip')).default
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)
  const kmlFile = Object.values(zip.files).find(f => f.name.endsWith('.kml'))
  if (!kmlFile) throw new Error('KMZ içinde KML dosyası bulunamadı')
  const kmlText = await kmlFile.async('text')
  const parser = new DOMParser()
  const kmlDoc = parser.parseFromString(kmlText, 'application/xml')
  return kmlToGeoJSON(kmlDoc)
}

function kmlToGeoJSON(kmlDoc: Document): any {
  const features: any[] = []
  const placemarks = kmlDoc.querySelectorAll('Placemark')
  placemarks.forEach(placemark => {
    const name = placemark.querySelector('name')?.textContent || ''
    const polygonEl = placemark.querySelector('Polygon')
    if (polygonEl) {
      const coordsText = polygonEl.querySelector('outerBoundaryIs coordinates, coordinates')?.textContent?.trim() || ''
      const coordinates = coordsText.split(/\s+/).filter(Boolean).map(c => {
        const [lng, lat] = c.split(',').map(Number)
        return [lng, lat]
      })
      if (coordinates.length > 0) {
        features.push({ type: 'Feature', properties: { name }, geometry: { type: 'Polygon', coordinates: [coordinates] } })
      }
    }
    const multiPolygons = placemark.querySelectorAll('MultiGeometry Polygon')
    if (multiPolygons.length > 0) {
      const allCoords: number[][][] = []
      multiPolygons.forEach(poly => {
        const coordsText = poly.querySelector('outerBoundaryIs coordinates, coordinates')?.textContent?.trim() || ''
        const coordinates = coordsText.split(/\s+/).filter(Boolean).map(c => {
          const [lng, lat] = c.split(',').map(Number)
          return [lng, lat]
        })
        if (coordinates.length > 0) allCoords.push(coordinates)
      })
      if (allCoords.length > 0) {
        features.push({ type: 'Feature', properties: { name }, geometry: { type: 'MultiPolygon', coordinates: allCoords.map(c => [c]) } })
      }
    }
  })
  return { type: 'FeatureCollection', features }
}

export default function HizmetBolgeleriPage() {
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [yeniForm, setYeniForm] = useState({ goster: false, name: '', aciklama: '', kargo_ucreti: '0', min_siparis: '0', renk: '#E07090' })
  const [kmzYukleniyor, setKmzYukleniyor] = useState(false)
  const [kmzBolgeId, setKmzBolgeId] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const yukle = () => {
    supabase.from('site_hizmet_bolgeleri').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setBolgeler(data || [])
      setLoading(false)
    })
  }
  useEffect(() => { yukle() }, [])

  const ekle = async () => {
    if (!yeniForm.name) { toast.error('Bölge adı zorunludur'); return }
    await supabase.from('site_hizmet_bolgeleri').insert({
      name: yeniForm.name, aciklama: yeniForm.aciklama,
      kargo_ucreti: parseFloat(yeniForm.kargo_ucreti),
      min_siparis: parseFloat(yeniForm.min_siparis),
      renk: yeniForm.renk, aktif: true
    })
    toast.success('Hizmet bölgesi eklendi')
    setYeniForm({ goster: false, name: '', aciklama: '', kargo_ucreti: '0', min_siparis: '0', renk: '#E07090' })
    yukle()
  }

  const aktifDegistir = async (id: string, aktif: boolean) => {
    await supabase.from('site_hizmet_bolgeleri').update({ aktif }).eq('id', id)
    setBolgeler(prev => prev.map(b => b.id === id ? { ...b, aktif } : b))
    toast.success(aktif ? 'Bölge aktif edildi' : 'Bölge pasif edildi')
  }

  const sil = async (id: string) => {
    if (!confirm('Bu bölgeyi silmek istediğinizden emin misiniz?')) return
    await supabase.from('site_hizmet_bolgeleri').delete().eq('id', id)
    toast.success('Bölge silindi')
    yukle()
  }

  const kmzIsle = async (file: File, bolgeId: string) => {
    if (!bolgeId) { toast.error('Önce bir bölge seçin'); return }
    if (!file.name.endsWith('.kmz') && !file.name.endsWith('.kml')) {
      toast.error('Sadece .kmz veya .kml dosyası yükleyebilirsiniz')
      return
    }
    setKmzYukleniyor(true)
    try {
      let geojson: any
      if (file.name.endsWith('.kmz')) {
        geojson = await parseKMZ(file)
      } else {
        const text = await file.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'application/xml')
        geojson = kmlToGeoJSON(doc)
      }
      if (!geojson.features?.length) { toast.error('Dosyada polygon bulunamadı'); return }
      const { error } = await supabase.from('site_hizmet_bolgeleri').update({ polygon_data: geojson }).eq('id', bolgeId)
      if (error) throw error
      toast.success(`✅ ${geojson.features.length} polygon yüklendi`)
      yukle()
    } catch (err: any) {
      toast.error('Hata: ' + (err.message || 'Dosya işlenemedi'))
    } finally {
      setKmzYukleniyor(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) kmzIsle(file, kmzBolgeId)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>KMZ Hizmet Bölgeleri</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Hizmet verilen coğrafi alanları yönetin</p>
        </div>
        <button onClick={() => setYeniForm({ ...yeniForm, goster: true })} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={15} />Bölge Ekle
        </button>
      </div>

      {/* KMZ Yükleme */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>KMZ Dosyası Yükle</h2>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Bölge seçin, ardından .kmz veya .kml dosyanızı yükleyin</p>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>Hangi bölgeye yüklensin?</label>
          <select value={kmzBolgeId} onChange={e => setKmzBolgeId(e.target.value)} style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit' }}>
            <option value="">— Bölge seçin —</option>
            {bolgeler.map(b => (
              <option key={b.id} value={b.id}>{b.name} {b.polygon_data ? '✅' : '(polygon yok)'}</option>
            ))}
          </select>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed ${dragOver ? '#3B9FCC' : '#D1D5DB'}`, borderRadius: '12px', padding: '32px', textAlign: 'center', cursor: kmzYukleniyor ? 'not-allowed' : 'pointer', background: dragOver ? '#EBF7FC' : '#FAFAFA', transition: 'all 0.2s' }}
        >
          <input ref={fileInputRef} type="file" accept=".kmz,.kml" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) kmzIsle(f, kmzBolgeId) }} />
          {kmzYukleniyor ? (
            <p style={{ color: '#3B9FCC', fontSize: '14px', fontWeight: 600 }}>⏳ İşleniyor...</p>
          ) : (
            <>
              <Upload size={28} style={{ color: '#9CA3AF', margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#1C1B2E', marginBottom: '4px' }}>.kmz veya .kml dosyası sürükleyin</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>ya da tıklayarak seçin</p>
            </>
          )}
        </div>

        <div style={{ marginTop: '12px', background: '#EBF7FC', borderRadius: '12px', padding: '12px 16px', fontSize: '12px', color: '#3B9FCC' }}>
          <strong>Nasıl çalışır:</strong> KMZ/KML → tarayıcıda GeoJSON'a çevrilir → Supabase'e kaydedilir. Sunucu gerekmez, ücretsizdir.
        </div>
      </div>

      {/* Yeni bölge formu */}
      {yeniForm.goster && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '2px solid #F4A7B9', padding: '24px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>Yeni Bölge</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>Bölge Adı *</label>
              <input value={yeniForm.name} onChange={e => setYeniForm({ ...yeniForm, name: e.target.value })} placeholder="Örn: İstanbul Avrupa" style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>Renk</label>
              <input type="color" value={yeniForm.renk} onChange={e => setYeniForm({ ...yeniForm, renk: e.target.value })} style={{ width: '100%', height: '41px', borderRadius: '10px', border: '1px solid #F0ECF5', padding: '4px', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>Kargo Ücreti (₺)</label>
              <input type="number" value={yeniForm.kargo_ucreti} onChange={e => setYeniForm({ ...yeniForm, kargo_ucreti: e.target.value })} style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>Min. Sipariş (₺)</label>
              <input type="number" value={yeniForm.min_siparis} onChange={e => setYeniForm({ ...yeniForm, min_siparis: e.target.value })} style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setYeniForm({ ...yeniForm, goster: false })} style={{ padding: '10px 20px', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '50px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>İptal</button>
            <button onClick={ekle} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Kaydet</button>
          </div>
        </div>
      )}

      {/* Bölge listesi */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
        {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p>
          : bolgeler.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '32px', textAlign: 'center', gridColumn: '1/-1' }}>
              <MapPin size={32} style={{ color: '#F0ECF5', margin: '0 auto 8px', display: 'block' }} />
              <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Henüz hizmet bölgesi tanımlanmamış</p>
            </div>
          ) : bolgeler.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${b.aktif ? b.renk + '40' : '#F0ECF5'}`, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: b.renk, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>{b.name}</div>
                    {b.aciklama && <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{b.aciklama}</div>}
                  </div>
                </div>
                <button onClick={() => aktifDegistir(b.id, !b.aktif)} style={{ padding: '4px 12px', borderRadius: '50px', border: 'none', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: b.aktif ? '#F0FDF4' : '#FEF2F2', color: b.aktif ? '#22C55E' : '#EF4444' }}>
                  {b.aktif ? 'Aktif' : 'Pasif'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div style={{ background: '#F8F7FC', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kargo</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>{b.kargo_ucreti === 0 ? 'Ücretsiz' : `₺${b.kargo_ucreti}`}</div>
                </div>
                <div style={{ background: '#F8F7FC', borderRadius: '8px', padding: '8px 12px' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Min. Sipariş</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>{b.min_siparis === 0 ? 'Yok' : `₺${b.min_siparis}`}</div>
                </div>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={12} style={{ color: b.polygon_data ? '#22C55E' : '#9CA3AF' }} />
                <span style={{ fontSize: '11px', color: b.polygon_data ? '#22C55E' : '#9CA3AF' }}>
                  {b.polygon_data ? `${b.polygon_data.features?.length || 0} polygon yüklü` : 'Polygon yok'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => sil(b.id)} style={{ flex: 1, padding: '8px', background: '#FEF2F2', border: 'none', borderRadius: '8px', color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Trash2 size={12} />Sil</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
