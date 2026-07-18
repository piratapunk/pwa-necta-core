'use client'

import { useEffect, useRef, useState } from 'react'

import { AbiBee } from '@/components/brand/AbiBee'
import { cn } from '@/lib/utils'

/*
 * Demo viva del hero y de la sección Abi: burbujas que aparecen en secuencia,
 * mostrando cómo Abi arma un bot. SVG/CSS determinista, respeta reduced-motion.
 */

type Turn = { role: 'assistant' | 'user'; text: string }

const SCRIPT: Turn[] = [
  { role: 'assistant', text: 'Hola, soy Abi 🐝 Cuéntame, ¿a qué se dedica tu negocio?' },
  { role: 'user', text: 'Tengo una taquería en Guadalajara' },
  {
    role: 'assistant',
    text: 'Listo, ya te dejé la base para restaurantes. Ahora la hacemos tuya: ¿me pasas tu menú?',
  },
]

export function AbiChatDemo({ className }: { className?: string }) {
  const [shown, setShown] = useState(1)
  const [typing, setTyping] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(SCRIPT.length)
      return
    }
    const schedule = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      let t = 900
      for (let i = 1; i < SCRIPT.length; i++) {
        const idx = i
        timers.current.push(
          setTimeout(() => {
            setTyping(true)
          }, t)
        )
        t += 900
        timers.current.push(
          setTimeout(() => {
            setTyping(false)
            setShown(idx + 1)
          }, t)
        )
        t += 1400
      }
      /* reinicia el loop */
      timers.current.push(
        setTimeout(() => {
          setShown(1)
          schedule()
        }, t + 2600)
      )
    }
    schedule()
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div
      className={cn(
        'elev rounded-xl border bg-surface/90 p-4 backdrop-blur-sm',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2.5">
          <AbiBee className="text-2xl" />
          <p className="font-display text-sm font-bold">Abi</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-success">
          <span className="size-1.5 rounded-full bg-success" /> en línea
        </span>
      </div>

      <div className="space-y-2.5">
        {SCRIPT.slice(0, shown).map((turn, i) => (
          <div
            key={i}
            className={cn(
              'max-w-[85%] animate-fade-up rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              turn.role === 'user'
                ? 'ml-auto rounded-br-sm bg-accent text-on-accent'
                : 'rounded-bl-sm bg-surface-raised text-text'
            )}
          >
            {turn.text}
          </div>
        ))}
        {typing && (
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface-raised px-4 py-3">
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.4s]" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.8s]" />
          </div>
        )}
      </div>
    </div>
  )
}
