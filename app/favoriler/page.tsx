'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavorilerRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/hesabim/favoriler') }, [router])
  return null
}
