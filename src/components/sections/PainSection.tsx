import { CalendarX, MessageSquareDot, MoonStar } from 'lucide-react'

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
    <section className="border-t bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="t-eyebrow">Te suena, ¿no?</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Atender bien no debería costarte el día entero
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <p.icon className="size-6 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-text-muted">
          Para eso existe Abi: para que tu negocio conteste solo —{' '}
          <span className="text-text">con tu tono, tu información y tus precios</span> —
          mientras tú haces lo tuyo.
        </p>
      </div>
    </section>
  )
}
