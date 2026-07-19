import type { Metadata } from 'next'

import { ConstructorChat } from '@/components/chat/ConstructorChat'

export const metadata: Metadata = {
  title: 'Arma tu asistente',
  description:
    'Cuéntale a Abi de tu negocio y en minutos tienes tu asistente funcionando, con su propia dirección web. Gratis.',
}

export default function ConstructorPage() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-5xl flex-col px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <p className="t-eyebrow">El Constructor</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Arma tu asistente <span className="text-accent">ahora mismo</span>
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Platícale a Abi de tu negocio. Al final tu asistente queda en línea,
          con su propia dirección, gratis y sin tarjeta.
        </p>
      </div>
      <ConstructorChat />
    </div>
  )
}
