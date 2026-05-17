// Point-in-polygon algoritması (Ray casting)
export function pointInPolygon(point: [number,number], polygon: [number,number][]): boolean {
  const [px, py] = point
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

export function parseKMZPolygon(geojson: any): [number,number][][] {
  const polygons: [number,number][][] = []
  if (!geojson?.features) return polygons
  for (const feature of geojson.features) {
    if (feature.geometry?.type === 'Polygon') {
      const coords = feature.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]] as [number,number])
      polygons.push(coords)
    } else if (feature.geometry?.type === 'MultiPolygon') {
      for (const poly of feature.geometry.coordinates) {
        const coords = poly[0].map((c: number[]) => [c[1], c[0]] as [number,number])
        polygons.push(coords)
      }
    }
  }
  return polygons
}

export async function checkServiceArea(lat: number, lng: number, bolge: any): Promise<boolean> {
  if (!bolge?.polygon_data) return false
  const polygons = parseKMZPolygon(bolge.polygon_data)
  return polygons.some(poly => pointInPolygon([lat, lng], poly))
}

export async function geocodeAddress(adres: string): Promise<{lat:number,lng:number}|null> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adres)}&limit=1`)
    const d = await r.json()
    if (d[0]) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) }
  } catch {}
  return null
}
