'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Package } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function SiparislerimPage() {
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const router = useRouter()
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      const user = data.session.user
      // musteri_id VEYA email ile eşleşen siparişleri getir
      const { data: sip } = await supabase
        .from('site_siparisler')
        .select('*, site_siparis_kalemleri(*)')
        .or(`musteri_id.eq.${user.id},musteri_email.eq.${user.email}`)
        .order('created_at', { ascending: false })
      setSiparisler(sip || [])
      setYukleniyor(false)
    })
  }, [router])
  const DURUM: Record<string, string> = { bekliyor: 'Hazırlanıyor', onaylandi: 'Onaylandı', kargoda: 'Kuryede', kuryede: 'Kuryede', teslim: 'Teslim Edildi', iptal: 'İptal' }
  const DURUM_RENK: Record<string, { bg: string; color: string }> = {
    bekliyor:   { bg: '#FEF3C7', color: '#F59E0B' },
    onaylandi:  { bg: '#EBF7FC', color: '#3B9FCC' },
    kargoda:    { bg: '#F5F3FF', color: '#8B5CF6' },
    kuryede:    { bg: '#F5F3FF', color: '#8B5CF6' },
    teslim:     { bg: '#F0FDF4', color: '#22C55E' },
    iptal:      { bg: '#FEF2F2', color: '#EF4444' },
  }
  if (yukleniyor) return (
    <div className="min-h-screen bg-lav flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-pembe-koy border-t-transparent animate-spin" />
    </div>
  )
  return (
    <div className="min-h-screen bg-lav py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/hesabim" className="flex items-center gap-2 text-[13px] text-metin-2 hover:text-pembe-koy mb-6 transition-colors">
          <ArrowLeft size={14} /> Hesabıma Dön
        </Link>
        <h1 className="font-display text-2xl text-metin mb-6">Siparişlerim</h1>
        {siparisler.length === 0 ? (
          <div className="card p-12 text-center">
            <Package size={48} className="text-sinir mx-auto mb-4" />
            <p className="text-[15px] font-semibold text-metin mb-2">Henüz sipariş yok</p>
            <p className="text-[13px] text-metin-2 mb-6">İlk siparişinizi vermek ister misiniz?</p>
            <Link href="/urunler" className="btn-primary px-8 py-3 inline-block">Alışverişe Başla</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {siparisler.map(s => {
              const durum = s.durum || 'bekliyor'
              const renk = DURUM_RENK[durum] || { bg: '#F8F7FC', color: '#9CA3AF' }
              return (
                <div key={s.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[12px] text-metin-2">Sipariş No</div>
                      <div className="text-[13px] font-semibold text-metin font-mono">#{s.siparis_no}</div>
                    </div>
                    <span style={{ background: renk.bg, color: renk.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px' }}>
                      {DURUM[durum] || durum}
                    </span>
                  </div>
                  <div className="text-[12px] text-metin-2 mb-3">
                    {new Date(s.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="border-t border-sinir pt-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-metin-2">{s.site_siparis_kalemleri?.length || 0} ürün</span>
                      <span style={{ fontSize: '11px', color: '#6B7280', background: '#F8F7FC', padding: '2px 8px', borderRadius: '6px' }}>
                        {s.odeme_yontemi === 'kapida' ? '🚪 Kapıda' : s.odeme_yontemi === 'havale' ? '🏦 Havale' : '💳 Kart'}
                      </span>
                    </div>
                    <span className="text-[15px] font-bold text-metin">₺{s.toplam?.toFixed(2)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
