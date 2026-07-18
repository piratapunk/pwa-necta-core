import { AbiChatDemo } from '@/components/chat/AbiChatDemo'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="honeycomb-bg absolute inset-0 opacity-[0.06]" aria-hidden />
      <div
        className="absolute -top-40 -left-40 size-[560px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
        {/* izquierda: mensaje */}
        <div className="animate-fade-up">
          <p className="t-eyebrow">NectaCore · Honey-tech para tu negocio</p>

          <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            La fábrica de{' '}
            <span className="text-accent">asistentes</span> para tu negocio
          </h1>

          <p className="mt-5 max-w-lg text-base text-text-muted sm:text-lg">
            Armas el tuyo con <strong className="text-text">Abi</strong> en
            minutos, lo pruebas gratis, y cuando quieras lo conectas a tu
            WhatsApp real.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href="/constructor">Arma tu asistente gratis</a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>

          <p className="mt-5 text-xs text-text-muted">
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
