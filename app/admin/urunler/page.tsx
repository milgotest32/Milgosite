'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AdminUrunlerPage() {
  const [urunler, setUrunler] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [loading, setLoading] = useState(true)
  const [durum, setDurum] = useState('all')

  const yukle = async () => {
    setLoading(true)
    let q: any = supabase.from('site_products').select('*, site_kategoriler(name), site_product_images(url,ana)').order('created_at', { ascending: false })
    if (durum !== 'all') q = q.eq('durum', durum)
    if (arama) q = q.ilike('name', `%${arama}%`)
    const { data } = await q
    setUrunler(data || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [arama, durum])

  const sil = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return
    await supabase.from('site_products').update({ durum: 'deleted' }).eq('id', id)
    toast.success('Ürün silindi')
    yukle()
  }

  const DURUM_RENK: Record<string, { bg: string, tx: string }> = {
    active: { bg: '#F0FDF4', tx: '#22C55E' },
    draft: { bg: '#F8F7FC', tx: '#9CA3AF' },
    deleted: { bg: '#FEF2F2', tx: '#EF4444' }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>Ürünler</h1>
        <Link href="/admin/urunler/yeni" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <Plus size={15} />Yeni Ürün
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#F8F7FC', borderRadius: '10px', padding: '0 14px', minWidth: '200px' }}>
          <Search size={15} style={{ color: '#9CA3AF', flexShrink: 0 }} />
          <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ürün adı, SKU ara..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 0', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <select value={durum} onChange={e => setDurum(e.target.value)} style={{ background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit' }}>
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="draft">Taslak</option>
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F7FC', borderBottom: '1px solid #F0ECF5' }}>
              {['Ürün', 'Kategori', 'Fiyat', 'Stok', 'Durum', 'İşlem'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</td></tr>
            ) : urunler.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center' }}>
                <Package size={32} style={{ color: '#F0ECF5', margin: '0 auto 8px', display: 'block' }} />
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Ürün bulunamadı</p>
              </td></tr>
            ) : urunler.map((u, i) => {
              const gorsel = u.site_product_images?.find((g: any) => g.ana)?.url || u.site_product_images?.[0]?.url
              const d = DURUM_RENK[u.durum] || DURUM_RENK.draft
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #F0ECF5', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F0EEF8', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {gorsel ? <img src={gorsel} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '20px' }}>🥛</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', marginBottom: '2px' }}>{u.name}</div>
                        {u.sku && <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>SKU: {u.sku}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{u.site_kategoriler?.name || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>₺{u.fiyat?.toFixed(2)}</div>
                    {u.eski_fiyat && <div style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through' }}>₺{u.eski_fiyat?.toFixed(2)}</div>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: u.stok <= u.min_stok ? '#EF4444' : u.stok <= 10 ? '#F59E0B' : '#22C55E' }}>{u.stok}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px', background: d.bg, color: d.tx }}>{u.durum}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link href={`/urun/${u.slug}`} target="_blank" style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F0EEF8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', textDecoration: 'none' }}><Eye size={13} /></Link>
                      <Link href={`/admin/urunler/${u.id}`} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#EBF7FC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B9FCC', textDecoration: 'none' }}><Edit size={13} /></Link>
                      <button onClick={() => sil(u.id, u.name)} style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
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
