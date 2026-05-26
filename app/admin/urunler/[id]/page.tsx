'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, MapPin, Plus, Trash2, Upload, Star, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

interface MevcutGorsel {
  id: string
  url: string
  ana: boolean
  sira: number
}

interface YeniGorsel {
  dosya: File
  preview: string
  ana: boolean
}

export default function UrunDuzenle() {
  const { id } = useParams()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gorselYukleniyor, setGorselYukleniyor] = useState(false)
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [form, setForm] = useState<any>({})
  const [mevcutGorseller, setMevcutGorseller] = useState<MevcutGorsel[]>([])
  const [yeniGorseller, setYeniGorseller] = useState<YeniGorsel[]>([])
  const [secilenBolgeler, setSecilenBolgeler] = useState<string[]>([])
  const [ozellikler, setOzellikler] = useState<{key: string; value: string}[]>([])

  const urunYukle = async () => {
    const { data } = await supabase.from('site_products').select('*, site_product_images(*)').eq('id', id as string).single()
    if (data) {
      setForm(data)
      setSecilenBolgeler(data.bolge_ids || [])
      setMevcutGorseller((data.site_product_images || []).sort((a: any, b: any) => a.sira - b.sira))
      if (data.ozellikler && typeof data.ozellikler === 'object' && !Array.isArray(data.ozellikler)) {
        setOzellikler(Object.entries(data.ozellikler).map(([key, value]) => ({ key, value: String(value) })))
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.from('site_kategoriler').select('id,name').eq('aktif',true).then(({data})=>setKategoriler(data||[]))
    supabase.from('site_hizmet_bolgeleri').select('id,name,renk').eq('aktif',true).then(({data})=>setBolgeler(data||[]))
    urunYukle()
  }, [id])

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))
  const bolgeToggle = (bid: string) => setSecilenBolgeler(prev => prev.includes(bid) ? prev.filter(b=>b!==bid) : [...prev, bid])
  const ozellikEkle = () => setOzellikler(prev => [...prev, { key: '', value: '' }])
  const ozellikSil = (i: number) => setOzellikler(prev => prev.filter((_, idx) => idx !== i))
  const ozellikSet = (i: number, field: 'key'|'value', val: string) =>
    setOzellikler(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o))

  const dosyaEkle = (files: FileList | null) => {
    if (!files?.length) return
    const hepsiBos = mevcutGorseller.length === 0 && yeniGorseller.length === 0
    const yeni: YeniGorsel[] = Array.from(files).map((dosya, i) => ({
      dosya,
      preview: URL.createObjectURL(dosya),
      ana: hepsiBos && i === 0
    }))
    setYeniGorseller(prev => [...prev, ...yeni])
  }

  const yeniGorselSil = (i: number) => {
    setYeniGorseller(prev => prev.filter((_, idx) => idx !== i))
  }

  const mevcutGorselSil = async (gorsel: MevcutGorsel) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return
    if (gorsel.url?.includes('site-medya')) {
      // URL'den storage path'ini çıkar: .../object/public/site-medya/PATH → PATH
      const match = gorsel.url.match(/site-medya\/(.+)/)
      if (match) await supabase.storage.from('site-medya').remove([match[1]])
    }
    await supabase.from('site_product_images').delete().eq('id', gorsel.id)
    // Silinen ana görselse başka birini ana yap
    const kalan = mevcutGorseller.filter(g => g.id !== gorsel.id)
    if (gorsel.ana && kalan.length > 0) {
      await supabase.from('site_product_images').update({ ana: true }).eq('id', kalan[0].id)
      kalan[0].ana = true
    }
    setMevcutGorseller(kalan)
    toast.success('Görsel silindi')
  }

  const mevcutAnaYap = async (gorsel: MevcutGorsel) => {
    await supabase.from('site_product_images').update({ ana: false }).eq('product_id', id as string)
    await supabase.from('site_product_images').update({ ana: true }).eq('id', gorsel.id)
    setMevcutGorseller(prev => prev.map(g => ({ ...g, ana: g.id === gorsel.id })))
    toast.success('Ana görsel güncellendi')
  }

  const yeniAnaYap = (i: number) => {
    // Tüm mevcut görsellerin ana'sını kaldır
    setMevcutGorseller(prev => prev.map(g => ({ ...g, ana: false })))
    setYeniGorseller(prev => prev.map((g, idx) => ({ ...g, ana: idx === i })))
  }

  const gorsellerYukle = async () => {
    if (!yeniGorseller.length) return
    setGorselYukleniyor(true)
    const mevcutSira = mevcutGorseller.length
    for (let i = 0; i < yeniGorseller.length; i++) {
      const g = yeniGorseller[i]
      const ext = g.dosya.name.split('.').pop()
      const yol = `urunler/${id}/${Date.now()}-${i}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('site-medya').upload(yol, g.dosya, { upsert: false })
      if (uploadErr) { toast.error(`Görsel yüklenemedi: ${g.dosya.name}`); continue }
      const { data: { publicUrl } } = supabase.storage.from('site-medya').getPublicUrl(yol)
      // Eğer yeni görsel ana olacaksa önce diğerlerini sıfırla
      if (g.ana) {
        await supabase.from('site_product_images').update({ ana: false }).eq('product_id', id as string)
      }
      await supabase.from('site_product_images').insert({ product_id: id, url: publicUrl, sira: mevcutSira + i, ana: g.ana })
    }
    toast.success(`${yeniGorseller.length} görsel yüklendi`)
    setYeniGorseller([])
    setGorselYukleniyor(false)
    urunYukle()
  }

  const kaydet = async () => {
    setSaving(true)
    const ozelliklerObj = ozellikler.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key.trim()] = value
      return acc
    }, {} as Record<string, string>)

    const { error } = await supabase.from('site_products').update({
      name: form.name, slug: form.slug, aciklama: form.aciklama,
      fiyat: parseFloat(form.fiyat), eski_fiyat: form.eski_fiyat ? parseFloat(form.eski_fiyat) : null,
      stok: parseInt(form.stok), durum: form.durum, featured: form.featured,
      yeni: form.yeni, indirimli: form.indirimli, kategori_id: form.kategori_id || null,
      seo_title: form.seo_title, seo_description: form.seo_description,
      bolge_ids: secilenBolgeler,
      ozellikler: Object.keys(ozelliklerObj).length > 0 ? ozelliklerObj : null,
      updated_at: new Date().toISOString()
    }).eq('id', id as string)
    if (error) { toast.error(error.message); setSaving(false); return }

    // Bekleyen yeni görseller varsa yükle
    if (yeniGorseller.length > 0) await gorsellerYukle()

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
        <button onClick={kaydet} disabled={saving||gorselYukleniyor} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Save size={15}/>{saving?'Kaydediliyor...':'Kaydet'}
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'16px'}}>
        {/* Sol */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
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

            <div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
                <label style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',color:'#6B7280'}}>Ürün Özellikleri</label>
                <button onClick={ozellikEkle} style={{display:'flex',alignItems:'center',gap:'4px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'8px',padding:'5px 12px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                  <Plus size={12}/> Özellik Ekle
                </button>
              </div>
              {ozellikler.length === 0 ? (
                <p style={{fontSize:'12px',color:'#9CA3AF',fontStyle:'italic'}}>
                  Henüz özellik eklenmedi.<br/>
                  <span style={{fontSize:'11px'}}>Örnek: Yağ Oranı → %4.5 | Hacim → 1 Litre</span>
                </p>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {ozellikler.map((o, i) => (
                    <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'8px',alignItems:'center'}}>
                      <input placeholder="Özellik adı" value={o.key} onChange={e=>ozellikSet(i,'key',e.target.value)}
                        style={{background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                      <input placeholder="Değer" value={o.value} onChange={e=>ozellikSet(i,'value',e.target.value)}
                        style={{background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                      <button onClick={()=>ozellikSil(i)} style={{width:'32px',height:'32px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444',flexShrink:0}}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* GÖRSEL YÖNETİMİ */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
              <div>
                <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'2px'}}>Ürün Görselleri</h2>
                <p style={{fontSize:'12px',color:'#9CA3AF'}}>⭐ Ana görsel · 🗑️ Sil · Yeni ekleyip Kaydet'e basın</p>
              </div>
              <button onClick={()=>fileRef.current?.click()} style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                <Upload size={13}/>Görsel Ekle
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>dosyaEkle(e.target.files)}/>

            {mevcutGorseller.length === 0 && yeniGorseller.length === 0 ? (
              <div onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();dosyaEkle(e.dataTransfer.files)}}
                style={{border:'2px dashed #E8E4F0',borderRadius:'12px',padding:'32px',textAlign:'center',cursor:'pointer',background:'#FAFAF9'}}>
                <ImageIcon size={32} style={{color:'#D1D5DB',margin:'0 auto 8px',display:'block'}}/>
                <p style={{fontSize:'13px',fontWeight:600,color:'#6B7280',marginBottom:'4px'}}>Görsel sürükleyin veya tıklayın</p>
                <p style={{fontSize:'11px',color:'#9CA3AF'}}>PNG, JPG, WebP desteklenir</p>
              </div>
            ) : (
              <div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:'10px'}}>
                  {/* Mevcut görseller */}
                  {mevcutGorseller.map((g) => (
                    <div key={g.id} style={{position:'relative',borderRadius:'12px',border:`2px solid ${g.ana?'#E07090':'#F0ECF5'}`,overflow:'hidden',background:'#F8F7FC',aspectRatio:'1'}}>
                      <img src={g.url} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}
                        onError={(e:any)=>e.target.style.opacity='0.3'}/>
                      <div style={{position:'absolute',top:'4px',right:'4px',display:'flex',gap:'3px'}}>
                        <button onClick={()=>mevcutAnaYap(g)} title="Ana görsel yap" style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:g.ana?'#E07090':'rgba(0,0,0,0.45)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Star size={11} fill={g.ana?'#fff':'none'}/>
                        </button>
                        <button onClick={()=>mevcutGorselSil(g)} style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:'rgba(0,0,0,0.45)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Trash2 size={11}/>
                        </button>
                      </div>
                      {g.ana && <div style={{position:'absolute',bottom:'4px',left:'4px',background:'#E07090',color:'#fff',fontSize:'9px',fontWeight:700,padding:'2px 6px',borderRadius:'4px'}}>ANA</div>}
                    </div>
                  ))}

                  {/* Yeni (henüz yüklenmemiş) görseller */}
                  {yeniGorseller.map((g, i) => (
                    <div key={`yeni-${i}`} style={{position:'relative',borderRadius:'12px',border:`2px dashed ${g.ana?'#E07090':'#3B9FCC'}`,overflow:'hidden',background:'#EBF7FC',aspectRatio:'1'}}>
                      <img src={g.preview} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/>
                      <div style={{position:'absolute',top:'4px',right:'4px',display:'flex',gap:'3px'}}>
                        <button onClick={()=>yeniAnaYap(i)} title="Ana görsel yap" style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:g.ana?'#E07090':'rgba(0,0,0,0.45)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Star size={11} fill={g.ana?'#fff':'none'}/>
                        </button>
                        <button onClick={()=>yeniGorselSil(i)} style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:'rgba(0,0,0,0.45)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <X size={11}/>
                        </button>
                      </div>
                      <div style={{position:'absolute',bottom:'4px',left:'4px',background:'#3B9FCC',color:'#fff',fontSize:'9px',fontWeight:700,padding:'2px 6px',borderRadius:'4px'}}>YENİ</div>
                    </div>
                  ))}

                  {/* Ekle butonu */}
                  <div onClick={()=>fileRef.current?.click()} style={{border:'2px dashed #E8E4F0',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:'1',cursor:'pointer',background:'#FAFAF9',flexDirection:'column',gap:'4px'}}>
                    <Plus size={20} style={{color:'#D1D5DB'}}/>
                    <span style={{fontSize:'10px',color:'#9CA3AF'}}>Ekle</span>
                  </div>
                </div>

                {yeniGorseller.length > 0 && (
                  <div style={{marginTop:'12px',padding:'10px 14px',background:'#EBF7FC',borderRadius:'10px',fontSize:'12px',color:'#3B9FCC',display:'flex',alignItems:'center',gap:'8px'}}>
                    <Upload size={14}/>
                    <span><strong>{yeniGorseller.length} yeni görsel</strong> hazır — Kaydet'e basıldığında yüklenecek</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sağ */}
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
        </div>
      </div>
    </div>
  )
}
