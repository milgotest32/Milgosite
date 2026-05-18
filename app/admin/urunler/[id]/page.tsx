'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

export default function UrunDuzenle() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [form, setForm] = useState<any>({})
  const [secilenBolgeler, setSecilenBolgeler] = useState<string[]>([])

  useEffect(() => {
    supabase.from('site_kategoriler').select('id,name').eq('aktif',true).then(({data})=>setKategoriler(data||[]))
    supabase.from('site_hizmet_bolgeleri').select('id,name,renk').eq('aktif',true).then(({data})=>setBolgeler(data||[]))
    supabase.from('site_products').select('*, site_product_images(*)').eq('id', id as string).single().then(({data}) => {
      if (data) {
        setForm(data)
        setSecilenBolgeler(data.bolge_ids || [])
      }
      setLoading(false)
    })
  }, [id])

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  const bolgeToggle = (bid: string) => {
    setSecilenBolgeler(prev => prev.includes(bid) ? prev.filter(b=>b!==bid) : [...prev, bid])
  }

  const kaydet = async () => {
    setSaving(true)
    const { error } = await supabase.from('site_products').update({
      name: form.name, slug: form.slug, aciklama: form.aciklama,
      fiyat: parseFloat(form.fiyat), eski_fiyat: form.eski_fiyat ? parseFloat(form.eski_fiyat) : null,
      stok: parseInt(form.stok), durum: form.durum, featured: form.featured,
      yeni: form.yeni, indirimli: form.indirimli, kategori_id: form.kategori_id || null,
      seo_title: form.seo_title, seo_description: form.seo_description,
      bolge_ids: secilenBolgeler,
      updated_at: new Date().toISOString()
    }).eq('id', id as string)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success('Ürün güncellendi!')
    setSaving(false)
  }

  const inp = (label: string, k: string, type='text') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}</label>
      <input type={type} value={form[k]||''} onChange={e=>set(k,e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
    </div>
  )

  if (loading) return <div style={{padding:'48px',textAlign:'center',color:'#9CA3AF'}}>Yükleniyor...</div>

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/admin/urunler" style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',color:'#6B7280'}}><ArrowLeft size={16}/></Link>
          <h1 style={{fontSize:'20px',fontWeight:700,color:'#1C1B2E'}}>{form.name}</h1>
        </div>
        <button onClick={kaydet} disabled={saving} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Save size={15}/>{saving?'Kaydediliyor...':'Kaydet'}
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'16px'}}>
        <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px',display:'flex',flexDirection:'column',gap:'14px'}}>
          {inp('Ürün Adı','name')}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {inp('Slug','slug')}
            {inp('SKU','sku')}
          </div>
          <div>
            <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Açıklama</label>
            <textarea value={form.aciklama||''} onChange={e=>set('aciklama',e.target.value)} rows={4} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
            {inp('Fiyat','fiyat','number')}
            {inp('Eski Fiyat','eski_fiyat','number')}
            {inp('Stok','stok','number')}
          </div>
          {inp('SEO Başlık','seo_title')}
          <div>
            <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>SEO Açıklama</label>
            <textarea value={form.seo_description||''} onChange={e=>set('seo_description',e.target.value)} rows={2} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none'}}/>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Durum</h3>
            <select value={form.durum||'active'} onChange={e=>set('durum',e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit',marginBottom:'10px'}}>
              <option value="active">Aktif</option><option value="draft">Taslak</option><option value="archived">Arşiv</option>
            </select>
            {[['featured','Öne Çıkan'],['yeni','Yeni'],['indirimli','İndirimli']].map(([k,l])=>(
              <label key={k} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#6B7280',marginBottom:'6px',cursor:'pointer'}}>
                <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{cursor:'pointer'}}/> {l}
              </label>
            ))}
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Kategori</h3>
            <select value={form.kategori_id||''} onChange={e=>set('kategori_id',e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',outline:'none',fontFamily:'inherit'}}>
              <option value="">Seçin</option>
              {kategoriler.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </div>

          {/* Hizmet Bölgeleri */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
              <MapPin size={14} style={{color:'#E07090'}}/>
              <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E'}}>Hizmet Bölgeleri</h3>
            </div>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginBottom:'10px'}}>Seçilmezse tüm bölgelere gösterilir.</p>
            {bolgeler.length === 0 ? (
              <p style={{fontSize:'12px',color:'#9CA3AF'}}>Henüz bölge tanımlanmamış.</p>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                {bolgeler.map(b => {
                  const secili = secilenBolgeler.includes(b.id)
                  return (
                    <label key={b.id} onClick={()=>bolgeToggle(b.id)} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'10px',border:`1.5px solid ${secili ? b.renk : '#F0ECF5'}`,background:secili ? b.renk+'15' : '#F8F7FC',cursor:'pointer',transition:'all .15s'}}>
                      <div style={{width:'10px',height:'10px',borderRadius:'50%',background:b.renk,flexShrink:0}}/>
                      <span style={{fontSize:'13px',fontWeight:secili?700:400,color:secili?'#1C1B2E':'#6B7280',flex:1}}>{b.name}</span>
                      <input type="checkbox" checked={secili} onChange={()=>bolgeToggle(b.id)} style={{cursor:'pointer'}}/>
                    </label>
                  )
                })}
              </div>
            )}
            {secilenBolgeler.length > 0 && (
              <div style={{marginTop:'10px',padding:'8px 12px',background:'#EBF7FC',borderRadius:'8px',fontSize:'11px',color:'#3B9FCC'}}>
                ✅ {secilenBolgeler.length} bölge seçili
              </div>
            )}
          </div>

          {form.site_product_images?.length > 0 && (
            <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
              <h3 style={{fontSize:'14px',fontWeight:700,color:'#1C1B2E',marginBottom:'12px'}}>Görseller</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {form.site_product_images.map((g: any) => <img key={g.id} src={g.url} alt="" style={{width:'100%',aspectRatio:'1',objectFit:'contain',borderRadius:'8px',border:'1px solid #F0ECF5',padding:'4px'}}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
