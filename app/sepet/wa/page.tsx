'use client'
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSepet } from '@/lib/sepet'
import { Suspense } from 'react'

function WaSepetInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { ekle, temizle } = useSepet()
  const [durum, setDurum] = useState<'yukleniyor' | 'hata' | 'tamam'>('yukleniyor')
  const [mesaj, setMesaj] = useState('Sepetiniz hazırlanıyor...')

  useEffect(() => {
    const yukle = async () => {
      // URL formatı: /sepet/wa?p=PRODUCT_ID:QTY,PRODUCT_ID:QTY
      const pParam = searchParams.get('p')
      if (!pParam) {
        setDurum('hata')
        setMesaj('Geçersiz sepet linki.')
        return
      }

      // Mevcut sepeti temizle (WhatsApp'tan gelen yeni sepet)
      temizle()

      const parcalar = pParam.split(',').filter(Boolean)
      let eklenen = 0

      for (const parca of parcalar) {
        const [productId, adetStr] = parca.split(':')
        const adet = parseInt(adetStr || '1', 10)

        if (!productId || adet <= 0) continue

        try {
          // Ürün detayını API'den çek
          const res = await fetch(`/api/products/${productId}`)
          if (!res.ok) continue
          const { data: urun } = await res.json()
          if (!urun || urun.durum !== 'active') continue

          // Sepete ekle
          ekle(urun, adet)
          eklenen++
          setMesaj(`${eklenen} ürün eklendi...`)
        } catch {
          // Hatalı ürünü atla
          continue
        }
      }

      if (eklenen === 0) {
        setDurum('hata')
        setMesaj('Ürünler yüklenemedi. Lütfen tekrar deneyin.')
        return
      }

      setDurum('tamam')
      setMesaj(`${eklenen} ürün sepete eklendi! Yönlendiriliyorsunuz...`)

      // Sepet sayfasına yönlendir
      setTimeout(() => router.replace('/sepet'), 1000)
    }

    yukle()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0EEF8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px', height: '80px',
        background: '#fff', borderRadius: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(224,112,144,0.1)',
        fontSize: '36px'
      }}>
        {durum === 'yukleniyor' ? '⏳' : durum === 'tamam' ? '✅' : '❌'}
      </div>
      <h2 style={{
        fontFamily: '"Playfair Display",serif',
        fontSize: '24px',
        color: '#1C1B2E'
      }}>
        {durum === 'yukleniyor' ? 'Sepet Hazırlanıyor' : durum === 'tamam' ? 'Sepet Hazır!' : 'Bir Sorun Oluştu'}
      </h2>
      <p style={{ color: '#9CA3AF', fontSize: '14px' }}>{mesaj}</p>
      {durum === 'hata' && (
        <a href="/urunler" style={{
          background: 'linear-gradient(135deg,#E07090,#3B9FCC)',
          color: '#fff', padding: '14px 32px', borderRadius: '50px',
          textDecoration: 'none', fontSize: '14px', fontWeight: 700
        }}>
          Ürünlere Git
        </a>
      )}
    </div>
  )
}

export default function WaSepetPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', background: '#F0EEF8',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <p style={{ color: '#9CA3AF' }}>Yükleniyor...</p>
      </div>
    }>
      <WaSepetInner />
    </Suspense>
  )
}
