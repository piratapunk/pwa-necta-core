'use client'

import { Check } from 'lucide-react'

import { AbiChatDemo } from '@/components/chat/AbiChatDemo'
import { useChat } from '@/components/chat/ChatContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const chips = [
  'Conversa en español, sin jerga',
  'Aprende de tu información',
  'Tú revisas y validas todo',
  'El asistente es tuyo, tu marca',
]

export function AbiSection() {
  const { openChat } = useChat()

  return (
    <section id="abi" className="scroll-mt-16 border-t bg-surface/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2">
        <div>
          <Badge variant="soft">El producto estrella de NectaCore</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Abi, la abejita que te arma tu bot
          </h2>
          <p className="mt-4 leading-relaxed text-text-muted">
            Abi no es un formulario ni un panel con mil opciones. Es una
            asistente que conversa contigo, entiende tu negocio y va armando tu
            bot mientras tú solo eliges. Tú revisas, tú decides, tú mandas —
            ella hace el trabajo pesado.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-text-muted">
            <li className="flex gap-2.5">
              <span className="mt-0.5 text-accent">🐝</span>
              Habla contigo en español, sin tecnicismos: decisiones de negocio, no de software.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 text-accent">🍯</span>
              Aprende de tu menú, catálogo o lo que le cuentes — y tú validas lo que entendió.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 text-accent">👑</span>
              El bot que arma es tuyo: tu tono, tu marca, tus reglas. Abi solo ayudó.
            </li>
          </ul>
          <Button className="mt-8" size="lg" onClick={() => openChat()}>
            Habla con Abi ahora
          </Button>
        </div>

        <div>
          <div className="relative">
            <div className="honeycomb-bg absolute -inset-4 opacity-[0.08]" aria-hidden />
            <AbiChatDemo className="relative" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {chips.map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 rounded-lg border bg-surface px-3 py-2.5 text-xs text-text-muted"
              >
                <Check className="size-3.5 shrink-0 text-accent" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
