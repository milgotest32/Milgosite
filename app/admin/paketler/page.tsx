'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Pencil, X, Save, Package, Search } from 'lucide-react'
import toast from 'react-hot-toast'
export const dynamic = 'force-dynamic'

const slugify = (t: string) => t.toLowerCase()
  .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
  .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

const BOŞ_FORM = { name:'', slug:'', aciklama:'', gorsel_url:'', fiyat:'', aktif:true, one_cikan:false }

const inp = (label: string, value: string, onChange: (v:string)=>void, props: any = {}) => (
  <div>
    <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase' as const,color:'#6B7280',marginBottom:'5px'}}>{label}</label>
    <input value={value} onChange={e=>onChange(e.target.value)} {...props}
      style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const,...props.style}}/>
  </div>
)

export default function PaketlerPage() {
  const [paketler, setPaketler] = useState<any[]>([])
  const [urunler, setUrunler] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BOŞ_FORM)
  const [formGoster, setFormGoster] = useState(false)
  const [duzenleId, setDuzenleId] = useState<string|null>(null)
  const [secilenUrunler, setSecilenUrunler] = useState<{id:string,adet:number,name:string,gorsel:string,fiyat:number}[]>([])
  const [urunArama, setUrunArama] = useState('')
  const [saving, setSaving] = useState(false)

  const yukle = useCallback(async () => {
    const { data: p } = await supabase.from('site_paketler').select('*, site_paket_urunleri(*, site_products(id,name,slug,fiyat,site_product_images(*)))').order('created_at', {ascending:false})
    setPaketler(p || [])
    const { data: u } = await supabase.from('site_products').select('id,name,slug,fiyat,site_product_images(*)').eq('durum','active').order('name')
    setUrunler(u || [])
    setLoading(false)
  }, [])

  useEffect(() => { yukle() }, [yukle])

  const duzenlemeAc = (p: any) => {
    setDuzenleId(p.id)
    setForm({ name:p.name, slug:p.slug, aciklama:p.aciklama||'', gorsel_url:p.gorsel_url||'', fiyat:String(p.fiyat), aktif:p.aktif, one_cikan:p.one_cikan })
    setSecilenUrunler((p.site_paket_urunleri||[]).map((k:any) => ({
      id: k.product_id, adet: k.adet,
      name: k.site_products?.name||'',
      gorsel: k.site_products?.site_product_images?.find((g:any)=>g.ana)?.url || k.site_products?.site_product_images?.[0]?.url || '',
      fiyat: k.site_products?.fiyat||0,
    })))
    setFormGoster(true)
  }

  const formKapat = () => { setFormGoster(false); setDuzenleId(null); setForm(BOŞ_FORM); setSecilenUrunler([]); setUrunArama('') }

  const urunEkle = (u: any) => {
    if (secilenUrunler.find(s=>s.id===u.id)) { toast.error('Bu ürün zaten eklendi'); return }
    setSecilenUrunler(prev => [...prev, {
      id: u.id, adet: 1, name: u.name,
      gorsel: u.site_product_images?.find((g:any)=>g.ana)?.url || u.site_product_images?.[0]?.url || '',
      fiyat: u.fiyat
    }])
  }

  const urunCikar = (id: string) => setSecilenUrunler(prev => prev.filter(u=>u.id!==id))
  const adetDegistir = (id: string, adet: number) => {
    if (adet < 1) return
    setSecilenUrunler(prev => prev.map(u=>u.id===id?{...u,adet}:u))
  }

  // Otomatik fiyat hesapla
  const otomFiyat = secilenUrunler.reduce((t,u)=>t+u.fiyat*u.adet,0)

  const kaydet = async () => {
    if (!form.name) { toast.error('Paket adı zorunludur'); return }
    if (secilenUrunler.length < 2) { toast.error('En az 2 ürün ekleyin'); return }
    if (!form.fiyat || isNaN(Number(form.fiyat))) { toast.error('Fiyat zorunludur'); return }
    setSaving(true)

    const slug = slugify(form.slug || form.name)

    if (duzenleId) {
      await supabase.from('site_paketler').update({ name:form.name, slug, aciklama:form.aciklama, gorsel_url:form.gorsel_url, fiyat:Number(form.fiyat), aktif:form.aktif, one_cikan:form.one_cikan, updated_at:new Date().toISOString() }).eq('id', duzenleId)
      await supabase.from('site_paket_urunleri').delete().eq('paket_id', duzenleId)
      await supabase.from('site_paket_urunleri').insert(secilenUrunler.map(u=>({ paket_id:duzenleId, product_id:u.id, adet:u.adet })))
      toast.success('Paket güncellendi')
    } else {
      const { data: yeni } = await supabase.from('site_paketler').insert({ name:form.name, slug, aciklama:form.aciklama, gorsel_url:form.gorsel_url, fiyat:Number(form.fiyat), aktif:form.aktif, one_cikan:form.one_cikan }).select().single()
      if (yeni) {
        await supabase.from('site_paket_urunleri').insert(secilenUrunler.map(u=>({ paket_id:yeni.id, product_id:u.id, adet:u.adet })))
      }
      toast.success('Paket oluşturuldu')
    }
    formKapat()
    await yukle()
    setSaving(false)
  }

  const sil = async (id: string, name: string) => {
    if (!confirm(`"${name}" paketini silmek istediğinizden emin misiniz?`)) return
    await supabase.from('site_paketler').delete().eq('id', id)
    toast.success('Paket silindi')
    yukle()
  }

  const toggleAktif = async (id: string, aktif: boolean) => {
    await supabase.from('site_paketler').update({ aktif }).eq('id', id)
    setPaketler(prev=>prev.map(p=>p.id===id?{...p,aktif}:p))
  }

  const filtreliUrunler = urunler.filter(u =>
    u.name.toLowerCase().includes(urunArama.toLowerCase()) &&
    !secilenUrunler.find(s=>s.id===u.id)
  )

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:700,color:'#1C1B2E',margin:0}}>Paketler</h1>
          <p style={{fontSize:'13px',color:'#9CA3AF',marginTop:'4px'}}>Birden fazla ürünü paket olarak satın</p>
        </div>
        <button onClick={()=>setFormGoster(true)}
          style={{display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',padding:'10px 20px',borderRadius:'50px',border:'none',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
          <Plus size={15}/>Paket Oluştur
        </button>
      </div>

      {/* Form Modal */}
      {formGoster && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'24px',overflowY:'auto'}}>
          <div style={{background:'#fff',borderRadius:'20px',padding:'28px',width:'100%',maxWidth:'100%',marginTop:'20px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
              <h2 style={{fontSize:'18px',fontWeight:700,color:'#1C1B2E',margin:0}}>{duzenleId?'Paketi Düzenle':'Yeni Paket'}</h2>
              <button onClick={formKapat} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF'}}><X size={20}/></button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
              {/* Sol: Paket bilgileri */}
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                <h3 style={{fontSize:'13px',fontWeight:700,color:'#6B7280',margin:0,textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Paket Bilgileri</h3>
                {inp('Paket Adı *', form.name, v=>setForm({...form,name:v,slug:form.slug||slugify(v)}), {placeholder:'Haftalık Süt Paketi'})}
                {inp('Slug', form.slug, v=>setForm({...form,slug:v}), {placeholder:'haftalik-sut-paketi'})}
                {inp('Açıklama', form.aciklama, v=>setForm({...form,aciklama:v}), {placeholder:'Paket içeriği ve faydaları...'})}
                {inp('Görsel URL', form.gorsel_url, v=>setForm({...form,gorsel_url:v}), {placeholder:'https://...'})}
                <div>
                  <label style={{display:'block',fontSize:'11px',fontWeight:700,textTransform:'uppercase' as const,color:'#6B7280',marginBottom:'5px'}}>Paket Fiyatı (₺) *</label>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <input type="number" value={form.fiyat} onChange={e=>setForm({...form,fiyat:e.target.value})}
                      style={{flex:1,background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'10px 14px',fontSize:'13px',color:'#1C1B2E',outline:'none',fontFamily:'inherit'}}/>
                    <button onClick={()=>setForm({...form,fiyat:String(otomFiyat.toFixed(2))})}
                      style={{background:'#F0FDF4',border:'none',borderRadius:'8px',padding:'10px 12px',fontSize:'11px',color:'#22C55E',fontWeight:700,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap' as const}}>
                      = ₺{otomFiyat.toFixed(2)}
                    </button>
                  </div>
                  {Number(form.fiyat) < otomFiyat && Number(form.fiyat) > 0 && (
                    <p style={{fontSize:'11px',color:'#22C55E',marginTop:'4px',fontWeight:600}}>
                      ✓ ₺{(otomFiyat-Number(form.fiyat)).toFixed(2)} tasarruf ({Math.round((1-Number(form.fiyat)/otomFiyat)*100)}% indirim)
                    </p>
                  )}
                </div>
                <div style={{display:'flex',gap:'16px'}}>
                  <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#6B7280',cursor:'pointer'}}>
                    <input type="checkbox" checked={form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked})}/>
                    Aktif
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:'#6B7280',cursor:'pointer'}}>
                    <input type="checkbox" checked={form.one_cikan} onChange={e=>setForm({...form,one_cikan:e.target.checked})}/>
                    Öne çıkan
                  </label>
                </div>
              </div>

              {/* Sağ: Ürün seçimi */}
              <div>
                <h3 style={{fontSize:'13px',fontWeight:700,color:'#6B7280',margin:'0 0 12px',textTransform:'uppercase' as const,letterSpacing:'0.1em'}}>Paketteki Ürünler</h3>

                {/* Seçili ürünler */}
                {secilenUrunler.length > 0 && (
                  <div style={{background:'#F8F7FC',borderRadius:'12px',padding:'12px',marginBottom:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
                    {secilenUrunler.map(u=>(
                      <div key={u.id} style={{display:'flex',alignItems:'center',gap:'8px',background:'#fff',borderRadius:'8px',padding:'8px'}}>
                        {u.gorsel ? <img src={u.gorsel} alt={u.name} style={{width:36,height:36,objectFit:'cover',borderRadius:'6px',flexShrink:0}}/> : <div style={{width:36,height:36,background:'#F0ECF5',borderRadius:'6px',flexShrink:0}}/>}
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:'12px',fontWeight:600,color:'#1C1B2E',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{u.name}</div>
                          <div style={{fontSize:'11px',color:'#9CA3AF'}}>₺{u.fiyat} × {u.adet} = ₺{(u.fiyat*u.adet).toFixed(2)}</div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:'4px',flexShrink:0}}>
                          <button onClick={()=>adetDegistir(u.id,u.adet-1)} style={{width:22,height:22,borderRadius:'50%',border:'1px solid #F0ECF5',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'#6B7280'}}>-</button>
                          <span style={{fontSize:'13px',fontWeight:700,minWidth:'16px',textAlign:'center' as const}}>{u.adet}</span>
                          <button onClick={()=>adetDegistir(u.id,u.adet+1)} style={{width:22,height:22,borderRadius:'50%',border:'1px solid #F0ECF5',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',color:'#6B7280'}}>+</button>
                          <button onClick={()=>urunCikar(u.id)} style={{width:22,height:22,borderRadius:'50%',border:'none',background:'#FEF2F2',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',marginLeft:'4px'}}>
                            <X size={10} color="#EF4444"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Ürün arama */}
                <div style={{position:'relative' as const,marginBottom:'8px'}}>
                  <Search size={13} style={{position:'absolute' as const,left:10,top:'50%',transform:'translateY(-50%)',color:'#9CA3AF'}}/>
                  <input value={urunArama} onChange={e=>setUrunArama(e.target.value)} placeholder="Ürün ara..."
                    style={{width:'100%',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'10px',padding:'8px 10px 8px 30px',fontSize:'12px',outline:'none',fontFamily:'inherit',boxSizing:'border-box' as const}}/>
                </div>
                <div style={{maxHeight:'180px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'4px'}}>
                  {filtreliUrunler.slice(0,20).map(u=>(
                    <button key={u.id} onClick={()=>urunEkle(u)}
                      style={{display:'flex',alignItems:'center',gap:'8px',background:'transparent',border:'1px solid #F0ECF5',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',textAlign:'left' as const,fontFamily:'inherit',transition:'background 0.15s',width:'100%'}}>
                      {u.site_product_images?.find((g:any)=>g.ana)?.url || u.site_product_images?.[0]?.url
                        ? <img src={u.site_product_images?.find((g:any)=>g.ana)?.url||u.site_product_images?.[0]?.url} alt={u.name} style={{width:28,height:28,objectFit:'cover',borderRadius:'4px',flexShrink:0}}/>
                        : <div style={{width:28,height:28,background:'#F0ECF5',borderRadius:'4px',flexShrink:0}}/>}
                      <span style={{fontSize:'12px',color:'#1C1B2E',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const}}>{u.name}</span>
                      <span style={{fontSize:'11px',color:'#9CA3AF',flexShrink:0}}>₺{u.fiyat}</span>
                      <Plus size={12} color="#9CA3AF"/>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',marginTop:'24px',paddingTop:'20px',borderTop:'1px solid #F0ECF5'}}>
              <button onClick={formKapat} style={{padding:'10px 20px',background:'#F8F7FC',border:'1px solid #F0ECF5',borderRadius:'50px',fontSize:'13px',color:'#6B7280',cursor:'pointer',fontFamily:'inherit'}}>İptal</button>
              <button onClick={kaydet} disabled={saving}
                style={{padding:'10px 24px',background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'6px'}}>
                <Save size={13}/>{saving?'Kaydediliyor...':duzenleId?'Güncelle':'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste */}
      {loading ? <p style={{color:'#9CA3AF'}}>Yükleniyor...</p> : paketler.length === 0 ? (
        <div style={{background:'#fff',borderRadius:'20px',border:'1px solid #F0ECF5',padding:'64px',textAlign:'center'}}>
          <Package size={48} style={{color:'#F0ECF5',margin:'0 auto 12px',display:'block'}}/>
          <p style={{color:'#9CA3AF',fontSize:'14px',marginBottom:'20px'}}>Henüz paket oluşturulmamış</p>
          <button onClick={()=>setFormGoster(true)} style={{background:'linear-gradient(135deg,#E07090,#3B9FCC)',color:'#fff',border:'none',borderRadius:'50px',padding:'12px 28px',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
            İlk Paketi Oluştur
          </button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'12px'}}>
          {paketler.map(p=>{
            const kalemler = p.site_paket_urunleri||[]
            const toplamFiyat = kalemler.reduce((t:number,k:any)=>t+(k.site_products?.fiyat||0)*k.adet,0)
            const tasarruf = toplamFiyat - p.fiyat
            return (
              <div key={p.id} style={{background:'#fff',borderRadius:'20px',border:`1px solid ${p.aktif?'#F4A7B9':'#F0ECF5'}`,padding:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                      <h3 style={{fontSize:'15px',fontWeight:700,color:'#1C1B2E',margin:0}}>{p.name}</h3>
                      {p.one_cikan && <span style={{fontSize:'9px',background:'#FEF3C7',color:'#D97706',padding:'2px 6px',borderRadius:'50px',fontWeight:700}}>ÖNCÜ</span>}
                    </div>
                    {p.aciklama && <p style={{fontSize:'12px',color:'#9CA3AF',margin:0}}>{p.aciklama}</p>}
                  </div>
                  <button onClick={()=>toggleAktif(p.id,!p.aktif)}
                    style={{padding:'3px 10px',borderRadius:'50px',border:'none',fontSize:'11px',fontWeight:700,cursor:'pointer',background:p.aktif?'#F0FDF4':'#FEF2F2',color:p.aktif?'#22C55E':'#EF4444',flexShrink:0}}>
                    {p.aktif?'Aktif':'Pasif'}
                  </button>
                </div>

                {/* Ürünler */}
                <div style={{background:'#F8F7FC',borderRadius:'10px',padding:'10px',marginBottom:'12px',display:'flex',flexDirection:'column',gap:'4px'}}>
                  {kalemler.map((k:any)=>(
                    <div key={k.id} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'#6B7280'}}>
                      <span>• {k.site_products?.name} ×{k.adet}</span>
                      <span>₺{((k.site_products?.fiyat||0)*k.adet).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Fiyat */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
                  <div>
                    <span style={{fontSize:'11px',color:'#9CA3AF',textDecoration:'line-through'}}>₺{toplamFiyat.toFixed(2)}</span>
                    <div style={{fontSize:'20px',fontWeight:800,color:'#1C1B2E'}}>₺{p.fiyat.toFixed(2)}</div>
                  </div>
                  {tasarruf > 0 && (
                    <span style={{background:'#F0FDF4',color:'#22C55E',fontSize:'12px',fontWeight:700,padding:'4px 10px',borderRadius:'50px'}}>
                      ₺{tasarruf.toFixed(2)} tasarruf
                    </span>
                  )}
                </div>

                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>duzenlemeAc(p)}
                    style={{flex:1,padding:'8px',background:'#EBF7FC',border:'none',borderRadius:'8px',color:'#3B9FCC',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'4px'}}>
                    <Pencil size={12}/>Düzenle
                  </button>
                  <button onClick={()=>sil(p.id,p.name)}
                    style={{width:'36px',padding:'8px',background:'#FEF2F2',border:'none',borderRadius:'8px',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
