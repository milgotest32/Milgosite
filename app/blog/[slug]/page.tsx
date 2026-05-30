import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock, Share2, Tag } from 'lucide-react'
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const db = createServerClient()
  const { data } = await db.from('site_blog_yazilar')
    .select('baslik,ozet,seo_title,seo_description,gorsel_url,created_at,updated_at,etiketler')
    .eq('slug', slug).single()
  if (!data) return { title: 'Blog Yazısı Bulunamadı' }

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr'
  const title = data.seo_title || data.baslik
  const description = data.seo_description || data.ozet
  const image = data.gorsel_url || `${base}/icons/og-image.png`

  return {
    title,
    description,
    keywords: data.etiketler?.join(', '),
    alternates: { canonical: `${base}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${base}/blog/${slug}`,
      siteName: 'milgo.',
      type: 'article',
      publishedTime: data.created_at,
      modifiedTime: data.updated_at,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function BlogDetayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = createServerClient()
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://milgo.com.tr'

  const { data: yazi } = await db.from('site_blog_yazilar')
    .select('*,site_blog_kategoriler(name,slug),site_users(ad,soyad)')
    .eq('slug', slug).single()

  if (!yazi || yazi.durum !== 'yayinda') notFound()

  // İlgili yazılar - aynı kategori
  const { data: ilgili } = await db.from('site_blog_yazilar')
    .select('id,baslik,slug,gorsel_url,ozet,created_at,okuma_suresi')
    .eq('durum', 'yayinda')
    .eq('kategori_id', yazi.kategori_id)
    .neq('id', yazi.id)
    .limit(3)

  const kat = (yazi as any).site_blog_kategoriler
  const yazar = (yazi as any).site_users

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: yazi.baslik,
    description: yazi.ozet,
    image: yazi.gorsel_url || `${base}/icons/og-image.png`,
    datePublished: yazi.created_at,
    dateModified: yazi.updated_at || yazi.created_at,
    author: yazar ? {
      '@type': 'Person',
      name: `${yazar.ad} ${yazar.soyad}`.trim() || 'Milgo',
    } : { '@type': 'Organization', name: 'Milgo' },
    publisher: {
      '@type': 'Organization',
      name: 'Milgo',
      logo: { '@type': 'ImageObject', url: `${base}/icons/icon-192.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${base}/blog/${slug}` },
    keywords: yazi.etiketler?.join(', '),
    ...(kat ? { articleSection: kat.name } : {}),
  }

  const paylasSayfaUrl = `${base}/blog/${slug}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ minHeight: '100vh', background: '#F0EEF8', padding: '32px 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9CA3AF', marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Ana Sayfa</Link><ChevronRight size={12} />
            <Link href="/blog" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Blog</Link><ChevronRight size={12} />
            {kat && <><Link href={`/blog?kategori=${kat.slug}`} style={{ color: '#9CA3AF', textDecoration: 'none' }}>{kat.name}</Link><ChevronRight size={12} /></>}
            <span style={{ color: '#1C1B2E' }}>{yazi.baslik}</span>
          </nav>

          <article>
            <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #F0ECF5' }}>
              {yazi.gorsel_url && (
                <img src={yazi.gorsel_url} alt={yazi.baslik} width={760} height={400}
                  style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ padding: '36px' }}>
                {kat && (
                  <Link href={`/blog?kategori=${kat.slug}`} style={{ fontSize: '10px', fontWeight: 700, background: '#FEF0F4', color: '#E07090', padding: '4px 12px', borderRadius: '50px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {kat.name}
                  </Link>
                )}

                <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: '32px', color: '#1C1B2E', margin: '16px 0 12px', lineHeight: 1.2 }}>
                  {yazi.baslik}
                </h1>

                {yazi.ozet && (
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>
                    {yazi.ozet}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #F0ECF5' }}>
                  {yazar && <span>✍️ {yazar.ad} {yazar.soyad}</span>}
                  <time dateTime={yazi.created_at}>
                    {new Date(yazi.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  {yazi.okuma_suresi && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />{yazi.okuma_suresi} dk okuma
                    </span>
                  )}
                </div>

                {/* İçerik */}
                {yazi.icerik && (
                  <div className="blog-icerik" style={{ fontSize: '15px', lineHeight: '1.9', color: '#374151' }}
                    dangerouslySetInnerHTML={{
                      __html: yazi.icerik
                        .replace(/<script[\s\S]*?<\/script>/gi, '')
                        .replace(/on\w+="[^"]*"/gi, '')
                        .replace(/javascript:/gi, '')
                    }}
                  />
                )}

                {/* Etiketler */}
                {yazi.etiketler?.length > 0 && (
                  <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F0ECF5', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <Tag size={14} color="#9CA3AF" />
                    {yazi.etiketler.map((e: string) => (
                      <Link key={e} href={`/blog?etiket=${encodeURIComponent(e)}`}
                        style={{ fontSize: '12px', background: '#F0EEF8', color: '#7A6070', padding: '4px 12px', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
                        #{e}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Paylaş */}
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #F0ECF5', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}><Share2 size={14} /> Paylaş:</span>
                  <a href={`https://wa.me/?text=${encodeURIComponent(yazi.baslik + ' ' + paylasSayfaUrl)}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '12px', background: '#25D366', color: '#fff', padding: '6px 14px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
                    WhatsApp
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(yazi.baslik)}&url=${encodeURIComponent(paylasSayfaUrl)}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '12px', background: '#1DA1F2', color: '#fff', padding: '6px 14px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* İlgili Yazılar */}
          {ilgili && ilgili.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: '22px', color: '#1C1B2E', marginBottom: '20px' }}>İlgili Yazılar</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '16px' }}>
                {ilgili.map((y: any) => (
                  <Link key={y.id} href={`/blog/${y.slug}`}
                    style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', textDecoration: 'none', border: '1px solid #F0ECF5', display: 'block' }}>
                    {y.gorsel_url && <img src={y.gorsel_url} alt={y.baslik} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />}
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: '15px', color: '#1C1B2E', marginBottom: '6px', lineHeight: 1.3 }}>{y.baslik}</h3>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={10} />{y.okuma_suresi} dk
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Geri dön */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: '#1C1B2E', border: '1px solid #F0ECF5', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              ← Tüm Yazılar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
