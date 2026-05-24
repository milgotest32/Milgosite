'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FEF0F4 0%, #EBF7FC 100%)',
      fontFamily: 'Nunito, sans-serif', padding: '24px', textAlign: 'center'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐄</div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1A0A12', margin: '0 0 8px' }}>
        Bir şeyler ters gitti
      </h1>
      <p style={{ fontSize: '15px', color: '#7A6070', margin: '0 0 32px', maxWidth: '360px', lineHeight: 1.6 }}>
        Beklenmedik bir hata oluştu. Lütfen tekrar deneyin ya da ana sayfaya dönün.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{
          background: '#1A0A12', color: '#fff', border: 'none',
          borderRadius: '50px', padding: '12px 28px', fontSize: '14px',
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit'
        }}>
          Tekrar Dene
        </button>
        <Link href="/" style={{
          background: '#fff', color: '#1A0A12', border: '1.5px solid #F0ECF5',
          borderRadius: '50px', padding: '12px 28px', fontSize: '14px',
          fontWeight: 700, textDecoration: 'none'
        }}>
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
