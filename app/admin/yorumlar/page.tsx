'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Check, X, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AdminYorumlarPage() {
  const [yorumlar, setYorumlar] = useState<any[]>([])
  const [filtre, setFiltre] = useState<'bekleyen' | 'onaylandi' | 'hepsi'>('bekleyen')
  const [yukleniyor, setYukleniyor] = useState(true)

  const yukle = async () => {
    setYukleniyor(true)
    let q = supabase
      .from('site_yorumlar')
      .select('*, site_products(name, slug)')
      .order('created_at', { ascending: false })
    if (filtre === 'bekleyen') q = q.eq('onaylı', false)
    if (filtre === 'onaylandi') q = q.eq('onaylı', true)
    const { data } = await q
    setYorumlar(data || [])
    setYukleniyor(false)
  }

  useEffect(() => { yukle() }, [filtre])

  const onayla = async (id: string) => {
    const { error } = await supabase.from('site_yorumlar').update({ onaylı: true }).eq('id', id)
    if (error) { toast.error('Hata oluştu'); return }
    toast.success('Yorum onaylandı')
    setYorumlar(prev => filtre === 'bekleyen' ? prev.filter(y => y.id !== id) : prev.map(y => y.id === id ? { ...y, onaylı: true } : y))
  }

  const reddet = async (id: string) => {
    const { error } = await supabase.from('site_yorumlar').delete().eq('id', id)
    if (error) { toast.error('Hata oluştu'); return }
    toast.success('Yorum silindi')
    setYorumlar(prev => prev.filter(y => y.id !== id))
  }

  const S = {
    card: { background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '12px' } as React.CSSProperties,
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>Müşteri Yorumları</h1>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['bekleyen', 'onaylandi', 'hepsi'] as const).map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: filtre === f ? '#1C1B2E' : '#F0ECF5', color: filtre === f ? '#fff' : '#6B7280' }}>
              {f === 'bekleyen' ? 'Bekleyenler' : f === 'onaylandi' ? 'Onaylananlar' : 'Hepsi'}
            </button>
          ))}
        </div>
      </div>

      {yukleniyor ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>Yükleniyor...</div>
      ) : yorumlar.length === 0 ? (
        <div style={{ ...S.card, textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            {filtre === 'bekleyen' ? 'Onay bekleyen yorum yok.' : 'Yorum bulunamadı.'}
          </p>
        </div>
      ) : (
        yorumlar.map(y => (
          <div key={y.id} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                {/* Ürün adı */}
                {y.site_products && (
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#E8567A', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>
                    {y.site_products.name}
                  </p>
                )}
                {/* Puan */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= y.puan ? '#FBBF24' : 'none'} style={{ color: '#FBBF24' }} />)}
                </div>
                {/* Başlık + metin */}
                {y.baslik && <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A0A12', margin: '0 0 4px' }}>{y.baslik}</p>}
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, margin: '0 0 10px' }}>{y.yorum}</p>
                {/* Kullanıcı + tarih */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#E8567A,#5BA4CF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' }}>{y.ad?.[0]}</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1A0A12' }}>{y.ad}</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(y.created_at).toLocaleDateString('tr-TR')}</span>
                  {y.onaylı && <span style={{ fontSize: '10px', background: '#F0FDF4', color: '#16a34a', padding: '2px 8px', borderRadius: '50px', fontWeight: 700 }}>✓ Onaylı</span>}
                </div>
              </div>
              {/* Aksiyonlar */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {!y.onaylı && (
                  <button onClick={() => onayla(y.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F0FDF4', color: '#16a34a', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    <Check size={13} /> Onayla
                  </button>
                )}
                <button onClick={() => reddet(y.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FEF2F2', color: '#dc2626', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <Trash2 size={13} /> Sil
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
