'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Download, RefreshCw, Mail, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OnkayitPage() {
  const [liste, setListe] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const yukle = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('site_sezon_onkayit')
      .select('*')
      .order('created_at', { ascending: false })
    setListe(data || [])
    setLoading(false)
  }

  useEffect(() => { yukle() }, [])

  const sil = async (id: string) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return
    await supabase.from('site_sezon_onkayit').delete().eq('id', id)
    toast.success('Silindi')
    yukle()
  }

  const excelIndir = () => {
    if (liste.length === 0) { toast.error('Liste boş'); return }
    const satirlar = [
      ['E-posta', 'Kayıt Tarihi'],
      ...liste.map(k => [
        k.email,
        new Date(k.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      ])
    ]
    const csv = satirlar.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `onkayit-listesi-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('İndirildi')
  }

  const emaillerKopyala = () => {
    const emailler = liste.map(k => k.email).join(', ')
    navigator.clipboard.writeText(emailler)
    toast.success(`${liste.length} email kopyalandı`)
  }

  return (
    <div>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>🥛 Sezon Ön Kayıt Listesi</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>Çiğ süt sezonu açılınca haber almak isteyen müşteriler</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={yukle} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0ECF5', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: '#7A6070', cursor: 'pointer', fontFamily: 'inherit' }}>
            <RefreshCw size={13} /> Yenile
          </button>
          <button onClick={emaillerKopyala} disabled={liste.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EBF7FC', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: '#3B9FCC', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Mail size={13} /> Emailleri Kopyala
          </button>
          <button onClick={excelIndir} disabled={liste.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Download size={13} /> CSV İndir
          </button>
        </div>
      </div>

      {/* İstatistik */}
      <div style={{ background: 'linear-gradient(135deg,#FEF0F4,#EBF7FC)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '36px', fontWeight: 800, color: '#E8567A', fontFamily: 'var(--font-nunito), Nunito, sans-serif' }}>{liste.length}</div>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1C1B2E' }}>Toplam Ön Kayıt</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#7A6070' }}>Sezon açıldığında bildirim almak isteyen müşteriler</p>
        </div>
      </div>

      {/* Liste */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0ECF5', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>E-posta</span>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.1em' }}>Kayıt Tarihi</span>
          <span></span>
        </div>

        {loading ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</p>
        ) : liste.length === 0 ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF' }}>Henüz ön kayıt yok</p>
        ) : (
          liste.map((k, i) => (
            <div key={k.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '12px 20px', borderBottom: i < liste.length - 1 ? '1px solid #F8F7FC' : 'none' }}>
              <span style={{ fontSize: '14px', color: '#1C1B2E', fontWeight: 500 }}>{k.email}</span>
              <span style={{ fontSize: '12px', color: '#9CA3AF', whiteSpace: 'nowrap' as const }}>
                {new Date(k.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button onClick={() => sil(k.id)}
                style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
