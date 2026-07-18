'use client'

import { useEffect, useRef } from 'react'

/*
 * El enjambre digital del hero: chispas de la colmena (boids de Reynolds
 * suavizados + deriva de ruido) en un canvas 2D ambiental.
 *  - El cursor atrae de lejos y repele de cerca: las abejas lo rodean, no se pegan.
 *  - Momento firma: al pasar sobre el CTA primario ([data-swarm-cta]) el
 *    enjambre se convoca alrededor del botón y se dispersa al salir.
 *  - Guardas: DPR<=2, pausa oculto/offscreen, reduced-motion => scatter estático,
 *    cero re-renders de React (todo en refs), tema por atributo data-theme.
 */

type Bee = {
  x: number; y: number; vx: number; vy: number
  r: number; alpha: number; phase: number
  trail: { x: number; y: number }[]
}

const SEP_R = 28, SEP_W = 1.4
const ALI_R = 60, ALI_W = 0.9
const COH_R = 90, COH_W = 0.7
const WANDER_W = 0.5
const HOME_W = 0.3
const CURSOR_R = 160, CURSOR_W = 0.6
const REPEL_R = 40
const MAX_SPEED = 75, MAX_FORCE = 40

const PALETTE = {
  dark: { color: '240, 176, 60', aMin: 0.25, aMax: 0.5 },
  light: { color: '160, 106, 20', aMin: 0.35, aMax: 0.6 },
}

function theme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

