'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Search, Plus, Pencil, Trash2, Check, X, Eye, EyeOff, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

type Sube = {
  id: string
  sube_kodu: string
  sube_adi: string
  email: string
  sifre: string
  aktif: boolean
}

const BOŞ: Omit<Sube, 'id'> = { sube_kodu: '', sube_adi: '', email: '', sifre: '', aktif: true }

export default function FiyuuPage() {
  const [liste, setListe] = useState<Sube[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [arama, setArama] = useState('')
  const [duzenlenen, setDuzenlenen] = useState<Sube | null>(null)
  const [yeni, setYeni] = useState(false)
  const [form, setForm] = useState<Omit<Sube, 'id'>>(BOŞ)
  const [sifreGorunen, setSifreGorunen] = useState<Record<string, boolean>>({})
  const [kaydediliyor, setKaydediliyor] = useState(false)

  const yukle = async () => {
    const { data } = await supabase.from('site_subeler').select('*').order('sube_adi')
    setListe(data || [])
    setYukleniyor(false)
  }
  useEffect(() => { yukle() }, [])

  const filtreli = liste.filter(s =>
    !arama ||
    s.sube_kodu.includes(arama) ||
    s.sube_adi.toLowerCase().includes(arama.toLowerCase()) ||
    s.email?.toLowerCase().includes(arama.toLowerCase())
  )

  const kaydet = async () => {
    if (!form.sube_kodu || !form.sube_adi) { toast.error('Şube kodu ve adı zorunlu'); return }
    setKaydediliyor(true)
    if (duzenlenen) {
      const { error } = await supabase.from('site_subeler').update(form).eq('id', duzenlenen.id)
      if (error) toast.error('Güncelleme hatası: ' + error.message)
      else { toast.success('Güncellendi'); setDuzenlenen(null) }
    } else {
      const { error } = await supabase.from('site_subeler').insert(form)
      if (error) toast.error('Eklenemedi: ' + error.message)
      else { toast.success('Şube eklendi'); setYeni(false); setForm(BOŞ) }
    }
    setKaydediliyor(false)
    yukle()
  }

  const sil = async (id: string, ad: string) => {
    if (!confirm(`"${ad}" şubesini silmek istediğinize emin misiniz?`)) return
    const { error } = await supabase.from('site_subeler').delete().eq('id', id)
    if (error) toast.error('Silinemedi')
    else { toast.success('Silindi'); yukle() }
  }

  const duzenle = (s: Sube) => {
    setDuzenlenen(s)
    setYeni(false)
    setForm({ sube_kodu: s.sube_kodu, sube_adi: s.sube_adi, email: s.email || '', sifre: s.sifre || '', aktif: s.aktif })
  }

  const iptal = () => { setDuzenlenen(null); setYeni(false); setForm(BOŞ) }

  const kopyala = (metin: string, etiket: string) => {
    navigator.clipboard.writeText(metin)
    toast.success(`${etiket} kopyalandı`)
  }

  const inp = (label: string, key: keyof typeof form, tip = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>
      <input type={tip} value={form[key] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '9px 13px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
    </div>
  )

  return (
    <div>
      <style>{`
        @media (max-width: 640px) {
          .sube-tablo-header { display: none !important; }
          .sube-satir { display: flex !important; flex-direction: column !important; gap: 8px !important; padding: 14px !important; }
          .sube-form-grid { grid-template-columns: 1fr !important; }
          .sube-actions { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* Başlık */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Fiyuu Şubeleri</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{liste.length} şube kayıtlı</p>
        </div>
        {!yeni && !duzenlenen && (
          <button onClick={() => { setYeni(true); setDuzenlenen(null); setForm(BOŞ) }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={14} /> Yeni Şube Ekle
          </button>
        )}
      </div>

      {/* Form */}
      {(yeni || duzenlenen) && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '16px' }}>
            {duzenlenen ? `✏️ Düzenle: ${duzenlenen.sube_adi}` : '➕ Yeni Şube'}
          </h3>
          <div className="sube-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {inp('Şube Kodu', 'sube_kodu', 'text', '5762315')}
            {inp('Şube Adı', 'sube_adi', 'text', 'Metrocity Milgo')}
            {inp('E-posta', 'email', 'email', 'ornek@mail.com')}
            {inp('Şifre', 'sifre', 'text', '••••••••')}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={kaydet} disabled={kaydediliyor}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '9px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: kaydediliyor ? 0.7 : 1 }}>
              <Check size={13} />{kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button onClick={iptal}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', color: '#6B7280', padding: '9px 16px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <X size={13} /> İptal
            </button>
          </div>
        </div>
      )}

      {/* Arama */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        <input value={arama} onChange={e => setArama(e.target.value)}
          placeholder="Şube kodu, adı veya e-posta ile ara..."
          style={{ width: '100%', background: '#fff', border: '1px solid #F0ECF5', borderRadius: '50px', padding: '10px 16px 10px 38px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
      </div>

      {/* Tablo */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        {/* Header - masaüstü */}
        <div className="sube-tablo-header" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px 160px 100px', gap: '0', background: '#F8F7FC', borderBottom: '1px solid #F0ECF5', padding: '10px 16px' }}>
          {['Şube Kodu', 'Şube Adı', 'E-posta', 'Şifre', 'İşlem'].map(h => (
            <div key={h} style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>

        {yukleniyor ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</div>
        ) : filtreli.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            {arama ? 'Sonuç bulunamadı' : 'Henüz şube yok'}
          </div>
        ) : filtreli.map((s, i) => (
          <div key={s.id} className="sube-satir"
            style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px 160px 100px', gap: '0', alignItems: 'center', padding: '12px 16px', borderBottom: i < filtreli.length - 1 ? '1px solid #F8F7FC' : 'none', background: duzenlenen?.id === s.id ? '#FEF0F4' : i % 2 === 0 ? '#fff' : '#FAFAF9' }}>

            {/* Şube Kodu */}
            <div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', display: 'none' }} className="mobil-label">Şube Kodu</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <code style={{ fontSize: '12px', fontWeight: 700, color: '#E07090', background: '#FEF0F4', padding: '2px 8px', borderRadius: '6px' }}>{s.sube_kodu}</code>
                <button onClick={() => kopyala(s.sube_kodu, 'Şube kodu')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex' }}>
                  <Copy size={11} />
                </button>
              </div>
            </div>

            {/* Şube Adı */}
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', paddingRight: '8px' }}>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px', display: 'none' }} className="mobil-label">Şube Adı</div>
              {s.sube_adi}
            </div>

            {/* E-posta */}
            <div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px', display: 'none' }} className="mobil-label">E-posta</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{s.email || '—'}</span>
                {s.email && (
                  <button onClick={() => kopyala(s.email, 'E-posta')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex', flexShrink: 0 }}>
                    <Copy size={11} />
                  </button>
                )}
              </div>
            </div>

            {/* Şifre */}
            <div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px', display: 'none' }} className="mobil-label">Şifre</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <code style={{ fontSize: '12px', color: '#1C1B2E', fontFamily: 'monospace' }}>
                  {sifreGorunen[s.id] ? (s.sifre || '—') : (s.sifre ? '••••••••' : '—')}
                </code>
                {s.sifre && (
                  <>
                    <button onClick={() => setSifreGorunen(p => ({ ...p, [s.id]: !p[s.id] }))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex' }}>
                      {sifreGorunen[s.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button onClick={() => kopyala(s.sifre, 'Şifre')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex' }}>
                      <Copy size={11} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* İşlemler */}
            <div className="sube-actions" style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => duzenle(s)} title="Düzenle"
                style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#F0F9FF', cursor: 'pointer', color: '#3B9FCC', display: 'flex' }}>
                <Pencil size={13} />
              </button>
              <button onClick={() => sil(s.id, s.sube_adi)} title="Sil"
                style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#FEF2F2', cursor: 'pointer', color: '#EF4444', display: 'flex' }}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Özet */}
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#9CA3AF', textAlign: 'right' }}>
        {arama ? `${filtreli.length} / ${liste.length} şube gösteriliyor` : `Toplam ${liste.length} şube`}
      </div>
    </div>
  )
}
