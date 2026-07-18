import {
  BarChart3,
  CalendarClock,
  MessageCircle,
  MessagesSquare,
  Megaphone,
  Phone,
  Send,
  Star,
  Target,
} from 'lucide-react'

import { Reveal } from '@/components/Reveal'
import { Badge } from '@/components/ui/badge'

const capabilities = [
  {
    icon: MessagesSquare,
    title: 'Chat de prueba al instante',
    body: 'Armas tu asistente y lo pruebas funcionando en su propia página web, gratis.',
    premium: false,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp con tu número',
    body: 'Tu asistente contesta en tu WhatsApp real, a cualquier hora, con tu información.',
    premium: true,
  },
  {
    icon: Megaphone,
    title: 'Redes sociales',
    body: 'DMs y comentarios de Instagram, Facebook y TikTok, atendidos al momento.',
    premium: true,
  },
  {
    icon: Phone,
    title: 'Teléfono con IA',
    body: 'Una recepcionista que contesta llamadas, agenda y transfiere cuando toca hablar contigo.',
    premium: true,
  },
  {
    icon: CalendarClock,
    title: 'Campañas y seguimientos',
    body: 'Recordatorios, promos y seguimientos por WhatsApp que salen solos, a tiempo.',
    premium: true,
  },
  {
    icon: Star,
    title: 'Reseñas cuidadas',
    body: 'Tus reseñas de Google y Facebook, monitoreadas y respondidas — y una alerta si algo sale mal.',
    premium: true,
  },
  {
    icon: Target,
    title: 'Anuncios que venden',
    body: 'Tus anuncios aterrizan directo en tu asistente. Sabes qué anuncio te trajo cada venta.',
    premium: true,
  },
  {
    icon: Send,
    title: 'Contenido en todas tus redes',
    body: 'Publica desde un solo lugar, en tus horarios, adaptado a cada plataforma.',
    premium: true,
  },
  {
    icon: BarChart3,
    title: 'Reporte mensual',
    body: 'Un reporte con todo: mensajes, campañas, reseñas y resultados. Sin que lo pidas.',
    premium: true,
  },
]

export function CapabilitiesSection() {
  return (
    <section id="capacidades" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="max-w-2xl">
          <p className="t-eyebrow">La colmena completa</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Empiezas con una obrera. Creces a un enjambre.
          </h2>
          <p className="mt-4 text-text-muted">
            Tu asistente arranca en el chat. Cuando quieras más, cada celda se
            abre — el mismo asistente, zumbando en más lugares para ti.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 70}>
              <div className="group h-full rounded-xl bg-surface-raised/60 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-raised">
                <div className="flex items-start justify-between">
                  <c.icon
                    className="size-5.5 text-text-muted transition-colors duration-200 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                  {c.premium && <Badge variant="premium">Premium</Badge>}
                </div>
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