export function HiveSwarm({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement as HTMLElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0, h = 0, dpr = 1
    let bees: Bee[] = []
    let raf = 0
    let running = false
    let last = 0
    let pal = PALETTE[theme()]
    const cursor = { x: 0, y: 0, active: false }
    const anchor = { x: 0, y: 0, drift: Math.random() * 100 }
    const gather = { active: false, x: 0, y: 0 }

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (reduced) drawStatic()
    }

    const beeCount = () => {
      const byArea = Math.floor((w * h) / 28000)
      return Math.max(14, Math.min(w < 640 ? 18 : 44, byArea))
    }

    const seed = () => {
      bees = Array.from({ length: beeCount() }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        r: 1.5 + Math.random() * 1.5 + (Math.random() < 0.08 ? 1.2 : 0),
        alpha: pal.aMin + Math.random() * (pal.aMax - pal.aMin),
        phase: Math.random() * 10,
        trail: [],
      }))
    }

    const drawBee = (x: number, y: number, r: number, a: number) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4)
      glow.addColorStop(0, `rgba(${pal.color}, ${a})`)
      glow.addColorStop(1, `rgba(${pal.color}, 0)`)
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      for (const b of bees) drawBee(b.x, b.y, b.r, b.alpha * 0.8)
    }

    const step = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000

      /* ancla suave que deriva por el hero */
      anchor.x = w * (0.5 + 0.22 * Math.sin(t * 0.1 + anchor.drift))
      anchor.y = h * (0.45 + 0.18 * Math.cos(t * 0.13 + anchor.drift))
      const target = gather.active ? gather : anchor

      ctx.clearRect(0, 0, w, h)

      for (const b of bees) {
        let ax = 0, ay = 0

        let sepX = 0, sepY = 0, aliX = 0, aliY = 0, cohX = 0, cohY = 0
        let nAli = 0, nCoh = 0
        for (const o of bees) {
          if (o === b) continue
          const dx = b.x - o.x, dy = b.y - o.y
          const d2 = dx * dx + dy * dy
          if (d2 < SEP_R * SEP_R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            sepX += (dx / d) * (1 - d / SEP_R)
            sepY += (dy / d) * (1 - d / SEP_R)
          }
          if (d2 < ALI_R * ALI_R) { aliX += o.vx; aliY += o.vy; nAli++ }
          if (d2 < COH_R * COH_R) { cohX += o.x; cohY += o.y; nCoh++ }
        }
        ax += sepX * MAX_FORCE * SEP_W
        ay += sepY * MAX_FORCE * SEP_W
        if (nAli) {
          ax += ((aliX / nAli - b.vx) / MAX_SPEED) * MAX_FORCE * ALI_W
          ay += ((aliY / nAli - b.vy) / MAX_SPEED) * MAX_FORCE * ALI_W
        }
        if (nCoh) {
          const cx = cohX / nCoh - b.x, cy = cohY / nCoh - b.y
          const d = Math.hypot(cx, cy) || 1
          ax += (cx / d) * MAX_FORCE * COH_W
          ay += (cy / d) * MAX_FORCE * COH_W
        }

        /* deriva orgánica: senos sumados con fase propia (estilo UntilLabs) */
        ax += Math.sin(t * 0.5 + b.phase * 10) * MAX_FORCE * WANDER_W
        ay += Math.cos(t * 0.4 + b.phase * 7) * MAX_FORCE * WANDER_W

        /* hogar / convocatoria al CTA */
        {
          const hx = target.x - b.x, hy = target.y - b.y
          const d = Math.hypot(hx, hy) || 1
          const wgt = gather.active ? 1.1 : HOME_W
          ax += (hx / d) * MAX_FORCE * wgt
          ay += (hy / d) * MAX_FORCE * wgt
        }

        /* cursor: atrae de lejos, repele de cerca */
        if (cursor.active) {
          const cx = cursor.x - b.x, cy = cursor.y - b.y
          const d = Math.hypot(cx, cy)
          if (d < REPEL_R && d > 0.01) {
            ax -= (cx / d) * MAX_FORCE * 2.2
            ay -= (cy / d) * MAX_FORCE * 2.2
          } else if (d < CURSOR_R) {
            ax += (cx / d) * MAX_FORCE * CURSOR_W
            ay += (cy / d) * MAX_FORCE * CURSOR_W
          }
        }

        b.vx += ax * dt
        b.vy += ay * dt
        const sp = Math.hypot(b.vx, b.vy)
        if (sp > MAX_SPEED) { b.vx = (b.vx / sp) * MAX_SPEED; b.vy = (b.vy / sp) * MAX_SPEED }
        b.x += b.vx * dt
        b.y += b.vy * dt

        /* wrap suave en los bordes */
        const m = 20
        if (b.x < -m) b.x = w + m; else if (b.x > w + m) b.x = -m
        if (b.y < -m) b.y = h + m; else if (b.y > h + m) b.y = -m

        b.trail.push({ x: b.x, y: b.y })
        if (b.trail.length > 4) b.trail.shift()
        for (let i = 0; i < b.trail.length - 1; i++) {
          const p = b.trail[i]
          drawBee(p.x, p.y, b.r * 0.6, b.alpha * 0.12 * (i + 1))
        }
        drawBee(b.x, b.y, b.r, b.alpha)
      }

      raf = requestAnimationFrame(step)
    }

    const start = () => {
      if (running || reduced) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
      cursor.active = true
    }
    const onLeave = () => (cursor.active = false)
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)

    /* convocatoria en el CTA primario */
    const cta = parent.querySelector<HTMLElement>('[data-swarm-cta]')
    const onCtaEnter = () => {
      const rect = canvas.getBoundingClientRect()
      const cr = cta!.getBoundingClientRect()
      gather.x = cr.left + cr.width / 2 - rect.left
      gather.y = cr.top + cr.height / 2 - rect.top
      gather.active = true
    }
    const onCtaLeave = () => (gather.active = false)
    cta?.addEventListener('pointerenter', onCtaEnter)
    cta?.addEventListener('pointerleave', onCtaLeave)

    /* cambio de tema sin remontar */
    const mo = new MutationObserver(() => {
      pal = PALETTE[theme()]
      for (const b of bees) b.alpha = pal.aMin + Math.random() * (pal.aMax - pal.aMin)
      if (reduced) drawStatic()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
      cta?.removeEventListener('pointerenter', onCtaEnter)
      cta?.removeEventListener('pointerleave', onCtaLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
