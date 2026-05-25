'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function MusterilerPage() {
  const [musteriler, setMusteriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [arama, setArama] = useState('')
  const [filtre, setFiltre] = useState('hepsi')
  const [syncing, setSyncing] = useState(false)
  const [syncSonuc, setSyncSonuc] = useState<{ok: boolean; msg: string} | null>(null)
  const [baglantiTest, setBaglantiTest] = useState<any>(null)
  const [testYukleniyor, setTestYukleniyor] = useState(false)

  const baglantiKontrol = async () => {
    setTestYukleniyor(true)
    setBaglantiTest(null)
    try {
      const r = await fetch('/api/admin/shopify-sync', { credentials: 'include' })
      const d = await r.json()
      setBaglantiTest(d)
    } catch (e: any) {
      setBaglantiTest({ ok: false, error: 'API isteği başarısız: ' + e.message })
    }
    setTestYukleniyor(false)
  }

  const shopifySync = async (tip: string) => {
    setSyncing(true)
    setSyncSonuc(null)
    try {
      const r = await fetch('/api/admin/shopify-sync', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ tip })
      })
      const d = await r.json()
      if (d.success) {
        const msg = tip === 'musteri'
          ? `${d.musteriSynced} müşteri aktarıldı!`
          : tip === 'siparis'
          ? `${d.siparisSynced} sipariş, ${d.kalemSynced} kalem aktarıldı!`
          : `${d.musteriSynced} müşteri, ${d.siparisSynced} sipariş aktarıldı!`
        setSyncSonuc({ ok: true, msg })
        fetch('/api/admin/users', { credentials: 'include' }).then(r=>r.json()).then(d=>setMusteriler(d.data||[]))
      } else {
        setSyncSonuc({ ok: false, msg: d.error || 'Bilinmeyen hata' })
      }
    } catch (e: any) {
      setSyncSonuc({ ok: false, msg: 'Bağlantı hatası: ' + e.message })
    }
    setSyncing(false)
  }

  useEffect(() => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setMusteriler(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
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
        <div style={{ display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' as const }}>
          {/* Filtreler */}
          {[['hepsi','Tümü'],['shopify','Shopify'],['site','Site']].map(([v,l]) => (
            <button key={v} onClick={() => setFiltre(v)}
              style={{ padding:'6px 14px', borderRadius:'50px', border:`1px solid ${filtre===v?'#E07090':'#F0ECF5'}`, background:filtre===v?'#FEF0F4':'#fff', fontSize:'12px', fontWeight:600, cursor:'pointer', color:filtre===v?'#E07090':'#6B7280' }}>
              {l}
            </button>
          ))}
          <button onClick={baglantiKontrol} disabled={testYukleniyor}
            style={{ padding:'8px 14px', borderRadius:'50px', border:'1.5px solid #F0ECF5', background:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer', color:'#6B7280', whiteSpace:'nowrap' as const }}>
            {testYukleniyor ? '⏳' : '🔗 Bağlantı Test'}
          </button>
          <button onClick={()=>shopifySync('musteri')} disabled={syncing}
            style={{ padding:'8px 16px', borderRadius:'50px', border:'none', background: syncing?'#F8F7FC':'linear-gradient(135deg,#E07090,#3B9FCC)', color: syncing?'#9CA3AF':'#fff', fontSize:'12px', fontWeight:700, cursor: syncing?'not-allowed':'pointer', whiteSpace:'nowrap' as const }}>
            {syncing ? '⏳...' : '🔄 Müşteri Sync'}
          </button>
          <button onClick={()=>shopifySync('siparis')} disabled={syncing}
            style={{ padding:'8px 16px', borderRadius:'50px', border:'none', background: syncing?'#F8F7FC':'linear-gradient(135deg,#3B9FCC,#6B5CF6)', color: syncing?'#9CA3AF':'#fff', fontSize:'12px', fontWeight:700, cursor: syncing?'not-allowed':'pointer', whiteSpace:'nowrap' as const }}>
            {syncing ? '⏳...' : '📦 Sipariş Sync'}
          </button>
          <button onClick={()=>shopifySync('hepsi')} disabled={syncing}
            style={{ padding:'8px 16px', borderRadius:'50px', border:'none', background: syncing?'#F8F7FC':'#1C1B2E', color: syncing?'#9CA3AF':'#fff', fontSize:'12px', fontWeight:700, cursor: syncing?'not-allowed':'pointer', whiteSpace:'nowrap' as const }}>
            {syncing ? '⏳ Senkronize ediliyor...' : '⚡ Tümünü Sync'}
          </button>
          <div style={{ position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
            <input value={arama} onChange={e => setArama(e.target.value)} placeholder="Ad, email, telefon..."
              style={{ background:'#fff', border:'1px solid #F0ECF5', borderRadius:'50px', padding:'8px 16px 8px 34px', fontSize:'13px', outline:'none', fontFamily:'inherit', width:'220px' }} />
          </div>
        </div>
      </div>

      {/* Shopify Bağlantı Test Sonucu */}
      {baglantiTest && (
        <div style={{ marginBottom:'16px', padding:'14px 18px', borderRadius:'14px', background: baglantiTest.ok ? '#F0FDF4' : '#FEF2F2', border:`1px solid ${baglantiTest.ok ? '#BBF7D0' : '#FECACA'}`, display:'flex', alignItems:'flex-start', gap:'10px' }}>
          {baglantiTest.ok
            ? <CheckCircle size={18} style={{ color:'#22C55E', flexShrink:0, marginTop:'1px' }} />
            : <XCircle size={18} style={{ color:'#EF4444', flexShrink:0, marginTop:'1px' }} />}
          <div style={{ fontSize:'13px' }}>
            {baglantiTest.ok ? (
              <>
                <p style={{ fontWeight:700, color:'#16A34A', margin:'0 0 4px' }}>✅ Shopify bağlantısı başarılı!</p>
                <p style={{ color:'#15803D', margin:0 }}>Mağaza: <strong>{baglantiTest.store}</strong> · Domain: {baglantiTest.domain}</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight:700, color:'#DC2626', margin:'0 0 6px' }}>❌ Shopify bağlantısı kurulamadı</p>
                <p style={{ color:'#B91C1C', margin:'0 0 8px', fontFamily:'monospace', fontSize:'12px', background:'#FEE2E2', padding:'8px', borderRadius:'8px' }}>{baglantiTest.error}</p>
                {!baglantiTest.token_set && (
                  <div style={{ background:'#FEF9C3', border:'1px solid #FDE68A', borderRadius:'8px', padding:'10px 12px', marginTop:'8px' }}>
                    <p style={{ fontWeight:700, color:'#92400E', margin:'0 0 6px', fontSize:'13px' }}>⚠️ Yapılması gerekenler:</p>
                    <ol style={{ margin:0, paddingLeft:'18px', color:'#78350F', fontSize:'12px', lineHeight:'1.8' }}>
                      <li>Vercel Dashboard → Projeniz → Settings → Environment Variables</li>
                      <li><code style={{ background:'#FEF3C7', padding:'1px 6px', borderRadius:'4px' }}>SHOPIFY_ACCESS_TOKEN</code> değişkenini ekleyin</li>
                      <li><code style={{ background:'#FEF3C7', padding:'1px 6px', borderRadius:'4px' }}>SHOPIFY_STORE_DOMAIN</code> değişkenini ekleyin (ör: market.milgo.com.tr)</li>
                      <li>Kaydet ve <strong>Redeploy</strong> yapın</li>
                    </ol>
                    <p style={{ margin:'8px 0 0', fontSize:'11px', color:'#92400E' }}>
                      Shopify Admin → Apps → Develop apps → Access token buradan alınır.
                      Gerekli izinler: <code>read_customers</code>, <code>read_orders</code>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <button onClick={() => setBaglantiTest(null)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', fontSize:'16px', flexShrink:0 }}>✕</button>
        </div>
      )}

      {/* Sync Sonucu */}
      {syncSonuc && (
        <div style={{ marginBottom:'16px', padding:'12px 16px', borderRadius:'12px', background: syncSonuc.ok ? '#F0FDF4' : '#FEF2F2', border:`1px solid ${syncSonuc.ok ? '#BBF7D0' : '#FECACA'}`, display:'flex', alignItems:'center', gap:'10px' }}>
          {syncSonuc.ok
            ? <CheckCircle size={16} style={{ color:'#22C55E', flexShrink:0 }} />
            : <AlertCircle size={16} style={{ color:'#EF4444', flexShrink:0 }} />}
          <span style={{ fontSize:'13px', fontWeight:600, color: syncSonuc.ok ? '#16A34A' : '#DC2626', flex:1 }}>
            {syncSonuc.ok ? `✅ ${syncSonuc.msg}` : `❌ ${syncSonuc.msg}`}
          </span>
          <button onClick={() => setSyncSonuc(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', fontSize:'16px' }}>✕</button>
        </div>
      )}

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
