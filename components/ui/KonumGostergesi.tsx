'use client'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

export default function KonumGostergesi() {
  const [konum, setKonum] = useState<string | null>(null)

  useEffect(() => {
    const guncelle = () => {
      setKonum(localStorage.getItem('milgo_konum'))
    }
    guncelle()
    window.addEventListener('milgo_konum_degisti', guncelle)
    window.addEventListener('storage', guncelle)
    return () => {
      window.removeEventListener('milgo_konum_degisti', guncelle)
      window.removeEventListener('storage', guncelle)
    }
  }, [])

  if (!konum) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#E8567A', background: '#FEE8EF', padding: '4px 10px', borderRadius: '50px', flexShrink: 0 }}>
      <MapPin size={11} />
      {konum}
    </div>
  )
}
