'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const c1 = useRef<HTMLDivElement>(null)
  const c2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    document.addEventListener('mousemove', move)
    let af: number
    const anim = () => {
      if (c1.current) { c1.current.style.left = x + 'px'; c1.current.style.top = y + 'px' }
      rx += (x - rx) * 0.1; ry += (y - ry) * 0.1
      if (c2.current) { c2.current.style.left = rx + 'px'; c2.current.style.top = ry + 'px' }
      af = requestAnimationFrame(anim)
    }
    af = requestAnimationFrame(anim)
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(af) }
  }, [])

  return (
    <>
      <div ref={c1} className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e8a4b8] mix-blend-screen" />
      <div ref={c2} className="fixed z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-[rgba(232,164,184,0.4)] transition-[width,height,border-color] duration-300" />
    </>
  )
}
