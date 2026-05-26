'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, X, Plus, MapPin, Trash2, Upload, Image as ImageIcon, Star } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const slugify = (t: string) => t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

interface Gorsel {
  dosya?: File
  preview: string
  ana: boolean
  yukleniyor?: boolean
}

export default function YeniUrunPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [markalar, setMarkalar] = useState<any[]>([])
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [gorseller, setGorseller] = useState<Gorsel[]>([])
  const [secilenBolgeler, setSecilenBolgeler] = useState<string[]>([])
  const [ozellikler, setOzellikler] = useState<{key: string; value: string}[]>([])
  const [form, setForm] = useState({
    name:'', slug:'', aciklama:'', icerik:'', kategori_id:'', marka_id:'',
    durum:'active', fiyat:'', eski_fiyat:'', sku:'', barkod:'',
    stok:'0', min_stok:'5', stok_takip:true, featured:false, yeni:false, indirimli:false,
    seo_title:'', seo_description:'', seo_keywords:'', etiketler:''
  })

  useEffect(() => {
    supabase.from('site_kategoriler').select('id,name').eq('aktif',true).then(({data})=>setKategoriler(data||[]))
    supabase.from('site_markalar').select('id,name').eq('aktif',true).then(({data})=>setMarkalar(data||[]))
    supabase.from('site_hizmet_bolgeleri').select('id,name,renk').eq('aktif',true).then(({data})=>setBolgeler(data||[]))
  }, [])

  const set = (k: string, v: any) => setForm(f=>({...f,[k]:v}))
  const bolgeToggle = (id: string) => setSecilenBolgeler(prev => prev.includes(id) ? prev.filter(b=>b!==id) : [...prev, id])
  const ozellikEkle = () => setOzellikler(prev => [...prev, { key: '', value: '' }])
  const ozellikSil = (i: number) => setOzellikler(prev => prev.filter((_, idx) => idx !== i))
  const ozellikSet = (i: number, field: 'key'|'value', val: string) =>
    setOzellikler(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o))

  const dosyaEkle = (files: FileList | null) => {
    if (!files?.length) return
    const yeniGorseller: Gorsel[] = Array.from(files).map((dosya, i) => ({
      dosya,
      preview: URL.createObjectURL(dosya),
      ana: gorseller.length === 0 && i === 0
    }))
    setGorseller(prev => {
      const liste = [...prev, ...yeniGorseller]
      if (!liste.some(g => g.ana) && liste.length > 0) liste[0].ana = true
      return liste
    })
  }

  const gorselSil = (i: number) => {
    setGorseller(prev => {
      const liste = prev.filter((_, idx) => idx !== i)
      if (liste.length > 0 && !liste.some(g => g.ana)) liste[0].ana = true
      return liste
    })
  }

  const anaYap = (i: number) => {
    setGorseller(prev => prev.map((g, idx) => ({ ...g, ana: idx === i })))
  }

  const kaydet = async () => {
    if (!form.name || !form.fiyat) { toast.error('Ad ve fiyat zorunludur'); return }
    setLoading(true)
    const ozelliklerObj = ozellikler.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key.trim()] = value
      return acc
    }, {} as Record<string, string>)
    const { data: urun, error } = await supabase.from('site_products').insert({
      name: form.name, slug: form.slug || slugify(form.name),
      aciklama: form.aciklama, icerik: form.icerik,
      kategori_id: form.kategori_id || null, marka_id: form.marka_id || null,
      durum: form.durum, fiyat: parseFloat(form.fiyat),
      eski_fiyat: form.eski_fiyat ? parseFloat(form.eski_fiyat) : null,
      sku: form.sku || null, barkod: form.barkod || null,
      stok: parseInt(form.stok), min_stok: parseInt(form.min_stok),
      stok_takip: form.stok_takip, featured: form.featured,
      yeni: form.yeni, indirimli: form.indirimli,
      seo_title: form.seo_title || form.name,
      seo_description: form.seo_description || form.aciklama,
      seo_keywords: form.seo_keywords,
      etiketler: form.etiketler ? form.etiketler.split(',').map(t=>t.trim()) : [],
      bolge_ids: secilenBolgeler,
      ozellikler: Object.keys(ozelliklerObj).length > 0 ? ozelliklerObj : null,
    }).select().single()

    if (error) { toast.error(error.message); setLoading(false); return }

    // Görselleri yükle
    if (gorseller.length > 0) {
      const gorselKayitlari = []
      for (let i = 0; i < gorseller.length; i++) {
        const g = gorseller[i]
        if (!g.dosya) continue
        const ext = g.dosya.name.split('.').pop()
        const yol = `urunler/${urun.id}/${Date.now()}-${i}.${ext}`
        const { error: uploadErr } = await supabase.storage.from('site-medya').upload(yol, g.dosya, { upsert: false })
        if (uploadErr) { toast.error(`Görsel yüklenemedi: ${g.dosya.name}`); continue }
        const { data: { publicUrl } } = supabase.storage.from('site-medya').getPublicUrl(yol)
        gorselKayitlari.push({ product_id: urun.id, url: publicUrl, sira: i, ana: g.ana })
      }
      if (gorselKayitlari.length > 0) {
        await supabase.from('site_product_images').insert(gorselKayitlari)
      }
    }

    toast.success('Ürün oluşturuldu!')
    router.push(`/admin/urunler/${urun.id}`)
    setLoading(false)
  }

  const inp = (label:string, k:string, type='text', placeholder='') => (
    <div>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>{label}</label>
      <input type={type} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
        style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <Link href="/admin/urunler" style={{width:'36px',height:'36px',background:'#fff',border:'1px solid #F0ECF5',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',color:'#6B7280'}}><ArrowLeft size={16}/></Link>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E'}}>Yeni Ürün</h1>
        </div>
        <button onClick={kaydet} disabled={loading} style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 24px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Save size={15}/>{loading?'Kaydediliyor...':'Kaydet'}
        </button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'16px',alignItems:'start'}}>
        {/* Sol */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px'}}>Temel Bilgiler</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {inp('Ürün Adı *','name','text','Örn: Milgo Çiğ Süt 2L')}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                {inp('Slug (URL)','slug','text','otomatik-olusturulur')}
                {inp('SKU','sku','text','MG-001')}
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Kısa Açıklama</label>
                <textarea value={form.aciklama} onChange={e=>set('aciklama',e.target.value)} rows={3} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Tam Açıklama</label>
                <textarea value={form.icerik} onChange={e=>set('icerik',e.target.value)} rows={5} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'14px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
              </div>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px'}}>Fiyat & Stok</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              {inp('Fiyat *','fiyat','number','0.00')}
              {inp('Eski Fiyat','eski_fiyat','number','0.00')}
              {inp('Stok Miktarı','stok','number','0')}
              {inp('Min. Stok Uyarısı','min_stok','number','5')}
              {inp('Barkod','barkod','text','')}
            </div>
            <div style={{marginTop:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
              <input type="checkbox" id="stok_takip" checked={form.stok_takip} onChange={e=>set('stok_takip',e.target.checked)} style={{cursor:'pointer'}}/>
              <label htmlFor="stok_takip" style={{fontSize:'13px',color:'#6B7280',cursor:'pointer'}}>Stok takibi aktif</label>
            </div>
          </div>

          {/* GÖRSEL YÜKLEME */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
              <div>
                <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'2px'}}>Ürün Görselleri</h2>
                <p style={{fontSize:'12px',color:'#9CA3AF'}}>PNG, JPG, WebP desteklenir. ⭐ ile ana görseli seçin.</p>
              </div>
              <button onClick={()=>fileRef.current?.click()} style={{display:'flex',alignItems:'center',gap:'6px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'10px',padding:'8px 16px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                <Upload size={13}/>Görsel Ekle
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>dosyaEkle(e.target.files)}/>

            {gorseller.length === 0 ? (
              <div onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();dosyaEkle(e.dataTransfer.files)}}
                style={{border:'2px dashed #E8E4F0',borderRadius:'12px',padding:'32px',textAlign:'center',cursor:'pointer',background:'#FAFAF9'}}>
                <ImageIcon size={32} style={{color:'#D1D5DB',margin:'0 auto 8px',display:'block'}}/>
                <p style={{fontSize:'13px',fontWeight:600,color:'#6B7280',marginBottom:'4px'}}>Görsel sürükleyin veya tıklayın</p>
                <p style={{fontSize:'11px',color:'#9CA3AF'}}>PNG, JPG, WebP · Birden fazla seçebilirsiniz</p>
              </div>
            ) : (
              <div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:'10px',marginBottom:'12px'}}>
                  {gorseller.map((g, i) => (
                    <div key={i} style={{position:'relative',borderRadius:'12px',border:`2px solid ${g.ana?'#E07090':'#F0ECF5'}`,overflow:'hidden',background:'#F8F7FC',aspectRatio:'1'}}>
                      <img src={g.preview} alt="" style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}}/>
                      <div style={{position:'absolute',top:'4px',right:'4px',display:'flex',gap:'3px'}}>
                        <button onClick={()=>anaYap(i)} title="Ana görsel yap" style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:g.ana?'#E07090':'rgba(0,0,0,0.4)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <Star size={11} fill={g.ana?'#fff':'none'}/>
                        </button>
                        <button onClick={()=>gorselSil(i)} style={{width:'22px',height:'22px',borderRadius:'6px',border:'none',background:'rgba(0,0,0,0.4)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <X size={11}/>
                        </button>
                      </div>
                      {g.ana && <div style={{position:'absolute',bottom:'4px',left:'4px',background:'#E07090',color:'#fff',fontSize:'9px',fontWeight:700,padding:'2px 6px',borderRadius:'4px'}}>ANA</div>}
                    </div>
                  ))}
                  <div onClick={()=>fileRef.current?.click()} style={{border:'2px dashed #E8E4F0',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',aspectRatio:'1',cursor:'pointer',background:'#FAFAF9',flexDirection:'column',gap:'4px'}}>
                    <Plus size={20} style={{color:'#D1D5DB'}}/>
                    <span style={{fontSize:'10px',color:'#9CA3AF'}}>Ekle</span>
                  </div>
                </div>
                <p style={{fontSize:'11px',color:'#9CA3AF'}}>⭐ tıklayarak ana görseli belirleyin. Ana görsel ürün listesinde görünür.</p>
              </div>
            )}
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
              <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>Ürün Özellikleri</h2>
              <button onClick={ozellikEkle} style={{display:'flex',alignItems:'center',gap:'4px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'8px',padding:'5px 12px',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                <Plus size={12}/> Ekle
              </button>
            </div>
            {ozellikler.length === 0 ? (
              <p style={{fontSize:'12px',color:'#9CA3AF',fontStyle:'italic'}}>
                Özellik yok. Ekle butonuna tıklayın.<br/>
                <span style={{fontSize:'11px'}}>Ör: Yağ Oranı → %4.5 · Hacim → 1 Litre</span>
              </p>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {ozellikler.map((o, i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'8px',alignItems:'center'}}>
                    <input placeholder="Özellik (ör: Yağ Oranı)" value={o.key} onChange={e=>ozellikSet(i,'key',e.target.value)}
                      style={{background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                    <input placeholder="Değer (ör: %4.5)" value={o.value} onChange={e=>ozellikSet(i,'value',e.target.value)}
                      style={{background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'8px 12px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                    <button onClick={()=>ozellikSil(i)} style={{width:'32px',height:'32px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#EF4444',flexShrink:0}}>
                      <Trash2 size={13}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'20px'}}>SEO</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {inp('SEO Başlık','seo_title')}
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>SEO Açıklama</label>
                <textarea value={form.seo_description} onChange={e=>set('seo_description',e.target.value)} rows={2} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',resize:'none'}}/>
              </div>
              {inp('Anahtar Kelimeler (virgülle)','seo_keywords','text','süt, taze süt, doğal...')}
              {inp('Etiketler (virgülle)','etiketler','text','organik, taze, doğal...')}
            </div>
          </div>
        </div>

        {/* Sağ */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Yayın Durumu</h2>
            <select value={form.durum} onChange={e=>set('durum',e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',marginBottom:'12px'}}>
              <option value="active">Aktif (Yayında)</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşiv</option>
            </select>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {[['featured','Öne Çıkan'],['yeni','Yeni'],['indirimli','İndirimli']].map(([k,l])=>(
                <label key={k} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#6B7280',cursor:'pointer'}}>
                  <input type="checkbox" checked={(form as any)[k]} onChange={e=>set(k,e.target.checked)} style={{cursor:'pointer'}}/> {l}
                </label>
              ))}
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Sınıflandırma</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Kategori</label>
                <select value={form.kategori_id} onChange={e=>set('kategori_id',e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}>
                  <option value="">Seçin</option>
                  {kategoriler.map(k=><option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'#6B7280',marginBottom:'6px'}}>Marka</label>
                <select value={form.marka_id} onChange={e=>set('marka_id',e.target.value)} style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}>
                  <option value="">Seçin</option>
                  {markalar.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <MapPin size={15} style={{color:'#E07090'}}/>
              <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>Hizmet Bölgeleri</h2>
            </div>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginBottom:'12px'}}>Seçilmezse tüm bölgelere gösterilir.</p>
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
