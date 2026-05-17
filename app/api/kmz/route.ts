import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { lat, lng } = await req.json()
  if (!lat || !lng) return NextResponse.json({ hizmet: false, hata: 'Koordinat gerekli' })

  const db = createServerClient()
  const { data: bolgeler } = await db.from('site_hizmet_bolgeleri').select('*').eq('aktif', true)
  if (!bolgeler?.length) return NextResponse.json({ hizmet: true, bolge: null }) // Bölge tanımlı değilse izin ver

  function pointInPolygon(px: number, py: number, polygon: [number,number][]): boolean {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j]
      if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) inside = !inside
    }
    return inside
  }

  for (const bolge of bolgeler) {
    if (!bolge.polygon_data?.features) continue
    for (const feature of bolge.polygon_data.features) {
      if (feature.geometry?.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]] as [number,number])
        if (pointInPolygon(lat, lng, coords)) {
          return NextResponse.json({ hizmet: true, bolge: { id: bolge.id, name: bolge.name, kargo_ucreti: bolge.kargo_ucreti, min_siparis: bolge.min_siparis } })
        }
      }
    }
  }

  return NextResponse.json({ hizmet: false, hata: 'Bu adrese hizmet verilemiyor' })
}
