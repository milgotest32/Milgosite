'use client'
import { useEffect, useRef } from 'react'
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0, af: number
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY }
    document.addEventListener('mousemove', move)
    const tick = () => {
      if (dot.current) { dot.current.style.left = x + 'px'; dot.current.style.top = y + 'px' }
      rx += (x - rx) * 0.14; ry += (y - ry) * 0.14
      if (ring.current) { ring.current.style.left = rx + 'px'; ring.current.style.top = ry + 'px' }
      af = requestAnimationFrame(tick)
    }
    af = requestAnimationFrame(tick)
    return () => { document.removeEventListener('mousemove', move); cancelAnimationFrame(af) }
  }, [])
  return <><div ref={dot} id="cur" /><div ref={ring} id="cur2" /></>
}
