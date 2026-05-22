import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'

async function getSmtpAyarlari(db: any) {
  const { data } = await db.from('site_ayarlar').select('anahtar,deger').eq('grup', 'mail')
  const ayarlar: Record<string, string> = {}
  data?.forEach((r: any) => { ayarlar[r.anahtar] = r.deger || '' })
  return ayarlar
}

export async function POST(req: NextRequest) {
  const db = createServerClient()

  // Auth kontrolü — sadece giriş yapmış kullanıcılar veya dahili istekler
  const authHeader = req.headers.get('x-internal-key')
  const internalKey = process.env.INTERNAL_API_KEY

  if (!authHeader || authHeader !== internalKey) {
    const { data: { user } } = await db.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  const { to, subject, html } = await req.json()
  if (!to || !subject || !html) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })

  const smtp = await getSmtpAyarlari(db)
  if (!smtp.smtp_host || !smtp.smtp_user || !smtp.smtp_pass) {
    return NextResponse.json({ error: 'SMTP ayarları eksik' }, { status: 500 })
  }

  try {
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host: smtp.smtp_host,
      port: parseInt(smtp.smtp_port || '587'),
      secure: smtp.smtp_port === '465',
      auth: { user: smtp.smtp_user, pass: smtp.smtp_pass },
    })
    await transporter.sendMail({
      from: `"${smtp.smtp_from_name || 'Milgo'}" <${smtp.smtp_from || smtp.smtp_user}>`,
      to, subject, html,
    })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
