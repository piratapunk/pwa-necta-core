'use client'

import { AbiBee } from '@/components/brand/AbiBee'
import { useChat } from '@/components/chat/ChatContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function AbiSection() {
  const { openChat } = useChat()

  return (
    <section id="abi" className="scroll-mt-16 border-t bg-surface/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
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
              <span className="text-accent">⬢</span>
              Habla contigo en español, sin tecnicismos: decisiones de negocio, no de software.
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent">⬢</span>
              Aprende de tu menú, catálogo o lo que le cuentes — y tú validas lo que entendió.
            </li>
            <li className="flex gap-2.5">
              <span className="text-accent">⬢</span>
              El bot que arma es tuyo: tu tono, tu marca, tus reglas. Abi solo ayudó.
            </li>
          </ul>
          <Button className="mt-8" size="lg" onClick={() => openChat()}>
            Habla con Abi ahora
          </Button>
        </div>

        <div className="relative flex justify-center">
          <div className="honeycomb-bg absolute inset-0 opacity-[0.08]" aria-hidden />
          <div className="relative rounded-2xl border bg-surface p-8 honey-glow">
            <AbiBee className="mx-auto size-32" />
            <div className="mt-6 space-y-3">
              <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-raised px-3.5 py-2.5 text-sm">
                Hola, soy Abi 🐝 ¿A qué se dedica tu negocio?
              </div>
              <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-sm text-on-accent">
                Tengo una taquería en Guadalajara
              </div>
              <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-raised px-3.5 py-2.5 text-sm">
                Listo, ya te dejé la base para restaurantes. Ahora la hacemos
                tuya: ¿me pasas tu menú?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
