import { AbiBee } from '@/components/brand/AbiBee'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow absolute inset-0 rotate-180" aria-hidden />
      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <AbiBee className="text-6xl" />
        <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">
          Tu próximo cliente ya te está escribiendo
        </h2>
        <p className="mt-4 max-w-xl text-text-muted">
          Ármale una obrera que le conteste al momento. Gratis, en minutos, y
          con Abi haciendo el trabajo pesado.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href="/constructor">Arma tu asistente gratis</a>
        </Button>
      </Reveal>
    </section>
  )
}
