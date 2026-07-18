import { AbiChatDemo } from '@/components/chat/AbiChatDemo'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" aria-hidden />
      <div className="honeycomb-bg absolute inset-0 opacity-[0.04]" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[7fr_5fr] lg:gap-16">
        {/* izquierda: mensaje */}
        <div className="animate-fade-up">
          <p className="t-eyebrow">NectaCore · Pura miel para tu negocio</p>

          <h1 className="mt-5 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            La colmena de{' '}
            <span className="text-accent">asistentes</span> para tu negocio
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-text-muted">
            Con <strong className="font-medium text-text">Abi</strong> armas el
            tuyo en minutos, lo pruebas gratis y, cuando estés listo, lo
            sueltas a zumbar en tu WhatsApp real.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href="/constructor">Arma tu asistente gratis</a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-text-faint">
            Sin código · Sin tarjeta · Lo pruebas antes de pagar
          </p>
        </div>

        {/* derecha: demo viva de Abi */}
        <div className="animate-fade-up [animation-delay:0.15s]">
          <AbiChatDemo />
        </div>
      </div>
    </section>
  )
}
