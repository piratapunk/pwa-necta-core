const steps = [
  {
    n: '1',
    title: 'Cuéntale a Abi',
    body: 'Le dices a qué se dedica tu negocio. Abi te deja la base armada desde el primer minuto — nunca empiezas de cero.',
  },
  {
    n: '2',
    title: 'Dale tu información',
    body: 'Súbele tu menú, catálogo o lista de precios… o cuéntaselo con tus palabras. Ella lo acomoda y tú revisas que quedó bien.',
  },
  {
    n: '3',
    title: 'Pruébalo en vivo',
    body: 'En un par de minutos tienes tu asistente contestando de verdad. Si algo no te late, lo cambias al instante.',
  },
]

/* Panal de progreso: arranca con celdas llenas (endowed progress, ver docs/UX-PSYCHOLOGY.md) */
function HoneycombProgress() {
  const cells = [true, true, false, false, false, false]
  return (
    <svg viewBox="0 0 340 60" className="mx-auto mt-10 w-full max-w-sm" aria-hidden>
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
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="t-eyebrow">Cómo funciona</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Armas tu asistente en lo que te tomas un café
          </h2>
          <p className="mt-4 text-text-muted">
            Tres decisiones de negocio. Nada de configuraciones, nada de jerga.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border bg-surface p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft font-display text-lg font-bold text-accent">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</p>
            </div>
          ))}
        </div>

        <HoneycombProgress />
        <p className="mt-2 text-center text-xs text-text-muted">
          Y cuando lo armas, ya vas empezado: Abi nunca te deja frente a una hoja en blanco.
        </p>
      </div>
    </section>
  )
}
