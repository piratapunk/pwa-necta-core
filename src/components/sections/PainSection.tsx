import { CalendarX, MessageSquareDot, MoonStar } from 'lucide-react'

import { Reveal } from '@/components/Reveal'

const pains = [
  {
    icon: MessageSquareDot,
    title: 'Los WhatsApp en visto',
    body: 'Mensajes que llegan mientras atiendes, cobras o cocinas — y cuando contestas, el cliente ya compró en otro lado.',
  },
  {
    icon: CalendarX,
    title: 'El mismo "¿a qué hora abren?"',
    body: 'Horarios, precios, ubicación, "¿tienen disponible?"… las mismas diez preguntas, todos los días, escritas a mano.',
  },
  {
    icon: MoonStar,
    title: 'Los clientes de medianoche',
    body: 'La gente pregunta cuando puede, no cuando tú puedes. Cada noche sin respuesta es una venta que amanece perdida.',
  },
]

export function PainSection() {
  return (
    <section className="bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal className="max-w-2xl">
          <p className="t-eyebrow">Te suena, ¿no?</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Atender bien no debería costarte el día entero
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-xl bg-surface-raised/60 p-6 transition-colors duration-200 hover:bg-surface-raised">
                <p.icon className="size-6 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 max-w-xl text-text-muted">
            Para eso existe Abi: te arma una obrera incansable que contesta por ti —{' '}
            <span className="text-text">con tu tono, tu información y tus precios</span> —
            mientras tú haces lo tuyo.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
