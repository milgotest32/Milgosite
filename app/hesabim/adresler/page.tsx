'use client'
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Plus, MapPin, Trash2, Check, Pencil, X } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const BOŞ_FORM = {goster:false,duzenleId:'',baslik:'Ev',ad:'',soyad:'',telefon:'',adres:'',ilce:'',sehir:'İstanbul',posta_kodu:'',varsayilan:false}

export default function AdreslerPage() {
  const [adresler, setAdresler] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BOŞ_FORM)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const yukle = async (uid: string) => {
    const { data } = await supabase.from('site_adresler').select('*').eq('user_id', uid).order('varsayilan', { ascending: false })
    setAdresler(data || [])
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/giris'); return }
      setUser(data.session.user)
      await yukle(data.session.user.id)
      setLoading(false)
    })
  }, [router])

  const kaydet = async () => {
    if (!form.ad || !form.adres) { toast.error('Ad ve adres zorunludur'); return }
    setSaving(true)

    // Eğer varsayılan seçildiyse diğerlerini sıfırla
    if (form.varsayilan) {
      await supabase.from('site_adresler').update({ varsayilan: false }).eq('user_id', user.id)
    }

    if (form.duzenleId) {
      // Düzenleme
      await supabase.from('site_adresler').update({
        baslik: form.baslik, ad: form.ad, soyad: form.soyad, telefon: form.telefon,
        adres: form.adres, ilce: form.ilce, sehir: form.sehir,
        posta_kodu: form.posta_kodu, varsayilan: form.varsayilan
      }).eq('id', form.duzenleId)
      toast.success('Adres güncellendi')
    } else {
      // Yeni ekle
      await supabase.from('site_adresler').insert({
        user_id: user.id, baslik: form.baslik, ad: form.ad, soyad: form.soyad,
        telefon: form.telefon, adres: form.adres, ilce: form.ilce,
        sehir: form.sehir, posta_kodu: form.posta_kodu, varsayilan: form.varsayilan
      })
      toast.success('Adres eklendi')
    }

    setForm(BOŞ_FORM)
    await yukle(user.id)
    setSaving(false)
  }

  const sil = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return
    await supabase.from('site_adresler').delete().eq('id', id)
    toast.success('Adres silindi')
    await yukle(user.id)
  }

  const varsayilanYap = async (id: string) => {
    await supabase.from('site_adresler').update({ varsayilan: false }).eq('user_id', user.id)
    await supabase.from('site_adresler').update({ varsayilan: true }).eq('id', id)
    toast.success('Varsayılan adres güncellendi')
    await yukle(user.id)
  }

  const duzenlemeAc = (a: any) => {
    setForm({
      goster: true, duzenleId: a.id,
      baslik: a.baslik || 'Ev', ad: a.ad || '', soyad: a.soyad || '',
      telefon: a.telefon || '', adres: a.adres || '', ilce: a.ilce || '',
      sehir: a.sehir || 'İstanbul', posta_kodu: a.posta_kodu || '',
      varsayilan: a.varsayilan || false
    })
  }

  const inp = (l: string, k: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display:'block', fontSize:'11px', fontWeight:700, textTransform:'uppercase', color:'#6B7280', marginBottom:'5px' }}>{l}</label>
      <input type={type} value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={placeholder}
        style={{ width:'100%', background:'#F8F7FC', border:'1px solid #F0ECF5', borderRadius:'10px', padding:'10px 14px', fontSize:'13px', color:'#1C1B2E', outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#F0EEF8', padding:'32px 24px' }}>
      <div style={{ maxWidth:'700px', margin:'0 auto' }}>
        <Link href="/hesabim" style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#9CA3AF', textDecoration:'none', marginBottom:'24px' }}>
          <ArrowLeft size={14} />Hesabıma Dön
        </Link>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
          <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:'28px', color:'#1C1B2E', margin:0 }}>Adreslerim</h1>
          {!form.goster && (
            <button onClick={() => setForm({ ...BOŞ_FORM, goster: true })}
              style={{ display:'flex', alignItems:'center', gap:'6px', background:'linear-gradient(135deg,#E07090,#3B9FCC)', color:'#fff', padding:'10px 18px', borderRadius:'50px', border:'none', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              <Plus size={14} />Adres Ekle
            </button>
          )}
        </div>

        {/* Form */}
        {form.goster && (
          <div style={{ background:'#fff', borderRadius:'20px', padding:'24px', border:'2px solid #F4A7B9', marginBottom:'16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'#1C1B2E', margin:0 }}>
                {form.duzenleId ? '✏️ Adresi Düzenle' : '+ Yeni Adres'}
              </h2>
              <button onClick={() => setForm(BOŞ_FORM)} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
              {inp('Başlık', 'baslik', 'text', 'Ev, İş...')}
              {inp('Ad *', 'ad', 'text', 'Adınız')}
              {inp('Soyad', 'soyad', 'text', 'Soyadınız')}
              {inp('Telefon', 'telefon', 'tel', '0532 xxx xx xx')}
            </div>
            <div style={{ marginBottom:'12px' }}>{inp('Adres *', 'adres', 'text', 'Sokak, mahalle, bina no')}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', marginBottom:'12px' }}>
              {inp('İlçe', 'ilce', 'text', 'Beşiktaş')}
              {inp('Şehir', 'sehir', 'text', 'İstanbul')}
              {inp('Posta Kodu', 'posta_kodu', 'text', '34000')}
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#6B7280', marginBottom:'20px', cursor:'pointer' }}>
              <input type="checkbox" checked={form.varsayilan} onChange={e => setForm({ ...form, varsayilan: e.target.checked })} style={{ cursor:'pointer' }} />
              Varsayılan adres olarak ayarla
            </label>
            <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
              <button onClick={() => setForm(BOŞ_FORM)}
                style={{ padding:'10px 20px', background:'#F8F7FC', border:'1px solid #F0ECF5', borderRadius:'50px', fontSize:'13px', color:'#6B7280', cursor:'pointer', fontFamily:'inherit' }}>
                İptal
              </button>
              <button onClick={kaydet} disabled={saving}
                style={{ padding:'10px 20px', background:'linear-gradient(135deg,#E07090,#3B9FCC)', color:'#fff', border:'none', borderRadius:'50px', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {saving ? 'Kaydediliyor...' : form.duzenleId ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}

        {/* Adres listesi */}
        {loading ? (
          <p style={{ color:'#9CA3AF' }}>Yükleniyor...</p>
        ) : adresler.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:'20px', padding:'48px', textAlign:'center', border:'1px solid #F0ECF5' }}>
            <MapPin size={40} style={{ color:'#F4A7B9', margin:'0 auto 12px', display:'block' }} />
            <p style={{ color:'#9CA3AF', fontSize:'14px', marginBottom:'16px' }}>Kayıtlı adresiniz yok</p>
            <button onClick={() => setForm({ ...BOŞ_FORM, goster: true })}
              style={{ background:'linear-gradient(135deg,#E07090,#3B9FCC)', color:'#fff', border:'none', borderRadius:'50px', padding:'10px 24px', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              İlk Adresini Ekle
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {adresler.map(a => (
              <div key={a.id} style={{ background:'#fff', borderRadius:'20px', padding:'20px', border:`2px solid ${a.varsayilan ? '#F4A7B9' : '#F0ECF5'}`, transition:'border-color 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                      <MapPin size={14} style={{ color:'#E07090', flexShrink:0 }} />
                      <span style={{ fontSize:'14px', fontWeight:700, color:'#1C1B2E' }}>{a.baslik}</span>
                      {a.varsayilan && (
                        <span style={{ fontSize:'10px', fontWeight:700, background:'#FEF0F4', color:'#E07090', padding:'2px 8px', borderRadius:'50px', display:'flex', alignItems:'center', gap:'3px' }}>
                          <Check size={9} />Varsayılan
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize:'13px', fontWeight:600, color:'#1C1B2E', margin:'0 0 2px' }}>{a.ad} {a.soyad}</p>
                    <p style={{ fontSize:'13px', color:'#6B7280', margin:'0 0 2px' }}>{a.adres}</p>
                    <p style={{ fontSize:'13px', color:'#6B7280', margin:'0 0 2px' }}>{a.ilce && `${a.ilce} / `}{a.sehir} {a.posta_kodu}</p>
                    {a.telefon && <p style={{ fontSize:'13px', color:'#6B7280', margin:0 }}>{a.telefon}</p>}
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexShrink:0, marginLeft:'12px' }}>
                    {!a.varsayilan && (
                      <button onClick={() => varsayilanYap(a.id)} title="Varsayılan yap"
                        style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#F0FDF4', border:'none', color:'#22C55E', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Check size={13} />
                      </button>
                    )}
                    <button onClick={() => duzenlemeAc(a)} title="Düzenle"
                      style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#EBF7FC', border:'none', color:'#3B9FCC', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => sil(a.id)} title="Sil"
                      style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#FEF2F2', border:'none', color:'#EF4444', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
