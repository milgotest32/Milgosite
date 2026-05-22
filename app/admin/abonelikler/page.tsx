'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { RefreshCw, Search, Phone, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const PLAN_RENK: Record<string, string> = { baslangic: '#3B9FCC', aile: '#E8567A', premium: '#8B5CF6' }
const DURUM_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  aktif:       { bg: '#F0FDF4', color: '#16a34a', label: '● Aktif' },
  durduruldu:  { bg: '#FEF3C7', color: '#D97706', label: '⏸ Durduruldu' },
  iptal:       { bg: '#FEF2F2', color: '#dc2626', label: '✕ İptal' },
}

export default function AdminAboneliklerPage() {
  const [abonelikler, setAbonelikler] = useState<any[]>([])
  const [filtre, setFiltre] = useState<'hepsi' | 'aktif' | 'durduruldu' | 'iptal'>('aktif')
  const [arama, setArama] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [islem, setIslem] = useState<string | null>(null)

  const yukle = async () => {
    setYukleniyor(true)
    let q = supabase
      .from('site_abonelikler')
      .select('*')
      .order('created_at', { ascending: false })

    if (filtre !== 'hepsi') {
      if (filtre === 'aktif') q = q.eq('aktif', true).neq('durum', 'iptal')
      else q = q.eq('durum', filtre)
    }

    const { data } = await q
    setAbonelikler(data || [])
    setYukleniyor(false)
  }

  useEffect(() => { yukle() }, [filtre])

  const durumGuncelle = async (id: string, aktif: boolean, durum: string) => {
    setIslem(id)
    const { error } = await supabase.from('site_abonelikler').update({ aktif, durum }).eq('id', id)
    if (error) { toast.error('İşlem başarısız'); setIslem(null); return }
    toast.success('Güncellendi')
    setAbonelikler(prev => prev.map(a => a.id === id ? { ...a, aktif, durum } : a))
    setIslem(null)
  }

  const filtrelenmis = abonelikler.filter(a => {
    if (!arama) return true
    const s = arama.toLowerCase()
    return (
      a.musteri_ad?.toLowerCase().includes(s) ||
      a.musteri_email?.toLowerCase().includes(s) ||
      a.musteri_telefon?.includes(s) ||
      a.plan?.includes(s)
    )
  })

  const aktifSayisi = abonelikler.filter(a => a.aktif && a.durum !== 'iptal').length
  const aylikGelir = abonelikler
    .filter(a => a.aktif && a.durum !== 'iptal')
    .reduce((t, a) => t + Number(a.fiyat || 0), 0)

  return (
    <div>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B2E', margin: '0 0 4px' }}>Abonelik Yönetimi</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>{aktifSayisi} aktif abonelik · Aylık tahmini gelir: <strong style={{ color: '#1C1B2E' }}>₺{aylikGelir.toLocaleString('tr-TR')}</strong></p>
        </div>
        <button onClick={yukle} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0ECF5', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: '#7A6070', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Yenile
        </button>
      </div>

      {/* Özet kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Aktif', value: abonelikler.filter(a => a.aktif && a.durum !== 'iptal').length, renk: '#F0FDF4', ic: '#16a34a' },
          { label: 'Durduruldu', value: abonelikler.filter(a => a.durum === 'durduruldu').length, renk: '#FEF3C7', ic: '#D97706' },
          { label: 'İptal', value: abonelikler.filter(a => a.durum === 'iptal').length, renk: '#FEF2F2', ic: '#dc2626' },
          { label: 'Başlangıç Planı', value: abonelikler.filter(a => a.plan === 'baslangic' && a.aktif).length, renk: '#EBF5FC', ic: '#3B9FCC' },
          { label: 'Aile Planı', value: abonelikler.filter(a => a.plan === 'aile' && a.aktif).length, renk: '#FEE8EF', ic: '#E8567A' },
          { label: 'Premium Plan', value: abonelikler.filter(a => a.plan === 'premium' && a.aktif).length, renk: '#FAF5FF', ic: '#8B5CF6' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #F0ECF5', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1C1B2E', marginBottom: '2px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filtreler + Arama */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['aktif', 'durduruldu', 'iptal', 'hepsi'] as const).map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ padding: '7px 14px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: filtre === f ? '#1C1B2E' : '#F0ECF5', color: filtre === f ? '#fff' : '#6B7280', textTransform: 'capitalize' }}>
              {f === 'hepsi' ? 'Tümü' : f === 'aktif' ? 'Aktif' : f === 'durduruldu' ? 'Durduruldu' : 'İptal'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '7px 14px', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="İsim, email veya telefon ara..."
            style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#1C1B2E', width: '100%', background: 'transparent' }} />
        </div>
      </div>

      {/* Tablo */}
      {yukleniyor ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>Yükleniyor...</div>
      ) : filtrelenmis.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '60px', textAlign: 'center' }}>
          <RefreshCw size={40} style={{ color: '#E5E7EB', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Abonelik bulunamadı</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtrelenmis.map(a => {
            const durum = a.durum || (a.aktif ? 'aktif' : 'iptal')
            const durumS = DURUM_STYLE[durum] || DURUM_STYLE.iptal
            const planRenk = PLAN_RENK[a.plan] || '#9CA3AF'
            return (
              <div key={a.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  {/* Sol: müşteri bilgileri */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A0A12' }}>{a.musteri_ad}</span>
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '50px', background: `${planRenk}20`, color: planRenk, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                        {a.plan}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: durumS.bg, color: durumS.color }}>
                        {durumS.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {a.musteri_email && (
                        <a href={`mailto:${a.musteri_email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280', textDecoration: 'none' }}>
                          <Mail size={12} /> {a.musteri_email}
                        </a>
                      )}
                      {a.musteri_telefon && (
                        <a href={`tel:${a.musteri_telefon}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280', textDecoration: 'none' }}>
                          <Phone size={12} /> {a.musteri_telefon}
                        </a>
                      )}
                      {a.teslimat_adres && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B7280' }}>
                          <MapPin size={12} /> {a.teslimat_adres}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sağ: plan detayları */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#1A0A12' }}>{a.haftalik_litre}L</div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Haftalık</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#1A0A12' }}>₺{a.fiyat}</div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Aylık</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A0A12' }}>
                        {a.sonraki_teslimat ? new Date(a.sonraki_teslimat).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : 'Her Cuma'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Teslimat</div>
                    </div>

                    {/* Aksiyon butonları */}
                    {durum !== 'iptal' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {a.aktif && durum !== 'durduruldu' ? (
                          <button onClick={() => durumGuncelle(a.id, false, 'durduruldu')} disabled={islem === a.id}
                            style={{ fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#FEF3C7', color: '#D97706', cursor: 'pointer' }}>
                            Duraklat
                          </button>
                        ) : durum === 'durduruldu' ? (
                          <button onClick={() => durumGuncelle(a.id, true, 'aktif')} disabled={islem === a.id}
                            style={{ fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#F0FDF4', color: '#16a34a', cursor: 'pointer' }}>
                            Devam Et
                          </button>
                        ) : null}
                        <button onClick={() => durumGuncelle(a.id, false, 'iptal')} disabled={islem === a.id}
                          style={{ fontSize: '11px', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#FEF2F2', color: '#dc2626', cursor: 'pointer' }}>
                          İptal
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt: başlangıç tarihi */}
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F0ECF5', fontSize: '11px', color: '#C4B5CC' }}>
                  Başlangıç: {a.created_at ? new Date(a.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  {a.baslangic_tarihi && ` · İlk teslimat: ${new Date(a.baslangic_tarihi).toLocaleDateString('tr-TR')}`}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
