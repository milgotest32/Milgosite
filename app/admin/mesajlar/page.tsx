'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function AdminMesajlarPage() {
  const [mesajlar, setMesajlar] = useState<any[]>([])
  const [acik, setAcik] = useState<string | null>(null)
  const [filtre, setFiltre] = useState<'hepsi' | 'okunmamis'>('okunmamis')
  const [yukleniyor, setYukleniyor] = useState(true)

  const yukle = async () => {
    setYukleniyor(true)
    let q = supabase.from('site_iletisim_mesajlari').select('*').order('created_at', { ascending: false })
    if (filtre === 'okunmamis') q = q.eq('okundu', false)
    const { data } = await q
    setMesajlar(data || [])
    setYukleniyor(false)
  }

  useEffect(() => { yukle() }, [filtre])

  const mesajAc = async (mesaj: any) => {
    setAcik(acik === mesaj.id ? null : mesaj.id)
    if (!mesaj.okundu) {
      await supabase.from('site_iletisim_mesajlari').update({ okundu: true }).eq('id', mesaj.id)
      setMesajlar(prev => prev.map(m => m.id === mesaj.id ? { ...m, okundu: true } : m))
    }
  }

  const sil = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await supabase.from('site_iletisim_mesajlari').delete().eq('id', id)
    if (error) { toast.error('Silinemedi'); return }
    setMesajlar(prev => prev.filter(m => m.id !== id))
    if (acik === id) setAcik(null)
    toast.success('Mesaj silindi')
  }

  const okunmamisSayisi = mesajlar.filter(m => !m.okundu).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B2E', margin: '0 0 4px' }}>İletişim Mesajları</h1>
          {okunmamisSayisi > 0 && <span style={{ fontSize: '12px', background: '#FEE8EF', color: '#E8567A', padding: '2px 10px', borderRadius: '50px', fontWeight: 700 }}>{okunmamisSayisi} okunmamış</span>}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['okunmamis', 'hepsi'] as const).map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              style={{ padding: '7px 16px', borderRadius: '10px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer', background: filtre === f ? '#1C1B2E' : '#F0ECF5', color: filtre === f ? '#fff' : '#6B7280' }}>
              {f === 'okunmamis' ? 'Okunmamış' : 'Tümü'}
            </button>
          ))}
        </div>
      </div>

      {yukleniyor ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>Yükleniyor...</div>
      ) : mesajlar.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '60px', textAlign: 'center' }}>
          <Mail size={40} style={{ color: '#E5E7EB', margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Mesaj yok.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mesajlar.map(m => (
            <div key={m.id}>
              {/* Satır */}
              <div onClick={() => mesajAc(m)} style={{ background: '#fff', borderRadius: acik === m.id ? '16px 16px 0 0' : '16px', border: '1px solid #F0ECF5', borderBottom: acik === m.id ? 'none' : undefined, padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background .15s' }}>
                <div style={{ flexShrink: 0 }}>
                  {m.okundu
                    ? <MailOpen size={18} style={{ color: '#9CA3AF' }} />
                    : <Mail size={18} style={{ color: '#E8567A' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: m.okundu ? 500 : 700, color: '#1A0A12' }}>{m.ad}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{m.email}</span>
                    {!m.okundu && <span style={{ fontSize: '9px', background: '#E8567A', color: '#fff', padding: '2px 7px', borderRadius: '50px', fontWeight: 800 }}>YENİ</span>}
                  </div>
                  {m.konu && <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.konu}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{new Date(m.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <button onClick={(e) => sil(m.id, e)}
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={13} style={{ color: '#dc2626' }} />
                  </button>
                </div>
              </div>
              {/* Açık mesaj içeriği */}
              {acik === m.id && (
                <div style={{ background: '#FDFBF9', border: '1px solid #F0ECF5', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '20px 20px 20px 50px' }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#374151', margin: 0, whiteSpace: 'pre-wrap' }}>{m.mesaj}</p>
                  <a href={`mailto:${m.email}?subject=Re: ${m.konu || 'Mesajınız'}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', background: '#1A0A12', color: '#fff', padding: '8px 18px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: 700 }}>
                    ✉️ Yanıtla
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
