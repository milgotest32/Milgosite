import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/admin-check'
export const dynamic = 'force-dynamic'

async function nextConfigGuncelle(redirectler: { eski_url: string; yeni_url: string }[]) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) return { ok: false, error: 'GitHub token veya repo eksik' }

  const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/next.config.ts`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }
  })
  if (!getRes.ok) return { ok: false, error: 'next.config.ts alınamadı' }
  const { sha } = await getRes.json()

  const redirectLines = redirectler.map(r =>
    `    { source: '${r.eski_url}', destination: '${r.yeni_url}', permanent: true },`
  ).join('\n')

  const yeniIcerik = `import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ]
  },
  async redirects() {
    return [
${redirectLines}
    ]
  },
}
export default nextConfig
`

  const pushRes = await fetch(`https://api.github.com/repos/${repo}/contents/next.config.ts`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'chore: redirectler güncellendi (admin panel)',
      content: Buffer.from(yeniIcerik).toString('base64'),
      sha,
    })
  })

  if (!pushRes.ok) {
    const err = await pushRes.json()
    return { ok: false, error: err.message || 'Push başarısız' }
  }
  return { ok: true }
}

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = createServerClient()
  const { data, error } = await db.from('site_redirects').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = createServerClient()
  const { eski_url, yeni_url } = await req.json()

  if (!eski_url || !yeni_url) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  if (!eski_url.startsWith('/')) return NextResponse.json({ error: 'Eski URL / ile başlamalı' }, { status: 400 })
  if (!yeni_url.startsWith('/')) return NextResponse.json({ error: 'Yeni URL / ile başlamalı' }, { status: 400 })

  const { error } = await db.from('site_redirects').upsert({ eski_url, yeni_url, aktif: true }, { onConflict: 'eski_url' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: tumRedirektler } = await db.from('site_redirects').select('eski_url,yeni_url').eq('aktif', true)
  const sonuc = await nextConfigGuncelle(tumRedirektler || [])
  return NextResponse.json({ ok: true, deploy: sonuc })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = createServerClient()
  const { id } = await req.json()

  const { error } = await db.from('site_redirects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: tumRedirektler } = await db.from('site_redirects').select('eski_url,yeni_url').eq('aktif', true)
  const sonuc = await nextConfigGuncelle(tumRedirektler || [])
  return NextResponse.json({ ok: true, deploy: sonuc })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })

  const db = createServerClient()
  const { id, aktif, eski_url, yeni_url } = await req.json()

  const guncelleme: any = {}
  if (aktif !== undefined) guncelleme.aktif = aktif
  if (eski_url) guncelleme.eski_url = eski_url
  if (yeni_url) guncelleme.yeni_url = yeni_url

  const { error } = await db.from('site_redirects').update(guncelleme).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: tumRedirektler } = await db.from('site_redirects').select('eski_url,yeni_url').eq('aktif', true)
  const sonuc = await nextConfigGuncelle(tumRedirektler || [])
  return NextResponse.json({ ok: true, deploy: sonuc })
}
