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
  const { to, subject, html } = await req.json()
  if (!to || !subject || !html) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })

  const smtp = await getSmtpAyarlari(db)
  if (!smtp.smtp_host || !smtp.smtp_user || !smtp.smtp_pass) {
    return NextResponse.json({ error: 'SMTP ayarları eksik' }, { status: 500 })
  }

  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport({
      host: smtp.smtp_host,
      port: parseInt(smtp.smtp_port || '587'),
      secure: smtp.smtp_port === '465',
      auth: { user: smtp.smtp_user, pass: smtp.smtp_pass },
    })

    await transporter.sendMail({
      from: `"milgo." <${smtp.from_email || smtp.smtp_user}>`,
      to, subject, html
    })

    // Log'a kaydet
    await db.from('site_mail_loglari').insert({ alici: to, konu: subject, durum: 'gonderildi' })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    await db.from('site_mail_loglari').insert({ alici: to, konu: subject, durum: 'hata', hata: err.message })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
