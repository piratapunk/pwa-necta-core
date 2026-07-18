'use client'

import { useEffect, useState } from 'react'

import { AbiBee } from '@/components/brand/AbiBee'

/*
 * Labor illusion (docs/UX-PSYCHOLOGY.md): el provisioning es instantáneo, pero
 * un momento de construcción narrado sube el valor percibido. ~5s de pasos con
 * el panal llenándose de miel. Respeta prefers-reduced-motion.
 */

const STEPS = [
  'Leyendo la información de tu negocio…',
  'Afinando el tono y la personalidad…',
  'Enseñándole tus precios y horarios…',
  'Armando su memoria…',
  'Dándole su dirección web…',
  'Poniéndolo en línea…',
]

export function BuildingOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }
    const perStep = 850
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setStep(i), i * perStep)
    )
    const done = setTimeout(onDone, STEPS.length * perStep + 400)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onDone])

  const filled = Math.min(6, step + 1)

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <AbiBee className="size-16 animate-honey-pulse" />
      <p className="mt-5 font-display text-lg font-bold">
        Armando tu asistente…
      </p>

      <svg viewBox="0 0 340 60" className="mt-5 w-full max-w-[280px]" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => {
          const x = 20 + i * 52
          const points = `${x},14 ${x + 22},2 ${x + 44},14 ${x + 44},40 ${x + 22},52 ${x},40`
          return (
            <polygon
              key={i}
              points={points}
              fill={i < filled ? 'var(--accent)' : 'transparent'}
              stroke="var(--accent)"
              strokeOpacity={i < filled ? 1 : 0.35}
              strokeWidth="2"
              style={{ transition: 'fill 0.5s ease' }}
            />
          )
        })}
      </svg>

      <p className="mt-5 h-5 text-sm text-text-muted transition-opacity">
        {STEPS[Math.min(step, STEPS.length - 1)]}
      </p>
    </div>
  )
}
