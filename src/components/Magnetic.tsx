'use client'

import { useEffect, useRef } from 'react'

/*
 * Botón magnético: el wrapper sigue al cursor con lerp (0.12/frame), fuerza
 * 0.3 del offset con tope de 14px; regresa con un resorte amortiguado de un
 * solo sobrepaso. Se desactiva en touch y con reduced-motion.
 */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return

    let raf = 0
    let tx = 0, ty = 0, x = 0, y = 0
    let hovering = false

    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      if (hovering || Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else {
        el.style.transform = ''
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const max = 14
      tx = Math.max(-max, Math.min(max, dx * 0.3))
      ty = Math.max(-max, Math.min(max, dy * 0.3))
      if (!hovering) {
        hovering = true
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      }
    }
    const onLeave = () => {
      hovering = false
      tx = 0
      ty = 0
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  )
}
