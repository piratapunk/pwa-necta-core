'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/*
 * Smart fill-out: opciones seleccionables (cada una alimenta un machote del
 * prompt) + campo libre de última instancia. Aparece cuando el borrador está
 * guardado; al enviarse, el subagente refina la personalidad del bot.
 */

type Prefs = {
  tono: string
  trato: string
  emojis: string
  si_no_sabe: string
  objetivo: string
  estilo: string
  extra: string
}

const QUESTIONS: {
  key: keyof Omit<Prefs, 'extra'>
  label: string
  options: { value: string; label: string }[]
}[] = [
  {
    key: 'tono',
    label: '¿Cómo debe sonar tu asistente?',
    options: [
      { value: 'cercano', label: 'Cercano y cálido' },
      { value: 'profesional', label: 'Profesional' },
      { value: 'juvenil', label: 'Juvenil y fresco' },
      { value: 'formal', label: 'Formal' },
    ],
  },
  {
    key: 'trato',
    label: '¿Cómo le habla a tus clientes?',
    options: [
      { value: 'tu', label: 'De tú' },
      { value: 'usted', label: 'De usted' },
    ],
  },
  {
    key: 'emojis',
    label: '¿Con emojis?',
    options: [
      { value: 'si', label: 'Sí, con medida 🙂' },
      { value: 'no', label: 'Sin emojis' },
    ],
  },
  {
    key: 'objetivo',
    label: '¿Qué es lo MÁS importante que logre?',
    options: [
      { value: 'vender', label: 'Concretar ventas/pedidos' },
      { value: 'agendar', label: 'Agendar citas' },
      { value: 'informar', label: 'Resolver dudas' },
      { value: 'captar', label: 'Captar interesados' },
    ],
  },
  {
    key: 'si_no_sabe',
    label: 'Cuando no sepa algo, ¿qué hace?',
    options: [
      { value: 'recado', label: 'Toma nombre y teléfono' },
      { value: 'llamar', label: 'Sugiere llamar al negocio' },
      { value: 'humano', label: 'Ofrece que alguien contacte' },
    ],
  },
  {
    key: 'estilo',
    label: '¿Respuestas…?',
    options: [
      { value: 'corto', label: 'Cortas y al grano' },
      { value: 'detallado', label: 'Con más detalle' },
    ],
  },
]

export function PersonalityTuner({
  builderSessionId,
  onDone,
}: {
  builderSessionId: string
  onDone: () => void
}) {
  const [prefs, setPrefs] = useState<Partial<Prefs>>({})
  const [extra, setExtra] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')

  const complete = QUESTIONS.every((q) => prefs[q.key])

  const submit = async () => {
    if (!complete || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/constructor/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderSessionId,
          prefs: { ...prefs, ...(extra.trim() ? { extra: extra.trim() } : {}) },
          _h: '',
        }),
      })
      if (!res.ok) {
        setState('error')
        return
      }
      onDone()
    } catch {
      setState('error')
    }
  }

  return (
    <div className="max-h-[45dvh] shrink-0 overflow-y-auto border-t bg-bg/50 px-4 py-4">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-4 text-accent" />
        <p className="text-sm font-semibold">
          Afina la personalidad de tu asistente
        </p>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="mb-1.5 text-xs text-text-muted">{q.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {q.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, [q.key]: o.value }))}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs transition-colors',
                    prefs[q.key] === o.value
                      ? 'border-accent bg-accent text-on-accent'
                      : 'bg-surface text-text-muted hover:border-accent/50 hover:text-text'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="mb-1.5 text-xs text-text-muted">
            ¿Algo más que deba saber o evitar? (opcional)
          </p>
          <textarea
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            maxLength={600}
            rows={2}
            placeholder="Ej. que siempre recomiende la especial de la casa; que nunca prometa tiempos de entrega…"
            className="w-full rounded-lg border bg-surface px-3 py-2 text-xs text-text placeholder:text-text-muted/60 outline-none focus-visible:border-accent"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-text-muted">
          {state === 'error'
            ? 'No se pudo afinar — inténtalo otra vez.'
            : state === 'sending'
              ? 'Abi está puliendo el carácter de tu asistente…'
              : complete
                ? 'Todo listo para afinar.'
                : 'Elige una opción en cada punto.'}
        </p>
        <Button size="sm" onClick={submit} disabled={!complete || state === 'sending'}>
          {state === 'sending' ? 'Afinando…' : 'Afinar personalidad ✨'}
        </Button>
      </div>
    </div>
  )
}
