'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function MusterilerPage() {
  const [musteriler, setMusteriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [arama, setArama] = useState('')
  const [filtre, setFiltre] = useState('hepsi')
  const [syncing, setSyncing] = useState(false)

  const shopifySync = async (tip: string) => {
    setSyncing(true)
    try {
      const r = await fetch('/api/admin/shopify-sync', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ tip })
      })
      const d = await r.json()
      if (d.success) {
        const msg = tip === 'musteri'
          ? `✅ ${d.musteriSynced} müşteri aktarıldı!`
          : tip === 'siparis'
          ? `✅ ${d.siparisSynced} sipariş, ${d.kalemSynced} kalem aktarıldı!`
          : `✅ ${d.musteriSynced} müşteri, ${d.siparisSynced} sipariş aktarıldı!`
        alert(msg)
        fetch('/api/admin/users').then(r=>r.json()).then(d=>setMusteriler(d.data||[]))
      }
    } catch { alert('Hata oluştu') }
    setSyncing(false)
  }

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setMusteriler(d.data || []); setLoading(false) })
  }, [])

  const filtrelendi = musteriler.filter(m => {
    const aramakOk = !arama || m.email?.toLowerCase().includes(arama.toLowerCase()) || `${m.ad} ${m.soyad || ''}`.toLowerCase().includes(arama.toLowerCase()) || m.telefon?.includes(arama)
    const filtreOk = filtre === 'hepsi' || (filtre === 'shopify' && m.kaynak === 'shopify') || (filtre === 'site' && m.kaynak !== 'shopify')
    return aramakOk && filtreOk
  })

  const toplamHarcama = musteriler.reduce((t, m) => t + (m.toplam_harcama || 0), 0)

  return (
    <div>
      {/* Başlık */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'#1C1B2E', marginBottom:'4px' }}>Müşteriler</h1>
          <p style={{ fontSize:'13px', color:'#9CA3AF' }}>{musteriler.length} müşteri · ₺{toplamHarcama.toFixed(2)} toplam harcama</p>
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {/* Filtreler */}
          {[['hepsi','Tümü'],['shopify','Shopify'],['site','Site']].map(([v,l]) => (
            <button key={v} onClick={() => setFiltre(v)}
              style={{ padding:'6px 14px', borderRadius:'50px', border:`1px solid ${filtre===v?'#E07090':'#F0ECF5'}`, background:filtre===v?'#FEF0F4':'#fff', fontSize:'12px', fontWeight:600, cursor:'pointer', color:filtre===v?'#E07090':'#6B7280' }}>
              {l}
            </button>
          ))}
          <div style={{ position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ad, email, telefon..."
              style={{ background:'#fff', border:'1px solid #F0ECF5', borderRadius:'50px', padding:'8px 16px 8px 34px', fontSize:'13px', outline:'none', fontFamily:'inherit', width:'220px' }} />
          </div>
        </div>
      </div>

      {/* İstatistik kartlar */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Toplam Müşteri', value: musteriler.length, emoji:'👥' },
          { label:'Shopify Müşterisi', value: musteriler.filter(m=>m.kaynak==='shopify').length, emoji:'🛍' },
          { label:'Toplam Harcama', value: `₺${toplamHarcama.toFixed(0)}`, emoji:'💰' },
          { label:'En Sadık', value: musteriler.sort((a,b)=>(b.toplam_harcama||0)-(a.toplam_harcama||0))[0]?.ad || '—', emoji:'⭐' },
        ].map(k => (
          <div key={k.label} style={{ background:'#fff', border:'1px solid #F0ECF5', borderRadius:'16px', padding:'16px' }}>
            <div style={{ fontSize:'20px', marginBottom:'6px' }}>{k.emoji}</div>
            <div style={{ fontSize:'18px', fontWeight:700, color:'#1C1B2E' }}>{k.value}</div>
            <div style={{ fontSize:'11px', color:'#9CA3AF', marginTop:'2px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tablo */}
      <div style={{ background:'#fff', borderRadius:'16px', border:'1px solid #F0ECF5', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ background:'#F8F7FC', borderBottom:'1px solid #F0ECF5' }}>
            {['Müşteri','İletişim','Konum','Sipariş','Harcama','Kaynak','Kayıt'].map(h =>
              <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, textTransform:'uppercase', color:'#9CA3AF', letterSpacing:'0.1em' }}>{h}</th>
            )}
          </tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={7} style={{ padding:'32px', textAlign:'center', color:'#9CA3AF' }}>Yükleniyor...</td></tr>
              : filtrelendi.length === 0
              ? <tr><td colSpan={7} style={{ padding:'32px', textAlign:'center', color:'#9CA3AF' }}>Müşteri bulunamadı</td></tr>
              : filtrelendi.map((m, i) => (
                <tr key={m.id} style={{ borderBottom:'1px solid #F0ECF5', background: i%2===0?'#fff':'#FAFAF9' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,#E07090,#3B9FCC)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {(m.ad||m.email||'?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize:'13px', fontWeight:600, color:'#1C1B2E', margin:0 }}>{m.ad ? `${m.ad} ${m.soyad||''}`.trim() : '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <p style={{ fontSize:'12px', color:'#6B7280', margin:'0 0 2px' }}>{m.email}</p>
                    {m.telefon && <p style={{ fontSize:'11px', color:'#9CA3AF', margin:0 }}>{m.telefon}</p>}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    {m.ilce && <p style={{ fontSize:'12px', color:'#6B7280', margin:0 }}>{m.ilce}</p>}
                    {m.posta_kodu && <p style={{ fontSize:'11px', color:'#9CA3AF', margin:0 }}>{m.posta_kodu}</p>}
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:700, color:'#1C1B2E', textAlign:'center' }}>
                    {m.toplam_siparis || '—'}
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:700, color:'#22C55E' }}>
                    {m.toplam_harcama ? `₺${Number(m.toplam_harcama).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding:'12px 16px' }}>
                    <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'50px',
                      background: m.kaynak==='shopify'?'#F0FDF4': m.role==='admin'?'#FEF0F4':'#F8F7FC',
                      color: m.kaynak==='shopify'?'#22C55E': m.role==='admin'?'#E07090':'#6B7280' }}>
                      {m.kaynak==='shopify'?'🛍 Shopify': m.role==='admin'?'⚙️ Admin':'👤 Site'}
                    </span>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:'12px', color:'#6B7280' }}>
                    {m.created_at ? new Date(m.created_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
