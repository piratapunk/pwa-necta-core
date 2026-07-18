import { Reveal } from '@/components/Reveal'

const steps = [
  {
    n: '01',
    title: 'Cuéntale a Abi',
    body: 'Le dices a qué se dedica tu negocio. Abi te deja la base armada desde el primer minuto — nunca empiezas de cero.',
  },
  {
    n: '02',
    title: 'Dale tu información',
    body: 'Súbele tu menú, catálogo o lista de precios… o cuéntaselo con tus palabras. Ella lo acomoda y tú revisas que quedó bien.',
  },
  {
    n: '03',
    title: 'Pruébalo en vivo',
    body: 'En un par de minutos tienes tu asistente contestando de verdad. Si algo no te late, lo cambias al instante.',
  },
]

/* Panal de progreso: arranca con celdas llenas (endowed progress, ver docs/UX-PSYCHOLOGY.md) */
function HoneycombProgress() {
  const cells = [true, true, false, false, false, false]
  return (
    <svg viewBox="0 0 340 60" className="mt-14 w-full max-w-sm" aria-hidden>
      {cells.map((filled, i) => {
        const x = 20 + i * 52
        const points = `${x},14 ${x + 22},2 ${x + 44},14 ${x + 44},40 ${x + 22},52 ${x},40`
        return (
          <polygon
            key={i}
            points={points}
            fill={filled ? 'var(--accent)' : 'transparent'}
            stroke="var(--accent)"
            strokeOpacity={filled ? 1 : 0.35}
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
}

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="max-w-2xl">
          <p className="t-eyebrow">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Armas tu asistente en lo que te tomas un café
          </h2>
          <p className="mt-4 text-text-muted">
            Tres decisiones de negocio. Nada de configuraciones, nada de jerga.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="border-t border-border-strong pt-6">
                <span className="font-display text-sm font-semibold tracking-wide text-accent">
                  {s.n}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <HoneycombProgress />
          <p className="mt-3 text-xs text-text-faint">
            Y nunca empiezas de cero: cuando llegas, el panal ya trae miel.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
