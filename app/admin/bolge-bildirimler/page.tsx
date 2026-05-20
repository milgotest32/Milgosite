'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
export const dynamic = 'force-dynamic'

export default function BolgeBildirimlerPage() {
  const [bildirimler, setBildirimler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_bolge_bildirim').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setBildirimler(data || []); setLoading(false) })
  }, [])

  const gruplu = bildirimler.reduce((acc: any, b) => {
    const k = b.bolge_adi || 'Bilinmiyor'
    if (!acc[k]) acc[k] = []
    acc[k].push(b)
    return acc
  }, {})

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',marginBottom:'4px'}}>Bölge Bildirimleri</h1>
        <p style={{fontSize:'13px',color:'#9CA3AF'}}>{bildirimler.length} kayıt — hizmet olmayan bölgelerden bildirim isteği</p>
      </div>

      {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p> : Object.entries(gruplu).map(([bolge, kayitlar]: any) => (
        <div key={bolge} style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
            <div>
              <h3 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',margin:0}}>📍 {bolge}</h3>
              <p style={{fontSize:'12px',color:'#9CA3AF',margin:'2px 0 0'}}>{kayitlar.length} kişi bekliyor</p>
            </div>
            <span style={{background:'#FEF0F4',color:'#E07090',padding:'4px 12px',borderRadius:'50px',fontSize:'12px',fontWeight:700}}>{kayitlar.length} kişi</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
            {kayitlar.map((k: any) => (
              <div key={k.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'#F8F7FC',borderRadius:'10px',fontSize:'13px'}}>
                <span style={{color:'#1C1B2E'}}>{k.email}</span>
                <span style={{color:'#9CA3AF',fontSize:'11px'}}>{new Date(k.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && bildirimler.length === 0 && (
        <div style={{textAlign:'center',padding:'48px',color:'#9CA3AF'}}>Henüz bildirim isteği yok</div>
      )}
    </div>
  )
}
