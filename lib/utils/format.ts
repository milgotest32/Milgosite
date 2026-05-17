export const formatFiyat = (f: number) => `₺${f.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
export const formatTarih = (t: string) => new Date(t).toLocaleDateString('tr-TR', {day:'numeric',month:'long',year:'numeric'})
export const slugify = (t: string) => t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export const generateSiparisNo = () => 'MG' + new Date().toISOString().slice(0,10).replace(/-/g,'') + Math.floor(Math.random()*99999).toString().padStart(5,'0')
