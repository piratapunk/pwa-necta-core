import { AbiChatDemo } from '@/components/chat/AbiChatDemo'
import { HiveSwarm } from '@/components/HiveSwarm'
import { Magnetic } from '@/components/Magnetic'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0" aria-hidden />
      <div className="honeycomb-bg absolute inset-0 opacity-[0.04]" aria-hidden />
      {/* hexágono flotante (rescate de la dirección "Panal Suave") */}
      <div
        className="absolute -top-6 right-[6%] hidden size-36 animate-[hex-float_8s_ease-in-out_infinite] bg-accent-soft [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] lg:block"
        aria-hidden
      />
      {/* el enjambre digital: chispas de la colmena que rodean el cursor y se
          convocan en el CTA */}
      <HiveSwarm />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[7fr_5fr] lg:gap-16">
        {/* izquierda: mensaje */}
        <div>
          <span className="elev animate-fade-up inline-flex items-center gap-2 rounded-full border bg-surface-raised/80 px-4 py-2 text-[13px] font-semibold text-accent">
            <span aria-hidden>🍯</span> Pura miel para tu negocio
          </span>

          <h1 className="mt-5 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            <span className="line-mask">
              <span>La colmena</span>
            </span>
            <span className="line-mask">
              <span style={{ '--line-delay': '90ms' } as React.CSSProperties}>
                de <span className="text-accent">asistentes</span>
              </span>
            </span>
            <span className="line-mask">
              <span style={{ '--line-delay': '180ms' } as React.CSSProperties}>
                para tu negocio
              </span>
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-[34rem] text-lg leading-relaxed text-text-muted [animation-delay:0.35s]">
            Con <strong className="font-medium text-text">Abi</strong> armas el
            tuyo en minutos, lo pruebas gratis y, cuando estés listo, lo
            sueltas a zumbar en tu WhatsApp real.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-3 [animation-delay:0.45s]">
            <Magnetic>
              <Button size="lg" asChild>
                <a href="/constructor" data-swarm-cta>
                  Arma tu asistente gratis
                </a>
              </Button>
            </Magnetic>
            <Button size="lg" variant="secondary" asChild>
              <a href="#como-funciona">Ver cómo funciona</a>
            </Button>
          </div>

          <p className="animate-fade-up mt-6 text-xs text-text-faint [animation-delay:0.55s]">
            Sin código · Sin tarjeta · Lo pruebas antes de pagar
          </p>
        </div>

        {/* derecha: demo viva de Abi */}
        <div className="animate-fade-up [animation-delay:0.3s]">
          <AbiChatDemo />
        </div>
      </div>
    </section>
  )
}
