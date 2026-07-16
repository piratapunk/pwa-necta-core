'use client'

import { Check } from 'lucide-react'

import { useChat } from '@/components/chat/ChatContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    emoji: '🐝',
    name: 'Gratis',
    tagline: 'Arma y prueba tu bot',
    price: 'Gratis',
    priceNote: 'sin tarjeta, sin caducidad',
    features: [
      'El constructor completo, con Abi',
      'Tu asistente funcionando en canal de prueba',
      'Aprende de tu información (con límite)',
      'Ajustes de tono, saludo y respuestas',
    ],
    cta: 'Empieza gratis',
    message: 'Quiero armar mi asistente gratis',
    highlight: false,
  },
  {
    id: 'premium',
    emoji: '⭐',
    name: 'Premium',
    tagline: 'Ponlo a trabajar de verdad',
    price: 'Suscripción mensual',
    priceNote: 'se cotiza al armar tu bot, sin sorpresas',
    features: [
      'Todo lo del plan gratis',
      'Tu número de WhatsApp real',
      'Redes, teléfono, campañas, reseñas y anuncios',
      'Tu CRM con leads, citas y conversaciones',
      'Más capacidad y personalización',
    ],
    cta: 'Habla con Abi',
    message: 'Quiero saber más del plan Premium',
    highlight: true,
  },
  {
    id: 'enterprise',
    emoji: '🏢',
    name: 'Enterprise',
    tagline: 'Lo hacemos contigo',
    price: 'A la medida',
    priceNote: 'junta, propuesta y acompañamiento',
    features: [
      'Todo lo de Premium',
      'Integraciones a tus sistemas (CRM, ERP, pagos)',
      'Flujos a la medida de tu operación',
      'Onboarding guiado, llamadas y SLA',
    ],
    cta: 'Agenda una junta',
    message: 'Quiero una junta para el plan Enterprise',
    highlight: false,
  },
]

export function PricingSection() {
  const { openChat } = useChat()

  return (
    <section id="planes" className="scroll-mt-16 border-t bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="t-eyebrow">Planes</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Empiezas gratis. Creces cuando tú quieras.
          </h2>
          <p className="mt-4 text-text-muted">
            El plan gratis funciona de verdad — no es un demo que caduca. Pagas
            cuando quieras conectar tu número real y abrir más canales.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.id}
              className={cn(
                'flex flex-col',
                p.highlight && 'relative border-accent/60 honey-glow'
              )}
            >
              {p.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  El favorito de los negocios
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span aria-hidden>{p.emoji}</span> {p.name}
                </CardTitle>
                <CardDescription>{p.tagline}</CardDescription>
                <p className="mt-3 font-display text-2xl font-bold text-text">{p.price}</p>
                <p className="text-xs text-text-muted">{p.priceNote}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-text-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={p.highlight ? 'default' : 'secondary'}
                  onClick={() => openChat(p.message)}
                >
                  {p.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
