'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowRight, Clock, Search } from 'lucide-react'
export const dynamic = 'force-dynamic'

export default function BlogClient() {
  const [yazilar, setYazilar] = useState<any[]>([])
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const aktifKat = searchParams.get('kategori') || ''
  const aktifEtiket = searchParams.get('etiket') || ''
  const aramaQ = searchParams.get('q') || ''
  const [arama, setArama] = useState(aramaQ)

  const yukle = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('site_blog_yazilar')
      .select('*,site_blog_kategoriler(name,slug)')
      .eq('durum', 'yayinda')
      .order('created_at', { ascending: false })
      .limit(30)

    if (aktifKat) q = q.eq('site_blog_kategoriler.slug', aktifKat) as any
    if (aktifEtiket) q = q.contains('etiketler', [aktifEtiket]) as any
    if (aramaQ) q = q.ilike('baslik', `%${aramaQ}%`) as any

    const { data } = await q
    setYazilar(data || [])
    setLoading(false)
  }, [aktifKat, aktifEtiket, aramaQ])

  useEffect(() => {
    supabase.from('site_blog_kategoriler').select('name,slug').then(({ data }) => setKategoriler(data || []))
    yukle()
  }, [yukle])

  const aramaYap = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams(searchParams.toString())
    if (arama) p.set('q', arama); else p.delete('q')
    router.push(`/blog?${p.toString()}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F0EEF8' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#FEF0F4,#EBF7FC)', padding: '48px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '40px', color: '#1C1B2E', marginBottom: '8px' }}>Blog & Tarifler</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '24px' }}>Güncel haberler, sağlıklı tarifler ve çiftlik hikayeleri</p>

        {/* Arama */}
        <form onSubmit={aramaYap} style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
          <input
            value={arama} onChange={e => setArama(e.target.value)}
            placeholder="Yazı ara..." type="search"
            style={{ flex: 1, padding: '10px 16px', borderRadius: '50px', border: '1px solid #F0ECF5', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
          />
          <button type="submit" style={{ background: '#E8567A', color: '#fff', border: 'none', borderRadius: '50px', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit' }}>
            <Search size={14} /> Ara
          </button>
        </form>
      </div>

      {/* Kategori filtreleri */}
      {kategoriler.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', padding: '20px 24px', overflowX: 'auto', maxWidth: '1100px', margin: '0 auto' }}>
          <Link href="/blog"
            style={{ flexShrink: 0, padding: '6px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', background: !aktifKat ? '#E8567A' : '#fff', color: !aktifKat ? '#fff' : '#7A6070', border: '1px solid #F0ECF5' }}>
            Tümü
          </Link>
          {kategoriler.map(k => (
            <Link key={k.slug} href={`/blog?kategori=${k.slug}`}
              style={{ flexShrink: 0, padding: '6px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', background: aktifKat === k.slug ? '#E8567A' : '#fff', color: aktifKat === k.slug ? '#fff' : '#7A6070', border: '1px solid #F0ECF5' }}>
              {k.name}
            </Link>
          ))}
        </div>
      )}

      {/* Aktif filtre bilgisi */}
      {(aktifEtiket || aramaQ) && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 16px', fontSize: '13px', color: '#9CA3AF' }}>
          {aktifEtiket && <span>#{aktifEtiket} etiketi · </span>}
          {aramaQ && <span>"{aramaQ}" araması · </span>}
          <Link href="/blog" style={{ color: '#E8567A', textDecoration: 'none', fontWeight: 600 }}>Temizle</Link>
        </div>
      )}

      {/* Yazılar */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 48px' }}>
        {loading ? (
          <p style={{ color: '#9CA3AF' }}>Yükleniyor...</p>
        ) : yazilar.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '24px', padding: '64px', textAlign: 'center', border: '1px solid #F0ECF5' }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Yazı bulunamadı</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '20px' }}>
            {yazilar.map(y => (
              <article key={y.id}>
                <Link href={`/blog/${y.slug}`}
                  style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', border: '1px solid #F0ECF5', display: 'block', boxShadow: '0 2px 12px rgba(224,112,144,0.06)' }}>
                  {y.gorsel_url && (
                    <img src={y.gorsel_url} alt={y.baslik} width={400} height={220}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '20px' }}>
                    {y.site_blog_kategoriler && (
                      <span style={{ fontSize: '10px', fontWeight: 700, background: '#FEF0F4', color: '#E07090', padding: '3px 10px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {y.site_blog_kategoriler.name}
                      </span>
                    )}
                    <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '20px', color: '#1C1B2E', margin: '10px 0 8px', lineHeight: 1.3 }}>{y.baslik}</h2>
                    <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {y.ozet}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#9CA3AF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <time dateTime={y.created_at}>{new Date(y.created_at).toLocaleDateString('tr-TR')}</time>
                        {y.okuma_suresi && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={10} />{y.okuma_suresi} dk</span>}
                      </div>
                      <span style={{ color: '#E07090', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>Oku <ArrowRight size={12} /></span>
                    </div>
                    {/* Etiketler */}
                    {y.etiketler?.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {y.etiketler.slice(0, 3).map((e: string) => (
                          <span key={e} style={{ fontSize: '10px', background: '#F0EEF8', color: '#7A6070', padding: '2px 8px', borderRadius: '50px' }}>#{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
