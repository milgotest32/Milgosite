'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, Users, ShoppingBag, TrendingUp, Eye, Check, X } from 'lucide-react'
export const dynamic = 'force-dynamic'
export default function AdminPage() {
  const [stats, setStats] = useState({ siparisler: 0, urunler: 0, musteriler: 0, gelir: 0 })
  const [siparisler, setSiparisler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([
      supabase.from('site_siparisler').select('*', { count: 'exact' }),
      supabase.from('site_urunler').select('*', { count: 'exact' }),
      supabase.from('site_siparisler').select('toplam').eq('odeme_durumu', 'odendi'),
    ]).then(([sip, urun, gelir]) => {
      const toplamGelir = (gelir.data || []).reduce((t: number, s: any) => t + (s.toplam || 0), 0)
      setStats({ siparisler: sip.count || 0, urunler: urun.count || 0, musteriler: 0, gelir: toplamGelir })
    })
    supabase.from('site_siparisler').select('*, site_siparis_kalemleri(*)').order('created_at', { ascending: false }).limit(10)
      .then(({ data }: any) => { setSiparisler(data || []); setLoading(false) })
  }, [])
  const durumGuncelle = async (id: string, durum: string) => {
    await supabase.from('site_siparisler').update({ durum }).eq('id', id)
    setSiparisler(prev => prev.map(s => s.id === id ? {...s, durum} : s))
  }
  const DURUM_RENK: Record<string, string> = { bekliyor: 'badge-mavi', kargoda: 'badge-pembe', teslim: 'bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full', iptal: 'bg-red-50 text-red-500 text-[11px] font-semibold px-2.5 py-1 rounded-full' }
  return (
    <div className="min-h-screen bg-lav">
      {/* Admin nav */}
      <div className="bg-metin text-white px-6 py-3.5 flex items-center justify-between">
        <div className="font-display text-xl">milgo. <span className="text-pembe text-[14px] font-sans font-normal">Admin</span></div>
        <div className="flex gap-4 text-[13px] text-white/70">
          <a href="/admin" className="hover:text-white">Dashboard</a>
          <a href="/admin/urunler" className="hover:text-white">Ürünler</a>
          <a href="/" className="hover:text-white">Siteye Git →</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h1 className="font-display text-2xl text-metin mb-6">Dashboard</h1>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{icon:<ShoppingBag size={20}/>, baslik:'Toplam Sipariş', deger:stats.siparisler, renk:'bg-pembe-acik text-pembe-koy'},{icon:<Package size={20}/>, baslik:'Ürün Sayısı', deger:stats.urunler, renk:'bg-mavi-acik text-mavi-koy'},{icon:<Users size={20}/>, baslik:'Müşteri', deger:stats.musteriler, renk:'bg-green-50 text-green-600'},{icon:<TrendingUp size={20}/>, baslik:'Toplam Gelir', deger:`₺${stats.gelir.toLocaleString('tr')}`, renk:'bg-yellow-50 text-yellow-600'}].map(item => (
            <div key={item.baslik} className="card p-5">
              <div className={`w-10 h-10 ${item.renk} rounded-xl flex items-center justify-center mb-3`}>{item.icon}</div>
              <div className="text-[24px] font-bold text-metin font-display">{item.deger}</div>
              <div className="text-[12px] text-metin-2">{item.baslik}</div>
            </div>
          ))}
        </div>
        {/* Siparişler */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-sinir flex items-center justify-between">
            <h2 className="font-semibold text-metin text-[16px]">Son Siparişler</h2>
          </div>
          {loading ? <div className="p-8 text-center text-metin-2">Yükleniyor...</div> : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-lav text-[11px] uppercase tracking-wide text-metin-2">{['Sipariş No','Müşteri','Tutar','Ürün','Durum','İşlem'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {siparisler.map((s, i) => (
                    <tr key={s.id} className={`border-t border-sinir hover:bg-lav transition-colors ${i%2===0?'':'bg-white'}`}>
                      <td className="px-5 py-4 text-[12px] font-mono text-metin">#{s.id.slice(0,8).toUpperCase()}</td>
                      <td className="px-5 py-4"><div className="text-[13px] font-medium text-metin">{s.musteri_ad || s.musteri_email}</div><div className="text-[11px] text-metin-2">{s.musteri_email}</div></td>
                      <td className="px-5 py-4 text-[14px] font-bold text-metin">₺{s.toplam?.toFixed(2)}</td>
                      <td className="px-5 py-4 text-[12px] text-metin-2">{s.site_siparis_kalemleri?.length || 0} ürün</td>
                      <td className="px-5 py-4"><span className={DURUM_RENK[s.durum] || 'badge-mavi'}>{s.durum}</span></td>
                      <td className="px-5 py-4">
                        <select value={s.durum} onChange={e => durumGuncelle(s.id, e.target.value)} className="text-[12px] bg-lav border border-sinir rounded-lg px-2 py-1.5 outline-none">
                          {['bekliyor','kargoda','teslim','iptal'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
