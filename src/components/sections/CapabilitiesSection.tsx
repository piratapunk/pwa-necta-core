import {
  BarChart3,
  CalendarClock,
  Megaphone,
  MessageCircle,
  Phone,
  Send,
  Star,
  Target,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'

const capabilities = [
  {
    icon: MessageCircle,
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
    icon: Send,
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
    icon: Megaphone,
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
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="t-eyebrow">La colmena completa</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Un asistente, todos tus canales
          </h2>
          <p className="mt-4 text-text-muted">
            Empiezas con el chat. Cuando quieras más, cada celda se abre — el
            mismo asistente, más lugares trabajando para ti.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-xl border bg-surface p-5 transition-all hover:border-accent/50 hover:bg-accent-soft"
            >
              <div className="flex items-start justify-between">
                <c.icon className="size-6 text-accent" />
                {c.premium && <Badge variant="premium">Premium</Badge>}
              </div>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
