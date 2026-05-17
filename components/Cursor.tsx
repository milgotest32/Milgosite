'use client'
import { useEffect, useRef } from 'react'
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0, af: number
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    document.addEventListener('mousemove', move)
    const anim = () => {
      if (dot.current) { dot.current.style.left = x + 'px'; dot.current.style.top = y + 'px' }
      rx += (x - rx) * 0.12; ry += (y - ry) * 0.12
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px' }
      af = requestAnimationFrame(anim)
    }
    af = requestAnimationFrame(anim)
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(af) }
  }, [])
  return <>
    <div ref={dot} id="cursor-dot" />
    <div ref={ring} id="cursor-ring" />
  </>
}
