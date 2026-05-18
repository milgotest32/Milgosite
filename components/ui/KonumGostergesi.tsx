'use client'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

export default function KonumGostergesi() {
  const [konum, setKonum] = useState<string | null>(null)

  useEffect(() => {
    const k = localStorage.getItem('milgo_konum')
    setKonum(k)
    const interval = setInterval(() => {
      const k2 = localStorage.getItem('milgo_konum')
      if (k2 !== konum) setKonum(k2)
    }, 1000)
    return () => clearInterval(interval)
  }, [konum])

  if (!konum) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#E8567A', background: '#FEE8EF', padding: '4px 10px', borderRadius: '50px', flexShrink: 0 }}>
      <MapPin size={11} />
      {konum}
    </div>
  )
}
