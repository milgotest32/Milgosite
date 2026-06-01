'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetch } from '@/lib/adminFetch'
import { ShoppingBag, Package, Users, TrendingUp, ArrowUpRight, Clock, RefreshCw, AlertCircle, Star } from 'lucide-react'
export const dynamic = 'force-dynamic'

const S = {
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px' } as React.CSSProperties,
}

const DURUM_RENK: Record<string, string> = {
  bekliyor: '#F59E0B', onaylandi: '#3B9FCC', kargoda: '#8B5CF6',
  kuryede: '#8B5CF6', teslim: '#22C55E', iptal: '#EF4444',
}
const DURUM_AD: Record<string, string> = {
  bekliyor: 'Bekliyor', onaylandi: 'Onaylandı', kargoda: 'Kargoda',
  kuryede: 'Kuryede', teslim: 'Teslim', iptal: 'İptal',
}

export default function AdminPage() {
  const [stats, setStats] = useState<any>({
    siparis_sayisi: 0, urun_sayisi: 0, musteri_sayisi: 0,
    toplam_gelir: 0, bugun_ciro: 0, hafta_gelir: 0,
    bekleyen_siparis: 0, bugun_siparis: 0, aktif_abonelik: 0,
    son_siparisler: [], dusuk_stok: [], en_cok_satanlar: [],
    aktif_sepetler: [], sepet_ozet: { toplam: 0, urun_bekleyen: 0, musteri_sayisi: 0 },
  })
  const [loading, setLoading] = useState(true)

  const yukle = () => {
    setLoading(true)
    adminFetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (!d.error) setStats(d); else console.error('Stats error:', d.error) })
      .finally(() => setLoading(false))


  }

  useEffect(() => { yukle() }, [])

  const fmt = (n: number) => `₺${n.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`
  const tarih = (s: string) => new Date(s).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      {/* Başlık */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1C1B2E', marginBottom: '2px' }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>{new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={yukle} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0ECF5', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, color: '#7A6070', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Yenile
        </button>
      </div>

      {/* Bugünkü ciro — büyük banner */}
      <div style={{ background: 'linear-gradient(135deg,#E8567A,#3B9FCC)', borderRadius: '20px', padding: '24px 28px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '6px' }}>Bugünkü Ciro</div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: '#fff', fontFamily: '"Playfair Display",serif', lineHeight: 1 }}>{fmt(stats.bugun_ciro)}</div>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{stats.bugun_siparis}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Bugün Sipariş</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{stats.bekleyen_siparis}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Bekleyen</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{fmt(stats.hafta_gelir)}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Bu Hafta</div>
          </div>
        </div>
      </div>

      {/* 5 ana stat kartı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '20px' }}>
        {[
          { icon: <ShoppingBag size={18} />, label: 'Toplam Sipariş', value: stats.siparis_sayisi, renk: '#FEF0F4', ic: '#E8567A', href: '/admin/siparisler' },
          { icon: <TrendingUp size={18} />, label: 'Toplam Gelir', value: fmt(stats.toplam_gelir), renk: '#F0FDF4', ic: '#22C55E', href: null },
          { icon: <Package size={18} />, label: 'Aktif Ürün', value: stats.urun_sayisi, renk: '#EBF7FC', ic: '#3B9FCC', href: '/admin/urunler' },
          { icon: <Users size={18} />, label: 'Müşteri', value: stats.musteri_sayisi, renk: '#FAF5FF', ic: '#8B5CF6', href: '/admin/musteriler' },
          { icon: <RefreshCw size={18} />, label: 'Aktif Abonelik', value: stats.aktif_abonelik, renk: '#FFF7ED', ic: '#F59E0B', href: '/admin/abonelikler' },
        ].map(item => (
          <div key={item.label} style={{ ...S.card, cursor: item.href ? 'pointer' : 'default' }}
            onClick={() => item.href && (window.location.href = item.href)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '38px', height: '38px', background: item.renk, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.ic }}>{item.icon}</div>
              {item.href && <ArrowUpRight size={14} style={{ color: '#D1D5DB' }} />}
            </div>
            <div style={{ marginTop: '12px', fontSize: '26px', fontWeight: 800, color: '#1C1B2E', fontFamily: '"Playfair Display",serif' }}>{loading ? '—' : item.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* 3 kolon: son siparişler | en çok satanlar | düşük stok */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>

        {/* Son Siparişler */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>Son Siparişler</h2>
            <Link href="/admin/siparisler" style={{ fontSize: '12px', color: '#E8567A', textDecoration: 'none', fontWeight: 600 }}>Tümü →</Link>
          </div>
          {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(stats.son_siparisler || []).map((s: any) => (
                <Link key={s.id} href={`/admin/siparisler/${s.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8F7FC', borderRadius: '10px', textDecoration: 'none' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#1C1B2E', fontFamily: 'monospace' }}>#{s.siparis_no}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                      {s.musteri_ad || s.musteri_email}
                    </div>
                    <div style={{ fontSize: '10px', color: '#C4B5CC' }}>{tarih(s.created_at)}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>₺{Number(s.toplam).toFixed(0)}</div>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px', background: (DURUM_RENK[s.durum] || '#9CA3AF') + '20', color: DURUM_RENK[s.durum] || '#9CA3AF' }}>
                      {DURUM_AD[s.durum] || s.durum}
                    </span>
                  </div>
                </Link>
              ))}
              {(stats.son_siparisler || []).length === 0 && <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Henüz sipariş yok</p>}
            </div>
          )}
        </div>

        {/* En Çok Satanlar */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>En Çok Satanlar</h2>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Son 30 gün</span>
          </div>
          {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats.en_cok_satanlar || []).map((u: any, i: number) => {
                const maxAdet = stats.en_cok_satanlar?.[0]?.toplam_adet || 1
                const pay = Math.round((u.toplam_adet / maxAdet) * 100)
                return (
                  <div key={u.urun_ad}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: i === 0 ? '#E8567A' : '#9CA3AF', minWidth: '16px' }}>#{i + 1}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>{u.urun_ad}</span>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1B2E' }}>{u.toplam_adet} adet</span>
                      </div>
                    </div>
                    <div style={{ height: '4px', background: '#F0ECF5', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${pay}%`, background: i === 0 ? '#E8567A' : '#C4B5CC', borderRadius: '2px', transition: 'width .6s' }} />
                    </div>
                  </div>
                )
              })}
              {(stats.en_cok_satanlar || []).length === 0 && <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Henüz satış verisi yok</p>}
            </div>
          )}
        </div>

        {/* Düşük Stok */}
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E', margin: 0 }}>⚠️ Düşük Stok</h2>
            <Link href="/admin/urunler" style={{ fontSize: '12px', color: '#E8567A', textDecoration: 'none', fontWeight: 600 }}>Yönet →</Link>
          </div>
          {loading ? <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Yükleniyor...</p>
            : (stats.dusuk_stok || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>✅</div>
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Tüm stoklar yeterli</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(stats.dusuk_stok || []).map((u: any) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#FEF2F2', borderRadius: '10px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{u.name}</div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: u.stok === 0 ? '#fff' : '#EF4444', background: u.stok === 0 ? '#EF4444' : '#FEE2E2', padding: '2px 10px', borderRadius: '50px', flexShrink: 0 }}>
                      {u.stok === 0 ? 'Tükendi' : `${u.stok} adet`}
                    </span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Sepet İstatistikleri */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #F0ECF5', padding: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1C1B2E' }}>🛒 Aktif Sepetler</h2>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Hangi müşteri sepete ne attı</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#FEE8EF', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#E07090' }}>{stats.sepet_ozet?.toplam || 0}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Sepet</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#EBF7FC', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#3B9FCC' }}>{stats.sepet_ozet?.urun_bekleyen || 0}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Ürün</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 16px', background: '#F0FDF4', borderRadius: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#22c55e' }}>{stats.sepet_ozet?.musteri_sayisi || 0}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Üye</div>
            </div>
          </div>
        </div>
        {(stats.aktif_sepetler || []).length === 0 ? (
          <p style={{ color: '#9CA3AF', fontSize: '13px', fontStyle: 'italic' }}>Aktif sepet yok.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {(stats.aktif_sepetler || []).map((s: any) => {
              const kalemleri = s.site_sepet_kalemleri || []
              const toplam = kalemleri.reduce((t: number, k: any) => t + (k.fiyat * k.adet), 0)
              const saat = Math.round((Date.now() - new Date(s.updated_at).getTime()) / 1000 / 60 / 60)
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8F7FC', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: s.user_id ? '#FEE8EF' : '#F0ECF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                      {s.user_id ? '👤' : '👻'}
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1B2E' }}>
                        {(s.site_users ? `${s.site_users.ad || ''} ${s.site_users.soyad || ''}`.trim() || 'İsimsiz' : 'Misafir')}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF' }}>
                        {kalemleri.map((k: any) => k.urun_ad).join(', ').substring(0, 50)}{kalemleri.length > 2 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#1C1B2E' }}>₺{toplam.toFixed(2)}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF' }}>{saat}s önce · {kalemleri.length} ürün</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Hızlı linkler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '10px', marginTop: '20px' }}>
        {[
          { label: '📦 Siparişler', href: '/admin/siparisler' },
          { label: '💬 Yorumlar', href: '/admin/yorumlar' },
          { label: '✉️ Mesajlar', href: '/admin/mesajlar' },
          { label: '🛒 Sepetler', href: '/admin/sepetler' },
          { label: '🗺 Bölge Raporu', href: '/admin/raporlar/bolgeler' },
          { label: '🔁 Abonelikler', href: '/admin/abonelikler' },
          { label: '🎟 Kuponlar', href: '/admin/kuponlar' },
        ].map(l => (
          <Link key={l.href} href={l.href}
            style={{ background: '#fff', border: '1px solid #F0ECF5', borderRadius: '12px', padding: '12px 14px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, color: '#1C1B2E', textAlign: 'center', display: 'block' }}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
