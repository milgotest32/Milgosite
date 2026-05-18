'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Save, X, Plus, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const slugify = (t: string) => t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

export default function YeniUrunPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [kategoriler, setKategoriler] = useState<any[]>([])
  const [markalar, setMarkalar] = useState<any[]>([])
  const [bolgeler, setBolgeler] = useState<any[]>([])
  const [gorseller, setGorseller] = useState<string[]>([''])
  const [secilenBolgeler, setSecilenBolgeler] = useState<string[]>([])
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

  const bolgeToggle = (id: string) => {
    setSecilenBolgeler(prev => prev.includes(id) ? prev.filter(b=>b!==id) : [...prev, id])
  }

  const kaydet = async () => {
    if (!form.name || !form.fiyat) { toast.error('Ad ve fiyat zorunludur'); return }
    setLoading(true)
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
      bolge_ids: secilenBolgeler
    }).select().single()

    if (error) { toast.error(error.message); setLoading(false); return }

    const gecerliGorseller = gorseller.filter(g=>g.trim())
    if (gecerliGorseller.length > 0) {
      await supabase.from('site_product_images').insert(
        gecerliGorseller.map((url,i)=>({ product_id:urun.id, url, sira:i, ana:i===0 }))
      )
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

          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'24px'}}>
            <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',marginBottom:'16px'}}>Ürün Görselleri</h2>
            <p style={{fontSize:'12px',color:'#9CA3AF',marginBottom:'16px'}}>Görsel URL'lerini girin. İlk görsel ana görsel olacak.</p>
            {gorseller.map((g,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
                <input value={g} onChange={e=>{const a=[...gorseller];a[i]=e.target.value;setGorseller(a)}} placeholder="https://..." style={{flex:1,background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                {i===0 && g && <img src={g} alt="" style={{width:'40px',height:'40px',borderRadius:'8px',objectFit:'contain',border:'1px solid #F0ECF5'}} onError={(e:any)=>e.target.style.display='none'}/>}
                {gorseller.length>1 && <button onClick={()=>setGorseller(gorseller.filter((_,j)=>j!==i))} style={{width:'36px',height:'36px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><X size={14}/></button>}
              </div>
            ))}
            <button onClick={()=>setGorseller([...gorseller,''])} style={{display:'flex',alignItems:'center',gap:'6px',background:'#F8F7FC',border:'1px dashed #F0ECF5',borderRadius:'10px',padding:'10px 16px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit',width:'100%',justifyContent:'center'}}>
              <Plus size={14}/>Görsel Ekle
            </button>
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

          {/* Hizmet Bölgeleri */}
          <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #F0ECF5',padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
              <MapPin size={15} style={{color:'#E07090'}}/>
              <h2 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E'}}>Hizmet Bölgeleri</h2>
            </div>
            <p style={{fontSize:'11px',color:'#9CA3AF',marginBottom:'12px'}}>
              Seçilmezse tüm bölgelere gösterilir.
            </p>
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
