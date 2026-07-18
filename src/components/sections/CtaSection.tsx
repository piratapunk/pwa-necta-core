import { AbiBee } from '@/components/brand/AbiBee'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t">
      <div className="honeycomb-bg absolute inset-0 opacity-[0.07]" aria-hidden />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <AbiBee className="text-6xl" />
        <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
          Tu próximo cliente ya te está escribiendo
        </h2>
        <p className="mt-4 max-w-xl text-text-muted">
          Ármale un asistente que le conteste. Gratis, en minutos, y con Abi
          haciendo el trabajo pesado.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <a href="/constructor">Arma tu asistente gratis 🐝</a>
        </Button>
      </div>
    </section>
  )
}
