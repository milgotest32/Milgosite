'use client'
import { adminFetch } from '@/lib/adminFetch'
import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function YonlendirmelerPage() {
  const [liste, setListe] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [deployDurum, setDeployDurum] = useState<'idle'|'deploying'|'done'|'error'>('idle')
  const [form, setForm] = useState({ eski_url: '', yeni_url: '' })
  const [ekleniyor, setEkleniyor] = useState(false)

  const yukle = async () => {
    setYukleniyor(true)
    const r = await adminFetch('/api/admin/redirects')
    const { data } = await r.json()
    setListe(data || [])
    setYukleniyor(false)
  }

  useEffect(() => { yukle() }, [])

  const ekle = async () => {
    if (!form.eski_url || !form.yeni_url) { toast.error('Her iki URL zorunlu'); return }
    if (!form.eski_url.startsWith('/')) { toast.error('Eski URL / ile başlamalı (örn: /products/urun-adi)'); return }
    if (!form.yeni_url.startsWith('/')) { toast.error('Yeni URL / ile başlamalı (örn: /urun/urun-adi)'); return }
    setEkleniyor(true)
    setDeployDurum('deploying')
    const r = await adminFetch('/api/admin/redirects', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const d = await r.json()
    if (d.ok) {
      toast.success('Eklendi! Site güncelleniyor...')
      setForm({ eski_url: '', yeni_url: '' })
      setDeployDurum('done')
      yukle()
    } else {
      toast.error(d.error || 'Hata oluştu')
      setDeployDurum('error')
    }
    setEkleniyor(false)
  }

  const sil = async (id: string) => {
    if (!confirm('Bu yönlendirmeyi silmek istediğinize emin misiniz?')) return
    setDeployDurum('deploying')
    const r = await adminFetch('/api/admin/redirects', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const d = await r.json()
    if (d.ok) { toast.success('Silindi'); setDeployDurum('done'); yukle() }
    else { toast.error(d.error); setDeployDurum('error') }
  }

  const toggle = async (id: string, aktif: boolean) => {
    setDeployDurum('deploying')
    const r = await adminFetch('/api/admin/redirects', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aktif: !aktif })
    })
    const d = await r.json()
    if (d.ok) { toast.success(aktif ? 'Pasife alındı' : 'Aktife alındı'); setDeployDurum('done'); yukle() }
    else { toast.error(d.error); setDeployDurum('error') }
  }

  const aktifSayisi = liste.filter(r => r.aktif).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E' }}>301 Yönlendirmeler</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
            Shopify'dan gelen eski URL'leri yeni siteye yönlendirin
          </p>
        </div>
        {/* Deploy durumu */}
        {deployDurum === 'deploying' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', color: '#92400E', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600 }}>
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Site güncelleniyor...
          </div>
        )}
        {deployDurum === 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', color: '#166534', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600 }}>
            <CheckCircle size={14} />
            Deploy tetiklendi (~1-2 dk)
          </div>
        )}
        {deployDurum === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', color: '#EF4444', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600 }}>
            <AlertCircle size={14} />
            Deploy hatası
          </div>
        )}
      </div>

      {/* İstatistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Toplam', value: liste.length, color: '#6B7280' },
          { label: 'Aktif', value: aktifSayisi, color: '#22C55E' },
          { label: 'Pasif', value: liste.length - aktifSayisi, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #F0ECF5', padding: '16px 20px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{s.label} Yönlendirme</div>
          </div>
        ))}
      </div>

      {/* Yeni ekle formu */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1C1B2E', marginBottom: '14px' }}>➕ Yeni Yönlendirme Ekle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Eski URL (Shopify)
            </label>
            <input
              value={form.eski_url}
              onChange={e => setForm(f => ({ ...f, eski_url: e.target.value }))}
              placeholder="/products/urun-adi"
              style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' as const }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Yeni URL
            </label>
            <input
              value={form.yeni_url}
              onChange={e => setForm(f => ({ ...f, yeni_url: e.target.value }))}
              placeholder="/urun/urun-adi"
              style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' as const }}
            />
          </div>
          <button onClick={ekle} disabled={ekleniyor}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 20px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: ekleniyor ? 0.7 : 1, whiteSpace: 'nowrap' as const }}>
            <Plus size={14} />{ekleniyor ? 'Ekleniyor...' : 'Ekle'}
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
          💡 URL'ler / ile başlamalı. Örn: <code style={{ background: '#F0ECF5', padding: '1px 6px', borderRadius: '4px' }}>/products/milgo-cig-sut-2-lt</code> → <code style={{ background: '#F0ECF5', padding: '1px 6px', borderRadius: '4px' }}>/urun/milgo-cig-sut-2l</code>
        </p>
      </div>

      {/* Liste */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0ECF5', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Eski URL</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Yeni URL</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Durum</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>İşlem</span>
        </div>

        {yukleniyor ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</div>
        ) : liste.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Henüz yönlendirme yok</div>
        ) : (
          liste.map((r, i) => (
            <div key={r.id} style={{
              padding: '14px 20px',
              borderBottom: i < liste.length - 1 ? '1px solid #F8F7FC' : 'none',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
              gap: '10px', alignItems: 'center',
              background: r.aktif ? '#fff' : '#FAFAFA',
              opacity: r.aktif ? 1 : 0.6
            }}>
              <code style={{ fontSize: '12px', color: '#EF4444', background: '#FEF2F2', padding: '3px 8px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                {r.eski_url}
              </code>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>→</span>
                <code style={{ fontSize: '12px', color: '#22C55E', background: '#F0FDF4', padding: '3px 8px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {r.yeni_url}
                </code>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px',
                background: r.aktif ? '#F0FDF4' : '#F3F4F6',
                color: r.aktif ? '#22C55E' : '#9CA3AF',
                textAlign: 'center' as const
              }}>
                {r.aktif ? 'Aktif' : 'Pasif'}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => toggle(r.id, r.aktif)} title={r.aktif ? 'Pasife al' : 'Aktife al'}
                  style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#F8F7FC', cursor: 'pointer', color: r.aktif ? '#22C55E' : '#9CA3AF', display: 'flex' }}>
                  {r.aktif ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button onClick={() => sil(r.id)} title="Sil"
                  style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#FEF2F2', cursor: 'pointer', color: '#EF4444', display: 'flex' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
