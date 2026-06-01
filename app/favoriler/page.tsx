'use client'
import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false } }

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavorilerRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/hesabim/favoriler') }, [router])
  return null
}
