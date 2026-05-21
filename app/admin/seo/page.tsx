'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function SeoPage() {
  const [ayarlar, setAyarlar] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('site_ayarlar').select('anahtar,deger').eq('grup', 'seo').then(({ data }) => {
      const a: Record<string, string> = {}
      data?.forEach((item: any) => { a[item.anahtar] = item.deger || '' })
      setAyarlar(a)
      setLoading(false)
    })
  }, [])

  const get = (k: string) => ayarlar[k] || ''
  const set = (k: string, v: string) => setAyarlar(a => ({ ...a, [k]: v }))

  const kaydet = async () => {
    setSaving(true)
    for (const [anahtar, deger] of Object.entries(ayarlar)) {
      await supabase.from('site_ayarlar').upsert({ grup: 'seo', anahtar, deger }, { onConflict: 'grup,anahtar' })
    }
    toast.success('SEO ayarları kaydedildi!')
    setSaving(false)
  }

  const inp = (label: string, k: string, placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{label}</label>
      <input value={get(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
    </div>
  )

  const textarea = (label: string, k: string, placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>{label}</label>
      <textarea value={get(k)} onChange={e => set(k, e.target.value)} placeholder={placeholder} rows={3}
        style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#1C1B2E', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' as const }} />
    </div>
  )

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#9CA3AF' }}>Yükleniyor...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>SEO Ayarları</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Arama motoru optimizasyonu</p>
        </div>
        <button onClick={kaydet} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#E07090,#3B9FCC)', color: '#fff', padding: '10px 24px', borderRadius: '50px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Save size={15} />{saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={15} style={{ color: '#E07090' }} />Genel</h2>
          {inp('Site Adı', 'site_adi', 'milgo.')}
          {inp('Varsayılan Sayfa Başlığı', 'default_title', 'milgo. — Mutluluğun Tadı')}
          {textarea('Varsayılan Meta Açıklama', 'default_description', 'Çiftliğimizden sofranıza...')}
          {inp('Anahtar Kelimeler', 'default_keywords', 'çiğ süt, doğal süt, çiftlik ürünleri...')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>Open Graph</h2>
            {inp('OG Başlık', 'og_title', 'milgo. — Mutluluğun Tadı')}
            {textarea('OG Açıklama', 'og_description')}
            {inp('OG Görsel URL', 'og_image', 'https://.../og.jpg')}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px' }}>Doğrulama Kodları</h2>
            {inp('Google Search Console', 'google_verification')}
            {inp('Google Analytics ID', 'ga_id', 'G-XXXXXXXXXX')}
            {inp('Facebook Pixel ID', 'fb_pixel_id')}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '4px', display:'flex',alignItems:'center',gap:'8px' }}>🤖 robots.txt</h2>
            <div style={{ background: '#EBF7FC', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#1C1B2E' }}>
              robots.txt arama motorlarına hangi sayfaların indeksleneceğini söyler. Boş bırakılırsa varsayılan ayarlar kullanılır.
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>robots.txt İçeriği</label>
              <textarea value={get('robots_txt')} onChange={e => set('robots_txt', e.target.value)} rows={8}
                placeholder={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /hesabim\n\nSitemap: https://milgo.com.tr/sitemap.xml`}
                style={{ width: '100%', background: '#F8F7FC', border: '1px solid #F0ECF5', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#1C1B2E', outline: 'none', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
              <a href="/robots.txt" target="_blank" style={{ fontSize: '12px', color: '#3B9FCC', textDecoration: 'none', fontWeight: 600 }}>📄 robots.txt görüntüle →</a>
              <a href="/sitemap.xml" target="_blank" style={{ fontSize: '12px', color: '#3B9FCC', textDecoration: 'none', fontWeight: 600 }}>🗺️ sitemap.xml görüntüle →</a>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', marginBottom: '12px' }}>Hızlı Kontrol</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['Site Adı', get('site_adi') || '❌ Eksik'],
                ['Meta Açıklama', get('default_description') ? `✅ ${get('default_description').slice(0,40)}...` : '❌ Eksik'],
                ['OG Görsel', get('og_image') ? '✅ Var' : '⚠️ Eksik'],
                ['GA ID', get('ga_id') ? '✅ Var' : '⚠️ Eklenmemiş'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #F0ECF5' }}>
                  <span style={{ color: '#6B7280' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#1C1B2E' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
