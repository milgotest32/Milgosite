'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function EtbisLogo() {
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    supabase.from('site_ayarlar').select('deger').eq('grup', 'genel').eq('anahtar', 'etbis_logo_url').single()
      .then(({ data }) => {
        if (data?.deger) setLogoUrl(data.deger)
      })
  }, [])

  if (!logoUrl) return null

  return (
    <a href="https://www.eticaret.gov.tr" target="_blank" rel="noreferrer" title="ETBİS - E-Ticaret Bilgi Sistemi">
      <img src={logoUrl} alt="ETBİS" style={{height:'64px',width:'auto',objectFit:'contain',borderRadius:'6px'}}/>
    </a>
  )
}
