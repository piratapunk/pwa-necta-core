const categories = [
  'Calendarios y agendas',
  'Hojas de cálculo',
  'Pagos y facturación',
  'Tiendas en línea',
  'Correo y newsletters',
  'CRMs y ERPs',
  'Formularios',
  'Mensajería interna',
  'Contabilidad',
  'Logística y envíos',
  'Reservaciones',
  'Y muchas más…',
]

export function IntegrationsSection() {
  return (
    <section className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="t-eyebrow">Se conecta con lo tuyo</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            +400 integraciones con las apps que ya usas
          </h2>
          <p className="mt-4 text-text-muted">
            Tu asistente no vive en una isla: agenda en tu calendario, registra
            en tus hojas, cobra con tu pasarela y avisa donde tú trabajas.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border bg-surface px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent/50 hover:text-text"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
