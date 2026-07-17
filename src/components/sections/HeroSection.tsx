'use client'

import { AbiBee } from '@/components/brand/AbiBee'
import { HeroChatInput } from '@/components/chat/HeroChatInput'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="honeycomb-bg absolute inset-0 opacity-[0.07]" aria-hidden />
      <div
        className="absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 sm:pt-28">
        <AbiBee className="size-20 animate-fade-up sm:size-24" />

        <p className="t-eyebrow mt-6 animate-fade-up [animation-delay:0.05s]">
          NectaCore · La fábrica de asistentes
        </p>

        <h1 className="mt-4 animate-fade-up text-4xl font-bold leading-[1.08] [animation-delay:0.1s] sm:text-6xl">
          Tu negocio,{' '}
          <span className="text-accent">contestando solo.</span>
        </h1>

        <p className="mt-5 max-w-2xl animate-fade-up text-base text-text-muted [animation-delay:0.15s] sm:text-lg">
          Armas tu asistente con <strong className="text-text">Abi</strong> en
          minutos: contesta esos WhatsApp que se te quedan en visto, agenda
          citas y deja cada cliente registrado en tu CRM. Gratis para armar y
          probar.
        </p>

        <div className="mt-8 w-full animate-fade-up [animation-delay:0.2s]">
          <HeroChatInput />
        </div>

        <div className="mt-6 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:0.25s]">
          <Button size="lg" asChild>
            <a href="/constructor">Arma tu asistente gratis</a>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a href="#como-funciona">Ver cómo funciona</a>
          </Button>
        </div>

        <p className="mt-6 animate-fade-up text-xs text-text-muted [animation-delay:0.3s]">
          Sin código · Sin tarjeta · Lo pruebas antes de pagar
        </p>
      </div>
    </section>
  )
}
